'use client';

import NTPLogo from 'ntp-logo-react';

/**
 * ntp-logo-react attaches an onClick handler directly on the rendered <img>,
 * so it must stay inside a Client Component boundary — a Server Component
 * cannot serialize a function prop into the RSC payload.
 */
export default function NetopiaLogo() {
  return <NTPLogo color="#ffffff" version="horizontal" secret="167084" />;
}
