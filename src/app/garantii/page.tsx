import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LegalNoticeFigure from '@/components/legal/LegalNoticeFigure';
import {
  GUARANTEES_PAGE_TITLE,
  YOUR_EUROPE_DURABILITY_GUARANTEE_URL,
} from '@/lib/consumer-guarantee';

const canonical = 'https://pro-term.ro/garantii';

export const metadata: Metadata = {
  title: 'Garanții și drepturile consumatorului | PRO TERM',
  description:
    'Garanția legală de conformitate, garanțiile comerciale, eticheta GARAN și procedura de sesizare a unei neconformități pentru produsele cumpărate de la PRO TERM.',
  alternates: { canonical },
  openGraph: {
    title: 'Garanții și drepturile consumatorului | PRO TERM',
    description:
      'Notificarea armonizată UE privind garanția legală, diferența față de garanția comercială și cum semnalezi o neconformitate.',
    url: canonical,
    type: 'website',
  },
};

const updatedAt = '04.10.2026';

const legalSources = [
  {
    label: 'OUG nr. 34/2014 privind drepturile consumatorilor (forma actualizată)',
    href: 'https://legislatie.just.ro/Public/DetaliiDocument/307805',
  },
  {
    label: 'OUG nr. 18/2026 (modifică OUG nr. 34/2014; aplicabilă de la 27.09.2026)',
    href: 'https://legislatie.just.ro/Public/DetaliiDocumentAfis/308474',
  },
  {
    label: 'OUG nr. 140/2021 privind contractele de vânzare de bunuri (forma actualizată)',
    href: 'https://legislatie.just.ro/Public/DetaliiDocument/303291',
  },
  {
    label: 'Regulamentul de punere în aplicare (UE) 2025/1960 al Comisiei',
    href: 'https://eur-lex.europa.eu/eli/reg_impl/2025/1960/oj',
  },
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-10 first:mt-0">
      <h2 id={id} className="scroll-mt-28 font-heading text-xl font-bold text-dark md:text-2xl">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-dark-300">{children}</div>
    </section>
  );
}

function ExternalAnchor({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-2 hover:underline"
    >
      {children}
      <ExternalLink size={14} aria-hidden="true" />
      <span className="sr-only">(se deschide într-o filă nouă)</span>
    </a>
  );
}

const listClass = 'list-disc space-y-2 pl-5 marker:text-primary';

