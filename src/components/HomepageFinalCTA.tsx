import Link from 'next/link';
import { Phone } from 'lucide-react';

export default function HomepageFinalCTA() {
  return (
    <section className="border-y border-accent/15 bg-accent-50 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mx-auto max-w-2xl font-heading text-3xl font-bold text-primary md:text-4xl">
          Hai să găsim soluția potrivită pentru spațiul tău.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-dark-300">
          Fie că ai nevoie de un aparat de aer condiționat, o pompă de căldură, o intervenție de service sau o
          instalație HVAC completă, spune-ne ce vrei să rezolvi. Îți răspundem cu o recomandare realistă și pașii
          următori.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/contact" className="btn-primary justify-center px-7 py-3 text-base">
            Solicită o ofertă
          </Link>
          <a
            href="tel:+40749025610"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-300 bg-white px-7 py-3 text-base font-semibold text-primary transition-colors hover:border-primary-400"
          >
            <Phone size={19} />
            Sună un specialist
          </a>
        </div>
      </div>
    </section>
  );
}
