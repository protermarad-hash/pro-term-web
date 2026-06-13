import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCityPage from '@/components/ServiceCityPage';

export const metadata: Metadata = {
  title: 'Curățare Aer Condiționat Arad | Igienizare AC | PRO TERM',
  description:
    'Curățare și igienizare aer condiționat în Arad: unitate interioară, filtre, schimbător de căldură. Recomandări de întreținere și mentenanță. PRO TERM — 0749 025 610.',
  alternates: { canonical: 'https://pro-term.ro/servicii/curatare-ac-arad' },
  openGraph: {
    title: 'Curățare Aer Condiționat Arad | PRO TERM',
    description: 'Igienizare profesională AC în Arad: curățare aprofundată unitate interioară, filtre și schimbător de căldură.',
    url: 'https://pro-term.ro/servicii/curatare-ac-arad',
  },
};

export default function Page() {
  return (
    <>
      <Header />
      <ServiceCityPage city="Arad" service="igienizare" />
      <Footer />
    </>
  );
}
