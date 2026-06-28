export const runtime = 'edge';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { getCloudflareEnv } from '@/lib/cloudflare/env';
import { getCollections, sortCollectionsByOrder } from '@/lib/cloudflare/d1';
import { collectionAsset } from '@/lib/assets/urls';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Display, Body } from '@/components/ui/Typography';
import { breadcrumbSchema } from '@/lib/metadata/schemas';
import { SITE_URL } from '@/config/site';
import { cn } from '@/lib/utils/cn';
import { MediaImage } from '@/components/ui/MediaImage';
import { buildPageMetadata } from '@/lib/metadata/page-metadata';

export const revalidate = 3600;

interface CollectionsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CollectionsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'collections.meta' });

  return buildPageMetadata({
    locale,
    path: '/collections',
    title: t('title'),
    description: t('description'),
    ogImage: collectionAsset('dubai', 'homepage', 'dubai-hero-01.jpeg'),
  });
}

const CARD_IMAGES: Record<string, { src: string; focalX: number; focalY: number }> = {
  dubai: { src: collectionAsset('dubai', 'homepage', 'dubai-hero-01.jpeg'), focalX: 50, focalY: 52 },
  milano: { src: collectionAsset('milano', 'homepage', 'milano-hero-01.jpg'), focalX: 50, focalY: 40 },
  havai: { src: collectionAsset('havai', 'homepage', 'havai-hero-01.png'), focalX: 50, focalY: 50 },
  toronto: { src: collectionAsset('toronto', 'homepage', 'toronto-hero-01.png'), focalX: 50, focalY: 50 },
  lyon: { src: collectionAsset('lyon', 'homepage', 'lyon-hero-01.png'), focalX: 50, focalY: 45 },
  paris: { src: collectionAsset('paris', 'homepage', 'paris-hero-01.jpeg'), focalX: 50, focalY: 45 },
  lasvegas: { src: collectionAsset('lasvegas', 'homepage', 'lasvegas-hero-01.jpeg'), focalX: 50, focalY: 50 },
};

export default async function CollectionsPage({ params }: CollectionsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'collections' });
  const tc = await getTranslations({ locale, namespace: 'collections.items' });

  const env = await getCloudflareEnv();
  const collectionsRaw = await getCollections(env?.DB ?? null);
  const collections = sortCollectionsByOrder(collectionsRaw);

  const breadcrumb = breadcrumbSchema([
    { name: 'Be4Best', url: `${SITE_URL}/${locale}` },
    { name: t('pageTitle'), url: `${SITE_URL}/${locale}/collections` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Page Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-dark">
        <Container className="text-center">
          <Eyebrow onDark className="mb-4">{t('pageTitle')}</Eyebrow>
          <Display as="h1" onDark className="mb-6">
            {t('pageTitle')}
          </Display>
          <Body onDark muted className="max-w-2xl mx-auto">
            {t('pageSubtitle')}
          </Body>
        </Container>
      </section>

      {/* Collections Grid */}
      <section className="section-padding bg-cream">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {collections.map((collection, index) => {
              const image = CARD_IMAGES[collection.slug];
              const isFirst = index === 0;

              return (
                <article
                  key={collection.slug}
                  className={cn('group', isFirst && 'md:col-span-2')}
                >
                  <Link
                    href={`/${locale}/collections/${collection.slug}`}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  >
                    {/* Image */}
                    <div className={cn('relative overflow-hidden', isFirst ? 'aspect-hero' : 'aspect-collection-card')}>
                      {image && (
                        <MediaImage
                          src={image.src}
                          alt={`${collection.name} — Be4Best Furniture`}
                          fill
                          sizes={isFirst
                            ? '(max-width: 768px) 100vw, 100vw'
                            : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw'}
                          priority={index < 2}
                          focalX={image.focalX}
                          focalY={image.focalY}
                          className="transition-transform duration-700 group-hover:scale-105"
                          wrapperClassName="absolute inset-0"
                        />
                      )}
                      <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-5 right-5 flex items-center justify-center w-9 h-9 bg-gold text-dark rounded-full translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex items-start justify-between gap-4 pt-5">
                      <div>
                        <h2 className={cn(
                          'font-display font-normal text-dark group-hover:text-gold transition-colors duration-300',
                          isFirst ? 'text-3xl lg:text-4xl' : 'text-2xl'
                        )}>
                          {collection.name}
                        </h2>
                        <p className="font-body text-sm text-muted mt-2 line-clamp-2">
                          {tc(`${collection.slug}.theme`)}
                        </p>
                      </div>
                      <span className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-gold shrink-0 mt-1">
                        Score {collection.luxury_score}
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
