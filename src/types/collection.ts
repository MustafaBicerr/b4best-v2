export interface Collection {
  id: number;
  name: string;
  slug: string;
  theme: string;
  style: string;
  featured: 0 | 1;
  homepage_priority: number;
  luxury_score: number;
  created_at: string;
}

export interface Asset {
  id: number;
  collection_id: number;
  filename: string;
  extension: string;
  role: string;
  homepage_score: number | null;
  luxury_score: number | null;
  desktop_suitable: 0 | 1;
  tablet_suitable: 0 | 1;
  mobile_suitable: 0 | 1;
  orientation: string | null;
  aspect_ratio: string | null;
  text_safe_area: string | null;
  focal_x: number | null;
  focal_y: number | null;
  contains_people: 0 | 1;
  contains_sofa: 0 | 1;
  contains_chair: 0 | 1;
  contains_coffee_table: 0 | 1;
  contains_accessories: 0 | 1;
  scene_type: string | null;
  brightness: string | null;
  dominant_color: string | null;
  recommended_usage: string | null;
  alt_text: string;
  seo_title: string;
  seo_description: string;
  created_at: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export type CollectionSlug =
  | 'dubai'
  | 'milano'
  | 'havai'
  | 'toronto'
  | 'lyon'
  | 'paris'
  | 'lasvegas';

export const COLLECTION_SLUGS: CollectionSlug[] = [
  'dubai',
  'milano',
  'havai',
  'toronto',
  'lyon',
  'paris',
  'lasvegas',
];
