import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { COLLECTION_ORDER, SITE_CONFIG, PHONES } from '@/config/site';
import { slugToName } from '@/lib/utils/formatters';
import { Container } from '@/components/ui/Container';
import { Instagram } from 'lucide-react';

interface FooterProps {
  locale: string;
}

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: 'common' });

  return (
    <footer className="bg-dark text-on-dark">
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="inline-block mb-4">
              <span className="font-display text-2xl font-light tracking-[0.2em] uppercase text-on-dark">
                Be4Best
              </span>
            </Link>
            <p className="font-accent text-xs font-medium uppercase tracking-[0.2em] text-gold mb-6">
              {t('footer.tagline')}
            </p>
            <p className="font-body text-sm text-on-dark/60 leading-relaxed max-w-sm">
              {t('footer.address')}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href={SITE_CONFIG.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-dark/40 hover:text-gold transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-accent text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-6">
              {t('footer.collections')}
            </h3>
            <ul className="space-y-3">
              {COLLECTION_ORDER.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${locale}/collections/${slug}`}
                    className="font-body text-sm text-on-dark/60 hover:text-gold transition-colors duration-200"
                  >
                    {slugToName(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Contact */}
          <div>
            <h3 className="font-accent text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-6">
              {t('footer.company')}
            </h3>
            <ul className="space-y-3 mb-8">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="font-body text-sm text-on-dark/60 hover:text-gold transition-colors duration-200"
                >
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="font-body text-sm text-on-dark/60 hover:text-gold transition-colors duration-200"
                >
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>

            <h3 className="font-accent text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-4">
              {t('footer.contact')}
            </h3>
            <div className="space-y-2">
              {PHONES.map((p) => (
                <a
                  key={p.number}
                  href={`tel:${p.number}`}
                  className="flex flex-col font-body text-sm text-on-dark/60 hover:text-gold transition-colors duration-200"
                >
                  <span>{p.display}</span>
                  <span className="text-xs text-on-dark/35">{p.name}</span>
                </a>
              ))}
              <a
                href={`mailto:${SITE_CONFIG.socialLinks.email}`}
                className="block font-body text-sm text-on-dark/60 hover:text-gold transition-colors duration-200 mt-1"
              >
                {SITE_CONFIG.socialLinks.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-on-dark/40">
            © {new Date().getFullYear()} Be4Best Furniture. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/tr"
              className="font-accent text-xs font-medium uppercase tracking-[0.15em] text-on-dark/40 hover:text-gold transition-colors duration-200"
            >
              TR
            </Link>
            <Link
              href="/en"
              className="font-accent text-xs font-medium uppercase tracking-[0.15em] text-on-dark/40 hover:text-gold transition-colors duration-200"
            >
              EN
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
