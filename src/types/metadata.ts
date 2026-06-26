export interface AssetFocalPoint {
  x: number;
  y: number;
}

export type AssetRole =
  | 'hero-01'
  | 'hero-02'
  | 'hero-03'
  | 'gallery-01'
  | 'gallery-02'
  | 'gallery-03'
  | 'gallery-04'
  | 'gallery-05'
  | 'detail-01'
  | 'detail-02'
  | 'detail-03'
  | 'detail-04'
  | 'lifestyle-01'
  | 'lifestyle-02';

export type AssetFolder = 'homepage' | 'gallery' | 'detail' | 'lifestyle' | 'master';

export type TextSafeArea =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center'
  | 'none';

export interface AssetMetadata {
  asset: string;
  role: string;
  title: string;
  collection: string;
  collectionSlug: string;
  sourceFile: string;
  orientation: 'landscape' | 'portrait' | 'square';
  containsPeople: boolean;
  containsSofa: boolean;
  containsChair: boolean;
  containsCoffeeTable: boolean;
  containsAccessories: boolean;
  sceneType: string;
  brightness: 'bright' | 'moody' | 'neutral' | 'dark';
  dominantColor: string;
  homepageScore: number;
  luxuryScore: number;
  recommendedUsage: string[];
  altText: string;
  seoTitle: string;
  seoDescription: string;
  aspectRatio: string;
  desktopSuitable: boolean;
  tabletSuitable: boolean;
  mobileSuitable: boolean;
  suitableAs?: string[];
  focalPoint: AssetFocalPoint;
  safeCropDesktop?: string;
  safeCropTablet?: string;
  safeCropMobile?: string;
  textSafeArea: TextSafeArea;
}

export interface CollectionMetadata {
  collection: string;
  slug: string;
  theme: string;
  style: string;
  dominantColors: string[];
  overallLuxuryScore: number;
  assetCounts: {
    master: number;
    homepage: number;
    gallery: number;
    detail: number;
    lifestyle: number;
  };
  recommendedHomepageImages: string[];
  recommendedGalleryOrder: string[];
  recommendedHeroes: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
  duplicates: string[];
}

export interface GlobalHeroRankingEntry {
  rank: number;
  asset: string;
  collection: string;
  homepageScore: number;
  luxuryScore: number;
  note: string;
}

export interface CollectionRankingEntry {
  rank: number;
  collection: string;
  slug: string;
  score: number;
  reason: string;
}

export interface DeviceHeroStrategy {
  desktop: string[];
  tablet: string[];
  mobile: string[];
  universalHeroes: string[];
  notes: string;
}

export interface HomepageRanking {
  generatedBy: string;
  purpose: string;
  scoringCriteria: string[];
  collectionRanking: CollectionRankingEntry[];
  globalHeroRanking: GlobalHeroRankingEntry[];
  recommendedHomepageStrategy: {
    primaryHero: string;
    heroRotation: string[];
    collectionSectionOrder: string[];
    notes: string;
  };
  deviceHeroStrategy: DeviceHeroStrategy;
}
