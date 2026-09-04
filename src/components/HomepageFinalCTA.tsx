import Link from 'next/link';
import { Phone } from 'lucide-react';

export default function HomepageFinalCTA() {
  return (
    <section className="bg-brand py-20 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mx-auto max-w-2xl font-heading text-3xl font-bold md:text-4xl">
          Hai să găsim soluția potrivită pentru spațiul tău.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/85">
          Fie că ai nevoie de un aparat de aer condiționat, o pompă de căldură, o intervenție de service sau o
          instalație HVAC completă, spune-ne ce vrei să rezolvi. Îți răspundem cu o recomandare realistă și pașii
          următori.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-bold text-brand transition hover:bg-light-200"
          >
            Solicită o ofertă
          </Link>
          <a
            href="tel:+40749025610"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
          >
            <Phone size={19} />
            Sună un specialist
          </a>
        </div>
      </div>
    </section>
  );
}
