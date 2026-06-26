export const LOCALES = ['tr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'tr';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://be4best.com';

export const SITE_CONFIG = {
  name: 'Be4Best Furniture',
  url: SITE_URL,
  defaultLocale: DEFAULT_LOCALE,
  locales: LOCALES,
  socialLinks: {
    instagram: 'https://instagram.com/be4bestfurniture',
    whatsapp: '+905321234567',
    phone: '+905321234567',
    email: 'info@be4best.com',
  },
  address: {
    city: 'Kayseri',
    country: 'Turkey',
  },
} as const;

export const COLLECTION_ORDER = [
  'dubai',
  'milano',
  'havai',
  'toronto',
  'lyon',
  'paris',
  'lasvegas',
] as const;
