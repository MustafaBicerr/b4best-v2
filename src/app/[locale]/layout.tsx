import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { PageTransition } from '@/components/layout/PageTransition';
import { SITE_URL } from '@/config/site';
import { collectionAsset } from '@/lib/assets/urls';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.meta' });

  // Default OG image used on pages that don't set their own (homepage, about, contact).
  // Uses the Dubai hero — strongest brand image in the collection.
  const defaultOgImage = collectionAsset('dubai', 'homepage', 'dubai-hero-01.jpeg');

  return {
    title: {
      default: t('title'),
      template: '%s | Be4Best Furniture',
    },
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        tr: `${SITE_URL}/tr`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      alternateLocale: locale === 'tr' ? 'en_US' : 'tr_TR',
      siteName: 'Be4Best Furniture',
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 800,
          alt: 'Be4Best Furniture — Luxury Collection',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@b4bmobilya',
      images: [defaultOgImage],
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'tr' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Header locale={locale} />
      <PageTransition>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </PageTransition>
      <Footer locale={locale} />
      <FloatingActions />
    </NextIntlClientProvider>
  );
}
