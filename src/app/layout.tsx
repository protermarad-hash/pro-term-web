import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import Providers from '@/components/Providers';
import StructuredData from '@/components/StructuredData';
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
  metadataBase: new URL('https://pro-term.ro'),
  title: {
    default: 'PRO TERM | Magazin HVAC România, montaj și service aer condiționat',
    template: '%s | PRO TERM',
  },
  description:
    'PRO TERM SRL oferă produse HVAC cu livrare în România, montaj și service aer condiționat în Arad și Timișoara, consultanță tehnică și proiecte HVAC comerciale sau industriale.',
  keywords: [
    'magazin HVAC Romania',
    'aer conditionat Romania',
    'montaj aer conditionat Arad',
    'montaj aer conditionat Timisoara',
    'service aer conditionat Arad',
    'service aer conditionat Timisoara',
    'produse HVAC',
    'climatizare',
    'pompe de caldura',
    'centrale termice',
    'Gree Arad',
    'Midea Arad',
    'Yamato Arad',
    'pro term',
    'pro-term.ro',
  ],
  alternates: {
    canonical: 'https://pro-term.ro',
  },
  icons: {
    icon: '/logo-proterm.jpg',
    apple: '/logo-proterm.jpg',
  },
  openGraph: {
    title: 'PRO TERM | Produse HVAC România și servicii în Arad / Timișoara',
    description:
      'Cumpără produse HVAC sau cere ofertă pentru montaj, service, mentenanță și consultanță tehnică PRO TERM.',
    url: 'https://pro-term.ro',
    siteName: 'PRO TERM',
    locale: 'ro_RO',
    type: 'website',
  },
  robots: { index: true, follow: true },
  verification: {
    google: 'BbVH2_3IHyF7RtfrFlp2N1k',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <StructuredData />
        <Providers>{children}</Providers>
      </body>
      <GoogleAnalytics gaId="G-58E9WQ01JX" />
    </html>
  );
}
