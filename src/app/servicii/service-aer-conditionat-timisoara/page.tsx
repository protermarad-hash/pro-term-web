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

const provider = { '@type': 'HVACBusiness', name: 'PRO TERM SRL', url: 'https://pro-term.ro', telephone: '+40749025610' };

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Service Aer Condiționat Timișoara',
  serviceType: 'Service aer condiționat',
  description: 'Service aer condiționat în Timișoara: diagnostic, reparații, revizie și igienizare. Tehnicieni F-Gas autorizați, intervenție rapidă.',
  provider,
  areaServed: { '@type': 'City', name: 'Timișoara' },
  url: 'https://pro-term.ro/servicii/service-aer-conditionat-timisoara',
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Acasă', item: 'https://pro-term.ro' },
    { '@type': 'ListItem', position: 2, name: 'Servicii', item: 'https://pro-term.ro/servicii' },
    { '@type': 'ListItem', position: 3, name: 'Service Aer Condiționat Timișoara', item: 'https://pro-term.ro/servicii/service-aer-conditionat-timisoara' },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <ServiceCityPage city="Timișoara" service="service" />
      <Footer />
    </>
  );
}
