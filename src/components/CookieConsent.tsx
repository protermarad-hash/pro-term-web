'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'proterm-cookie-consent';

type Consent = 'accepted' | 'rejected';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
  }, []);

  function saveConsent(consent: Consent) {
    window.localStorage.setItem(STORAGE_KEY, consent);
    window.dispatchEvent(new CustomEvent('proterm-cookie-consent', { detail: consent }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 md:px-6 md:pb-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-5 shadow-card-hover md:flex md:items-center md:justify-between md:gap-6">
        <div>
          <p className="font-heading text-lg font-bold text-dark">Setări cookies</p>
          <p className="mt-2 text-sm leading-relaxed text-dark-300">
            Folosim cookies esențiale pentru funcționarea site-ului. Cu acordul tău, putem folosi și cookies pentru analiză și îmbunătățirea experienței. Poți accepta sau refuza cookies opționale.
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row md:mt-0 md:flex-shrink-0">
          <button
            type="button"
            onClick={() => saveConsent('rejected')}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-dark-300 transition-colors hover:border-primary hover:text-primary"
          >
            Refuz cookies opționale
          </button>
          <button
            type="button"
            onClick={() => saveConsent('accepted')}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-600"
          >
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  );
}
