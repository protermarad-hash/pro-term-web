import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const updatedAt = '07.06.2026';

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
                Datele complete de identificare ale comerciantului, inclusiv CUI, număr Registrul Comerțului și sediu social complet, trebuie menținute actualizate în pagina <Link href="/informatii-legale">Informații legale comerciant</Link>.
              </p>
              <p>
                PRO TERM comercializează echipamente HVAC, aparate de aer condiționat, centrale, pompe de căldură, accesorii de montaj și servicii conexe de consultanță, montaj, service și mentenanță.
              </p>

              <h2>2. Utilizarea site-ului</h2>
              <p>
                Prin accesarea site-ului, sunteți de acord cu acești termeni. Dacă nu sunteți de acord, vă rugăm să nu utilizați site-ul. Ne rezervăm dreptul de a modifica informațiile, produsele, prețurile și conținutul site-ului, cu respectarea legislației aplicabile.
              </p>

              <h2>3. Produse, servicii, caracteristici și disponibilitate</h2>
              <p>
                Principalele caracteristici ale produselor și serviciilor sunt prezentate în paginile dedicate produselor, serviciilor sau ofertelor. Pentru echipamente tehnice, disponibilitatea, compatibilitatea, accesoriile și montajul pot necesita confirmare telefonică sau prin e-mail.
              </p>
              <p>
                Produsele afișate pe site pot avea preț final sau status „Cere ofertă”. Pentru produsele tehnice, servicii, montaj sau proiecte speciale, oferta finală se confirmă individual înainte de facturare, livrare sau intervenție.
              </p>

              <h2>4. Prețuri, TVA, costuri suplimentare și valabilitatea ofertelor</h2>
              <p>
                Prețurile sunt exprimate în RON. Unde este cazul, pagina produsului sau oferta confirmată va preciza dacă TVA-ul, livrarea, deplasarea, montajul, accesoriile și alte costuri sunt incluse sau se adaugă separat.
              </p>
              <p>
                Pot exista diferențe în funcție de model, stoc, furnizor, accesorii, lungime traseu frigorific, condiții de montaj, deplasare sau servicii suplimentare. Orice cost suplimentar se comunică înainte de executare și necesită acordul clientului.
              </p>
              <p>
                Promoțiile, reducerile și ofertele sunt valabile în limita stocului disponibil și pe perioada indicată în ofertă sau pe site. Dacă perioada nu este indicată, oferta se confirmă înainte de acceptarea comenzii.
              </p>

              <h2>5. Comenzi și cereri de ofertă</h2>
              <p>
                O comandă sau cerere transmisă prin site nu reprezintă automat acceptare contractuală până la confirmarea acesteia de către PRO TERM. Confirmarea poate fi transmisă prin telefon, e-mail, WhatsApp sau alt canal agreat.
              </p>
              <p>
                Înainte de transmiterea unei comenzi sau cereri, clientul poate verifica și corecta datele introduse. Pentru produsele care necesită montaj, PRO TERM poate solicita informații suplimentare despre locație, spațiu, traseu, alimentare electrică, acces și condițiile reale de instalare.
              </p>
              <p>
                Limba contractului și a comunicărilor comerciale este limba română, cu excepția cazului în care părțile convin altfel.
              </p>

              <h2>6. Plată, facturare și mijloace de plată</h2>
              <p>
                Plata se poate face conform metodelor comunicate la confirmarea comenzii sau ofertei. Metodele disponibile pot include transfer bancar, plată numerar la livrare/intervenție sau alte metode comunicate punctual. Factura se emite pe baza datelor furnizate de client. Clientul este responsabil pentru corectitudinea datelor de facturare.
              </p>

              <h2>7. Livrare, restricții de livrare, montaj și service</h2>
              <p>
                Livrarea, montajul și service-ul se stabilesc în funcție de disponibilitate, zona de intervenție și complexitatea lucrării. Pentru lucrări în afara zonei Arad/Timișoara sau pentru proiecte speciale, condițiile se stabilesc punctual.
              </p>
              <p>
                La începutul procesului de comandă/ofertare sau înainte de confirmare, clientul va fi informat despre eventualele restricții de livrare/intervenție și despre costurile aplicabile. Clientul are obligația să ofere acces la locație, informații corecte despre spațiu și să asigure condițiile necesare intervenției, dacă acestea au fost comunicate în prealabil.
              </p>

              <h2>8. Servicii începute în perioada de retragere</h2>
              <p>
                Dacă un consumator solicită expres începerea prestării unui serviciu înainte de expirarea perioadei legale de retragere, PRO TERM poate solicita acordul expres al consumatorului pe un suport durabil și confirmarea că acesta a luat cunoștință de consecințele legale privind dreptul de retragere după prestarea integrală a serviciului.
              </p>

              <h2>9. Garanții, conformitate și asistență post-vânzare</h2>
              <p>
                Produsele beneficiază de garanția legală de conformitate și/sau de garanția comercială acordată de producător/importator, conform documentelor de garanție. Garanția poate fi condiționată de montaj autorizat, utilizare corectă și respectarea instrucțiunilor producătorului.
              </p>
              <p>
                Pentru intervenții în garanție pot fi solicitate factura, certificatul de garanție și documentele de montaj/punere în funcțiune, după caz. Asistența post-vânzare se oferă prin telefon, e-mail sau programare tehnică, în funcție de situație.
              </p>

              <h2>10. Retur, retragere și formular de retragere</h2>
              <p>
                Condițiile de retur și dreptul de retragere sunt prezentate în pagina <Link href="/politica-retur">Politica de retur</Link>. Pentru produse montate, personalizate, folosite sau comandate special, pot exista limitări legale sau tehnice.
              </p>
              <p>
                Consumatorii pot folosi modelul disponibil în pagina <Link href="/formular-retragere">Formular de retragere</Link> sau pot transmite orice declarație neechivocă privind retragerea, în condițiile legii.
              </p>

              <h2>11. Reclamații și soluționarea litigiilor</h2>
              <p>
                Reclamațiile pot fi transmise la <a href="mailto:office@pro-term.ro">office@pro-term.ro</a> sau telefonic la <a href="tel:+40749025610">0749 025 610</a>. Vom încerca soluționarea amiabilă într-un termen rezonabil.
              </p>
              <p>
                Consumatorii pot apela și la ANPC, la mecanismele de soluționare alternativă a litigiilor sau la platforma SOL/ODR a Comisiei Europene, conform legislației aplicabile. Linkurile sunt disponibile în pagina <Link href="/informatii-legale">Informații legale comerciant</Link>.
              </p>

              <h2>12. Comunicări comerciale</h2>
              <p>
                Comunicările comerciale prin e-mail, SMS sau alte canale similare se transmit doar în condițiile legii, de regulă pe baza consimțământului prealabil al destinatarului, cu excepțiile permise de legislația aplicabilă.
              </p>

              <h2>13. Protecția datelor și cookies</h2>
              <p>
                Modul de prelucrare a datelor personale este descris în <Link href="/politica-confidentialitate">Politica de confidențialitate / GDPR</Link>. Informațiile despre cookies sunt disponibile în <Link href="/politica-cookies">Politica cookies</Link>.
              </p>

              <h2>14. Legea aplicabilă</h2>
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
