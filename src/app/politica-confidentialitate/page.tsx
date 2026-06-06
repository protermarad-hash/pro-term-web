import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const updatedAt = '06.06.2026';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="bg-light-200 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-card md:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">Zona legală</p>
            <h1 className="font-heading text-3xl font-bold text-dark md:text-5xl">Politica de confidențialitate / GDPR</h1>
            <p className="mt-4 text-sm text-dark-300">Ultima actualizare: {updatedAt}</p>

            <div className="prose prose-slate mt-8 max-w-none text-dark-300">
              <p>
                Această politică explică modul în care SC PRO TERM SRL prelucrează datele personale ale vizitatorilor și clienților site-ului pro-term.ro. Documentul se aplică solicitărilor de ofertă, comenzilor, comunicării prin formular, telefon sau e-mail și relației comerciale cu clienții.
              </p>

              <h2>1. Operatorul de date</h2>
              <p>
                Operatorul datelor personale este SC PRO TERM SRL, cu sediul/activitatea în Arad, România, reprezentată de Herman Sebastian. Pentru solicitări privind datele personale ne puteți contacta la <a href="mailto:office@pro-term.ro">office@pro-term.ro</a> sau telefonic la <a href="tel:+40749025610">0749 025 610</a>.
              </p>

              <h2>2. Ce date putem prelucra</h2>
              <ul>
                <li>nume și prenume;</li>
                <li>telefon și adresă de e-mail;</li>
                <li>adresă de livrare, montaj sau facturare, dacă este necesar;</li>
                <li>date de facturare pentru persoane fizice sau juridice;</li>
                <li>detalii despre produsele solicitate, comenzi, oferte, intervenții, service sau mentenanță;</li>
                <li>conținutul mesajelor transmise prin formular, e-mail, telefon sau alte canale de comunicare;</li>
                <li>date tehnice minime privind utilizarea site-ului, cum ar fi adresa IP, browserul, dispozitivul și paginile accesate, dacă folosim servicii de analiză sau securitate.</li>
              </ul>

              <h2>3. Scopurile prelucrării</h2>
              <ul>
                <li>răspuns la cereri de ofertă și solicitări de consultanță;</li>
                <li>preluarea și procesarea comenzilor;</li>
                <li>emiterea facturilor și documentelor contabile;</li>
                <li>programarea montajului, service-ului sau intervențiilor tehnice;</li>
                <li>gestionarea garanțiilor și a reclamațiilor;</li>
                <li>îmbunătățirea site-ului, a produselor și a serviciilor;</li>
                <li>respectarea obligațiilor legale și fiscale.</li>
              </ul>

              <h2>4. Temeiul legal</h2>
              <p>Prelucrăm datele în baza unuia sau mai multor temeiuri legale:</p>
              <ul>
                <li>executarea unui contract sau efectuarea demersurilor înainte de încheierea unui contract, de exemplu ofertare, comandă, livrare, montaj sau service;</li>
                <li>obligații legale, de exemplu facturare, contabilitate și arhivare;</li>
                <li>interes legitim, de exemplu protejarea site-ului, prevenirea fraudelor, gestionarea relației cu clienții și îmbunătățirea serviciilor;</li>
                <li>consimțământ, acolo unde este necesar, de exemplu pentru comunicări comerciale opționale sau cookie-uri care nu sunt strict necesare.</li>
              </ul>

              <h2>5. Cui putem transmite datele</h2>
              <p>Datele pot fi transmise, doar când este necesar, către:</p>
              <ul>
                <li>furnizori de servicii IT, hosting, mentenanță site și e-mail;</li>
                <li>servicii de facturare, contabilitate și gestiune;</li>
                <li>curieri, furnizori sau parteneri implicați în livrare, montaj, service sau garanție;</li>
                <li>autorități publice, dacă există obligații legale;</li>
                <li>platforme de plată, dacă vor fi activate plăți online.</li>
              </ul>
              <p>Nu vindem datele personale către terți.</p>

              <h2>6. Durata păstrării datelor</h2>
              <p>
                Păstrăm datele atât timp cât este necesar pentru scopurile pentru care au fost colectate. Datele din documente financiar-contabile sunt păstrate conform termenelor legale. Datele din cereri de ofertă sau comunicări comerciale sunt păstrate pe durata necesară gestionării solicitării și relației cu clientul, cu excepția cazului în care legea impune o durată mai mare.
              </p>

              <h2>7. Drepturile persoanei vizate</h2>
              <p>În condițiile GDPR, aveți următoarele drepturi:</p>
              <ul>
                <li>dreptul de acces la date;</li>
                <li>dreptul la rectificarea datelor incorecte;</li>
                <li>dreptul la ștergerea datelor, când legea permite;</li>
                <li>dreptul la restricționarea prelucrării;</li>
                <li>dreptul la portabilitatea datelor;</li>
                <li>dreptul de opoziție;</li>
                <li>dreptul de retragere a consimțământului, când prelucrarea se bazează pe consimțământ;</li>
                <li>dreptul de a depune plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal.</li>
              </ul>

              <h2>8. Securitatea datelor</h2>
              <p>
                Aplicăm măsuri rezonabile tehnice și organizatorice pentru protejarea datelor personale împotriva accesului neautorizat, pierderii, distrugerii sau modificării. Totuși, nicio transmisie prin internet nu poate fi garantată 100% sigură.
              </p>

              <h2>9. Cookie-uri</h2>
              <p>
                Informații despre cookie-uri sunt disponibile în pagina <Link href="/politica-cookies">Politica cookies</Link>.
              </p>

              <h2>10. Modificări</h2>
              <p>
                Putem actualiza această politică atunci când modificăm site-ul, serviciile sau cerințele legale. Versiunea actuală va fi publicată pe această pagină.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
