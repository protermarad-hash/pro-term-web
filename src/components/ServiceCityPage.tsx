import Link from 'next/link';

export type ServiceCityPageProps = {
  city: 'Arad' | 'Timișoara';
  service: 'montaj' | 'service';
};

export default function ServiceCityPage({ city, service }: ServiceCityPageProps) {
  const label = service === 'montaj' ? 'Montaj aer condiționat' : 'Service aer condiționat';

  return (
    <main className="bg-light-200 pt-24">
      <section className="bg-hero-gradient py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl font-bold md:text-6xl">{label} {city}</h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80">
              Servicii PRO TERM pentru clienți rezidențiali și comerciali din {city} și zone apropiate.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/#contact" className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-4 font-bold text-primary transition hover:bg-light-200">
                Cere ofertă
              </Link>
              <Link href="/produse" className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-4 font-bold text-white transition hover:bg-white hover:text-primary">
                Vezi produse
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
