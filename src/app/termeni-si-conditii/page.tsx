import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const updatedAt = '06.06.2026';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="bg-light-200 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-card md:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">Zona legală</p>
            <h1 className="font-heading text-3xl font-bold text-dark md:text-5xl">Termeni și condiții</h1>
            <p className="mt-4 text-sm text-dark-300">Ultima actualizare: {updatedAt}</p>

            <div className="prose prose-slate mt-8 max-w-none text-dark-300">
              <h2>1. Informații despre comerciant</h2>
              <p>
                Site-ul pro-term.ro este administrat de SC PRO TERM SRL, firmă din Arad, România, reprezentată de Herman Sebastian. Pentru contact: <a href="mailto:office@pro-term.ro">office@pro-term.ro</a>, telefon <a href="tel:+40749025610">0749 025 610</a>.
              </p>
              <p>
                PRO TERM comercializează echipamente HVAC, aparate de aer condiționat, centrale, pompe de căldură, accesorii de montaj și servicii conexe de consultanță, montaj, service și mentenanță.
              </p>

              <h2>2. Utilizarea site-ului</h2>
              <p>
                Prin accesarea site-ului, sunteți de acord cu acești termeni. Dacă nu sunteți de acord, vă rugăm să nu utilizați site-ul. Ne rezervăm dreptul de a modifica informațiile, produsele, prețurile și conținutul site-ului, cu respectarea legislației aplicabile.
              </p>

              <h2>3. Produse, prețuri și disponibilitate</h2>
              <p>
                Produsele afișate pe site pot avea preț final sau status „Cere ofertă”. Pentru echipamente tehnice, disponibilitatea, compatibilitatea, accesoriile și montajul pot necesita confirmare telefonică sau prin e-mail.
              </p>
              <p>
                Prețurile sunt exprimate în RON. Pot exista diferențe în funcție de model, stoc, furnizor, accesorii, lungime traseu frigorific, condiții de montaj, deplasare sau servicii suplimentare. Oferta finală va fi confirmată înainte de facturare/livrare/montaj.
              </p>

              <h2>4. Comenzi și cereri de ofertă</h2>
              <p>
                O comandă sau cerere transmisă prin site nu reprezintă automat acceptare contractuală până la confirmarea acesteia de către PRO TERM. Confirmarea poate fi transmisă prin telefon, e-mail sau alt canal agreat.
              </p>
              <p>
                Pentru produsele care necesită montaj, PRO TERM poate solicita informații suplimentare despre locație, spațiu, traseu, alimentare electrică, acces și condițiile reale de instalare.
              </p>

              <h2>5. Livrare, montaj și service</h2>
              <p>
                Livrarea, montajul și service-ul se stabilesc în funcție de disponibilitate, zona de intervenție și complexitatea lucrării. Pentru lucrări în afara zonei Arad sau pentru proiecte speciale, condițiile se stabilesc punctual.
              </p>
              <p>
                Clientul are obligația să ofere acces la locație, informații corecte despre spațiu și să asigure condițiile necesare intervenției, dacă acestea au fost comunicate în prealabil.
              </p>

              <h2>6. Plată și facturare</h2>
              <p>
                Plata se poate face conform metodelor comunicate la confirmarea comenzii sau ofertei. Factura se emite pe baza datelor furnizate de client. Clientul este responsabil pentru corectitudinea datelor de facturare.
              </p>

              <h2>7. Garanții</h2>
              <p>
                Produsele beneficiază de garanția legală și/sau comercială acordată de producător/importator, conform documentelor de garanție. Garanția poate fi condiționată de montaj autorizat, utilizare corectă și respectarea instrucțiunilor producătorului.
              </p>
              <p>
                Pentru intervenții în garanție pot fi solicitate factura, certificatul de garanție și documentele de montaj/punere în funcțiune, după caz.
              </p>

              <h2>8. Retur și retragere</h2>
              <p>
                Condițiile de retur și dreptul de retragere sunt prezentate în pagina <Link href="/politica-retur">Politica de retur</Link>. Pentru produse montate, personalizate, folosite sau comandate special, pot exista limitări legale sau tehnice.
              </p>

              <h2>9. Reclamații și soluționarea litigiilor</h2>
              <p>
                Reclamațiile pot fi transmise la <a href="mailto:office@pro-term.ro">office@pro-term.ro</a> sau telefonic la <a href="tel:+40749025610">0749 025 610</a>. Vom încerca soluționarea amiabilă într-un termen rezonabil.
              </p>
              <p>
                Consumatorii pot apela și la ANPC sau la mecanismele de soluționare alternativă/online a litigiilor, conform legislației aplicabile.
              </p>

              <h2>10. Protecția datelor</h2>
              <p>
                Modul de prelucrare a datelor personale este descris în <Link href="/politica-confidentialitate">Politica de confidențialitate / GDPR</Link>.
              </p>

              <h2>11. Legea aplicabilă</h2>
              <p>
                Acești termeni sunt guvernați de legislația din România. Orice litigiu va fi soluționat pe cale amiabilă sau, dacă nu este posibil, de instanțele competente.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
