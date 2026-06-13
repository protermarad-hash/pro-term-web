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

const provider = { '@type': 'HVACBusiness', name: 'PRO TERM SRL', url: 'https://pro-term.ro', telephone: '+40749025610' };

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Revizie Aer Condiționat Arad',
  serviceType: 'Revizie aer condiționat',
  description: 'Revizie aer condiționat în Arad: verificare funcționare, curățare filtru, control condens și mentenanță preventivă. Echipă autorizată F-Gas.',
  provider,
  areaServed: { '@type': 'City', name: 'Arad' },
  url: 'https://pro-term.ro/servicii/revizie-ac-arad',
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Acasă', item: 'https://pro-term.ro' },
    { '@type': 'ListItem', position: 2, name: 'Servicii', item: 'https://pro-term.ro/servicii' },
    { '@type': 'ListItem', position: 3, name: 'Revizie Aer Condiționat Arad', item: 'https://pro-term.ro/servicii/revizie-ac-arad' },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <ServiceCityPage city="Arad" service="revizie" />
      <Footer />
    </>
  );
}
