import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Informații legale comerciant | PRO TERM SRL',
  description: 'Date de identificare PRO TERM SRL: CUI, număr înregistrare, adresă sediu, contact și informații legale conform legislației române.',
  alternates: { canonical: 'https://pro-term.ro/informatii-legale' },
};

const updatedAt = '07.06.2026';

export default function LegalInfoPage() {
  return (
    <>
      <Header />
      <main className="bg-light-200 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-card md:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">Zona legală</p>
            <h1 className="font-heading text-3xl font-bold text-dark md:text-5xl">Informații legale comerciant</h1>
            <p className="mt-4 text-sm text-dark-300">Ultima actualizare: {updatedAt}</p>

            <div className="prose prose-slate mt-8 max-w-none text-dark-300">
              <p>
                Această pagină centralizează informațiile de identificare și contact ale comerciantului, pentru acces facil, direct, permanent și gratuit.
              </p>

              <h2>1. Date comerciant</h2>
              <ul>
                <li><strong>Denumire:</strong> PRO TERM SRL</li>
                <li><strong>Formă juridică:</strong> Societate cu răspundere limitată</li>
                <li><strong>Sediu social:</strong> Jud. Arad, Municipiul Arad, Aleea Neptun nr. 4, bl. Y3, etaj 7, ap. 31</li>
                <li><strong>Cod unic de înregistrare:</strong> 11355602</li>
                <li><strong>Nr. ordine Registrul Comerțului:</strong> J199900003027</li>
                <li><strong>EUID:</strong> ROONRC.J199900003027</li>
                <li><strong>Data înregistrării:</strong> 14.01.1999</li>
                <li><strong>Activitate principală CAEN:</strong> 4322 - Lucrări de instalații sanitare, de încălzire și de aer condiționat</li>
                <li><strong>Reprezentant:</strong> Herman Sebastian</li>
                <li><strong>Telefon:</strong> <a href="tel:+40749025610">0749 025 610</a></li>
                <li><strong>E-mail:</strong> <a href="mailto:office@pro-term.ro">office@pro-term.ro</a></li>
                <li><strong>Website:</strong> pro-term.ro</li>
              </ul>

              <h2>2. Activitate</h2>
              <p>
                PRO TERM comercializează echipamente HVAC, aparate de aer condiționat, pompe de căldură, centrale termice, accesorii și servicii conexe de consultanță, montaj, service și mentenanță. Activitatea principală declarată este CAEN 4322 - lucrări de instalații sanitare, de încălzire și de aer condiționat.
              </p>

              <h2>3. Prețuri, TVA și livrare</h2>
              <p>
                Prețurile sunt afișate în RON. Unde este cazul, oferta finală va preciza dacă TVA-ul și costurile de livrare/deplasare sunt incluse sau se adaugă separat. Pentru produse tehnice și lucrări de montaj, oferta poate depinde de stoc, furnizor, traseu, accesorii, zonă de intervenție și condițiile reale din locație.
              </p>

              <h2>4. Comenzi, contracte și corectarea erorilor</h2>
              <p>
                Înainte de confirmarea unei comenzi sau oferte, clientul poate verifica și corecta datele transmise prin formular, e-mail, telefon sau WhatsApp. Contractul/comanda este considerată acceptată numai după confirmarea expresă transmisă de PRO TERM.
              </p>

              <h2>5. Reclamații și soluționarea litigiilor</h2>
              <p>
                Reclamațiile pot fi transmise la <a href="mailto:office@pro-term.ro">office@pro-term.ro</a> sau telefonic la <a href="tel:+40749025610">0749 025 610</a>. Pentru consumatori, pot fi consultate și platformele/informațiile ANPC privind reclamațiile și soluționarea alternativă a litigiilor.
              </p>
              <ul>
                <li><a href="https://anpc.ro" target="_blank" rel="noopener noreferrer">ANPC</a></li>
                <li><a href="https://reclamatiisal.anpc.ro" target="_blank" rel="noopener noreferrer">SAL ANPC</a></li>
                <li><a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">Platforma SOL/ODR a Comisiei Europene</a></li>
              </ul>

              <h2>6. Documente conexe</h2>
              <ul>
                <li><Link href="/termeni-si-conditii">Termeni și condiții</Link></li>
                <li><Link href="/livrare-si-plata">Livrare și plată</Link></li>
                <li><Link href="/politica-confidentialitate">Politica de confidențialitate / GDPR</Link></li>
                <li><Link href="/politica-retur">Politica de retur</Link></li>
                <li><Link href="/formular-retragere">Formular de retragere</Link></li>
                <li><Link href="/politica-cookies">Politica cookies</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
