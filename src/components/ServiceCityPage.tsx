import Link from 'next/link';
import { CheckCircle2, MapPin, MessageCircle, ShieldCheck, Wrench } from 'lucide-react';

type ServiceType = 'montaj' | 'service' | 'igienizare' | 'revizie';

export type ServiceCityPageProps = {
  city: 'Arad' | 'Timișoara';
  service: ServiceType;
};

const phone = '40749025610';

function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

const serviceContent: Record<ServiceType, { label: string; intro: string; points: string[] }> = {
  montaj: {
    label: 'Montaj aer condiționat',
    intro: 'Instalare aparate de aer condiționat pentru locuințe, birouri și spații comerciale, cu recomandare tehnică, montaj corect și probă de funcționare.',
    points: ['Montaj pentru aparate 9.000–24.000 BTU', 'Poziționare unitate interioară și exterioară', 'Probă de funcționare și explicații de utilizare', 'Suport pentru alegerea soluției potrivite'],
  },
  service: {
    label: 'Service aer condiționat',
    intro: 'Diagnostic, verificare, revizie, igienizare și suport tehnic pentru aparate de aer condiționat și echipamente HVAC.',
    points: ['Diagnostic pentru aparate care nu funcționează corect', 'Revizie și verificare funcționare', 'Igienizare unitate interioară', 'Recomandări pentru mentenanță preventivă'],
  },
  igienizare: {
    label: 'Igienizare aer condiționat',
    intro: 'Curățare și igienizare pentru unitatea interioară a aparatului de aer condiționat, recomandată pentru aer mai curat și funcționare eficientă.',
    points: ['Curățare filtre și componente accesibile', 'Igienizare unitate interioară', 'Verificare evacuare condens', 'Recomandări pentru utilizare și întreținere'],
  },
  revizie: {
    label: 'Revizie aer condiționat',
    intro: 'Verificare periodică pentru aparate de aer condiționat, înainte de sezon sau când randamentul este scăzut.',
    points: ['Verificare funcționare generală', 'Control evacuare condens', 'Verificare stare filtre și schimbătoare', 'Recomandări pentru prevenirea defectelor'],
  },
};

export default function ServiceCityPage({ city, service }: ServiceCityPageProps) {
  const content = serviceContent[service];
  const whatsappUrl = buildWhatsAppUrl(`Bună ziua, doresc o ofertă pentru ${content.label.toLowerCase()} în ${city}.`);

  return (
    <main className="bg-light-200 pt-24">
      <section className="bg-hero-gradient py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 ring-1 ring-white/20"><MapPin size={16} /> {content.label} în {city}</span>
            <h1 className="font-heading text-4xl font-bold leading-tight md:text-6xl">{content.label} {city}</h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80">{content.intro} Servicii disponibile în {city} și zone apropiate, în funcție de programare.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-4 font-bold text-white transition hover:bg-green-600"><MessageCircle size={20} /> Cere ofertă pe WhatsApp</a>
              <Link href="/#contact" className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-4 font-bold text-white transition hover:bg-white hover:text-primary">Formular contact</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="card lg:col-span-2">
              <h2 className="mb-5 font-heading text-2xl font-bold text-dark">Ce include serviciul de {content.label.toLowerCase()} în {city}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {content.points.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl bg-light-200 p-4"><CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-primary" /><p className="text-sm leading-relaxed text-dark-300">{item}</p></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="card"><ShieldCheck className="mb-3 text-primary" size={28} /><h3 className="font-heading text-lg font-bold text-dark">Lucrări corecte</h3><p className="mt-2 text-sm leading-relaxed text-dark-300">Verificăm condițiile și recomandăm soluția potrivită pentru echipament.</p></div>
              <div className="card"><Wrench className="mb-3 text-primary" size={28} /><h3 className="font-heading text-lg font-bold text-dark">Echipă locală</h3><p className="mt-2 text-sm leading-relaxed text-dark-300">PRO TERM oferă servicii HVAC cu echipă locală și suport tehnic.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-light-200 p-8 shadow-card md:flex md:items-center md:justify-between md:gap-8">
            <div><h2 className="font-heading text-2xl font-bold text-dark">Cauți și echipamente HVAC cu livrare în România?</h2><p className="mt-2 text-dark-300">Vezi catalogul PRO TERM cu aparate de aer condiționat, pompe de căldură, centrale termice și accesorii.</p></div>
            <Link href="/produse" className="btn-primary mt-5 md:mt-0">Vezi produsele</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
