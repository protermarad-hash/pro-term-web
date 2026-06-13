import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Pagina nu a fost găsită',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-light-200 px-4 pt-24">
        <div className="w-full max-w-lg text-center">
          <p className="font-heading text-8xl font-bold text-primary/20 select-none">404</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-dark">
            Pagina nu a fost găsită
          </h1>
          <p className="mt-4 text-dark-300 leading-relaxed">
            Pagina pe care o cauți nu există sau a fost mutată. Poți reveni la homepage sau explora catalogul de produse HVAC.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="btn-primary w-full justify-center sm:w-auto"
            >
              Înapoi acasă
            </Link>
            <Link
              href="/produse"
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white sm:w-auto"
            >
              Vezi produse HVAC
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
