import type { MetadataRoute } from 'next';
import { SITE_URL, LOCALES, COLLECTION_ORDER } from '@/config/site';

export const revalidate = 86400;

function hreflangAlternates(path: string) {
  return {
    languages: {
      tr: `${SITE_URL}/tr${path}`,
      en: `${SITE_URL}/en${path}`,
      'x-default': `${SITE_URL}/tr${path}`,
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    // Homepage
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: hreflangAlternates(''),
    });

    // Collections index
    entries.push({
      url: `${SITE_URL}/${locale}/collections`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: hreflangAlternates('/collections'),
    });

    // Individual collections
    for (const slug of COLLECTION_ORDER) {
      entries.push({
        url: `${SITE_URL}/${locale}/collections/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.85,
        alternates: hreflangAlternates(`/collections/${slug}`),
      });
    }

    // About
    entries.push({
      url: `${SITE_URL}/${locale}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: hreflangAlternates('/about'),
    });

    // Contact
    entries.push({
      url: `${SITE_URL}/${locale}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: hreflangAlternates('/contact'),
    });
  }

  return entries;
}
