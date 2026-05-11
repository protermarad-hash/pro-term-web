import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

const footerLinks = {
  Servicii: [
    'Climatizare & HVAC',
    'Refrigerare comercială',
    'Refrigerare industrială',
    'Camere frigorifice',
    'Service & mentenanță',
  ],
  Companie: ['Despre noi', 'Echipa noastră', 'Certificări', 'Parteneri', 'Blog'],
  Legal: ['Termeni și condiții', 'Politica de confidențialitate', 'GDPR', 'Cookies'],
};

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo-proterm.jpg"
                alt="PRO TERM"
                width={160}
                height={48}
                className="h-10 w-auto object-contain brightness-200"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-1 max-w-xs">
              PRO TERM SRL — fondată în 1999, cu peste 25 de ani de experiență în sisteme
              HVAC industriale și civile.
            </p>
            <p className="text-white/40 text-xs mb-6">
              Soluții HVAC Complete · Arad, România
            </p>

            <div className="space-y-2">
              <a
                href="tel:+40700000000"
                className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
              >
                <Phone size={15} className="text-accent" />
                0700 000 000
              </a>
              <a
                href="mailto:office@pro-term.ro"
                className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
              >
                <Mail size={15} className="text-brand" />
                office@pro-term.ro
              </a>
              <span className="flex items-center gap-2 text-white/70 text-sm">
                <MapPin size={15} className="text-primary-300" />
                Arad, România
              </span>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-4">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href={link === 'Despre noi' ? '/despre' : '#'}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} PRO TERM SRL. Toate drepturile rezervate.
          </p>
          <p className="text-white/30 text-xs">
            Fondată în 1999 · Arad, România
          </p>
        </div>
      </div>
    </footer>
  );
}
