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
  title: 'PRO TERM | Magazin online HVAC, climatizare și service în Arad',
  description:
    'PRO TERM — magazin online pentru aparate de aer condiționat și soluții HVAC. Dealer oficial și service zonal Gree, Midea și Yamato în Arad.',
  keywords: [
    'magazin HVAC Arad',
    'aer condiționat Arad',
    'aparate aer condiționat',
    'montaj aer condiționat Arad',
    'service HVAC',
    'climatizare',
    'Gree Arad',
    'Midea Arad',
    'Yamato Arad',
    'pro term',
    'pro-term.ro',
  ],
  icons: {
    icon: '/logo-proterm.jpg',
    apple: '/logo-proterm.jpg',
  },
  openGraph: {
    title: 'PRO TERM | Magazin online HVAC și servicii în Arad',
    description: 'Cumpără produse HVAC sau cere ofertă pentru montaj, service și consultanță tehnică.',
    url: 'https://pro-term.ro',
    siteName: 'PRO TERM',
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
