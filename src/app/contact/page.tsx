import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';

export const metadata: Metadata = {
  title: 'Contact PRO TERM | Arad | 0749 025 610',
  description:
    'Contactează PRO TERM SRL pentru ofertă de produse HVAC, montaj aer condiționat în Arad și Timiș sau consultanță pentru proiecte comerciale. Sună: 0749 025 610.',
  alternates: { canonical: 'https://pro-term.ro/contact' },
  openGraph: {
    title: 'Contact PRO TERM | Arad | 0749 025 610',
    description: 'Solicită ofertă, programează montaj sau cere consultanță HVAC. PRO TERM SRL Arad — răspuns rapid.',
    url: 'https://pro-term.ro/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="bg-light-200 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">Contactează-ne</p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-dark md:text-4xl">
              Solicită ofertă sau programează o intervenție
            </h1>
            <p className="mt-3 max-w-2xl text-dark-300 leading-relaxed">
              Suntem la dispoziția ta pentru oferte de produse HVAC, montaj aer condiționat în Arad și Timiș sau consultanță pentru proiecte comerciale și industriale.
            </p>
          </div>
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
