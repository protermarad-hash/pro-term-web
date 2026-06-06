import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const updatedAt = '06.06.2026';

export default function ReturnPolicyPage() {
  return (
    <>
      <Header />
      <main className="bg-light-200 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-card md:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">Zona legală</p>
            <h1 className="font-heading text-3xl font-bold text-dark md:text-5xl">Politica de retur</h1>
            <p className="mt-4 text-sm text-dark-300">Ultima actualizare: {updatedAt}</p>

            <div className="prose prose-slate mt-8 max-w-none text-dark-300">
              <p>
                Această politică explică modul în care se pot returna produsele cumpărate de pe pro-term.ro sau comandate prin PRO TERM. Pentru echipamente HVAC, centrale, pompe de căldură și accesorii tehnice, returul poate depinde de starea produsului, montaj, utilizare și natura comenzii.
              </p>

              <h2>1. Dreptul de retragere pentru consumatori</h2>
              <p>
                Dacă sunteți consumator persoană fizică și ați cumpărat online/la distanță, puteți avea dreptul de retragere în termenul legal de 14 zile, cu respectarea condițiilor legale. Termenul curge, de regulă, de la data la care intrați în posesia produsului.
              </p>
              <p>
                Pentru exercitarea dreptului de retragere, ne puteți contacta la <a href="mailto:office@pro-term.ro">office@pro-term.ro</a> sau la <a href="tel:+40749025610">0749 025 610</a>.
              </p>

              <h2>2. Produse care pot avea limitări la retur</h2>
              <p>Pot exista limitări sau excepții pentru:</p>
              <ul>
                <li>produse montate, instalate, puse în funcțiune sau folosite;</li>
                <li>produse comandate special pentru client sau configurate/personalizate;</li>
                <li>produse care nu mai pot fi vândute ca noi din cauza manipulării, deteriorării, lipsei ambalajului sau accesoriilor;</li>
                <li>materiale tăiate la dimensiune, trasee frigorifice, kituri sau accesorii adaptate lucrării;</li>
                <li>servicii deja prestate, cum ar fi constatare, deplasare, montaj, service sau punere în funcțiune, în condițiile legii.</li>
              </ul>

              <h2>3. Condiția produsului returnat</h2>
              <p>
                Produsul trebuie returnat, pe cât posibil, în ambalajul original, cu toate accesoriile, documentele și etichetele primite. Clientul poate fi responsabil pentru diminuarea valorii produsului dacă acesta a fost manipulat peste ceea ce era necesar pentru verificarea naturii, caracteristicilor și funcționării sale.
              </p>

              <h2>4. Costul transportului</h2>
              <p>
                Costul transportului pentru retur poate fi suportat de client, cu excepția cazurilor în care legea sau oferta confirmată prevede altfel ori produsul este neconform/imputabil comerciantului.
              </p>

              <h2>5. Rambursarea</h2>
              <p>
                Rambursarea se face conform legislației aplicabile, după primirea și verificarea produsului returnat. Ne rezervăm dreptul de a amâna rambursarea până la primirea produsului sau până la primirea unei dovezi privind expedierea acestuia, după caz.
              </p>

              <h2>6. Produse defecte sau neconforme</h2>
              <p>
                Dacă produsul primit este defect, deteriorat sau neconform, vă rugăm să ne contactați cât mai rapid cu fotografii, factură și detalii despre problemă. Vom analiza situația și vom propune reparație, înlocuire, retur sau altă soluție conform legii și garanției aplicabile.
              </p>

              <h2>7. Relația cu garanția</h2>
              <p>
                Returul nu înlocuiește garanția. Pentru defecte apărute în perioada de garanție, se aplică procedurile de garanție ale producătorului/importatorului și condițiile din certificatul de garanție.
              </p>

              <h2>8. Contact</h2>
              <p>
                Pentru retururi, garanții sau reclamații: <a href="mailto:office@pro-term.ro">office@pro-term.ro</a>, telefon <a href="tel:+40749025610">0749 025 610</a>.
              </p>

              <p>
                Pentru termenii generali ai site-ului, consultați <Link href="/termeni-si-conditii">Termeni și condiții</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
