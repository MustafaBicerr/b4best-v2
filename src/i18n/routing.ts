import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
  // Always redirect be4best.com → /tr (ignore browser Accept-Language)
  localeDetection: false,
  localePrefix: 'always',
});
