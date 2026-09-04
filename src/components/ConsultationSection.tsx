import Link from 'next/link';
import { Lightbulb } from 'lucide-react';

export default function ConsultationSection() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 rounded-2xl border border-primary/10 bg-card-gradient p-8 md:grid-cols-[auto_1fr_auto] md:p-12">
          <div className="hidden h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-white md:flex">
            <Lightbulb size={26} />
          </div>

          <div>
            <h2 className="section-title">Nu știi ce echipament ți se potrivește?</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-dark-300">
              Puterea mai mare nu înseamnă întotdeauna confort mai bun. Un aparat ales greșit poate consuma inutil,
              poate funcționa necorespunzător și poate avea o durată de viață mai scurtă.
            </p>
            <p className="mt-3 max-w-2xl leading-relaxed text-dark-300">
              Trimite-ne câteva informații despre spațiu, iar echipa PRO TERM îți recomandă o variantă potrivită
              nevoilor și bugetului tău.
            </p>
          </div>

          <Link href="/contact" className="btn-primary w-fit whitespace-nowrap md:justify-self-end">
            Vreau o recomandare
          </Link>
        </div>
      </div>
    </section>
  );
}
