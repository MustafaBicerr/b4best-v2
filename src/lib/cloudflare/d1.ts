import type { D1Database } from '@cloudflare/workers-types';
import type { Asset, Collection, ContactMessage } from '@/types/collection';
import { COLLECTION_ORDER } from '@/config/site';

// ─── Static fallback data (used when D1 is unavailable in local dev) ─────────

export const STATIC_COLLECTIONS: Collection[] = [
  { id: 1, name: 'Dubai', slug: 'dubai', theme: 'Skyline luxury penthouse living', style: 'Contemporary glam, soft neutral palette', featured: 1, homepage_priority: 1, luxury_score: 96, created_at: '' },
  { id: 2, name: 'Milano', slug: 'milano', theme: 'Mediterranean villa luxury', style: 'Editorial Mediterranean, boucle signature', featured: 1, homepage_priority: 2, luxury_score: 95, created_at: '' },
  { id: 3, name: 'Havai', slug: 'havai', theme: 'Flagship branded collection', style: 'Clean studio, warm wood-panelled lounge', featured: 1, homepage_priority: 3, luxury_score: 95, created_at: '' },
  { id: 4, name: 'Toronto', slug: 'toronto', theme: 'Warm organic lounge aesthetic', style: 'Symmetrical, warm organic palette', featured: 1, homepage_priority: 4, luxury_score: 93, created_at: '' },
  { id: 5, name: 'Lyon', slug: 'lyon', theme: 'Architectural serpentine sectional', style: 'Double-height penthouse, curved sectional', featured: 0, homepage_priority: 5, luxury_score: 92, created_at: '' },
  { id: 6, name: 'Paris', slug: 'paris', theme: 'Romantic Eiffel Tower aesthetic', style: 'Classic elegant, Eiffel Tower backdrop', featured: 1, homepage_priority: 6, luxury_score: 92, created_at: '' },
  { id: 7, name: 'Las Vegas', slug: 'lasvegas', theme: 'Desert modern living space', style: 'Serene desert-modern storytelling', featured: 0, homepage_priority: 7, luxury_score: 90, created_at: '' },
];

// ─── Collection queries ───────────────────────────────────────────────────────

export async function getCollections(db: D1Database | null): Promise<Collection[]> {
  if (!db) return STATIC_COLLECTIONS;

  const result = await db
    .prepare('SELECT * FROM collections ORDER BY homepage_priority ASC')
    .all<Collection>();

  return result.results ?? STATIC_COLLECTIONS;
}

export async function getCollectionBySlug(
  db: D1Database | null,
  slug: string
): Promise<Collection | null> {
  if (!db) {
    return STATIC_COLLECTIONS.find((c) => c.slug === slug) ?? null;
  }

  const result = await db
    .prepare('SELECT * FROM collections WHERE slug = ? LIMIT 1')
    .bind(slug)
    .first<Collection>();

  return result ?? null;
}

export async function getFeaturedCollections(db: D1Database | null): Promise<Collection[]> {
  if (!db) return STATIC_COLLECTIONS.filter((c) => c.featured === 1);

  const result = await db
    .prepare('SELECT * FROM collections WHERE featured = 1 ORDER BY homepage_priority ASC')
    .all<Collection>();

  return result.results ?? STATIC_COLLECTIONS.filter((c) => c.featured === 1);
}

// ─── Asset queries ────────────────────────────────────────────────────────────

export async function getAssetsByCollection(
  db: D1Database | null,
  collectionId: number
): Promise<Asset[]> {
  if (!db) return [];

  const result = await db
    .prepare('SELECT * FROM assets WHERE collection_id = ?')
    .bind(collectionId)
    .all<Asset>();

  return result.results ?? [];
}

export async function getAssetsByRole(
  db: D1Database | null,
  collectionId: number,
  rolePrefix: string
): Promise<Asset[]> {
  if (!db) return [];

  const result = await db
    .prepare("SELECT * FROM assets WHERE collection_id = ? AND role LIKE ?")
    .bind(collectionId, `${rolePrefix}%`)
    .all<Asset>();

  return result.results ?? [];
}

export async function getHomepageAssets(db: D1Database | null): Promise<Asset[]> {
  if (!db) return [];

  const result = await db
    .prepare(`
      SELECT a.* FROM assets a
      JOIN collections c ON c.id = a.collection_id
      WHERE a.role LIKE 'hero%'
        AND a.homepage_score >= 90
      ORDER BY a.homepage_score DESC
      LIMIT 20
    `)
    .all<Asset>();

  return result.results ?? [];
}

export async function getBestDesktopHero(db: D1Database | null): Promise<Asset | null> {
  if (!db) return null;

  return await db
    .prepare(`
      SELECT a.* FROM assets a
      JOIN collections c ON c.id = a.collection_id
      WHERE a.role = 'hero-01'
        AND a.desktop_suitable = 1
        AND c.slug = 'milano'
      LIMIT 1
    `)
    .first<Asset>();
}

// ─── Admin: Write operations ──────────────────────────────────────────────────

export async function createContactMessage(
  db: D1Database | null,
  data: ContactMessage
): Promise<void> {
  if (!db) {
    console.warn('[D1] createContactMessage: DB not available, message dropped:', data.email);
    return;
  }

  await db
    .prepare(`
      INSERT INTO contact_messages (name, email, phone, company, subject, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .bind(
      data.name,
      data.email,
      data.phone ?? null,
      data.company ?? null,
      data.subject,
      data.message
    )
    .run();
}

// ─── Utility: ordered collections ────────────────────────────────────────────

export function sortCollectionsByOrder(collections: Collection[]): Collection[] {
  return [...collections].sort((a, b) => {
    const ai = COLLECTION_ORDER.indexOf(a.slug as typeof COLLECTION_ORDER[number]);
    const bi = COLLECTION_ORDER.indexOf(b.slug as typeof COLLECTION_ORDER[number]);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}
