import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'tr' | 'en')) {
    locale = routing.defaultLocale;
  }

  const [common, home, collections, about, contact] = await Promise.all([
    import(`../../messages/${locale}/common.json`),
    import(`../../messages/${locale}/home.json`),
    import(`../../messages/${locale}/collections.json`),
    import(`../../messages/${locale}/about.json`),
    import(`../../messages/${locale}/contact.json`),
  ]);

  /**
   * Message structure:
   * - common.json  = { nav, footer, buttons, accessibility, errors, floating }  → under 'common'
   * - home.json    = { home: { meta, hero, ... } }  → unwrapped to 'home'
   * - etc.
   *
   * Usage examples:
   *   useTranslations('common')            → t('nav.home'), t('footer.tagline')
   *   useTranslations('home.hero')         → t('title'), t('cta')
   *   useTranslations('collections.items.dubai') → t('name'), t('theme')
   */
  return {
    locale,
    messages: {
      common: common.default,
      home: (home.default as { home: unknown }).home,
      collections: (collections.default as { collections: unknown }).collections,
      about: (about.default as { about: unknown }).about,
      contact: (contact.default as { contact: unknown }).contact,
    },
  };
});
