import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculator BTU Aer Condiționat | Află câți BTU ai nevoie | PRO TERM',
  description:
    'Calculator gratuit BTU pentru aer condiționat. Introdu dimensiunile camerei și află ce capacitate ai nevoie. Livrare în toată România, montaj Arad și Timiș.',
  alternates: {
    canonical: 'https://pro-term.ro/calculator-btu',
  },
  openGraph: {
    title: 'Calculator BTU Aer Condiționat — PRO TERM',
    description:
      'Calculator gratuit BTU pentru aer condiționat. Introdu dimensiunile camerei și află ce capacitate ai nevoie.',
    url: 'https://pro-term.ro/calculator-btu',
  },
  robots: { index: true, follow: true },
};

export default function CalculatorBTULayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
