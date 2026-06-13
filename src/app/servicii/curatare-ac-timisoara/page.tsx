import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCityPage from '@/components/ServiceCityPage';

export const metadata: Metadata = {
  title: 'Curățare Aer Condiționat Timișoara | Igienizare AC | PRO TERM',
  description:
    'Curățare și igienizare aer condiționat în Timișoara: unitate interioară, filtre, schimbător de căldură. Recomandări de întreținere și mentenanță. PRO TERM — 0749 025 610.',
  alternates: { canonical: 'https://pro-term.ro/servicii/curatare-ac-timisoara' },
  openGraph: {
    title: 'Curățare Aer Condiționat Timișoara | PRO TERM',
    description: 'Igienizare profesională AC în Timișoara: curățare aprofundată unitate interioară, filtre și schimbător de căldură.',
    url: 'https://pro-term.ro/servicii/curatare-ac-timisoara',
  },
};

export default function Page() {
  return (
    <>
      <Header />
      <ServiceCityPage city="Timișoara" service="igienizare" />
      <Footer />
    </>
  );
}
