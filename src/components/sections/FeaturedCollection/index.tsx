'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { fadeInUp, slideInLeft, slideInRight, viewportConfig, imageReveal } from '@/lib/animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { collectionAsset } from '@/lib/assets/urls';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Heading, Body } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { MediaImage } from '@/components/ui/MediaImage';
import { cn } from '@/lib/utils/cn';

interface FeaturedCollectionProps {
  locale: string;
}

/**
 * Spotlight section for the top-ranked collection (Dubai — rank 1, score 96).
 * Uses homepage/detail images from metadata.
 */
export function FeaturedCollection({ locale }: FeaturedCollectionProps) {
  const t = useTranslations('home.featured');
  const tc = useTranslations('collections.items.dubai');
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="section-padding bg-dark overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            variants={prefersReducedMotion ? undefined : slideInLeft}
            initial={prefersReducedMotion ? undefined : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={viewportConfig}
            className="order-2 lg:order-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <Eyebrow onDark>{t('eyebrow')}</Eyebrow>
              <Badge variant="outline">{t('label')}</Badge>
            </div>

            <Heading as="h2" size="section" onDark className="mb-6">
              {tc('name')}
            </Heading>

            <Body onDark muted className="mb-8 leading-loose">
              {tc('description')}
            </Body>

            <Link
              href={`/${locale}/collections/dubai`}
              className={cn(
                'inline-flex items-center gap-3',
                'font-accent text-xs font-semibold uppercase tracking-[0.2em] text-gold',
                'border border-gold px-8 py-4',
                'hover:bg-gold hover:text-dark',
                'transition-all duration-300 group'
              )}
            >
              {t('cta')}
              <ArrowRight
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </motion.div>

          {/* Right: Images */}
          <motion.div
            variants={prefersReducedMotion ? undefined : slideInRight}
            initial={prefersReducedMotion ? undefined : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={viewportConfig}
            className="order-1 lg:order-2"
          >
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              {/* Main hero image */}
              <motion.div
                variants={prefersReducedMotion ? undefined : imageReveal}
                className="col-span-2 relative overflow-hidden"
                style={{ aspectRatio: '16/9' }}
              >
                <MediaImage
                  src={collectionAsset('dubai', 'homepage', 'dubai-hero-01.jpeg')}
                  alt="Dubai koleksiyonu — Burj Khalifa manzaralı salon"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  focalX={50}
                  focalY={52}
                  wrapperClassName="absolute inset-0"
                />
              </motion.div>

              {/* Detail images */}
              <motion.div
                variants={prefersReducedMotion ? undefined : fadeInUp}
                className="relative overflow-hidden"
                style={{ aspectRatio: '4/3' }}
              >
                <MediaImage
                  src={collectionAsset('dubai', 'detail', 'dubai-detail-01.jpeg')}
                  alt="Dubai koleksiyonu koltuk detayı"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  focalX={48}
                  focalY={55}
                  wrapperClassName="absolute inset-0"
                />
              </motion.div>

              <motion.div
                variants={prefersReducedMotion ? undefined : fadeInUp}
                className="relative overflow-hidden"
                style={{ aspectRatio: '4/3' }}
              >
                <MediaImage
                  src={collectionAsset('dubai', 'gallery', 'dubai-gallery-01.jpeg')}
                  alt="Dubai koleksiyonu galeri görseli"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  wrapperClassName="absolute inset-0"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
