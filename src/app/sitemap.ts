import type { MetadataRoute } from 'next';
import { SITE_URL, LOCALES, COLLECTION_ORDER } from '@/config/site';

export const revalidate = 86400;

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
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}`])
        ),
      },
    });

    // Collections index
    entries.push({
      url: `${SITE_URL}/${locale}/collections`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}/collections`])
        ),
      },
    });

    // Individual collections
    for (const slug of COLLECTION_ORDER) {
      entries.push({
        url: `${SITE_URL}/${locale}/collections/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.85,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}/collections/${slug}`])
          ),
        },
      });
    }

    // About
    entries.push({
      url: `${SITE_URL}/${locale}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}/about`])
        ),
      },
    });

    // Contact
    entries.push({
      url: `${SITE_URL}/${locale}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}/contact`])
        ),
      },
    });
  }

  return entries;
}
