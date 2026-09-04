import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Livrare și plată | PRO TERM SRL',
  description: 'Informații despre livrarea produselor HVAC PRO TERM în România, costurile de transport, metodele de plată acceptate și termenele de confirmare.',
  alternates: { canonical: 'https://pro-term.ro/livrare-si-plata' },
};

const updatedAt = '04.09.2026';

export default function DeliveryPaymentPage() {
  return (
    <>
      <Header />
      <main className="bg-light-200 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-card md:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">Zona legală</p>
            <h1 className="font-heading text-3xl font-bold text-dark md:text-5xl">Livrare și plată</h1>
            <p className="mt-4 text-sm text-dark-300">Ultima actualizare: {updatedAt}</p>
            <div className="prose prose-slate mt-8 max-w-none text-dark-300">
              <h2>1. Zone de livrare și intervenție</h2>
              <p>Produsele pot fi livrate în România, în funcție de disponibilitate, curier, volum și greutate. Serviciile de montaj, service și revizie sunt disponibile local în Arad și Timișoara, iar pentru proiecte HVAC mari PRO TERM poate analiza deplasări în alte zone ale țării.</p>
              <h2>2. Costuri de livrare și deplasare</h2>
              <p>Costurile de livrare, transport, manipulare sau deplasare se comunică înainte de confirmarea finală a comenzii sau ofertei. Dacă un cost nu este inclus în prețul produsului sau serviciului, acesta va fi comunicat separat și va necesita acordul clientului.</p>
              <h2>3. Termene de livrare și programare</h2>
              <p>Termenele de livrare sau intervenție sunt estimative și depind de stoc, furnizor, curier, localitate, complexitatea lucrării și programarea echipei tehnice. Termenul final se confirmă telefonic, prin e-mail sau prin alt canal agreat.</p>

              <div className="my-6 rounded-2xl border border-primary/15 bg-light-300 p-5 md:p-6">
                <h3 className="font-heading text-lg font-bold text-dark md:text-xl">Termen estimat de livrare</h3>
                <p className="mt-3 text-dark-300">Pentru produsele aflate în stoc, termenul estimat de livrare este de <strong className="text-dark">2–5 zile lucrătoare</strong> de la confirmarea comenzii.</p>
                <p className="mt-3 text-dark-300">Pentru produsele care nu se află în stocul propriu PRO TERM, disponibilitatea și termenul estimat de livrare sunt confirmate individual clientului, telefonic sau prin e-mail, înainte de confirmarea finală a comenzii.</p>
                <p className="mt-3 text-dark-300">Termenul poate varia în funcție de disponibilitatea furnizorului, localitatea de livrare, zilele nelucrătoare și situațiile independente de controlul PRO TERM. Dacă termenul comunicat nu este acceptat de client, comanda nu va fi confirmată.</p>
              </div>
              <h2>4. Metode de plată</h2>
              <p>Plata se poate face prin transfer bancar, plată ramburs sau alte metode comunicate la confirmarea comenzii sau ofertei. Dacă vor fi activate plăți online, această pagină va fi actualizată cu informații despre procesatorul de plată.</p>
              <h2>5. Comenzi cu montaj sau servicii</h2>
              <p>Pentru servicii, montaj sau lucrări tehnice, prețul final poate depinde de condițiile reale din locație, acces, traseu frigorific, materiale suplimentare, intervenții electrice, deplasare și alte lucrări neincluse în pachetul standard. Orice cost suplimentar va fi comunicat înainte de executare.</p>
              <p>Pentru dreptul de retragere și retur, consultați <Link href="/politica-retur">Politica de retur</Link>. Pentru termenii generali, consultați <Link href="/termeni-si-conditii">Termeni și condiții</Link>.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
