'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { fadeInUp, staggerContainer, imageReveal, viewportConfig } from '@/lib/animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { collectionAsset } from '@/lib/assets/urls';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Heading } from '@/components/ui/Typography';
import { cn } from '@/lib/utils/cn';
import type { Collection } from '@/types/collection';

/**
 * Card hero images — desktop suitable, high homepage score.
 * Derived from homepage-ranking.json collectionRanking order.
 */
const CARD_IMAGES: Record<string, { src: string; focalX: number; focalY: number }> = {
  dubai: { src: collectionAsset('dubai', 'homepage', 'dubai-hero-01.jpeg'), focalX: 50, focalY: 52 },
  milano: { src: collectionAsset('milano', 'homepage', 'milano-hero-01.jpg'), focalX: 50, focalY: 40 },
  havai: { src: collectionAsset('havai', 'homepage', 'havai-hero-01.png'), focalX: 50, focalY: 50 },
  toronto: { src: collectionAsset('toronto', 'homepage', 'toronto-hero-01.png'), focalX: 50, focalY: 50 },
  lyon: { src: collectionAsset('lyon', 'homepage', 'lyon-hero-01.png'), focalX: 50, focalY: 45 },
  paris: { src: collectionAsset('paris', 'homepage', 'paris-hero-01.jpeg'), focalX: 50, focalY: 45 },
  lasvegas: { src: collectionAsset('lasvegas', 'homepage', 'lasvegas-hero-01.jpeg'), focalX: 50, focalY: 50 },
};

interface CollectionsGridProps {
  collections: Collection[];
  locale: string;
}

export function CollectionsGrid({ collections, locale }: CollectionsGridProps) {
  const t = useTranslations('home.collections');
  const tc = useTranslations('collections.items');
  const prefersReducedMotion = useReducedMotion();

  const animProps = prefersReducedMotion
    ? {}
    : { variants: staggerContainer, initial: 'hidden', whileInView: 'visible', viewport: viewportConfig };

  return (
    <section className="section-padding bg-cream">
      <Container>
        {/* Header */}
        <motion.div
          variants={prefersReducedMotion ? undefined : fadeInUp}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          whileInView={prefersReducedMotion ? undefined : 'visible'}
          viewport={viewportConfig}
          className="text-center mb-16 lg:mb-20"
        >
          <Eyebrow className="mb-4">{t('eyebrow')}</Eyebrow>
          <Heading as="h2" size="section" className="mb-6 whitespace-pre-line">
            {t('title')}
          </Heading>
          <p className="font-body text-muted max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          {...animProps}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {collections.map((collection, index) => {
            const image = CARD_IMAGES[collection.slug];
            const isLarge = index === 0;

            return (
              <motion.article
                key={collection.slug}
                variants={prefersReducedMotion ? undefined : fadeInUp}
                className={cn(
                  'group relative overflow-hidden cursor-pointer',
                  isLarge && 'sm:col-span-2 lg:col-span-1'
                )}
              >
                <Link
                  href={`/${locale}/collections/${collection.slug}`}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  aria-label={`${collection.name} koleksiyonunu görüntüle`}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-collection-card">
                    <motion.div
                      variants={prefersReducedMotion ? undefined : imageReveal}
                      className="absolute inset-0"
                    >
                      {image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image.src}
                          alt={`${collection.name} — Be4Best Furniture`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          style={{ objectPosition: `${image.focalX}% ${image.focalY}%` }}
                          loading="lazy"
                        />
                      )}
                    </motion.div>

                    {/* Hover overlay */}
                    <div
                      className={cn(
                        'absolute inset-0 bg-dark/40',
                        'transition-opacity duration-500',
                        'opacity-0 group-hover:opacity-100'
                      )}
                      aria-hidden="true"
                    />

                    {/* Hover CTA */}
                    <div
                      className={cn(
                        'absolute bottom-5 right-5',
                        'flex items-center justify-center w-10 h-10',
                        'bg-gold text-dark rounded-full',
                        'translate-y-3 opacity-0',
                        'transition-all duration-500',
                        'group-hover:translate-y-0 group-hover:opacity-100'
                      )}
                      aria-hidden="true"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="pt-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-xl font-normal text-dark group-hover:text-gold transition-colors duration-300">
                          {collection.name}
                        </h3>
                        <p className="font-body text-sm text-muted mt-1 line-clamp-2">
                          {tc(`${collection.slug}.theme`)}
                        </p>
                      </div>
                      <span className="font-accent text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold mt-1 shrink-0">
                        {collection.luxury_score}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </motion.div>

        {/* View all CTA */}
        <motion.div
          variants={prefersReducedMotion ? undefined : fadeInUp}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          whileInView={prefersReducedMotion ? undefined : 'visible'}
          viewport={viewportConfig}
          className="text-center mt-14"
        >
          <Link
            href={`/${locale}/collections`}
            className={cn(
              'inline-flex items-center gap-3',
              'font-accent text-xs font-semibold uppercase tracking-[0.2em] text-dark',
              'border-b border-gold pb-1',
              'hover:text-gold transition-colors duration-300',
              'group'
            )}
          >
            {t('cta')}
            <ArrowUpRight
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
