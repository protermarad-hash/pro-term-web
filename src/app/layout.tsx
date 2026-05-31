import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import Providers from '@/components/Providers';
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
  title: 'PROTERM | Magazin online HVAC, climatizare și service în Arad',
  description:
    'PROTERM — magazin online pentru aparate de aer condiționat și soluții HVAC. Produse, montaj, service, mentenanță și consultanță tehnică în Arad.',
  keywords: [
    'magazin HVAC Arad',
    'aer condiționat Arad',
    'aparate aer condiționat',
    'montaj aer condiționat Arad',
    'service HVAC',
    'climatizare',
    'refrigerare industrială',
    'refrigerare comercială',
    'proterm',
    'Daikin',
    'Midea',
    'Gree',
    'LG',
  ],
  icons: {
    icon: '/logo-proterm.jpg',
    apple: '/logo-proterm.jpg',
  },
  openGraph: {
    title: 'PROTERM | Magazin online HVAC și servicii în Arad',
    description: 'Cumpără produse HVAC sau cere ofertă pentru montaj, service și consultanță tehnică.',
    url: 'https://proterm.ro',
    siteName: 'PROTERM',
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
