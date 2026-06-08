import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Oferiți montaj aer condiționat în Arad și Timișoara?',
    answer:
      'Da. PRO TERM oferă montaj aer condiționat în Arad și Timișoara, în funcție de programare, acces și condițiile tehnice ale locației.',
  },
  {
    question: 'Livrați produse HVAC în România?',
    answer:
      'Da. Produsele HVAC pot fi livrate în România, în funcție de stoc, volum, greutate și condițiile de transport. Costul final se confirmă înainte de procesare.',
  },
  {
    question: 'Vă deplasați pentru proiecte HVAC mari în țară?',
    answer:
      'Pentru proiecte HVAC comerciale sau industriale, echipa PRO TERM poate analiza deplasări la nivel național, în funcție de complexitate, calendar și cerințele tehnice.',
  },
  {
    question: 'Cum aleg capacitatea potrivită pentru un aparat de aer condiționat?',
    answer:
      'Capacitatea se alege în funcție de suprafață, izolație, orientare, număr de persoane, surse de căldură și destinația spațiului. PRO TERM poate oferi recomandare tehnică înainte de achiziție.',
  },
  {
    question: 'Ce include montajul standard pentru aer condiționat?',
    answer:
      'Montajul standard include lucrările și materialele menționate în pachetul ales. Lucrările suplimentare, traseele mai lungi sau condițiile speciale se comunică și se tarifează separat.',
  },
  {
    question: 'Când este recomandată revizia sau curățarea aparatului de aer condiționat?',
    answer:
      'Revizia și curățarea sunt recomandate înainte de sezonul cald și ori de câte ori apar mirosuri, zgomote, scurgeri de condens sau randament scăzut.',
  },
];

export default function FaqSection() {
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className="bg-light-200 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-accent">
            Întrebări frecvente
          </span>
          <h2 className="section-title mt-2">Răspunsuri rapide înainte să ceri oferta</h2>
          <p className="section-subtitle mx-auto text-center">
            Informații utile despre produse HVAC, montaj, service, livrare și proiecte comerciale.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {faqs.map((item) => (
            <div key={item.question} className="rounded-3xl bg-white p-6 shadow-card">
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <HelpCircle size={20} />
                </div>
                <h3 className="font-heading text-lg font-bold text-dark">{item.question}</h3>
              </div>
              <p className="text-sm leading-relaxed text-dark-300">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/#contact" className="btn-primary">
            Cere recomandare
          </Link>
          <Link href="/servicii/proiecte-hvac-romania" className="rounded-lg border-2 border-primary px-5 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white">
            Proiecte HVAC România
          </Link>
        </div>
      </div>
    </section>
  );
}
