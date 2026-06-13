import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCityPage from '@/components/ServiceCityPage';

export const metadata: Metadata = {
  title: 'Montaj Aer Condiționat Timișoara | Echipă F-Gas Autorizată | PRO TERM',
  description:
    'Montaj aer condiționat în Timișoara pentru locuințe, birouri și spații comerciale. Instalare completă, probă de funcționare, garanție 12 luni. Sună: 0749 025 610.',
  alternates: { canonical: 'https://pro-term.ro/servicii/montaj-aer-conditionat-timisoara' },
  openGraph: {
    title: 'Montaj Aer Condiționat Timișoara | PRO TERM',
    description: 'Instalare aer condiționat în Timișoara — echipă F-Gas autorizată, garanție 12 luni, intervenție rapidă.',
    url: 'https://pro-term.ro/servicii/montaj-aer-conditionat-timisoara',
  },
};

export default function Page() {
  return <><Header /><ServiceCityPage city="Timișoara" service="montaj" /><Footer /></>;
}
