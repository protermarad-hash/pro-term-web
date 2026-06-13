import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politica de retur și retragere | PRO TERM SRL',
  description: 'Condițiile de returnare a produselor HVAC achiziționate de la PRO TERM SRL și dreptul de retragere conform legislației privind protecția consumatorilor.',
  alternates: { canonical: 'https://pro-term.ro/politica-retur' },
};

const updatedAt = '07.06.2026';

export default function ReturnPolicyPage() {
  return (
    <>
      <Header />
      <main className="bg-light-200 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-card md:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">Zona legală</p>
            <h1 className="font-heading text-3xl font-bold text-dark md:text-5xl">Politica de retur și retragere</h1>
            <p className="mt-4 text-sm text-dark-300">Ultima actualizare: {updatedAt}</p>

            <div className="prose prose-slate mt-8 max-w-none text-dark-300">
              <p>
                Această politică explică modul în care se pot returna produsele cumpărate de pe pro-term.ro sau comandate prin PRO TERM. Pentru echipamente HVAC, centrale, pompe de căldură și accesorii tehnice, returul poate depinde de starea produsului, montaj, utilizare și natura comenzii.
              </p>

              <h2>1. Dreptul de retragere pentru consumatori</h2>
              <p>
                Dacă sunteți consumator persoană fizică și ați cumpărat online/la distanță, puteți avea dreptul de retragere în termenul legal de 14 zile, cu respectarea condițiilor legale. Termenul curge, de regulă, de la data la care intrați în posesia produsului sau, pentru servicii, de la data încheierii contractului.
              </p>
              <p>
                Pentru exercitarea dreptului de retragere, ne puteți contacta la <a href="mailto:office@pro-term.ro">office@pro-term.ro</a> sau la <a href="tel:+40749025610">0749 025 610</a>. Puteți folosi modelul din pagina <Link href="/formular-retragere">Formular de retragere</Link> sau orice declarație neechivocă privind retragerea.
              </p>

              <h2>2. Confirmarea cererii de retragere</h2>
              <p>
                Dacă transmiteți cererea de retragere electronic, PRO TERM va confirma primirea solicitării fără întârziere nejustificată, pe un suport durabil, de regulă prin e-mail.
              </p>

              <h2>3. Produse și servicii care pot avea limitări la retur</h2>
              <p>Pot exista limitări sau excepții pentru:</p>
              <ul>
                <li>produse montate, instalate, puse în funcțiune sau folosite peste limita verificării normale;</li>
                <li>produse comandate special pentru client sau configurate/personalizate;</li>
                <li>produse care nu mai pot fi vândute ca noi din cauza manipulării, deteriorării, lipsei ambalajului sau accesoriilor;</li>
                <li>materiale tăiate la dimensiune, trasee frigorifice, kituri sau accesorii adaptate lucrării;</li>
                <li>servicii deja prestate integral, cum ar fi constatare, deplasare, montaj, service sau punere în funcțiune, dacă au fost începute cu acordul expres al consumatorului în condițiile legii.</li>
              </ul>

              <h2>4. Condiția produsului returnat</h2>
              <p>
                Produsul trebuie returnat, pe cât posibil, în ambalajul original, cu toate accesoriile, documentele și etichetele primite. Clientul poate fi responsabil pentru diminuarea valorii produsului dacă acesta a fost manipulat peste ceea ce era necesar pentru verificarea naturii, caracteristicilor și funcționării sale.
              </p>

              <h2>5. Costul transportului pentru retur</h2>
              <p>
                Costul transportului pentru retur poate fi suportat de client, cu excepția cazurilor în care legea sau oferta confirmată prevede altfel ori produsul este neconform/imputabil comerciantului. Costurile suplimentare necomunicate anterior nu vor fi puse în sarcina consumatorului.
              </p>

              <h2>6. Rambursarea</h2>
              <p>
                Rambursarea se face conform legislației aplicabile, fără întârziere nejustificată și, de regulă, în maximum 14 zile de la data la care PRO TERM este informat despre decizia de retragere. Rambursarea poate fi amânată până la primirea produsului returnat sau până la primirea dovezii de expediere, după caz.
              </p>
              <p>
                Rambursarea se face prin aceeași metodă de plată folosită la tranzacția inițială, cu excepția cazului în care consumatorul acceptă expres o altă metodă și aceasta nu generează costuri suplimentare pentru consumator.
              </p>

              <h2>7. Produse defecte sau neconforme</h2>
              <p>
                Dacă produsul primit este defect, deteriorat sau neconform, vă rugăm să ne contactați cât mai rapid cu fotografii, factură și detalii despre problemă. Vom analiza situația și vom propune reparație, înlocuire, retur sau altă soluție conform legii și garanției aplicabile.
              </p>

              <h2>8. Relația cu garanția</h2>
              <p>
                Returul nu înlocuiește garanția. Pentru defecte apărute în perioada de garanție, se aplică procedurile de garanție ale producătorului/importatorului și condițiile din certificatul de garanție.
              </p>

              <h2>9. Contact</h2>
              <p>
                Pentru retururi, garanții sau reclamații: <a href="mailto:office@pro-term.ro">office@pro-term.ro</a>, telefon <a href="tel:+40749025610">0749 025 610</a>.
              </p>

              <p>
                Pentru termenii generali ai site-ului, consultați <Link href="/termeni-si-conditii">Termeni și condiții</Link>. Pentru livrare și plată, consultați <Link href="/livrare-si-plata">Livrare și plată</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
