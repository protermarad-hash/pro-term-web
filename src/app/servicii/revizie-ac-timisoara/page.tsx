import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCityPage from '@/components/ServiceCityPage';

export const metadata: Metadata = {
  title: 'Revizie AC Timisoara | PRO TERM',
  description: 'Revizie AC in Timisoara pentru verificare functionare, condens si mentenanta preventiva.',
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
