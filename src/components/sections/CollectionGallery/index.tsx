'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { fadeInUp, staggerContainer, viewportConfig } from '@/lib/animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Eyebrow, Heading } from '@/components/ui/Typography';
import { Container } from '@/components/ui/Container';
import { MediaImage } from '@/components/ui/MediaImage';
import { cn } from '@/lib/utils/cn';

const INITIAL_COUNT = 8;
const PAGE_SIZE = 8;

interface GalleryImage {
  src: string;
  alt: string;
  focalX?: number;
  focalY?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
  aspectRatio?: string;
  role?: string;
}

interface CollectionGalleryProps {
  galleryImages: GalleryImage[];
  /** @deprecated Pass all images via galleryImages — loader now handles all roles */
  detailImages?: GalleryImage[];
}

function aspectClass(image: GalleryImage): string {
  const ratio = image.aspectRatio ?? (image.orientation === 'portrait' ? '2:3' : '3:2');
  if (ratio === '2:3' || image.orientation === 'portrait') return 'aspect-[2/3]';
  if (ratio === '1:1' || image.orientation === 'square')   return 'aspect-square';
  if (ratio === '4:3') return 'aspect-[4/3]';
  return 'aspect-[3/2]';
}

export function CollectionGallery({ galleryImages, detailImages = [] }: CollectionGalleryProps) {
  const t = useTranslations('collections');
  const prefersReducedMotion = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  // Merge legacy detailImages for backward compat, de-dupe by src
  const seen = new Set<string>();
  const allImages = [...galleryImages, ...detailImages].filter(({ src }) => {
    if (seen.has(src)) return false;
    seen.add(src);
    return true;
  });

  const visibleImages = allImages.slice(0, visibleCount);
  const hasMore = visibleCount < allImages.length;

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + allImages.length) % allImages.length : null));
  }, [allImages.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % allImages.length : null));
  }, [allImages.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, closeLightbox, prev, next]);

  if (allImages.length === 0) return null;

  return (
    <>
      <section className="section-padding-sm bg-cream">
        <Container>
          {/* Section header */}
          <motion.div
            variants={prefersReducedMotion ? undefined : fadeInUp}
            initial={prefersReducedMotion ? undefined : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={viewportConfig}
            className="text-center mb-12"
          >
            <Eyebrow className="mb-3">{t('gallery')}</Eyebrow>
            <Heading as="h2" size="subsection">{t('gallery')}</Heading>
            <p className="mt-3 font-body text-sm text-dark/40 tabular-nums">
              {allImages.length} görsel
            </p>
          </motion.div>

          {/* Masonry grid — show only visibleImages, rest load on demand */}
          <motion.div
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? undefined : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={viewportConfig}
            className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3"
          >
            {visibleImages.map((image, index) => (
              <motion.div
                key={`${image.src}-${index}`}
                variants={prefersReducedMotion ? undefined : fadeInUp}
                className={cn(
                  'break-inside-avoid relative group cursor-pointer overflow-hidden',
                  'rounded-sm',
                  aspectClass(image)
                )}
                onClick={() => openLightbox(index)}
                role="button"
                tabIndex={0}
                aria-label={`${image.alt} — ${t('lightbox.enlarge')}`}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
              >
                <MediaImage
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  focalX={image.focalX}
                  focalY={image.focalY}
                  className="transition-transform duration-700 group-hover:scale-105"
                  wrapperClassName="absolute inset-0"
                />
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 bg-dark/30 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <ZoomIn className="w-8 h-8 text-white drop-shadow-md" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className={cn(
                  'inline-flex items-center gap-3',
                  'font-accent text-xs font-semibold uppercase tracking-[0.2em] text-dark',
                  'border border-dark/30 px-8 py-4',
                  'hover:border-gold hover:text-gold transition-all duration-300'
                )}
              >
                Daha Fazla Yükle
                <span className="text-dark/40 font-body normal-case tracking-normal text-xs">
                  ({Math.min(PAGE_SIZE, allImages.length - visibleCount)} / {allImages.length - visibleCount} kaldı)
                </span>
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* Lightbox — always uses full allImages array, unaffected by pagination */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark/95 flex items-center justify-center"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={t('lightbox.enlarge')}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 text-on-dark/70 hover:text-white transition-colors duration-200 p-2 z-10"
              aria-label={t('lightbox.close')}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-on-dark/70 hover:text-white transition-colors duration-200 p-3 z-10"
                aria-label={t('lightbox.prev')}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Lightbox image — served at display size, high quality */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[85vh] mx-14 sm:mx-20"
              onClick={(e) => e.stopPropagation()}
            >
              <MediaImage
                src={allImages[lightboxIndex].src}
                alt={allImages[lightboxIndex].alt}
                fill={false}
                sizes="(max-width: 768px) 100vw, 80vw"
                width={1200}
                height={800}
                focalX={allImages[lightboxIndex].focalX}
                focalY={allImages[lightboxIndex].focalY}
                className="max-w-full max-h-[85vh] object-contain rounded-sm !object-contain"
                style={{ objectFit: 'contain' }}
              />
              <p className="text-center font-body text-on-dark/50 text-sm mt-3">
                {lightboxIndex + 1} / {allImages.length}
              </p>
            </motion.div>

            {/* Next */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-dark/70 hover:text-white transition-colors duration-200 p-3 z-10"
                aria-label={t('lightbox.next')}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
