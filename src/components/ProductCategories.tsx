import Link from 'next/link';
import { ArrowRight, Snowflake, Flame, Wind, Wrench } from 'lucide-react';

const categories = [
  {
    icon: Snowflake,
    title: 'Aer condiționat',
    text: 'Răcoare vara și confort în sezonul rece, cu un aparat ales corect pentru încăperea ta.',
    cta: 'Vezi aparatele',
  },
  {
    icon: Flame,
    title: 'Pompe de căldură',
    text: 'Încălzire eficientă, apă caldă și confort pe termen lung, într-un sistem dimensionat pentru locuința ta.',
    cta: 'Vezi soluțiile',
  },
  {
    icon: Wind,
    title: 'Ventilație cu recuperare',
    text: 'Aer proaspăt în interior, cu pierderi reduse de căldură și un nivel mai bun de confort.',
    cta: 'Descoperă sistemele',
  },
  {
    icon: Wrench,
    title: 'Accesorii și componente HVAC',
    text: 'Produsele necesare pentru o instalare corectă, o funcționare sigură și o durată mai mare de viață a echipamentelor.',
    cta: 'Vezi accesoriile',
  },
];

/**
 * All four CTAs point to /produse (the single catalog route): ProductCatalog only
 * reads a `?brand=` URL param, not a category filter, so a deep link into one
 * category does not exist yet. "Ventilație cu recuperare" also has no matching
 * `Category` value in src/lib/products.ts — closest real destination is the full
 * catalog. See the redesign report for the exact mapping.
 */
export default function ProductCategories() {
  return (
    <section className="bg-light-200 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h2 className="section-title">Tot ce ai nevoie pentru confortul casei tale</h2>
          <p className="section-subtitle">
            Nu trebuie să cunoști toate detaliile tehnice înainte să alegi. Spune-ne ce spațiu vrei să încălzești, să
            răcești sau să ventilezi, iar noi te ajutăm să găsești echipamentul potrivit.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ icon: Icon, title, text, cta }) => (
            <div key={title} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={22} />
              </div>
              <h3 className="font-heading text-lg font-bold text-dark">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-dark-300">{text}</p>
              <Link
                href="/produse"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-brand"
              >
                {cta}
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
