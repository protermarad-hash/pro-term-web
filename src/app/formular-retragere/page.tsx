import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FormularRetragereClient from './FormularRetragereClient';

export const metadata: Metadata = {
  title: 'Retrageți-vă din contract aici | PRO TERM',
  description: 'Funcția online PRO TERM pentru exercitarea dreptului de retragere din contractele la distanță.',
  robots: { index: false, follow: false },
};

export default function WithdrawalFormPage() {
  return (
    <>
      <Header />
      <main className="bg-light-200 pb-20 pt-28">
        <div className="container mx-auto px-4">
          <FormularRetragereClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
