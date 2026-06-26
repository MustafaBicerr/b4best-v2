export const LOCALES = ['tr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'tr';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://be4best.com';

// ─── Phone numbers ────────────────────────────────────────────────────────────
// Both numbers are shown on the contact page and footer.
// phone1 is the primary line used for quick-call buttons and WhatsApp.

export const PHONES = [
  {
    /** E.164 format — use in tel: hrefs */
    number: '+905071917319',
    /** Human-readable display format */
    display: '+90 507 191 73 19',
    name: 'Ahmet Buğra Ok',
  },
  {
    number: '+905540042077',
    display: '+90 554 004 20 77',
    name: 'Nuri Ok',
  },
] as const;

export const SITE_CONFIG = {
  name: 'Be4Best Furniture',
  url: SITE_URL,
  defaultLocale: DEFAULT_LOCALE,
  locales: LOCALES,
  socialLinks: {
    instagram: 'https://www.instagram.com/b4bmobilya/',
    /** Primary number — used for floating call button and WhatsApp */
    whatsapp: PHONES[0].number,
    /** Primary number — used for quick-call actions */
    phone: PHONES[0].number,
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
