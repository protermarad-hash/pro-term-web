import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCityPage from '@/components/ServiceCityPage';

export const metadata: Metadata = {
  title: 'Service Aer Condiționat Arad | Diagnostic și Reparații | PRO TERM',
  description:
    'Service aer condiționat în Arad: diagnostic, reparații, revizie și igienizare. Tehnicieni F-Gas autorizați, intervenție rapidă. PRO TERM — 0749 025 610.',
  alternates: { canonical: 'https://pro-term.ro/servicii/service-aer-conditionat-arad' },
  openGraph: {
    title: 'Service Aer Condiționat Arad | PRO TERM',
    description: 'Diagnostic, reparații și revizie aer condiționat în Arad. Tehnicieni F-Gas certificați, intervenție promptă.',
    url: 'https://pro-term.ro/servicii/service-aer-conditionat-arad',
  },
};

export default function Page() {
  return <><Header /><ServiceCityPage city="Arad" service="service" /><Footer /></>;
}
