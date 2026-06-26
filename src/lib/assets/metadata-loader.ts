/**
 * Build-time metadata loader for collection gallery images.
 *
 * Reads individual asset JSON files from the organized-assets metadata
 * directory at SSG/build time. Each file describes one photo asset with
 * its correct filename (including extension), alt text, focal point, and
 * luxury score used for sorting.
 *
 * Role → R2 folder mapping:
 *   gallery-*   → gallery/
 *   detail-*    → detail/
 *   lifestyle-* → lifestyle/
 *   hero-*      → homepage/
 *
 * Usage: call from async Server Components only (not client components).
 */

import path from 'path';
import { collectionAsset } from './urls';

interface RawAssetMeta {
  asset: string;
  role: string;
  altText: string;
  orientation?: 'landscape' | 'portrait' | 'square';
  aspectRatio?: string;
  focalPoint?: { x: number; y: number };
  luxuryScore?: number;
  collectionSlug?: string;
}

export interface GalleryImageData {
  src: string;
  alt: string;
  focalX: number;
  focalY: number;
  orientation: 'landscape' | 'portrait' | 'square';
  aspectRatio: string;
  role: string;
}

type R2Folder = 'gallery' | 'detail' | 'lifestyle' | 'homepage';

function roleToFolder(role: string): R2Folder {
  if (role.startsWith('gallery')) return 'gallery';
  if (role.startsWith('detail')) return 'detail';
  if (role.startsWith('lifestyle')) return 'lifestyle';
  return 'homepage';
}

/**
 * Returns all gallery images for a collection by reading its metadata JSONs.
 *
 * Excludes the primary hero ({slug}-hero-01.*) since it is already rendered
 * in the page hero section.
 *
 * Images are sorted by luxuryScore descending so the strongest shots appear
 * first, with role name as a stable tiebreaker.
 */
export async function loadCollectionGallery(slug: string): Promise<GalleryImageData[]> {
  // Candidate paths, checked in order:
  // 1. Bundled within the Next.js project (works on Cloudflare Pages CI and any deployment)
  // 2. Local development with the full assets directory sibling to the project
  const candidatePaths = [
    path.join(process.cwd(), 'src', 'data', 'collection-metadata', slug),
    path.join(process.cwd(), '..', 'Be4Best-web', 'b4b', 'organized-assets', 'collections', slug, 'metadata'),
  ];

  // fs/promises is a Node.js-only API — not available in Cloudflare Workers edge runtime.
  // Dynamic import isolates it so it is not bundled for edge environments.
  // For SSG pages the code only runs at build time (Node.js), so this is safe.
  let fsModule: typeof import('fs').promises | null = null;
  try {
    const nodeFs = await import('node:fs');
    fsModule = nodeFs.promises;
  } catch {
    // Running in edge runtime — static HTML already baked in at build time.
    return [];
  }

  let metadataDir = '';
  let filenames: string[] = [];

  for (const candidate of candidatePaths) {
    try {
      filenames = await fsModule.readdir(candidate);
      metadataDir = candidate;
      break;
    } catch {
      // Try next candidate
    }
  }

  if (!metadataDir) {
    return [];
  }

  const individualFiles = filenames.filter(
    (f) => f.endsWith('.json') && f !== 'metadata.json'
  );

  const primaryHeroBase = `${slug}-hero-01`;

  const results: (GalleryImageData & { luxuryScore: number })[] = [];

  await Promise.all(
    individualFiles.map(async (filename) => {
      try {
        const raw = await fsModule!.readFile(path.join(metadataDir, filename), 'utf-8');
        const meta: RawAssetMeta = JSON.parse(raw);

        // Skip primary hero (it is shown in the page hero section above)
        const assetBase = meta.asset.replace(/\.[^.]+$/, '');
        if (assetBase === primaryHeroBase) return;

        const folder = roleToFolder(meta.role);
        const src = collectionAsset(slug, folder, meta.asset);

        results.push({
          src,
          alt: meta.altText ?? `${slug} — Be4Best`,
          focalX: meta.focalPoint?.x ?? 50,
          focalY: meta.focalPoint?.y ?? 50,
          orientation: meta.orientation ?? 'landscape',
          aspectRatio: meta.aspectRatio ?? '3:2',
          role: meta.role,
          luxuryScore: meta.luxuryScore ?? 80,
        });
      } catch {
        // Skip malformed or unreadable files
      }
    })
  );

  results.sort((a, b) => {
    if (b.luxuryScore !== a.luxuryScore) return b.luxuryScore - a.luxuryScore;
    return a.role.localeCompare(b.role);
  });

  return results.map(({ luxuryScore: _score, ...image }) => image);
}