export default function GuaranteesPage() {
  return (
    <>
      <Header />
      <main className="bg-light-200 pb-20 pt-28">
        <div className="container mx-auto px-4">
          <article className="mx-auto max-w-4xl rounded-3xl bg-white p-5 shadow-card sm:p-6 md:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">Zona legală</p>
            <h1 className="font-heading text-3xl font-bold text-dark md:text-5xl">{GUARANTEES_PAGE_TITLE}</h1>
            <p className="mt-4 text-sm text-dark-300">Ultima actualizare: {updatedAt}</p>
            <p className="mt-6 text-[15px] leading-relaxed text-dark-300">
              Această pagină explică garanția legală de conformitate, garanțiile comerciale și modul în care ne poți
              semnala o problemă cu un produs cumpărat de la PRO TERM, potrivit OUG nr. 34/2014, astfel cum a fost
              modificată prin OUG nr. 18/2026, OUG nr. 140/2021 și Regulamentului de punere în aplicare (UE) 2025/1960,
              aplicabile de la 27 septembrie 2026.
            </p>

            <nav aria-label="Cuprins" className="mt-6 rounded-2xl bg-light-200 p-4 text-sm">
              <ol className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {[
                  ['notificare', 'Notificarea armonizată UE'],
                  ['garantie-legala', 'Garanția legală de conformitate'],
                  ['garantie-comerciala', 'Garanția comercială'],
                  ['eticheta-garan', 'Eticheta GARAN'],
                  ['sesizare', 'Cum semnalezi o neconformitate'],
                  ['post-vanzare', 'Servicii post-vânzare'],
                  ['persoane-juridice', 'Clienți persoane juridice'],
                  ['contact', 'Contact și autorități'],
                ].map(([anchor, label]) => (
                  <li key={anchor}>
                    <a href={`#${anchor}`} className="font-semibold text-primary underline-offset-2 hover:underline">
                      {label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-10">
              <Section id="notificare" title="Notificarea armonizată UE privind garanția legală">
                <p>
                  Notificarea de mai jos este documentul oficial stabilit prin Regulamentul (UE) 2025/1960 și pus la
                  dispoziție de Comisia Europeană. Este reprodusă integral, fără modificări.
                </p>
                <div className="pt-2">
                  <LegalNoticeFigure id="garantii-page" />
                </div>
              </Section>

              <Section id="garantie-legala" title="Garanția legală de conformitate (pentru consumatori)">
                <p>
                  Garanția legală de conformitate este prevăzută de lege, este gratuită și nu depinde de un certificat
                  de garanție. Pentru bunurile vândute consumatorilor:
                </p>
                <ul className={listClass}>
                  <li>
                    <strong className="text-dark">Vânzătorul răspunde</strong> față de consumator pentru orice
                    neconformitate care există în momentul livrării bunurilor și care este constatată în termen de doi
                    ani de la livrare (art. 9 alin. (1) din OUG nr. 140/2021). Pentru produsele cumpărate de la noi,
                    vânzătorul este PRO TERM SRL.
                  </li>
                  <li>
                    Orice neconformitate constatată în termen de un an de la livrare este prezumată a fi existat în
                    momentul livrării, până la proba contrarie (art. 10 alin. (1)).
                  </li>
                  <li>
                    Consumatorul poate cere aducerea bunului în conformitate, alegând între reparare și înlocuire, cu
                    excepțiile prevăzute de lege; în cazurile prevăzute la art. 11 alin. (4), poate obține o reducere
                    proporțională a prețului sau încetarea contractului (art. 11).
                  </li>
                  <li>
                    Reparațiile și înlocuirile se fac fără costuri, într-un termen rezonabil care nu poate depăși 15 zile
                    calendaristice de la informarea vânzătorului, stabilit de comun acord, în scris (art. 12 alin. (1)).
                  </li>
                  <li>
                    Dacă neconformitatea este constatată la scurt timp după livrare, fără a depăși 30 de zile
                    calendaristice, consumatorul beneficiază de înlocuirea bunului (art. 11 alin. (7)).
                  </li>
                  <li>
                    Pentru bunurile instalate conform naturii și destinației lor, obligația de reparare sau înlocuire
                    include demontarea bunului neconform și instalarea bunului reparat sau înlocuit ori suportarea
                    costurilor aferente (art. 12 alin. (4)).
                  </li>
                </ul>
              </Section>

              <Section id="garantie-comerciala" title="Garanția comercială – diferența față de garanția legală">
                <p>
                  Garanția comercială este opțională și este oferită de un garant (producător, importator sau vânzător)
                  în condițiile din certificatul de garanție comercială și din publicitatea asociată (art. 15 alin. (1)
                  din OUG nr. 140/2021). Ea se adaugă garanției legale și nu afectează drepturile consumatorului față de
                  vânzător.
                </p>
                <ul className={listClass}>
                  <li>
                    Certificatul de garanție comercială se oferă pe un suport durabil, cel târziu la livrarea bunului, în
                    limba română, și cuprinde: declarația că drepturile din garanția legală nu sunt afectate, numele și
                    adresa garantului, procedura de urmat, bunurile acoperite și condițiile garanției (art. 15 alin. (5)–(9)).
                  </li>
                  <li>
                    Garanțiile comerciale pot avea condiții proprii, stabilite de garant – de exemplu montaj autorizat,
                    utilizare corectă și respectarea instrucțiunilor producătorului. Se aplică întotdeauna condițiile din
                    certificatul de garanție al produsului.
                  </li>
                  <li>
                    Când producătorul ne pune la dispoziție informațiile despre garanția comercială, le afișăm pe pagina
                    produsului.
                  </li>
                </ul>
              </Section>

              <Section id="eticheta-garan" title="Eticheta GARAN – garanția comercială de durabilitate">
                <p>
                  Eticheta armonizată GARAN semnalează o garanție comercială de durabilitate oferită de{' '}
                  <strong className="text-dark">producător</strong>. O afișăm numai pentru produsele pentru care
                  producătorul ne-a pus la dispoziție informația că oferă o astfel de garanție, care îndeplinește toate
                  condițiile de mai jos:
                </p>
                <ul className={listClass}>
                  <li>este oferită fără costuri suplimentare;</li>
                  <li>acoperă întregul bun, nu doar o componentă;</li>
                  <li>are o durată mai mare de doi ani.</li>
                </ul>
                <p>
                  Pe durata acestei garanții, producătorul răspunde direct față de consumator pentru repararea sau
                  înlocuirea bunului (art. 15 alin. (2) din OUG nr. 140/2021). O garanție comercială care nu
                  îndeplinește toate aceste condiții – de exemplu una care acoperă doar anumite componente, presupune
                  costuri suplimentare sau nu este oferită de producător – nu este o garanție comercială de durabilitate
                  și nu este marcată cu eticheta GARAN.
                </p>
                <p>
                  <ExternalAnchor href={YOUR_EUROPE_DURABILITY_GUARANTEE_URL}>
                    Informații oficiale despre eticheta GARAN (Europa ta)
                  </ExternalAnchor>
                </p>
              </Section>

              <Section id="sesizare" title="Cum ne semnalezi o neconformitate">
                <ol className="list-decimal space-y-2 pl-5 marker:font-bold marker:text-primary">
                  <li>
                    Contactează-ne cât mai curând posibil:{' '}
                    <a href="mailto:office@pro-term.ro" className="font-semibold text-primary hover:underline">
                      office@pro-term.ro
                    </a>{' '}
                    sau{' '}
                    <a href="tel:+40749025610" className="font-semibold text-primary hover:underline">
                      0749 025 610
                    </a>
                    .
                  </li>
                  <li>Descrie produsul și problema constatată; dacă poți, trimite și fotografii.</li>
                  <li>
                    Atașează o dovadă a achiziției, de exemplu factura, chitanța sau un extras de cont.
                  </li>
                  <li>
                    Pentru reparare sau înlocuire, bunul se pune la dispoziția vânzătorului (art. 12 alin. (2) din OUG nr.
                    140/2021), iar termenul de remediere se stabilește de comun acord, în scris.
                  </li>
                  <li>
                    Dacă produsul are și o garanție comercială, o poți folosi conform certificatului de garanție;
                    drepturile din garanția legală față de vânzător rămân neafectate.
                  </li>
                </ol>
              </Section>

              <Section id="post-vanzare" title="Servicii post-vânzare">
                <p>
                  PRO TERM oferă montaj, service și mentenanță pentru echipamente de climatizare și încălzire, în principal
                  în județele Arad și Timiș. Asistența după vânzare se oferă prin telefon, e-mail sau programare tehnică,
                  în funcție de situație. Detalii despre servicii:{' '}
                  <Link href="/servicii" className="font-semibold text-primary underline-offset-2 hover:underline">
                    Servicii PRO TERM
                  </Link>
                  .
                </p>
                <p>
                  Când producătorul ne pune la dispoziție informații despre piesele de schimb, instrucțiunile de reparare
                  și întreținere sau perioada de actualizări software, acestea apar pe pagina produsului.
                </p>
              </Section>

              <Section id="persoane-juridice" title="Clienți persoane juridice">
                <p>
                  Regulile de mai sus privind garanția legală de conformitate și notificarea armonizată protejează
                  consumatorii – persoanele fizice care cumpără în afara activității lor comerciale sau profesionale.
                  Pentru achizițiile făcute de persoane juridice sau în scop profesional se aplică regimul general al
                  Codului civil și condițiile contractuale; garanțiile comerciale ale producătorilor se aplică în
                  condițiile din certificatele de garanție.
                </p>
              </Section>

              <Section id="contact" title="Contact și autorități">
                <ul className={listClass}>
                  <li>
                    PRO TERM SRL, CUI 11355602 – date complete în{' '}
                    <Link href="/informatii-legale" className="font-semibold text-primary underline-offset-2 hover:underline">
                      Informații legale comerciant
                    </Link>
                    .
                  </li>
                  <li>
                    Telefon <a href="tel:+40749025610" className="font-semibold text-primary hover:underline">0749 025 610</a>,
                    e-mail <a href="mailto:office@pro-term.ro" className="font-semibold text-primary hover:underline">office@pro-term.ro</a>.
                  </li>
                  <li>
                    <ExternalAnchor href="https://anpc.ro">Autoritatea Națională pentru Protecția Consumatorilor (ANPC)</ExternalAnchor>
                  </li>
                  <li>
                    <ExternalAnchor href="https://reclamatiisal.anpc.ro">Soluționarea alternativă a litigiilor (SAL)</ExternalAnchor>
                  </li>
                </ul>
              </Section>

              <section aria-labelledby="temei-legal" className="mt-10 rounded-2xl bg-light-200 p-4 sm:p-5">
                <h2 id="temei-legal" className="text-sm font-bold uppercase tracking-widest text-dark">
                  Temei legal
                </h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {legalSources.map((source) => (
                    <li key={source.href}>
                      <ExternalAnchor href={source.href}>{source.label}</ExternalAnchor>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
