import type { D1Database } from '@cloudflare/workers-types';

export interface CloudflareEnv {
  DB: D1Database;
}

/**
 * Safely retrieve the Cloudflare request context.
 * Returns null when running outside Cloudflare (e.g. local Next.js dev server).
 */
export async function getCloudflareEnv(): Promise<CloudflareEnv | null> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages');
    const ctx = getRequestContext();
    return ctx.env as CloudflareEnv;
  } catch {
    return null;
  }
}
