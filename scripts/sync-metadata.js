#!/usr/bin/env node
/**
 * Syncs collection metadata JSON files from Be4Best-web organized-assets
 * into the Next.js project so the gallery works on Cloudflare Pages CI
 * (which only has access to the b4best-v2 directory).
 *
 * Run:  npm run sync-metadata
 * When: After adding new photos or updating metadata in Be4Best-web.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const ASSETS_ROOT = path.join(PROJECT_ROOT, '..', 'Be4Best-web', 'b4b', 'organized-assets', 'collections');
const DEST_ROOT = path.join(PROJECT_ROOT, 'src', 'data', 'collection-metadata');

const COLLECTIONS = ['dubai', 'milano', 'havai', 'toronto', 'lyon', 'paris', 'lasvegas'];

let totalCopied = 0;

for (const slug of COLLECTIONS) {
  const srcDir = path.join(ASSETS_ROOT, slug, 'metadata');
  const dstDir = path.join(DEST_ROOT, slug);

  let files;
  try {
    files = await fs.readdir(srcDir);
  } catch {
    console.warn(`  ⚠  ${slug}: source metadata directory not found, skipping`);
    continue;
  }

  await fs.mkdir(dstDir, { recursive: true });
  const jsonFiles = files.filter((f) => f.endsWith('.json'));

  for (const file of jsonFiles) {
    await fs.copyFile(path.join(srcDir, file), path.join(dstDir, file));
  }

  console.log(`  ✓  ${slug}: ${jsonFiles.length} files synced`);
  totalCopied += jsonFiles.length;
}

console.log(`\nDone — ${totalCopied} metadata files synced to src/data/collection-metadata/`);
