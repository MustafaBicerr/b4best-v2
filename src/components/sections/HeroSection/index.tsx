'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { heroEntrance, heroTextContainer, heroTextLine, fadeIn } from '@/lib/animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { collectionAsset } from '@/lib/assets/urls';
import { cn } from '@/lib/utils/cn';

/**
 * Hero images selected per device following homepage-ranking.json deviceHeroStrategy.
 * Desktop/tablet use landscape wide shots; mobile uses portrait-friendly compositions.
 */
const DESKTOP_HEROES = [
  { src: collectionAsset('milano', 'homepage', 'milano-hero-01.jpg'), collection: 'Milano', focalX: 50, focalY: 40 },
  { src: collectionAsset('dubai', 'homepage', 'dubai-hero-01.jpeg'), collection: 'Dubai', focalX: 50, focalY: 52 },
  { src: collectionAsset('havai', 'homepage', 'havai-hero-01.png'), collection: 'Havai', focalX: 50, focalY: 50 },
  { src: collectionAsset('toronto', 'homepage', 'toronto-hero-01.png'), collection: 'Toronto', focalX: 50, focalY: 50 },
  { src: collectionAsset('paris', 'homepage', 'paris-hero-01.jpeg'), collection: 'Paris', focalX: 50, focalY: 45 },
];

const MOBILE_HEROES = [
  { src: collectionAsset('milano', 'gallery', 'milano-gallery-01.jpg'), collection: 'Milano', focalX: 50, focalY: 40 },
  { src: collectionAsset('paris', 'homepage', 'paris-hero-02.jpeg'), collection: 'Paris', focalX: 50, focalY: 45 },
  { src: collectionAsset('dubai', 'homepage', 'dubai-hero-02.png'), collection: 'Dubai', focalX: 50, focalY: 52 },
  { src: collectionAsset('havai', 'homepage', 'havai-hero-03.png'), collection: 'Havai', focalX: 50, focalY: 50 },
  { src: collectionAsset('lasvegas', 'homepage', 'lasvegas-hero-01.jpeg'), collection: 'Las Vegas', focalX: 50, focalY: 50 },
];

const ROTATION_INTERVAL = 6000;

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations('home.hero');
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const heroes = isMobile ? MOBILE_HEROES : DESKTOP_HEROES;

  const advance = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % heroes.length);
  }, [heroes.length]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(advance, ROTATION_INTERVAL);
    return () => clearInterval(timer);
  }, [advance, prefersReducedMotion]);

  const titleLines = t('title').split('\n');

  return (
    <section
      className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden"
      aria-label={`${t('eyebrow')} — Be4Best`}
    >
      {/* Background images */}
      <AnimatePresence mode="sync">
        {heroes.map((hero, index) =>
          index === currentIndex ? (
            <motion.div
              key={hero.src}
              className="absolute inset-0"
              variants={prefersReducedMotion ? undefined : heroEntrance}
              initial={prefersReducedMotion ? { opacity: 1 } : 'hidden'}
              animate={prefersReducedMotion ? { opacity: 1 } : 'visible'}
              exit={prefersReducedMotion ? { opacity: 0 } : 'exit'}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.src}
                alt={`${hero.collection} koleksiyonu — Be4Best Furniture`}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: `${hero.focalX}% ${hero.focalY}%` }}
                fetchPriority={index === 0 ? 'high' : 'low'}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-dark/10"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 xl:px-16 pb-16 lg:pb-24">
        <motion.div
          variants={heroTextContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {/* Eyebrow */}
          <motion.p
            variants={heroTextLine}
            className="font-accent text-xs font-semibold uppercase tracking-[0.3em] text-gold mb-4 lg:mb-6"
          >
            {t('eyebrow')}
          </motion.p>

          {/* Title */}
          <h1 className="sr-only">{t('title').replace(/\n/g, ' ')}</h1>
          <div aria-hidden="true">
            {titleLines.map((line, i) => (
              <motion.div key={i} variants={heroTextLine} className="overflow-hidden">
                <span
                  className={cn(
                    'block font-display font-light text-on-dark leading-[1.05]',
                    '[font-size:clamp(2.5rem,7vw,6rem)]'
                  )}
                >
                  {line}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            variants={heroTextLine}
            className="mt-6 lg:mt-8 font-body text-on-dark/80 max-w-xl leading-relaxed text-base lg:text-lg"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTA */}
          <motion.div variants={heroTextLine} className="mt-8 lg:mt-10">
            <Link
              href={`/${locale}/collections`}
              className={cn(
                'inline-flex items-center gap-3',
                'font-accent text-xs font-semibold uppercase tracking-[0.2em]',
                'border border-gold text-gold',
                'px-8 py-4',
                'hover:bg-gold hover:text-dark',
                'transition-all duration-300',
                'group'
              )}
            >
              {t('cta')}
              <span
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Dot indicators */}
        <div
          className="flex items-center gap-2 mt-10"
          role="tablist"
          aria-label="Hero slideshow navigation"
        >
          {heroes.map((hero, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Slide ${i + 1}: ${hero.collection}`}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                'transition-all duration-500',
                i === currentIndex
                  ? 'w-8 h-0.5 bg-gold'
                  : 'w-2 h-0.5 bg-on-dark/40 hover:bg-on-dark/70'
              )}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="absolute bottom-8 right-6 sm:right-10 hidden sm:flex items-center gap-2"
        aria-hidden="true"
      >
        <span className="font-accent text-[0.65rem] uppercase tracking-[0.25em] text-on-dark/40 rotate-90 origin-center translate-x-3">
          {t('scroll')}
        </span>
        <ChevronDown className="w-4 h-4 text-on-dark/40 animate-bounce" />
      </motion.div>
    </section>
  );
}
