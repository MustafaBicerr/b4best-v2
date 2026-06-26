/**
 * Asset URL helpers — the ONLY place where NEXT_PUBLIC_MEDIA_BASE_URL is used.
 *
 * NEXT_PUBLIC_ prefix is required so the value is available in Client Components.
 * To move from R2 dev URL to production media.be4best.com,
 * change ONLY the NEXT_PUBLIC_MEDIA_BASE_URL environment variable.
 */

function getMediaBase(): string {
  return (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? '').replace(/\/$/, '');
}

/**
 * Build a URL for any path relative to the R2 bucket root.
 * @example assetUrl('collections/dubai/homepage/dubai-hero-01.jpeg')
 */
export function assetUrl(path: string): string {
  const cleanPath = path.replace(/^\//, '');
  return `${getMediaBase()}/${cleanPath}`;
}

/**
 * Build a URL for a collection asset.
 * @example collectionAsset('dubai', 'homepage', 'dubai-hero-01.jpeg')
 *  → https://pub-xxx.r2.dev/collections/dubai/homepage/dubai-hero-01.jpeg
 */
export function collectionAsset(
  slug: string,
  folder: 'homepage' | 'gallery' | 'detail' | 'lifestyle' | 'master',
  filename: string
): string {
  return assetUrl(`collections/${slug}/${folder}/${filename}`);
}

/**
 * Build a filename for a collection asset using the standardised naming convention:
 * {slug}-{role}-{nn}.{ext}
 * @example buildAssetFilename('dubai', 'hero', 1, 'jpeg') → 'dubai-hero-01.jpeg'
 */
export function buildAssetFilename(
  slug: string,
  role: string,
  index: number,
  ext: string
): string {
  const nn = String(index).padStart(2, '0');
  return `${slug}-${role}-${nn}.${ext}`;
}

/**
 * Build a full collection asset URL from role parts.
 * @example collectionRoleUrl('dubai', 'homepage', 'hero', 1, 'jpeg')
 */
export function collectionRoleUrl(
  slug: string,
  folder: 'homepage' | 'gallery' | 'detail' | 'lifestyle' | 'master',
  role: string,
  index: number,
  ext: string
): string {
  const filename = buildAssetFilename(slug, role, index, ext);
  return collectionAsset(slug, folder, filename);
}
