import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, Truck } from 'lucide-react';

const footerLinks = {
  Servicii: [
    { label: 'Montaj aer condiționat', href: '#' },
    { label: 'Service HVAC Arad', href: '#' },
    { label: 'Service HVAC Timiș', href: '#' },
    { label: 'Sisteme VRV comerciale', href: '#' },
    { label: 'Mentenanță preventivă', href: '#' },
  ],
  Companie: [
    { label: 'Despre noi', href: '/despre' },
    { label: 'Proiecte realizate', href: '/#proiecte' },
    { label: 'Certificări', href: '/despre#certificari' },
    { label: 'Produse', href: '/produse' },
    { label: 'Contact', href: '/#contact' },
  ],
  Legal: [
    { label: 'Termeni și condiții', href: '#' },
    { label: 'Politica de confidențialitate', href: '#' },
    { label: 'GDPR', href: '#' },
    { label: 'Cookies', href: '#' },
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
                alt="PRO TERM SRL"
                width={160}
                height={48}
                className="h-10 w-auto object-contain brightness-200"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-1 max-w-xs">
              PRO TERM SRL — fondată în 1999 în Arad. Dealer autorizat Gree, Midea și Yamato.
              Instalare și service HVAC autorizat.
            </p>

            {/* Coverage zone */}
            <div className="mt-4 mb-5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <MapPin size={13} className="text-brand flex-shrink-0" />
                <span>
                  <span className="text-white/80 font-semibold">Montaj & service:</span>{' '}
                  Arad și Timiș
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Truck size={13} className="text-primary-300 flex-shrink-0" />
                <span>
                  <span className="text-white/80 font-semibold">Livrări produse:</span>{' '}
                  Toată România
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href="tel:+40749025610"
                className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
              >
                <Phone size={15} className="text-accent" />
                0749 025 610
              </a>
              <a
                href="mailto:proterm.arad@gmail.com"
                className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
              >
                <Mail size={15} className="text-brand" />
                proterm.arad@gmail.com
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-4">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {label}
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
          <p className="text-white/30 text-xs text-center">
            Montaj & service: Arad și Timiș · Livrări: toată România · Fondată 1999
          </p>
        </div>
      </div>
    </footer>
  );
}
