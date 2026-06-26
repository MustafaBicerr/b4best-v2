import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Montserrat } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: true,
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://be4best.com'),
  title: {
    default: 'Be4Best Furniture',
    template: '%s | Be4Best Furniture',
  },
  description: 'Luxury furniture collections inspired by the world\'s most prestigious locations.',
  icons: {
    icon: '/icons/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${cormorant.variable} ${inter.variable} ${montserrat.variable}`}
    >
      <body>
        {/* Skip link — text intentionally bilingual for accessibility robustness */}
        <a href="#main-content" className="skip-link" aria-label="Skip to main content">
          Skip to main content / Ana içeriğe geç
        </a>
        {children}
      </body>
    </html>
  );
}
