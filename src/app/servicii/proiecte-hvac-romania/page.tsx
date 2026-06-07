import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NationalProjectPage from '@/components/NationalProjectPage';

export const metadata: Metadata = {
  title: 'Proiecte HVAC România | Climatizare comercială și industrială',
  description: 'PRO TERM preia proiecte HVAC comerciale și industriale în România: climatizare, VRV/VRF, montaj, service și mentenanță pentru spații mari.',
};

export default function Page() {
  return (
    <>
      <Header />
      <NationalProjectPage />
      <Footer />
    </>
  );
}
