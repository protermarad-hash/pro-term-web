import { Phone, Mail, MapPin } from 'lucide-react';

const footerLinks = {
  Servicii: [
    'Refrigerare comercială',
    'Refrigerare industrială',
    'Climatizare & HVAC',
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
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-hero-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">FT</span>
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">
                FRIGO<span className="text-accent">TERM</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Soluții profesionale de refrigerare pentru industrie și comerț.
              15 ani de experiență, 500+ proiecte finalizate.
            </p>

            {/* Contact quick */}
            <div className="space-y-2">
              <a href="tel:+40700000000" className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
                <Phone size={15} className="text-accent" />
                0700 000 000
              </a>
              <a href="mailto:office@frigoterm.ro" className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
                <Mail size={15} className="text-secondary" />
                office@frigoterm.ro
              </a>
              <span className="flex items-center gap-2 text-white/70 text-sm">
                <MapPin size={15} className="text-primary-300" />
                Str. Exemplu nr. 1, București
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-sm uppercase tracking-widest text-white/50 mb-4">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} FRIGOTERM SRL. Toate drepturile rezervate.
          </p>
          <p className="text-white/30 text-xs">
            CUI: RO12345678 · J40/123/2008
          </p>
        </div>
      </div>
    </footer>
  );
}
