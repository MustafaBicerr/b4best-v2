import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ChevronRight } from 'lucide-react';
import { getCloudflareEnv } from '@/lib/cloudflare/env';
import { getCollectionBySlug, STATIC_COLLECTIONS } from '@/lib/cloudflare/d1';
import { collectionAsset } from '@/lib/assets/urls';
import { loadCollectionGallery } from '@/lib/assets/metadata-loader';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Heading, Body } from '@/components/ui/Typography';
import { CollectionGallery } from '@/components/sections/CollectionGallery';
import { collectionSchema, breadcrumbSchema } from '@/lib/metadata/schemas';
import { SITE_URL } from '@/config/site';
import { slugToName } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

// force-static + dynamicParams=false: fully pre-rendered, no server fallback function.
// This satisfies @cloudflare/next-on-pages without requiring runtime='edge'
// (which Next.js 15 disallows when generateStaticParams is also present).
export const dynamic = 'force-static';
export const dynamicParams = false;

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
 * Hero image config per collection — only the primary hero that renders in
 * the full-bleed hero section above the gallery needs special treatment.
 * Extensions and focal points come directly from the metadata JSON via
 * loadCollectionGallery; this map covers just the hero-01 asset.
 */
const HERO_CONFIG: Record<string, { filename: string; ext: string; focalX: number; focalY: number }> = {
  dubai:    { filename: 'dubai-hero-01',    ext: 'jpeg', focalX: 50, focalY: 52 },
  milano:   { filename: 'milano-hero-01',   ext: 'jpg',  focalX: 50, focalY: 40 },
  havai:    { filename: 'havai-hero-01',    ext: 'png',  focalX: 50, focalY: 50 },
  toronto:  { filename: 'toronto-hero-01',  ext: 'png',  focalX: 50, focalY: 50 },
  lyon:     { filename: 'lyon-hero-01',     ext: 'png',  focalX: 50, focalY: 45 },
  paris:    { filename: 'paris-hero-01',    ext: 'jpeg', focalX: 50, focalY: 45 },
  lasvegas: { filename: 'lasvegas-hero-01', ext: 'jpeg', focalX: 50, focalY: 50 },
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

  const hero = HERO_CONFIG[slug] ?? { filename: `${slug}-hero-01`, ext: 'jpeg', focalX: 50, focalY: 50 };
  const heroUrl = collectionAsset(slug, 'homepage', `${hero.filename}.${hero.ext}`);

  // All gallery images loaded dynamically from metadata JSONs at build time.
  // Includes gallery, detail, lifestyle and alternate hero shots — everything
  // except the primary hero-01 which is already shown in the hero section.
  const galleryImages = await loadCollectionGallery(slug);

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
          style={{ objectPosition: `${hero.focalX}% ${hero.focalY}%` }}
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

      {/* Gallery — all collection images loaded from metadata at build time */}
      <CollectionGallery galleryImages={galleryImages} />

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
