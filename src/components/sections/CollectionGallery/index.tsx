'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { fadeInUp, staggerContainer, viewportConfig } from '@/lib/animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { collectionAsset } from '@/lib/assets/urls';
import { Eyebrow, Heading } from '@/components/ui/Typography';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';

interface GalleryImage {
  src: string;
  alt: string;
  focalX?: number;
  focalY?: number;
}

interface CollectionGalleryProps {
  slug: string;
  galleryImages: GalleryImage[];
  detailImages?: GalleryImage[];
}

export function CollectionGallery({ slug, galleryImages, detailImages = [] }: CollectionGalleryProps) {
  const t = useTranslations('collections');
  const prefersReducedMotion = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allImages = [...galleryImages, ...detailImages];

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
          <motion.div
            variants={prefersReducedMotion ? undefined : fadeInUp}
            initial={prefersReducedMotion ? undefined : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={viewportConfig}
            className="text-center mb-12"
          >
            <Eyebrow className="mb-3">{t('gallery')}</Eyebrow>
            <Heading as="h2" size="subsection">{t('gallery')}</Heading>
          </motion.div>

          <motion.div
            variants={prefersReducedMotion ? undefined : staggerContainer}
            initial={prefersReducedMotion ? undefined : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={viewportConfig}
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
          >
            {allImages.map((image, index) => (
              <motion.div
                key={index}
                variants={prefersReducedMotion ? undefined : fadeInUp}
                className="break-inside-avoid relative group cursor-pointer overflow-hidden"
                onClick={() => openLightbox(index)}
                role="button"
                tabIndex={0}
                aria-label={`${image.alt} — ${t('lightbox.enlarge')}`}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{
                    objectPosition: image.focalX !== undefined && image.focalY !== undefined
                      ? `${image.focalX}% ${image.focalY}%`
                      : 'center',
                  }}
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 bg-dark/30 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <ZoomIn className="w-8 h-8 text-white" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Lightbox */}
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
            aria-label="Görsel büyütme"
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 text-on-dark/70 hover:text-white transition-colors duration-200 p-2"
              aria-label={t('lightbox.close')}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 text-on-dark/70 hover:text-white transition-colors duration-200 p-2"
              aria-label={t('lightbox.prev')}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[85vh] mx-12"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={allImages[lightboxIndex].src}
                alt={allImages[lightboxIndex].alt}
                className="max-w-full max-h-[85vh] object-contain"
              />
              <p className="text-center font-body text-on-dark/50 text-sm mt-3">
                {lightboxIndex + 1} / {allImages.length}
              </p>
            </motion.div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 text-on-dark/70 hover:text-white transition-colors duration-200 p-2"
              aria-label={t('lightbox.next')}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
