import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NationalProjectPage from '@/components/NationalProjectPage';

export const metadata: Metadata = {
  title: 'Proiecte HVAC Comerciale și Industriale România | PRO TERM',
  description:
    'PRO TERM realizează proiecte HVAC comerciale și industriale la nivel național: climatizare VRV/VRF, sisteme multi-split, montaj, service și mentenanță pentru spații mari, retail și birouri.',
  alternates: { canonical: 'https://pro-term.ro/servicii/proiecte-hvac-romania' },
  openGraph: {
    title: 'Proiecte HVAC Comerciale și Industriale România | PRO TERM',
    description:
      'Sisteme HVAC pentru spații comerciale, industriale și birouri la nivel național. VRV/VRF, multi-split, consultanță și mentenanță.',
    url: 'https://pro-term.ro/servicii/proiecte-hvac-romania',
  },
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
