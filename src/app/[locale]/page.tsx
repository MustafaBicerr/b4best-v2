export const runtime = 'edge';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HeroSection } from '@/components/sections/HeroSection';
import { CollectionsGrid } from '@/components/sections/CollectionsGrid';
import { FeaturedCollection } from '@/components/sections/FeaturedCollection';
import { AboutTeaser } from '@/components/sections/AboutTeaser';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { getCloudflareEnv } from '@/lib/cloudflare/env';
import { getCollections, sortCollectionsByOrder } from '@/lib/cloudflare/d1';
import { organizationSchema, furnitureStoreSchema, websiteSchema } from '@/lib/metadata/schemas';
import { buildPageMetadata } from '@/lib/metadata/page-metadata';

export const revalidate = 3600;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.meta' });

  return buildPageMetadata({
    locale,
    title: t('title'),
    description: t('description'),
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  const env = await getCloudflareEnv();
  const collectionsRaw = await getCollections(env?.DB ?? null);
  const collections = sortCollectionsByOrder(collectionsRaw);

  const jsonLd = [
    organizationSchema(),
    furnitureStoreSchema(locale),
    websiteSchema(),
  ];

  return (
    <>
      {/* JSON-LD */}
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <HeroSection locale={locale} />
      <CollectionsGrid collections={collections} locale={locale} />
      <FeaturedCollection locale={locale} />
      <AboutTeaser locale={locale} />
      <ContactCTA locale={locale} />
    </>
  );
}
