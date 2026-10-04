import Image from 'next/image';
import Link from 'next/link';

/**
 * Ordinul ANPC nr. 449/2022, art. 2, as amended by Ordinul nr. 270/2026:
 * SAL pictogram on the home page, 250 (L) x 50 (H) px, linked to the SAL
 * platform. The file is the unmodified "PICTOGRAMA SAL ONLINE" from
 * https://anpc.ro/sal (201 x 50 px); it is shown at its own proportions inside
 * the 250 x 50 px linked area instead of being stretched.
 */
export const SAL_PLATFORM_URL = 'https://reclamatiisal.anpc.ro';
export const SAL_PICTOGRAM_PATH = '/legal/anpc-sal-pictograma.png';
export const SAL_PICTOGRAM_WIDTH = 250;
export const SAL_PICTOGRAM_HEIGHT = 50;

export default function ConsumerProtectionNotice() {
  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-3 min-[360px]:px-4">
        <div className="grid gap-4 rounded-3xl border border-slate-100 bg-light-200 p-6 shadow-card md:grid-cols-3 md:items-center">
          <div className="md:col-span-2">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">Informare consumatori</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-dark">
              Protecția Consumatorilor - A.N.P.C.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-dark-300">
              Pentru informații privind drepturile consumatorilor, reclamații și soluționarea litigiilor, puteți consulta Autoritatea Națională pentru Protecția Consumatorilor.
            </p>
            {/* Below 360 px the pictogram may use the card padding so it keeps its
                legal 250 x 50 px size on narrow screens (e.g. 280 px) without overflow. */}
            <div className="-mx-6 mt-4 flex justify-center min-[360px]:mx-0 min-[360px]:justify-start">
              <a
                href={SAL_PLATFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="anpc-sal-pictogram"
                className="block h-[50px] w-[250px] max-w-none flex-shrink-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Image
                  src={SAL_PICTOGRAM_PATH}
                  alt="ANPC – Soluționarea alternativă a litigiilor (SAL). Detalii (se deschide într-o filă nouă)"
                  width={SAL_PICTOGRAM_WIDTH}
                  height={SAL_PICTOGRAM_HEIGHT}
                  unoptimized
                  className="block h-[50px] w-[250px] max-w-none object-contain object-left max-[359px]:object-center"
                />
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-primary px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-primary-600">
              PROTECȚIA CONSUMATORILOR - A.N.P.C.
            </a>
            <Link href="/garantii" className="rounded-xl border border-primary px-5 py-3 text-center text-sm font-bold text-primary transition hover:bg-primary hover:text-white">
              Garanții și drepturile consumatorului
            </Link>
            <Link href="/informatii-legale" className="rounded-xl border border-primary px-5 py-3 text-center text-sm font-bold text-primary transition hover:bg-primary hover:text-white">
              Informații legale PRO TERM
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
