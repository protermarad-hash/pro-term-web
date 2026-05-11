import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
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
  title: 'FRIGOTERM | Soluții Frigorifice și HVAC',
  description:
    'FRIGOTERM — expertul tău în sisteme frigorifice, climatizare și soluții HVAC pentru industrie și comerț. Proiectare, instalare, service autorizat.',
  keywords: [
    'frigorifice',
    'climatizare',
    'HVAC',
    'refrigerare industrială',
    'service frigorific',
    'instalare aer condiționat',
    'frigoterm',
  ],
  openGraph: {
    title: 'FRIGOTERM | Soluții Frigorifice și HVAC',
    description:
      'Expertul tău în sisteme frigorifice, climatizare și soluții HVAC.',
    url: 'https://frigoterm.ro',
    siteName: 'FRIGOTERM',
    locale: 'ro_RO',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
