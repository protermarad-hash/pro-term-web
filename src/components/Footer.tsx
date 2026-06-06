import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

const footerLinks = {
  Servicii: [
    { label: 'Climatizare & HVAC', href: '/#servicii' },
    { label: 'Aer condiționat', href: '/produse' },
    { label: 'Centrale termice', href: '/produse' },
    { label: 'Pompe de căldură', href: '/produse' },
    { label: 'Service & mentenanță', href: '/#contact' },
  ],
  Companie: [
    { label: 'Despre noi', href: '/despre' },
    { label: 'Produse', href: '/produse' },
    { label: 'Certificări', href: '/#avantaje' },
    { label: 'Contact', href: '/#contact' },
  ],
  Legal: [
    { label: 'Termeni și condiții', href: '/termeni-si-conditii' },
    { label: 'Politica de confidențialitate', href: '/politica-confidentialitate' },
    { label: 'Politica de retur', href: '/politica-retur' },
    { label: 'Politica cookies', href: '/politica-cookies' },
  ],
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
              SC PRO TERM SRL — dealer oficial și service zonal Gree, Midea și Yamato. Soluții HVAC, climatizare, montaj, service și mentenanță în Arad.
            </p>
            <p className="text-white/40 text-xs mb-6">
              Herman Sebastian · Arad, România · ISO 9001 · F-Gas / AGFR
            </p>

            <div className="space-y-2">
              <a
                href="tel:+40749025610"
                className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
              >
                <Phone size={15} className="text-accent" />
                0749 025 610
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
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
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
            © {new Date().getFullYear()} SC PRO TERM SRL. Toate drepturile rezervate.
          </p>
          <p className="text-white/30 text-xs">
            Arad, România
          </p>
        </div>
      </div>
    </footer>
  );
}
