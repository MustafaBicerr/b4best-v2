import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ChevronRight } from 'lucide-react';
import { getCloudflareEnv } from '@/lib/cloudflare/env';
import { getCollectionBySlug, getAssetsByCollection, STATIC_COLLECTIONS } from '@/lib/cloudflare/d1';
import { collectionAsset } from '@/lib/assets/urls';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Heading, Body } from '@/components/ui/Typography';
import { CollectionGallery } from '@/components/sections/CollectionGallery';
import { collectionSchema, breadcrumbSchema } from '@/lib/metadata/schemas';
import { SITE_URL } from '@/config/site';
import { slugToName } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';
import type { CollectionSlug } from '@/types/collection';

export const revalidate = 3600;

interface CollectionPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const locales = ['tr', 'en'];
  return locales.flatMap((locale) =>
    STATIC_COLLECTIONS.map((c) => ({ locale, slug: c.slug }))
  );
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const tc = await getTranslations({ locale, namespace: `collections.items.${slug}` });
  const tMeta = await getTranslations({ locale, namespace: 'collections.meta' });

  const heroImage = collectionAsset(slug, 'homepage', `${slug}-hero-01.jpeg`);

  return {
    title: `${slugToName(slug)} — ${tMeta('title').split('—')[1]?.trim() ?? 'Be4Best Furniture'}`,
    description: tc('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/collections/${slug}`,
      languages: {
        tr: `${SITE_URL}/tr/collections/${slug}`,
        en: `${SITE_URL}/en/collections/${slug}`,
      },
    },
    openGraph: {
      title: `${slugToName(slug)} — Be4Best Furniture`,
      description: tc('description'),
      url: `${SITE_URL}/${locale}/collections/${slug}`,
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 800,
          alt: `${slugToName(slug)} — Be4Best Furniture`,
        },
      ],
    },
  };
}

/**
 * Per-collection gallery configuration derived from metadata JSON.
 * Only desktop_suitable images are included; mobile uses focalPoint.
 */
const COLLECTION_ASSETS: Record<CollectionSlug, {
  hero: { filename: string; ext: string; focalX: number; focalY: number };
  gallery: { filename: string; ext: string; focalX?: number; focalY?: number }[];
  detail: { filename: string; ext: string; focalX?: number; focalY?: number }[];
}> = {
  dubai: {
    hero: { filename: 'dubai-hero-01', ext: 'jpeg', focalX: 50, focalY: 52 },
    gallery: [
      { filename: 'dubai-gallery-01', ext: 'jpeg' },
      { filename: 'dubai-gallery-02', ext: 'jpeg' },
      { filename: 'dubai-gallery-03', ext: 'jpeg' },
      { filename: 'dubai-gallery-04', ext: 'jpeg' },
    ],
    detail: [
      { filename: 'dubai-detail-01', ext: 'jpeg', focalX: 48, focalY: 55 },
      { filename: 'dubai-detail-02', ext: 'jpeg' },
    ],
  },
  milano: {
    hero: { filename: 'milano-hero-01', ext: 'jpg', focalX: 50, focalY: 40 },
    gallery: [{ filename: 'milano-gallery-01', ext: 'jpg' }],
    detail: [],
  },
  havai: {
    hero: { filename: 'havai-hero-01', ext: 'png', focalX: 50, focalY: 50 },
    gallery: [],
    detail: [
      { filename: 'havai-detail-01', ext: 'png' },
      { filename: 'havai-detail-02', ext: 'png' },
    ],
  },
  toronto: {
    hero: { filename: 'toronto-hero-01', ext: 'png', focalX: 50, focalY: 50 },
    gallery: [
      { filename: 'toronto-gallery-01', ext: 'png' },
      { filename: 'toronto-gallery-02', ext: 'png' },
    ],
    detail: [{ filename: 'toronto-detail-01', ext: 'png' }],
  },
  lyon: {
    hero: { filename: 'lyon-hero-01', ext: 'png', focalX: 50, focalY: 45 },
    gallery: [
      { filename: 'lyon-gallery-01', ext: 'png' },
      { filename: 'lyon-gallery-02', ext: 'png' },
      { filename: 'lyon-gallery-03', ext: 'png' },
      { filename: 'lyon-gallery-04', ext: 'png' },
    ],
    detail: [],
  },
  paris: {
    hero: { filename: 'paris-hero-01', ext: 'jpeg', focalX: 50, focalY: 45 },
    gallery: [
      { filename: 'paris-gallery-01', ext: 'jpg' },
      { filename: 'paris-gallery-02', ext: 'jpg' },
      { filename: 'paris-gallery-03', ext: 'jpg' },
      { filename: 'paris-gallery-04', ext: 'jpg' },
      { filename: 'paris-gallery-05', ext: 'jpg' },
    ],
    detail: [
      { filename: 'paris-detail-01', ext: 'jpg' },
      { filename: 'paris-detail-02', ext: 'jpg' },
      { filename: 'paris-detail-03', ext: 'jpg' },
      { filename: 'paris-detail-04', ext: 'jpg' },
    ],
  },
  lasvegas: {
    hero: { filename: 'lasvegas-hero-01', ext: 'jpeg', focalX: 50, focalY: 50 },
    gallery: [{ filename: 'lasvegas-gallery-01', ext: 'jpeg' }],
    detail: [
      { filename: 'lasvegas-detail-01', ext: 'jpeg' },
      { filename: 'lasvegas-detail-02', ext: 'jpeg' },
    ],
  },
};

