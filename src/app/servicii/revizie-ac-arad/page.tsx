import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCityPage from '@/components/ServiceCityPage';

export const metadata: Metadata = {
  title: 'Revizie Aer Condiționat Arad | Mentenanță Preventivă | PRO TERM',
  description:
    'Revizie aer condiționat în Arad: verificare funcționare, curățare filtru, control condens și mentenanță preventivă. Echipă autorizată F-Gas. Sună: 0749 025 610.',
  alternates: { canonical: 'https://pro-term.ro/servicii/revizie-ac-arad' },
  openGraph: {
    title: 'Revizie Aer Condiționat Arad | PRO TERM',
    description: 'Mentenanță preventivă și revizie AC în Arad. Verificare completă, curățare filtre, control condens.',
    url: 'https://pro-term.ro/servicii/revizie-ac-arad',
  },
};

export default function Page() {
  return (
    <>
      <Header />
      <ServiceCityPage city="Arad" service="revizie" />
      <Footer />
    </>
  );
}
