import { SITE_URL, PHONES } from '@/config/site';

// ─── Organization Schema ──────────────────────────────────────────────────────

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Be4Best Furniture',
    url: SITE_URL,
    logo: `${SITE_URL}/icons/logo.svg`,
    sameAs: [
      'https://www.instagram.com/b4bmobilya/',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kayseri',
      addressCountry: 'TR',
    },
    contactPoint: PHONES.map((p) => ({
      '@type': 'ContactPoint',
      telephone: p.number,
      contactType: 'customer service',
      availableLanguage: ['Turkish', 'English'],
    })),
  };
}

// ─── LocalBusiness + FurnitureStore Schema ────────────────────────────────────

export function furnitureStoreSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['FurnitureStore', 'LocalBusiness'],
    name: 'Be4Best Furniture',
    description: locale === 'tr'
      ? 'Dünyanın en prestijli lokasyonlarından ilham alan lüks mobilya koleksiyonları.'
      : 'Luxury furniture collections inspired by the world\'s most prestigious locations.',
    url: SITE_URL,
    telephone: PHONES[0].number,
    sameAs: ['https://www.instagram.com/b4bmobilya/'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kayseri',
      addressCountry: 'TR',
    },
    priceRange: '$$$',
    openingHours: 'Mo-Fr 09:00-18:00',
  };
}

// ─── WebSite Schema ───────────────────────────────────────────────────────────

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Be4Best Furniture',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/en/collections?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ─── BreadcrumbList Schema ────────────────────────────────────────────────────

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── Collection / Product Schema ─────────────────────────────────────────────

export function collectionSchema(opts: {
  name: string;
  description: string;
  imageUrl: string;
  url: string;
  locale: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${opts.name} — Be4Best Furniture`,
    description: opts.description,
    image: opts.imageUrl,
    url: opts.url,
    brand: {
      '@type': 'Brand',
      name: 'Be4Best Furniture',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Be4Best Furniture',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kayseri',
        addressCountry: 'TR',
      },
    },
  };
}

// ─── ContactPage Schema ───────────────────────────────────────────────────────

export function contactPageSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: locale === 'tr' ? 'Be4Best İletişim' : 'Be4Best Contact',
    url: `${SITE_URL}/${locale}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: 'Be4Best Furniture',
      telephone: PHONES.map((p) => p.number),
      email: 'info@be4best.com',
    },
  };
}

// ─── AboutPage Schema ─────────────────────────────────────────────────────────

export function aboutPageSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: locale === 'tr' ? 'Be4Best Hakkımızda' : 'About Be4Best',
    url: `${SITE_URL}/${locale}/about`,
    description: locale === 'tr'
      ? 'Be4Best Furniture\'ın hikayesi, değerleri ve vizyonu.'
      : 'The story, values and vision of Be4Best Furniture.',
    mainEntity: organizationSchema(),
  };
}
