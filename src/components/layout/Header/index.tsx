'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { COLLECTION_ORDER } from '@/config/site';
import { slugToName } from '@/lib/utils/formatters';

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('common');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const otherLocale = locale === 'tr' ? 'en' : 'tr';
  const navLinks = [
    { href: `/${locale}`, label: t('nav.home') },
    { href: `/${locale}/collections`, label: t('nav.collections') },
    { href: `/${locale}/about`, label: t('nav.about') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-500',
        isScrolled
          ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-border-light'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Be4Best Furniture — Ana Sayfa"
          >
            <span
              className={cn(
                'font-display text-xl lg:text-2xl font-light tracking-[0.15em] uppercase',
                isScrolled ? 'text-dark' : 'text-on-dark'
              )}
            >
              Be4Best
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label={t('accessibility.skipToContent')}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'font-accent text-xs font-medium uppercase tracking-[0.15em]',
                  'relative pb-1',
                  'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-gold',
                  'after:transition-all after:duration-300',
                  'hover:after:w-full hover:text-gold',
                  'transition-colors duration-300',
                  isScrolled ? 'text-dark' : 'text-on-dark'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Lang toggle + mobile menu */}
          <div className="flex items-center gap-4">
            {/* Language toggle */}
            <Link
              href={`/${otherLocale}`}
              className={cn(
                'font-accent text-xs font-semibold uppercase tracking-[0.2em]',
                'transition-colors duration-300',
                isScrolled ? 'text-muted hover:text-gold' : 'text-on-dark/70 hover:text-gold',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm'
              )}
              aria-label={t('accessibility.languageToggle')}
            >
              {otherLocale.toUpperCase()}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'lg:hidden p-2 transition-colors duration-300',
                isScrolled ? 'text-dark' : 'text-on-dark',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm'
              )}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-500',
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="bg-cream border-t border-border-light">
          <nav className="px-5 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'block py-3 px-2',
                  'font-accent text-sm font-medium uppercase tracking-[0.15em] text-dark',
                  'border-b border-border-light last:border-0',
                  'hover:text-gold transition-colors duration-200'
                )}
              >
                {link.label}
              </Link>
            ))}
            {/* Collection quick links on mobile */}
            <div className="pt-4">
              <p className="font-accent text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gold mb-3">
                Koleksiyonlar
              </p>
              <div className="grid grid-cols-2 gap-1">
                {COLLECTION_ORDER.map((slug) => (
                  <Link
                    key={slug}
                    href={`/${locale}/collections/${slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2 px-2 font-body text-sm text-muted hover:text-gold transition-colors duration-200"
                  >
                    {slugToName(slug)}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
