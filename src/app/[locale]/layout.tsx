import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { PageTransition } from '@/components/layout/PageTransition';
import { collectionAsset } from '@/lib/assets/urls';
import { buildPageMetadata } from '@/lib/metadata/page-metadata';

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
  const defaultOgImage = collectionAsset('dubai', 'homepage', 'dubai-hero-01.jpeg');

  return {
    ...buildPageMetadata({
      locale,
      title: t('title'),
      description: t('description'),
      ogImage: defaultOgImage,
    }),
    title: {
      default: t('title'),
      template: '%s | Be4Best Furniture',
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
