import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCityPage from '@/components/ServiceCityPage';

export const metadata: Metadata = {
  title: 'Service aer condiționat Arad | PRO TERM',
  description: 'Service aer condiționat în Arad: diagnostic, revizie, igienizare și suport tehnic pentru echipamente HVAC.',
};

export default function Page() {
  return <><Header /><ServiceCityPage city="Arad" service="service" /><Footer /></>;
}