export default async function CollectionDetailPage({ params }: CollectionPageProps) {
  const { locale, slug } = await params;

  if (!STATIC_COLLECTIONS.find((c) => c.slug === slug)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'collections' });
  const tc = await getTranslations({ locale, namespace: `collections.items.${slug}` });

  const env = await getCloudflareEnv();
  const collection = await getCollectionBySlug(env?.DB ?? null, slug);

  if (!collection) notFound();

  const assets = COLLECTION_ASSETS[slug as CollectionSlug];
  const heroUrl = collectionAsset(slug, 'homepage', `${assets.hero.filename}.${assets.hero.ext}`);

  const galleryImages = assets.gallery.map((g) => ({
    src: collectionAsset(slug, 'gallery', `${g.filename}.${g.ext}`),
    alt: `${collection.name} galeri görseli — Be4Best`,
    focalX: g.focalX,
    focalY: g.focalY,
  }));

  const detailImages = assets.detail.map((d) => ({
    src: collectionAsset(slug, 'detail', `${d.filename}.${d.ext}`),
    alt: `${collection.name} detay görseli — Be4Best`,
    focalX: d.focalX,
    focalY: d.focalY,
  }));

  const jsonLd = [
    collectionSchema({
      name: collection.name,
      description: tc('description'),
      imageUrl: heroUrl,
      url: `${SITE_URL}/${locale}/collections/${slug}`,
      locale,
    }),
    breadcrumbSchema([
      { name: 'Be4Best', url: `${SITE_URL}/${locale}` },
      { name: t('pageTitle'), url: `${SITE_URL}/${locale}/collections` },
      { name: collection.name, url: `${SITE_URL}/${locale}/collections/${slug}` },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Hero */}
      <section className="relative min-h-[70vh] lg:min-h-[80vh] flex flex-col justify-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroUrl}
          alt={`${collection.name} — Be4Best Furniture`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: `${assets.hero.focalX}% ${assets.hero.focalY}%` }}
          fetchPriority="high"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 xl:px-16 pb-12 lg:pb-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6" aria-label="Breadcrumb">
            <Link
              href={`/${locale}/collections`}
              className="font-accent text-xs text-on-dark/60 hover:text-gold uppercase tracking-[0.15em] transition-colors duration-200"
            >
              {t('pageTitle')}
            </Link>
            <ChevronRight className="w-3 h-3 text-on-dark/40" aria-hidden="true" />
            <span className="font-accent text-xs text-gold uppercase tracking-[0.15em]">
              {collection.name}
            </span>
          </nav>

          <Eyebrow onDark className="mb-4">{tc('name')}</Eyebrow>
          <h1 className={cn(
            'font-display font-light text-on-dark leading-[1.05]',
            '[font-size:clamp(2.5rem,7vw,6rem)]'
          )}>
            {tc('name')}
          </h1>
        </div>
      </section>

      {/* Description */}
      <section className="section-padding-sm bg-cream">
        <Container size="md">
          <div className="max-w-2xl mx-auto text-center">
            <Heading as="h2" size="subsection" className="mb-6">{tc('theme')}</Heading>
            <Body muted className="leading-loose text-lg">{tc('description')}</Body>
          </div>
        </Container>
      </section>

      {/* Gallery */}
      <CollectionGallery
        slug={slug}
        galleryImages={galleryImages}
        detailImages={detailImages}
      />

      {/* Back link */}
      <section className="py-16 bg-cream border-t border-border-light">
        <Container className="text-center">
          <Link
            href={`/${locale}/collections`}
            className={cn(
              'inline-flex items-center gap-2',
              'font-accent text-xs font-semibold uppercase tracking-[0.2em] text-dark',
              'border-b border-gold pb-1',
              'hover:text-gold transition-colors duration-300'
            )}
          >
            ← {t('backToCollections')}
          </Link>
        </Container>
      </section>
    </>
  );
}
