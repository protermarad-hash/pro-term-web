import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import FooterAccountLink from './FooterAccountLink';
import NetopiaLogo from './NetopiaLogo';

const footerLinks = {
  Servicii: [
    { label: 'Climatizare & HVAC', href: '/#servicii' },
    { label: 'Aer condiționat', href: '/produse' },
    { label: 'Centrale termice', href: '/produse' },
    { label: 'Pompe de căldură', href: '/produse' },
    { label: 'Service & mentenanță', href: '/#contact' },
    { label: 'Proiecte HVAC România', href: '/servicii/proiecte-hvac-romania' },
    { label: 'Climatizare comercială și industrială', href: '/servicii/climatizare-comerciala-industriala-romania' },
  ],
  Companie: [
    { label: 'Despre noi', href: '/despre' },
    { label: 'Produse', href: '/produse' },
    { label: 'Certificări', href: '/#avantaje' },
    { label: 'Contact', href: '/#contact' },
  ],
  Legal: [
    { label: 'Informații legale comerciant', href: '/informatii-legale' },
    { label: 'Termeni și condiții', href: '/termeni-si-conditii' },
    { label: 'Livrare și plată', href: '/livrare-si-plata' },
    { label: 'Politica de confidențialitate', href: '/politica-confidentialitate' },
    { label: 'Politica de retur', href: '/politica-retur' },
    { label: 'Formular de retragere', href: '/formular-retragere' },
    { label: 'Politica cookies', href: '/politica-cookies' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-white">
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
            <p className="text-white/75 text-sm leading-relaxed mb-1 max-w-xs">
              SC PRO TERM SRL — soluții HVAC, climatizare, montaj, service și mentenanță în Arad, Timișoara și proiecte naționale.
            </p>
            <p className="text-white/55 text-xs mb-6">
              Herman Sebastian · Arad, România · suport tehnic HVAC
            </p>

            <div className="space-y-2">
              <a
                href="tel:+40749025610"
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
              >
                <Phone size={15} className="text-accent" />
                0749 025 610
              </a>
              <a
                href="mailto:office@pro-term.ro"
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
              >
                <Mail size={15} className="text-brand" />
                office@pro-term.ro
              </a>
              <span className="flex items-center gap-2 text-white/80 text-sm">
                <MapPin size={15} className="text-primary-300" />
                Arad, România
              </span>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-sm uppercase tracking-widest text-white/55 mb-4">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-white/75 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {category === 'Companie' && <FooterAccountLink />}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 overflow-hidden rounded-2xl bg-white p-3 sm:gap-4 sm:p-4">
          <div className="flex-shrink-0">
            <NetopiaLogo />
          </div>
          <p className="text-xs text-dark-400 sm:text-sm">
            Plată online prin NETOPIA Payments — disponibilă în curând.
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/60">Protecția consumatorilor</h4>
          <div className="mt-3 grid gap-3 text-sm text-white/75 md:grid-cols-3">
            <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              PROTECȚIA CONSUMATORILOR - A.N.P.C.
            </a>
            <a href="https://reclamatiisal.anpc.ro" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Soluționare alternativă litigii - SAL
            </a>
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Soluționare online litigii - SOL/ODR
            </a>
          </div>
          <p className="mt-3 text-xs text-white/55">
            Telefonul Consumatorilor: 0219551 · CJPC Arad: Str. Revoluției nr. 50, Arad · Tel. 0257/257.049 · reclamatii.arad@opc.ro
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/55 text-sm">
            © {new Date().getFullYear()} SC PRO TERM SRL. Toate drepturile rezervate.
          </p>
          <p className="text-white/50 text-xs text-center md:text-right">
            Toate prețurile afișate includ TVA de 21% · Arad, România
          </p>
        </div>
      </div>
    </footer>
  );
}
