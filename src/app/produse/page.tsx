import type { Metadata } from 'next';
import ProduseClient from './ProduseClient';

export const metadata: Metadata = {
  title: 'Aparate Aer Condiționat cu Livrare în Toată România — Gree, Midea, Yamato | PRO TERM SRL',
  description:
    'Cumpără aparate de aer condiționat online de la PRO TERM SRL. Livrare în toată România. Modele split, multi-split, casetă și portabil — Gree, Midea, Yamato. Montaj disponibil în Arad și Timiș.',
  alternates: { canonical: 'https://pro-term.ro/produse' },
  openGraph: {
    title: 'Aparate Aer Condiționat cu Livrare Națională — Gree, Midea, Yamato',
    description:
      'Livrare în toată România. Split, multi-split, casetă, portabil de la dealeri autorizați Gree, Midea, Yamato. Montaj profesional în Arad și Timiș.',
    url: 'https://pro-term.ro/produse',
  },
};

export default function ProdusePage() {
  return <ProduseClient />;
}
