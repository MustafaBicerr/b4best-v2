#!/usr/bin/env node
/**
 * Image Variant Generator & R2 Uploader
 *
 * For each photo in the collection metadata JSONs:
 *   1. Downloads the original from R2 (media.be4best.com)
 *   2. Generates 4 WebP variants using sharp (maintains aspect ratio, high quality)
 *   3. Uploads each variant to R2 using `wrangler r2 object put`
 *
 * Variant naming convention:
 *   Original:  collections/dubai/homepage/dubai-hero-01.jpeg
 *   Variants:  collections/dubai/homepage/variants/dubai-hero-01-390w.webp
 *              collections/dubai/homepage/variants/dubai-hero-01-750w.webp
 *              collections/dubai/homepage/variants/dubai-hero-01-1080w.webp
 *              collections/dubai/homepage/variants/dubai-hero-01-1920w.webp
 *
 * Run:
 *   node scripts/process-images.mjs                         — process & upload all
 *   node scripts/process-images.mjs --dry-run               — process locally, skip upload
 *   node scripts/process-images.mjs --collection dubai      — single collection
 *   node scripts/process-images.mjs --skip-existing         — skip already-uploaded variants
 *
 * After running, set NEXT_PUBLIC_CF_IMAGES=true in .env.local and rebuild.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import sharp from 'sharp';

// ─── Configuration ─────────────────────────────────────────────────────────

const R2_BUCKET  = 'media';
const R2_PREFIX  = 'be4best.com';
const MEDIA_BASE = 'https://media.be4best.com/be4best.com';
const META_DIR   = new URL('../src/data/collection-metadata', import.meta.url).pathname;
const TMP_DIR    = path.join(os.tmpdir(), 'b4b-image-variants');

/**
 * Breakpoints (px) — must match next.config.ts deviceSizes.
 * next/image requests the smallest breakpoint >= the rendered width,
 * so these cover: mobile (390), tablet (750), desktop (1080, 1920).
 */
const BREAKPOINTS = [390, 750, 1080, 1920];

/**
 * WebP quality per breakpoint.
 * Higher = better quality, larger file.
 * 85 is visually lossless for photography at display sizes.
 * Slightly lower on mobile because small screens are more forgiving.
 */
const QUALITY = { 390: 82, 750: 84, 1080: 85, 1920: 86 };

// Role → R2 folder (mirrors metadata-loader.ts)
const roleToFolder = (role) => {
  if (role.startsWith('gallery'))   return 'gallery';
  if (role.startsWith('detail'))    return 'detail';
  if (role.startsWith('lifestyle')) return 'lifestyle';
  return 'homepage';
};

// ─── Argument parsing ───────────────────────────────────────────────────────

const args          = process.argv.slice(2);
const DRY_RUN       = args.includes('--dry-run');
const SKIP_EXISTING = args.includes('--skip-existing');
const colIdx        = args.indexOf('--collection');
const ONLY_COL      = colIdx !== -1 ? (args[colIdx + 1] ?? null) : null;

if (DRY_RUN)  console.log('🔍 DRY RUN — no files will be uploaded to R2\n');
if (ONLY_COL) console.log(`📦 Processing only collection: ${ONLY_COL}\n`);

// ─── Helpers ────────────────────────────────────────────────────────────────

async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  const dest = createWriteStream(destPath);
  await pipeline(res.body, dest);
}

/**
 * Upload a local file to R2 using wrangler CLI.
 * Sets immutable cache headers so the CDN caches variants for 1 year.
 */
function uploadToR2(localFile, r2Key) {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', [
      'wrangler', 'r2', 'object', 'put',
      `${R2_BUCKET}/${r2Key}`,
      '--remote',  // required in Wrangler 4 — without this, uploads go to local emulation only
      '--file', localFile,
      '--content-type', 'image/webp',
      '--cache-control', 'public, max-age=31536000, immutable',
    ], { stdio: ['ignore', 'pipe', 'pipe'] });

    let buf = '';
    proc.stdout.on('data', (d) => (buf += d));
    proc.stderr.on('data', (d) => (buf += d));
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`wrangler exit ${code}:\n${buf.slice(-400)}`));
    });
  });
}

/**
 * Resize src to targetWidth (maintaining aspect ratio) and encode as WebP.
 * Never upscales — if the original is narrower than targetWidth, returns
 * the original dimensions.
 *
 * Why we maintain aspect ratio (no crop):
 * - The metadata already curates the best framing; the focal point is already
 *   composition-centred in the original.
 * - Browser uses object-fit: cover + object-position (focalX/focalY) in CSS,
 *   so additional cropping in the variant adds complexity without benefit.
 * - Keeping full frames means the 1920w variant is always usable as lightbox.
 */
