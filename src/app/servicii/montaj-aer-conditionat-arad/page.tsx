import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCityPage from '@/components/ServiceCityPage';

export const metadata: Metadata = {
  title: 'Montaj Aer Condiționat Arad | Echipă F-Gas Autorizată | PRO TERM',
  description:
    'Montaj aer condiționat în Arad pentru locuințe, birouri și spații comerciale. Instalare completă, probă de funcționare, garanție 12 luni. Sună: 0749 025 610.',
  alternates: { canonical: 'https://pro-term.ro/servicii/montaj-aer-conditionat-arad' },
  openGraph: {
    title: 'Montaj Aer Condiționat Arad | PRO TERM',
    description: 'Instalare aer condiționat în Arad — echipă F-Gas autorizată, garanție 12 luni, intervenție rapidă.',
    url: 'https://pro-term.ro/servicii/montaj-aer-conditionat-arad',
  },
};

const provider = { '@type': 'HVACBusiness', name: 'PRO TERM SRL', url: 'https://pro-term.ro', telephone: '+40749025610' };

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Montaj Aer Condiționat Arad',
  serviceType: 'Montaj aer condiționat',
  description: 'Montaj aer condiționat în Arad pentru locuințe, birouri și spații comerciale. Instalare completă, probă de funcționare, garanție 12 luni.',
  provider,
  areaServed: { '@type': 'City', name: 'Arad' },
  url: 'https://pro-term.ro/servicii/montaj-aer-conditionat-arad',
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Acasă', item: 'https://pro-term.ro' },
    { '@type': 'ListItem', position: 2, name: 'Servicii', item: 'https://pro-term.ro/servicii' },
    { '@type': 'ListItem', position: 3, name: 'Montaj Aer Condiționat Arad', item: 'https://pro-term.ro/servicii/montaj-aer-conditionat-arad' },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <ServiceCityPage city="Arad" service="montaj" />
      <Footer />
    </>
  );
}
