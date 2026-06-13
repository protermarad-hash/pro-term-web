import type { Metadata } from 'next';
import CalculatorBtuClient from './CalculatorBtuClient';

export const metadata: Metadata = {
  title: 'Calculator BTU Aer Condiționat | Alege capacitatea potrivită | PRO TERM',
  description:
    'Calculator BTU gratuit pentru aer condiționat. Introdu dimensiunile camerei, orientarea și tipul locuinței și află ce capacitate BTU îți trebuie. Recomandări produse Midea, Gree, Yamato.',
  alternates: { canonical: 'https://pro-term.ro/calculator-btu' },
  openGraph: {
    title: 'Calculator BTU Aer Condiționat | PRO TERM',
    description:
      'Calculează gratuit ce BTU ai nevoie pentru camera ta. Recomandări instantanee de produse și ofertă personalizată.',
    url: 'https://pro-term.ro/calculator-btu',
  },
};

export default function CalculatorBtuPage() {
  return <CalculatorBtuClient />;
}
