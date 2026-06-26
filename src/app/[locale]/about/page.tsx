import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Heading, Body } from '@/components/ui/Typography';
import { aboutPageSchema, breadcrumbSchema } from '@/lib/metadata/schemas';
import { SITE_URL } from '@/config/site';
import { collectionAsset } from '@/lib/assets/urls';
import { cn } from '@/lib/utils/cn';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/about`,
      languages: {
        tr: `${SITE_URL}/tr/about`,
        en: `${SITE_URL}/en/about`,
      },
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  const jsonLd = [
    aboutPageSchema(locale),
    breadcrumbSchema([
      { name: 'Be4Best', url: `${SITE_URL}/${locale}` },
      { name: t('hero.eyebrow'), url: `${SITE_URL}/${locale}/about` },
    ]),
  ];

  const values = ['craftsmanship', 'luxury', 'innovation', 'sustainability'] as const;

  const stats = [
    { key: 'countries' },
    { key: 'collections' },
    { key: 'experience' },
    { key: 'satisfaction' },
  ] as const;

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
      <section className="relative min-h-[60vh] flex flex-col justify-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={collectionAsset('milano', 'homepage', 'milano-hero-01.jpg')}
          alt="Be4Best Furniture — Milano Koleksiyonu"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 40%' }}
          fetchPriority="high"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/40 to-dark/10" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 xl:px-16 pb-16 lg:pb-24">
          <Eyebrow onDark className="mb-4">{t('hero.eyebrow')}</Eyebrow>
          <h1 className="font-display font-light text-on-dark [font-size:clamp(2.5rem,7vw,6rem)] leading-[1.05] whitespace-pre-line">
            {t('hero.title')}
          </h1>
          <p className="mt-4 font-body text-on-dark/70 max-w-xl leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-cream">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <Eyebrow className="mb-4">{t('story.eyebrow')}</Eyebrow>
              <Heading as="h2" size="section" className="mb-8 whitespace-pre-line">
                {t('story.title')}
              </Heading>
            </div>
            <div className="space-y-6">
              <Body muted className="leading-loose">{t('story.body1')}</Body>
              <Body muted className="leading-loose">{t('story.body2')}</Body>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="section-padding-sm bg-dark">
        <Container>
          <div className="text-center mb-12">
            <Eyebrow onDark>{t('stats.eyebrow')}</Eyebrow>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map(({ key }) => (
              <div key={key} className="text-center">
                <p className="font-display font-light text-on-dark [font-size:clamp(2rem,4vw,3.5rem)] leading-none mb-2">
                  {t(`stats.items.${key}.value`)}
                </p>
                <p className="font-accent text-[0.65rem] font-medium uppercase tracking-[0.2em] text-on-dark/50">
                  {t(`stats.items.${key}.label`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="section-padding bg-cream">
        <Container>
          <div className="text-center mb-16">
            <Eyebrow className="mb-4">{t('values.eyebrow')}</Eyebrow>
            <Heading as="h2" size="section" className="whitespace-pre-line">
              {t('values.title')}
            </Heading>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {values.map((value) => (
              <div key={value} className="group">
                <div className="w-10 h-px bg-gold mb-6 transition-all duration-500 group-hover:w-16" aria-hidden="true" />
                <h3 className="font-display text-xl font-normal text-dark mb-3">
                  {t(`values.items.${value}.title`)}
                </h3>
                <Body muted size="sm" className="leading-relaxed">
                  {t(`values.items.${value}.description`)}
                </Body>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CEO Quote */}
      <section className="section-padding-sm bg-cream-dark">
        <Container size="md">
          <div className="text-center">
            <Eyebrow className="mb-8">{t('ceo.eyebrow')}</Eyebrow>
            <blockquote>
              <p className="font-display font-light text-dark [font-size:clamp(1.5rem,3vw,2.5rem)] leading-relaxed italic mb-8">
                &ldquo;{t('ceo.quote')}&rdquo;
              </p>
              <footer>
                <p className="font-accent text-sm font-semibold uppercase tracking-[0.15em] text-dark">
                  {t('ceo.name')}
                </p>
                <p className="font-body text-xs text-muted mt-1">{t('ceo.title')}</p>
              </footer>
            </blockquote>
          </div>
        </Container>
      </section>
    </>
  );
}
