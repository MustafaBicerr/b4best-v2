'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { fadeInUp, heroTextContainer, heroTextLine, viewportConfig } from '@/lib/animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { collectionAsset } from '@/lib/assets/urls';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Typography';
import { cn } from '@/lib/utils/cn';

interface ContactCTAProps {
  locale: string;
}

export function ContactCTA({ locale }: ContactCTAProps) {
  const t = useTranslations('home.contact');
  const prefersReducedMotion = useReducedMotion();
  const titleLines = t('title').split('\n');

  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={collectionAsset('lasvegas', 'homepage', 'lasvegas-hero-01.jpeg')}
          alt=""
          className="w-full h-full object-cover"
          style={{ objectPosition: '50% 50%' }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-dark/70" />
      </div>

      {/* Content */}
      <Container className="relative z-10 text-center">
        <motion.div
          variants={prefersReducedMotion ? undefined : heroTextContainer}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          whileInView={prefersReducedMotion ? undefined : 'visible'}
          viewport={viewportConfig}
        >
          <motion.div variants={prefersReducedMotion ? undefined : heroTextLine}>
            <Eyebrow onDark className="mb-4">{t('eyebrow')}</Eyebrow>
          </motion.div>

          <div aria-hidden="true">
            {titleLines.map((line, i) => (
              <motion.div
                key={i}
                variants={prefersReducedMotion ? undefined : heroTextLine}
                className="overflow-hidden"
              >
                <span className="block font-display font-light text-on-dark [font-size:clamp(2rem,5vw,4rem)] leading-[1.05]">
                  {line}
                </span>
              </motion.div>
            ))}
          </div>
          <h2 className="sr-only">{t('title').replace(/\n/g, ' ')}</h2>

          <motion.p
            variants={prefersReducedMotion ? undefined : fadeInUp}
            className="mt-6 font-body text-on-dark/70 max-w-lg mx-auto leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            variants={prefersReducedMotion ? undefined : fadeInUp}
            className="mt-10"
          >
            <Link
              href={`/${locale}/contact`}
              className={cn(
                'inline-flex items-center gap-3',
                'font-accent text-xs font-semibold uppercase tracking-[0.2em]',
                'bg-gold text-dark',
                'px-10 py-4',
                'hover:bg-gold-dark',
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
        </motion.div>
      </Container>
    </section>
  );
}
