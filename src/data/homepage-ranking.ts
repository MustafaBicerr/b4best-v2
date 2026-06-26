/**
 * Static copy of homepage-ranking.json for use at build time.
 * This mirrors the live data in b4b/organized-assets/homepage-ranking.json.
 * Used by HeroSection and CollectionsGrid to select images without D1.
 */

export const HERO_ROTATION_DESKTOP = [
  'collections/milano/homepage/milano-hero-01.jpg',
  'collections/dubai/homepage/dubai-hero-01.jpeg',
  'collections/havai/homepage/havai-hero-01.png',
  'collections/toronto/homepage/toronto-hero-01.png',
  'collections/paris/homepage/paris-hero-01.jpeg',
] as const;

export const HERO_ROTATION_MOBILE = [
  'collections/milano/gallery/milano-gallery-01.jpg',
  'collections/paris/homepage/paris-hero-02.jpeg',
  'collections/dubai/homepage/dubai-hero-02.png',
  'collections/havai/homepage/havai-hero-03.png',
  'collections/lasvegas/homepage/lasvegas-hero-01.jpeg',
] as const;

export const COLLECTION_SECTION_ORDER = [
  'dubai',
  'milano',
  'havai',
  'toronto',
  'lyon',
  'paris',
  'lasvegas',
] as const;
