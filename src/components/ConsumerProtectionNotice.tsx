import Link from 'next/link';

export default function ConsumerProtectionNotice() {
  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid gap-4 rounded-3xl border border-slate-100 bg-light-200 p-6 shadow-card md:grid-cols-3 md:items-center">
          <div className="md:col-span-2">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">Informare consumatori</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-dark">
              Protecția Consumatorilor - A.N.P.C.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-dark-300">
              Pentru informații privind drepturile consumatorilor, reclamații și soluționarea litigiilor, puteți consulta Autoritatea Națională pentru Protecția Consumatorilor.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-primary px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-primary-600">
              PROTECȚIA CONSUMATORILOR - A.N.P.C.
            </a>
            <Link href="/informatii-legale" className="rounded-xl border border-primary px-5 py-3 text-center text-sm font-bold text-primary transition hover:bg-primary hover:text-white">
              Informații legale PRO TERM
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
