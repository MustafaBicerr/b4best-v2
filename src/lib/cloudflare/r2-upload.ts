/**
 * R2 Upload helpers — STUB for future admin panel implementation.
 *
 * When implementing the admin panel, this module will:
 * 1. Generate a pre-signed upload URL from R2
 * 2. Return the URL to the client for direct upload
 * 3. Confirm the upload and update D1 assets table
 *
 * The `R2Bucket` binding will be added to wrangler.toml as:
 *   [[r2_buckets]]
 *   binding = "ASSETS"
 *   bucket_name = "be4best-assets"
 */

export interface UploadResult {
  url: string;
  key: string;
}

/**
 * Generates a pre-signed URL for uploading an asset to R2.
 * STUB — not yet implemented.
 */
export async function generateUploadUrl(
  _key: string,
  _contentType: string
): Promise<UploadResult> {
  throw new Error('R2 upload not yet implemented. Implement admin panel first.');
}

/**
 * Deletes an asset from R2 by key.
 * STUB — not yet implemented.
 */
export async function deleteAsset(_key: string): Promise<void> {
  throw new Error('R2 delete not yet implemented. Implement admin panel first.');
}
