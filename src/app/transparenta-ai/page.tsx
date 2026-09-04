import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AI_MEDIA_REGISTRY } from '@/lib/ai-media-registry';

export const metadata: Metadata = {
  title: 'Transparență privind conținutul generat cu AI | PRO TERM',
  description:
    'Cum și de ce PRO TERM marchează imaginile ilustrative generate cu inteligență artificială, și ce înseamnă simbolul „AI” afișat pe unele materiale de pe site.',
  alternates: { canonical: 'https://pro-term.ro/transparenta-ai' },
  robots: { index: true, follow: true },
};

// Deterministic, derived from the registry's own reviewedAt values — not new Date(),
// so this page doesn't report a fresh "last updated" date on every single request.
const lastUpdated = AI_MEDIA_REGISTRY.reduce(
  (latest, entry) => (entry.reviewedAt > latest ? entry.reviewedAt : latest),
  AI_MEDIA_REGISTRY[0]?.reviewedAt ?? '',
);

export default function TransparentaAiPage() {
  return (
    <>
      <Header />
      <main className="bg-light-200 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-card md:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">Zona legală</p>
            <h1 className="font-heading text-3xl font-bold text-dark md:text-5xl">
              Transparență privind imaginile generate cu AI
            </h1>
            {lastUpdated && (
              <p className="mt-4 text-sm text-dark-300">Ultima actualizare: {lastUpdated}</p>
            )}

            <div className="prose prose-slate mt-8 max-w-none text-dark-300">
              <p>
                PRO TERM utilizează ocazional imagini ilustrative generate cu ajutorul inteligenței
                artificiale. Acestea sunt marcate vizibil cu simbolul <strong>„AI”</strong>.
              </p>

              <h2>1. Cum recunoști o imagine AI</h2>
              <p>
                O imagine generată substanțial cu inteligență artificială poartă un indicator vizibil
                „AI” într-un colț al imaginii. Indicatorul este un link către această pagină.
              </p>

              <h2>2. Ce înseamnă eticheta</h2>
              <p>
                Eticheta arată că imaginea respectivă a fost generată substanțial cu ajutorul
                inteligenței artificiale, nu doar retușată sau procesată minor. Nu înseamnă că produsul
                sau marca prezentate în imagine sunt fictive — marca și produsul rămân reale; doar
                imaginea în sine este o ilustrație generată.
              </p>

              <h2>3. Ce nu reprezintă aceste imagini</h2>
              <p>
                Imaginile marcate „AI” sunt ilustrative. Ele nu reprezintă fotografii ale unor lucrări
                reale executate de PRO TERM și nu trebuie privite ca imaginea exactă a produsului
                comercializat.
              </p>

              <h2>4. Materiale oficiale ale producătorilor</h2>
              <p>
                O imagine poate proveni oficial de la producător sau de la importatorul autorizat și,
                în același timp, să fie generată cu inteligență artificială. Cele două lucruri nu se
                exclud reciproc — materialul poate fi în continuare oficial și autorizat pentru
                utilizare, chiar dacă este generat, nu fotografiat.
              </p>

              <h2>5. Fotografii ale lucrărilor PRO TERM</h2>
              <p>
                Fotografiile reale ale proiectelor, montajelor sau lucrărilor executate de echipa
                PRO TERM vor fi identificate distinct față de materialele ilustrative marcate „AI”.
              </p>

              <h2>6. Verificarea informațiilor despre produse</h2>
              <p>
                Pentru decizia de cumpărare, imaginile exacte de produs și fișele tehnice oficiale au
                prioritate față de orice imagine ilustrativă. Caracteristicile reale ale unui produs sunt
                cele din documentația oficială a producătorului, nu cele deduse dintr-o imagine
                promoțională.
              </p>

              <h2>7. Contact</h2>
              <p>
                Pentru clarificări despre o imagine anume sau despre această politică, ne poți scrie la{' '}
                <a href="mailto:office@pro-term.ro">office@pro-term.ro</a>.
              </p>
            </div>

            <h2 className="mt-10 font-heading text-xl font-bold text-dark">Registrul imaginilor marcate</h2>
            <ul className="mt-5 space-y-4">
              {AI_MEDIA_REGISTRY.map((entry) => (
                <li key={entry.id} className="rounded-2xl border border-slate-100 bg-light-200 p-5">
                  <p className="font-heading font-bold text-dark">{entry.title}</p>
                  <p className="mt-1 text-sm text-dark-300">{entry.usageContext}</p>
                  <p className="mt-3 text-sm leading-relaxed text-dark-300">{entry.publicDisclosure}</p>
                  <dl className="mt-4 grid gap-2 text-xs text-dark-300 sm:grid-cols-3">
                    <div>
                      <dt className="font-bold uppercase tracking-wide text-dark-400">Sursă</dt>
                      <dd>{entry.sourceOrganisation}</dd>
                    </div>
                    <div>
                      <dt className="font-bold uppercase tracking-wide text-dark-400">Lucrare reală PRO TERM?</dt>
                      <dd>{entry.representsRealProject ? 'Da' : 'Nu'}</dd>
                    </div>
                    <div>
                      <dt className="font-bold uppercase tracking-wide text-dark-400">Produsul exact comercializat?</dt>
                      <dd>{entry.representsExactProduct ? 'Da' : 'Nu'}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
