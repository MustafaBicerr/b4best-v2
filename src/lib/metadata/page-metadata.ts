import type { Metadata } from 'next';
import { SITE_URL } from '@/config/site';
import { collectionAsset } from '@/lib/assets/urls';

const DEFAULT_OG_IMAGE = collectionAsset('dubai', 'homepage', 'dubai-hero-01.jpeg');

interface PageMetadataOptions {
  locale: string;
  /** Path after locale, e.g. `/about` or `/collections/dubai`. Empty string for homepage. */
  path?: string;
  title: string;
  description: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
}

/**
 * Builds consistent SEO metadata for every public page:
 * title, description, canonical, hreflang (tr/en/x-default), OpenGraph, Twitter.
 */
export function buildPageMetadata({
  locale,
  path = '',
  title,
  description,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
}: PageMetadataOptions): Metadata {
  const normalizedPath = path.startsWith('/') ? path : path ? `/${path}` : '';
  const url = `${SITE_URL}/${locale}${normalizedPath}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        tr: `${SITE_URL}/tr${normalizedPath}`,
        en: `${SITE_URL}/en${normalizedPath}`,
        'x-default': `${SITE_URL}/tr${normalizedPath}`,
      },
    },
    openGraph: {
      type: ogType,
      title,
      description,
      url,
      siteName: 'Be4Best Furniture',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      alternateLocale: locale === 'tr' ? ['en_US'] : ['tr_TR'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 800,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@b4bmobilya',
      images: [ogImage],
    },
  };
}
