'use client';

import { useTranslations } from 'next-intl';
import { Phone, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { cn } from '@/lib/utils/cn';

export function FloatingActions() {
  const t = useTranslations('common');

  return (
    <div
      className="fixed bottom-6 right-5 sm:right-8 z-40 flex flex-col gap-3"
      aria-label="Quick contact"
    >
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${SITE_CONFIG.socialLinks.whatsapp.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'flex items-center justify-center w-12 h-12',
          'bg-[#25D366] text-white rounded-full shadow-lg',
          'hover:scale-110 active:scale-95',
          'transition-transform duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2'
        )}
        aria-label={t('floating.whatsapp')}
      >
        <MessageCircle className="w-5 h-5" aria-hidden="true" />
      </a>

      {/* Phone */}
      <a
        href={`tel:${SITE_CONFIG.socialLinks.phone}`}
        className={cn(
          'flex items-center justify-center w-12 h-12',
          'bg-gold text-dark rounded-full shadow-lg',
          'hover:scale-110 active:scale-95',
          'transition-transform duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2'
        )}
        aria-label={t('floating.callUs')}
      >
        <Phone className="w-5 h-5" aria-hidden="true" />
      </a>
    </div>
  );
}
