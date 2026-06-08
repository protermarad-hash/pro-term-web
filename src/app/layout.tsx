import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import Providers from '@/components/Providers';
import SchemaOrg from '@/components/SchemaOrg';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PRO TERM SRL | Soluții HVAC Complete — Arad',
    template: '%s | PRO TERM SRL',
  },
  description:
    'PRO TERM SRL — expertul tău în sisteme HVAC, climatizare și soluții frigorifice pentru industrie și comerț din Arad. Proiectare, instalare, service autorizat din 1999.',
  keywords: [
    'HVAC',
    'climatizare',
    'aer condiționat',
    'refrigerare industrială',
    'service HVAC',
    'instalare aer condiționat',
    'pro term',
    'Gree',
    'Midea',
    'Yamato',
    'Arad',
  ],
  metadataBase: new URL('https://pro-term.ro'),
  alternates: { canonical: 'https://pro-term.ro' },
  icons: {
    icon: '/logo-proterm.jpg',
    apple: '/logo-proterm.jpg',
  },
  openGraph: {
    title: 'PRO TERM SRL | Soluții HVAC Complete — Arad',
    description: 'Expertul tău în sisteme HVAC, climatizare și soluții frigorifice din Arad, din 1999.',
    url: 'https://pro-term.ro',
    siteName: 'PRO TERM SRL',
    locale: 'ro_RO',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <SchemaOrg />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
