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
  title: 'PROTERM | Soluții HVAC Complete',
  description:
    'PROTERM — expertul tău în sisteme HVAC, climatizare și soluții frigorifice pentru industrie și comerț. Proiectare, instalare, service autorizat.',
  keywords: [
    'HVAC',
    'climatizare',
    'aer condiționat',
    'refrigerare industrială',
    'service HVAC',
    'instalare aer condiționat',
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
    title: 'PROTERM | Soluții HVAC Complete',
    description: 'Expertul tău în sisteme HVAC, climatizare și soluții frigorifice.',
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
