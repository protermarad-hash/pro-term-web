'use client';

import { MessageCircle } from 'lucide-react';
import { trackWhatsAppClick } from '@/lib/analytics';

const PHONE = '40749025610';
const DEFAULT_MESSAGE = 'Bună ziua, doresc o ofertă de la PRO TERM.';

export function buildWhatsAppUrl(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}

export default function WhatsAppFloat() {
  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact PRO TERM pe WhatsApp"
      onClick={() => trackWhatsAppClick({ cta_location: 'floating-button' })}
      className="fixed bottom-24 right-5 z-[90] flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-sm font-extrabold text-white shadow-card-hover transition-all hover:-translate-y-1 hover:bg-green-600 md:bottom-7 md:right-7"
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
