import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCityPage from '@/components/ServiceCityPage';

export const metadata: Metadata = {
  title: 'Revizie AC Arad | PRO TERM',
  description: 'Revizie AC in Arad pentru verificare functionare, condens si mentenanta preventiva.',
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
