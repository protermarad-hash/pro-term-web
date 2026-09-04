'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

const PHONE = '40749025610';
const DEFAULT_MESSAGE = 'Bună ziua, doresc o ofertă de la PRO TERM.';

export function buildWhatsAppUrl(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}

export default function WhatsAppFloat() {
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  // Cookie banner isn't exposed via context — detect its own dialog node directly
  // rather than duplicating CookieConsent's logic or wiring a new shared store.
  useEffect(() => {
    const selector = '[role="dialog"][aria-label="Consimțământ cookie-uri"]';
    setCookieBannerVisible(Boolean(document.querySelector(selector)));

    const observer = new MutationObserver(() => {
      setCookieBannerVisible(Boolean(document.querySelector(selector)));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Hide once the footer (and its own NETOPIA/legal content) enters the viewport,
  // so the button never sits on top of footer links.
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const hidden = footerVisible;

  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact PRO TERM pe WhatsApp"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={`fixed right-4 z-[90] flex h-[50px] w-[50px] items-center justify-center rounded-full bg-green-500 text-white shadow-card transition-all duration-200 hover:bg-green-600 sm:h-auto sm:w-auto sm:gap-2 sm:rounded-full sm:px-4 sm:py-3 sm:font-extrabold ${
        cookieBannerVisible ? 'bottom-[188px] sm:bottom-28' : 'bottom-[calc(16px+env(safe-area-inset-bottom))] sm:bottom-7'
      } ${hidden ? 'pointer-events-none opacity-0' : 'opacity-100'} sm:right-7`}
    >
      <MessageCircle size={22} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
