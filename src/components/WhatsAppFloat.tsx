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

  // While the cookie dialog is up, don't try to guess its height and float above it —
  // just don't render the button at all. No opacity/pointer-events transition means no
  // window where it's visible-but-inert or invisible-but-clickable; it simply isn't in
  // the DOM, so it can't be focused or hit-tested. It reappears immediately once the
  // dialog closes or scrolls out, at its one normal position.
  if (cookieBannerVisible || footerVisible) return null;

  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact PRO TERM pe WhatsApp"
      className="fixed bottom-[calc(16px+env(safe-area-inset-bottom))] right-4 z-[90] flex h-[50px] w-[50px] items-center justify-center rounded-full bg-green-500 text-white shadow-card hover:bg-green-600 sm:bottom-7 sm:right-7 sm:h-auto sm:w-auto sm:gap-2 sm:rounded-full sm:px-4 sm:py-3 sm:font-extrabold"
    >
      <MessageCircle size={22} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
