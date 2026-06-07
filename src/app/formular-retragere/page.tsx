import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const updatedAt = '07.06.2026';

export default function WithdrawalFormPage() {
  return (
    <>
      <Header />
      <main className="bg-light-200 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-card md:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">Zona legală</p>
            <h1 className="font-heading text-3xl font-bold text-dark md:text-5xl">Formular de retragere</h1>
            <p className="mt-4 text-sm text-dark-300">Ultima actualizare: {updatedAt}</p>

            <div className="prose prose-slate mt-8 max-w-none text-dark-300">
              <p>
                Acest model poate fi folosit de consumatorii persoane fizice care doresc să își exercite dreptul de retragere dintr-un contract încheiat la distanță, în condițiile legii. Folosirea acestui model nu este obligatorie; puteți transmite orice declarație neechivocă privind retragerea.
              </p>

              <div className="rounded-2xl border border-slate-200 bg-light-200 p-5">
                <p><strong>Către:</strong> SC PRO TERM SRL</p>
                <p><strong>E-mail:</strong> office@pro-term.ro</p>
                <p><strong>Telefon:</strong> 0749 025 610</p>
                <p><strong>Website:</strong> pro-term.ro</p>
              </div>

              <h2>Model declarație de retragere</h2>
              <p>
                Vă informez prin prezenta cu privire la retragerea mea din contractul referitor la achiziția următoarelor produse / prestarea următoarelor servicii:
              </p>
              <ul>
                <li>Produs/serviciu: ..............................................................</li>
                <li>Număr comandă / ofertă / factură: ...........................................</li>
                <li>Comandat la data de: ........................................................</li>
                <li>Primit la data de: ...........................................................</li>
                <li>Nume consumator: ............................................................</li>
                <li>Adresă consumator: ..........................................................</li>
                <li>Telefon / e-mail: ............................................................</li>
                <li>Cont bancar pentru rambursare, dacă este cazul: .............................</li>
                <li>Data: .......................................................................</li>
                <li>Semnătura consumatorului, dacă formularul este transmis pe hârtie: ..........</li>
              </ul>

              <h2>Transmitere</h2>
              <p>
                Formularul completat poate fi transmis prin e-mail la <a href="mailto:office@pro-term.ro">office@pro-term.ro</a> sau prin alt mijloc de comunicare agreat. După primirea solicitării, PRO TERM va confirma primirea cererii pe un suport durabil, de regulă prin e-mail.
              </p>

              <h2>Observații importante</h2>
              <ul>
                <li>Dreptul de retragere se aplică în condițiile legale pentru consumatori persoane fizice.</li>
                <li>Pot exista excepții sau limitări pentru produse personalizate, comandate special, montate, folosite sau pentru servicii executate integral cu acordul expres al consumatorului.</li>
                <li>Condițiile detaliate sunt disponibile în <Link href="/politica-retur">Politica de retur</Link> și în <Link href="/termeni-si-conditii">Termeni și condiții</Link>.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
