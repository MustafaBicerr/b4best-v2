export const runtime = 'edge';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Heading, Body } from '@/components/ui/Typography';
import { ContactForm } from '@/components/sections/ContactForm';
import { contactPageSchema, breadcrumbSchema } from '@/lib/metadata/schemas';
import { SITE_URL, SITE_CONFIG, PHONES } from '@/config/site';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/contact`,
      languages: {
        tr: `${SITE_URL}/tr/contact`,
        en: `${SITE_URL}/en/contact`,
      },
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  const jsonLd = [
    contactPageSchema(locale),
    breadcrumbSchema([
      { name: 'Be4Best', url: `${SITE_URL}/${locale}` },
      { name: t('hero.eyebrow'), url: `${SITE_URL}/${locale}/contact` },
    ]),
  ];

  const contactItems = [
    {
      icon: MapPin,
      label: t('info.address.label'),
      value: t('info.address.value'),
      href: undefined,
    },
    {
      icon: Phone,
      label: t('info.phone1.label'),
      value: t('info.phone1.value'),
      href: `tel:${PHONES[0].number}`,
    },
    {
      icon: Phone,
      label: t('info.phone2.label'),
      value: t('info.phone2.value'),
      href: `tel:${PHONES[1].number}`,
    },
    {
      icon: Mail,
      label: t('info.email.label'),
      value: t('info.email.value'),
      href: `mailto:${SITE_CONFIG.socialLinks.email}`,
    },
    {
      icon: Clock,
      label: t('info.hours.label'),
      value: t('info.hours.value'),
      href: undefined,
    },
  ];

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
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-dark">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow onDark className="mb-4">{t('hero.eyebrow')}</Eyebrow>
            <h1 className="font-display font-light text-on-dark [font-size:clamp(2.5rem,7vw,6rem)] leading-[1.05] whitespace-pre-line mb-6">
              {t('hero.title')}
            </h1>
            <Body onDark muted>{t('hero.subtitle')}</Body>
          </div>
        </Container>
      </section>

      {/* Main content */}
      <section className="section-padding bg-cream">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            {/* Left: Contact info */}
            <div>
              <Heading as="h2" size="subsection" className="mb-10">
                {t('info.title')}
              </Heading>

              <div className="space-y-8">
                {contactItems.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4 group">
                    <div className="flex items-center justify-center w-10 h-10 bg-cream-dark border border-border-light mt-0.5 shrink-0">
                      <Icon className="w-4 h-4 text-gold" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-accent text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted mb-1">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="font-body text-dark hover:text-gold transition-colors duration-200"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="font-body text-dark">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-12 pt-8 border-t border-border-light">
                <a
                  href={`https://wa.me/${SITE_CONFIG.socialLinks.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 font-accent text-xs font-semibold uppercase tracking-[0.2em] text-[#25D366] hover:opacity-80 transition-opacity duration-200"
                >
                  <span
                    className="flex items-center justify-center w-8 h-8 bg-[#25D366] text-white rounded-full"
                    aria-hidden="true"
                  >
                    W
                  </span>
                  {t('info.whatsapp')}
                </a>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
