import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCityPage from '@/components/ServiceCityPage';

export const metadata: Metadata = {
  title: 'Curatare AC Arad | PRO TERM',
  description: 'Curatare AC in Arad pentru unitatea interioara, verificare condens si recomandari de intretinere.',
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