async function generateVariant(srcPath, destPath, targetWidth, quality) {
  const meta = await sharp(srcPath).metadata();
  const origW = meta.width ?? 9999;

  await sharp(srcPath)
    .resize(Math.min(targetWidth, origW), null, {
      fit: 'inside',          // maintain aspect ratio
      withoutEnlargement: true,
    })
    .webp({ quality, smartSubsample: true })
    .toFile(destPath);

  return (await fs.stat(destPath)).size;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  await fs.mkdir(TMP_DIR, { recursive: true });

  const collectionDirs = (await fs.readdir(META_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((n) => !ONLY_COL || n === ONLY_COL);

  if (collectionDirs.length === 0) {
    console.error(`❌ No collections found${ONLY_COL ? ` matching "${ONLY_COL}"` : ''}`);
    process.exit(1);
  }

  let totalImages = 0, totalVariants = 0, totalOrigBytes = 0, totalVarBytes = 0, errors = 0;

  for (const slug of collectionDirs) {
    const colDir = path.join(META_DIR, slug);
    const jsonFiles = (await fs.readdir(colDir)).filter(
      (f) => f.endsWith('.json') && f !== 'metadata.json'
    );

    console.log(`📁 ${slug.toUpperCase()} (${jsonFiles.length} images)`);

    for (const file of jsonFiles) {
      let meta;
      try {
        meta = JSON.parse(await fs.readFile(path.join(colDir, file), 'utf-8'));
      } catch {
        console.log(`  ⚠ Skipping ${file} (parse error)`);
        errors++;
        continue;
      }

      const { asset, role } = meta;
      const folder    = roleToFolder(role);
      const r2Dir     = `${R2_PREFIX}/collections/${slug}/${folder}`;
      const srcUrl    = `${MEDIA_BASE}/collections/${slug}/${folder}/${asset}`;
      const assetBase = asset.replace(/\.[^.]+$/, '');

      // ── Step 1: download original ──────────────────────────────────────
      const tmpOrigDir = path.join(TMP_DIR, slug, folder);
      const tmpOrig    = path.join(tmpOrigDir, asset);

      process.stdout.write(`  ${asset}`.padEnd(44));

      try {
        await fs.mkdir(tmpOrigDir, { recursive: true });

        if (!await fileExists(tmpOrig)) {
          await downloadFile(srcUrl, tmpOrig);
        }

        const origSize = (await fs.stat(tmpOrig)).size;
        totalOrigBytes += origSize;
        process.stdout.write(`${(origSize / 1024 / 1024).toFixed(1).padStart(5)}MB `);
        totalImages++;

        // ── Step 2: generate variants ────────────────────────────────────
        let variantTotalSize = 0;

        for (const width of BREAKPOINTS) {
          const variantName = `${assetBase}-${width}w.webp`;
          const variantR2   = `${r2Dir}/variants/${variantName}`;
          const tmpVarDir   = path.join(TMP_DIR, slug, folder, 'variants');
          const tmpVarPath  = path.join(tmpVarDir, variantName);

          await fs.mkdir(tmpVarDir, { recursive: true });

          // Re-use existing tmp file if already processed (speeds up retries)
          if (!await fileExists(tmpVarPath)) {
            await generateVariant(tmpOrig, tmpVarPath, width, QUALITY[width]);
          }

          const varSize = (await fs.stat(tmpVarPath)).size;
          variantTotalSize += varSize;
          totalVarBytes    += varSize;
          totalVariants++;

          // ── Step 3: upload to R2 ────────────────────────────────────────
          if (!DRY_RUN) {
            process.stdout.write('↑');
            await uploadToR2(tmpVarPath, variantR2);
            process.stdout.write('.');
          }
        }

        const avgSaving = ((origSize - variantTotalSize / BREAKPOINTS.length) / origSize * 100);
        console.log(` → avg ${avgSaving.toFixed(0)}% smaller ✓`);

      } catch (err) {
        console.log(`\n    ❌ ${err.message}`);
        errors++;
      }
    }

    console.log('');
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  const avgOrigMB = totalImages > 0 ? (totalOrigBytes / totalImages / 1024 / 1024).toFixed(1) : '?';
  const avgVarKB  = totalVariants > 0
    ? (totalVarBytes / totalVariants / 1024).toFixed(0)
    : '?';

  console.log('─'.repeat(60));
  console.log(`✅ Complete`);
  console.log(`   Images processed  : ${totalImages}`);
  console.log(`   Variants generated: ${totalVariants} (${BREAKPOINTS.length} per image)`);
  console.log(`   Avg original size : ${avgOrigMB} MB`);
  console.log(`   Avg variant size  : ${avgVarKB} KB`);
  if (errors > 0) console.log(`   Errors            : ${errors}`);

  if (!DRY_RUN) {
    console.log(`\n✅ All variants uploaded to R2 bucket "${R2_BUCKET}"`);
    console.log(`\nNext step:`);
    console.log(`  Set NEXT_PUBLIC_CF_IMAGES=true in .env.local`);
    console.log(`  Then: npm run build:cf && npx wrangler pages deploy ...`);
  } else {
    console.log(`\n⚠️  DRY RUN — nothing uploaded`);
    console.log(`   Run without --dry-run to upload to R2.`);
    console.log(`   Tmp files: ${TMP_DIR}`);
  }
}

main().catch((err) => {
  console.error('\n💥 Fatal:', err.message);
  process.exit(1);
});
