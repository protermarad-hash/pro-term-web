import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCityPage from '@/components/ServiceCityPage';

export const metadata: Metadata = {
  title: 'Montaj aer condiționat Arad | PRO TERM',
  description: 'Montaj aer condiționat în Arad pentru locuințe, birouri și spații comerciale. Instalare, probă de funcționare și suport tehnic PRO TERM.',
};

export default function Page() {
  return <><Header /><ServiceCityPage city="Arad" service="montaj" /><Footer /></>;
}
