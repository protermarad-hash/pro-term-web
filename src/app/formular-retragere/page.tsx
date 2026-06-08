import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FormularRetragereClient from './FormularRetragereClient';

export const metadata: Metadata = {
  title: 'Formular de retragere din contract',
  robots: { index: false, follow: false },
};

export default function WithdrawalFormPage() {
  return (
    <>
      <Header />
      <main className="bg-light-200 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <FormularRetragereClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
