'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';

const GA_ID = 'G-58E9WQ01JX';
const STORAGE_KEY = 'proterm-cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [gaEnabled, setGaEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    } else if (stored === 'accepted') {
      setGaEnabled(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setGaEnabled(true);
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  }

  return (
    <>
      {gaEnabled && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}</Script>
        </>
      )}

      {visible && (
        <div
          role="dialog"
          aria-label="Consimțământ cookie-uri"
          className="fixed inset-x-0 bottom-0 z-[100] border-t border-white/10 bg-dark/95 backdrop-blur-md"
        >
          <div className="container mx-auto flex flex-col gap-2.5 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-5">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-white">
                Folosim cookie-uri pentru a îmbunătăți experiența ta pe site.
              </p>
              <p className="mt-1 text-xs leading-snug text-white/60 sm:leading-relaxed">
                Cookie-urile analitice (Google Analytics) ne ajută să înțelegem cum este utilizat
                site-ul. Cookie-urile necesare asigură funcționarea de bază.{' '}
                <Link
                  href="/politica-cookies"
                  className="text-accent underline underline-offset-2 transition-colors hover:text-accent/80"
                >
                  Politica cookies
                </Link>
              </p>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={decline}
                className="flex-1 rounded-xl border border-white/20 px-3.5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white sm:flex-initial sm:px-4"
              >
                Doar necesare
              </button>
              <button
                type="button"
                onClick={accept}
                className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-px hover:bg-accent/90 sm:flex-initial sm:px-5"
              >
                Accept toate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
