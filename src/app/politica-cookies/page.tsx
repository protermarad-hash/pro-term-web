import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const updatedAt = '06.06.2026';

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <main className="bg-light-200 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-card md:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">Zona legală</p>
            <h1 className="font-heading text-3xl font-bold text-dark md:text-5xl">Politica cookies</h1>
            <p className="mt-4 text-sm text-dark-300">Ultima actualizare: {updatedAt}</p>

            <div className="prose prose-slate mt-8 max-w-none text-dark-300">
              <p>
                Această politică explică modul în care site-ul pro-term.ro poate utiliza cookie-uri și tehnologii similare. Cookie-urile sunt fișiere mici salvate pe dispozitivul utilizatorului pentru funcționarea site-ului, memorarea unor preferințe sau analizarea utilizării site-ului.
              </p>

              <h2>1. Tipuri de cookie-uri</h2>
              <ul>
                <li><strong>Cookie-uri strict necesare:</strong> ajută la funcționarea site-ului, navigare, securitate, coș de cumpărături sau sesiune. Acestea nu necesită consimțământ separat.</li>
                <li><strong>Cookie-uri de preferințe:</strong> pot reține alegeri precum limba, regiunea sau alte setări.</li>
                <li><strong>Cookie-uri de analiză:</strong> ne pot ajuta să înțelegem cum este folosit site-ul, ce pagini sunt vizitate și ce putem îmbunătăți.</li>
                <li><strong>Cookie-uri de marketing:</strong> pot fi folosite pentru campanii, remarketing sau măsurarea performanței reclamelor, doar dacă vor fi activate și cu respectarea consimțământului.</li>
              </ul>

              <h2>2. Cookie-uri folosite în prezent</h2>
              <p>
                Site-ul poate folosi cookie-uri tehnice necesare funcționării. Dacă vom activa servicii suplimentare, precum Google Analytics, Facebook Pixel, chat online sau alte instrumente de marketing/analiză, vom actualiza această pagină și, unde este necesar, vom solicita consimțământul.
              </p>

              <h2>3. Gestionarea cookie-urilor</h2>
              <p>
                Puteți controla cookie-urile din setările browserului. Blocarea cookie-urilor strict necesare poate afecta funcționarea anumitor zone ale site-ului, cum ar fi coșul de cumpărături sau formularele.
              </p>

              <h2>4. Consimțământ</h2>
              <p>
                Pentru cookie-uri care nu sunt strict necesare, vom solicita consimțământul acolo unde legea impune. Consimțământul poate fi retras prin setările browserului sau prin mecanismul de consimțământ disponibil pe site, dacă acesta este activ.
              </p>

              <h2>5. Date personale</h2>
              <p>
                Pentru informații despre prelucrarea datelor personale, consultați <Link href="/politica-confidentialitate">Politica de confidențialitate / GDPR</Link>.
              </p>

              <h2>6. Contact</h2>
              <p>
                Pentru întrebări privind cookie-urile, ne puteți contacta la <a href="mailto:office@pro-term.ro">office@pro-term.ro</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
