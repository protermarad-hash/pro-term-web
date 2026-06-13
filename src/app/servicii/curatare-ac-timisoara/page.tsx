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

const provider = { '@type': 'HVACBusiness', name: 'PRO TERM SRL', url: 'https://pro-term.ro', telephone: '+40749025610' };

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Curățare Aer Condiționat Timișoara',
  serviceType: 'Curățare și igienizare aer condiționat',
  description: 'Curățare și igienizare aer condiționat în Timișoara: unitate interioară, filtre, schimbător de căldură. Recomandări de întreținere și mentenanță.',
  provider,
  areaServed: { '@type': 'City', name: 'Timișoara' },
  url: 'https://pro-term.ro/servicii/curatare-ac-timisoara',
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Acasă', item: 'https://pro-term.ro' },
    { '@type': 'ListItem', position: 2, name: 'Servicii', item: 'https://pro-term.ro/servicii' },
    { '@type': 'ListItem', position: 3, name: 'Curățare Aer Condiționat Timișoara', item: 'https://pro-term.ro/servicii/curatare-ac-timisoara' },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <ServiceCityPage city="Timișoara" service="igienizare" />
      <Footer />
    </>
  );
}
