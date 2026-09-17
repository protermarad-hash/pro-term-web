import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NationalProjectPage from '@/components/NationalProjectPage';

export const metadata: Metadata = {
  title: 'Proiecte HVAC Complete la Cheie România | PRO TERM',
  description:
    'PRO TERM gestionează proiecte HVAC complete la cheie pentru clienți comerciali și industriali din România: proiectare, furnizare echipamente, execuție și punere în funcțiune.',
  alternates: { canonical: 'https://pro-term.ro/servicii/proiecte-hvac-romania' },
  openGraph: {
    title: 'Proiecte HVAC Complete la Cheie România | PRO TERM',
    description:
      'Proiectare, furnizare, execuție și punere în funcțiune pentru proiecte HVAC comerciale și industriale, la nivel național.',
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
