import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCityPage from '@/components/ServiceCityPage';

export const metadata: Metadata = {
  title: 'Service Aer Condiționat Timișoara | Diagnostic și Reparații | PRO TERM',
  description:
    'Service aer condiționat în Timișoara: diagnostic, reparații, revizie și igienizare. Tehnicieni F-Gas autorizați, intervenție rapidă. PRO TERM — 0749 025 610.',
  alternates: { canonical: 'https://pro-term.ro/servicii/service-aer-conditionat-timisoara' },
  openGraph: {
    title: 'Service Aer Condiționat Timișoara | PRO TERM',
    description: 'Diagnostic, reparații și revizie aer condiționat în Timișoara. Tehnicieni F-Gas certificați, intervenție promptă.',
    url: 'https://pro-term.ro/servicii/service-aer-conditionat-timisoara',
  },
};

export default function Page() {
  return <><Header /><ServiceCityPage city="Timișoara" service="service" /><Footer /></>;
}
