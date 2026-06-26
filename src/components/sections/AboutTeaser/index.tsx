'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { fadeInUp, staggerContainerFast, scaleUp, viewportConfig } from '@/lib/animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Heading, Body } from '@/components/ui/Typography';
import { cn } from '@/lib/utils/cn';

interface AboutTeaserProps {
  locale: string;
}

export function AboutTeaser({ locale }: AboutTeaserProps) {
  const t = useTranslations('home.about');
  const prefersReducedMotion = useReducedMotion();

  const stats = [
    { value: t('stats.countriesValue'), label: t('stats.countries') },
    { value: t('stats.collectionsValue'), label: t('stats.collections') },
    { value: t('stats.experienceValue'), label: t('stats.experience') },
  ];

  return (
    <section className="section-padding bg-cream-dark">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            variants={prefersReducedMotion ? undefined : fadeInUp}
            initial={prefersReducedMotion ? undefined : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={viewportConfig}
          >
            <Eyebrow className="mb-4">{t('eyebrow')}</Eyebrow>
            <Heading as="h2" size="section" className="mb-6 whitespace-pre-line">
              {t('title')}
            </Heading>
            <Body muted className="leading-loose mb-8">
              {t('body')}
            </Body>
            <Link
              href={`/${locale}/about`}
              className={cn(
                'inline-flex items-center gap-2',
                'font-accent text-xs font-semibold uppercase tracking-[0.2em] text-dark',
                'border-b border-gold pb-1',
                'hover:text-gold transition-colors duration-300'
              )}
            >
              {t('cta')}
            </Link>
          </motion.div>

          {/* Right: Stats */}
          <motion.div
            variants={prefersReducedMotion ? undefined : staggerContainerFast}
            initial={prefersReducedMotion ? undefined : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={viewportConfig}
            className="grid grid-cols-3 gap-6 lg:gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={prefersReducedMotion ? undefined : scaleUp}
                className="text-center"
              >
                <p className="font-display font-light text-dark [font-size:clamp(2rem,4vw,3.5rem)] leading-none mb-2">
                  {stat.value}
                </p>
                <p className="font-accent text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
