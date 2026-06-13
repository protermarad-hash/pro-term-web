import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCityPage from '@/components/ServiceCityPage';

export const metadata: Metadata = {
  title: 'Revizie Aer Condiționat Timișoara | Mentenanță Preventivă | PRO TERM',
  description:
    'Revizie aer condiționat în Timișoara: verificare funcționare, curățare filtru, control condens și mentenanță preventivă. Echipă autorizată F-Gas. Sună: 0749 025 610.',
  alternates: { canonical: 'https://pro-term.ro/servicii/revizie-ac-timisoara' },
  openGraph: {
    title: 'Revizie Aer Condiționat Timișoara | PRO TERM',
    description: 'Mentenanță preventivă și revizie AC în Timișoara. Verificare completă, curățare filtre, control condens.',
    url: 'https://pro-term.ro/servicii/revizie-ac-timisoara',
  },
};

export default function Page() {
  return (
    <>
      <Header />
      <ServiceCityPage city="Timișoara" service="revizie" />
      <Footer />
    </>
  );
}
