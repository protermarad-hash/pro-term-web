'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock, Truck } from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    label: 'Telefon',
    value: '0749 025 610',
    href: 'tel:+40749025610',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'proterm.arad@gmail.com',
    href: 'mailto:proterm.arad@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Montaj & service',
    value: 'Județele Arad și Timiș',
    href: null,
  },
  {
    icon: Truck,
    label: 'Livrări produse',
    value: 'Toată România',
    href: null,
  },
  {
    icon: Clock,
    label: 'Program',
    value: 'Lun–Vin: 8:00–18:00 | Urgențe: 24/7',
    href: null,
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="py-20 bg-light-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            Contact
          </span>
          <h2 className="section-title mt-2">Solicită o Ofertă Gratuită</h2>
          <p className="section-subtitle mx-auto text-center">
            Montaj și service în Arad și Timiș. Livrare echipamente în toată România.
            Te contactăm în maxim 2 ore în zilele lucrătoare.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="card flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-xs text-dark-300 font-medium uppercase tracking-wide">
                    {label}
                  </div>
                  {href ? (
                    <a
                      href={href}
                      className="text-dark font-semibold text-sm hover:text-primary transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="text-dark font-semibold text-sm">{value}</span>
                  )}
                </div>
              </div>
            ))}

            {/* Emergency box */}
            <div className="rounded-2xl bg-accent p-5 text-white">
              <div className="font-bold font-heading text-lg mb-1">
                Urgență HVAC?
              </div>
              <p className="text-white/80 text-sm mb-3">
                Sunăm înapoi în maxim 30 de minute, non-stop.
                Acoperim județele Arad și Timiș.
              </p>
              <a
                href="tel:+40749025610"
                className="flex items-center gap-2 font-bold text-white"
              >
                <Phone size={18} />
                0749 025 610
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 card">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  <Send size={28} className="text-secondary" />
                </div>
                <h3 className="text-xl font-bold font-heading text-dark mb-2">
                  Mesaj trimis cu succes!
                </h3>
                <p className="text-dark-300">
                  Te vom contacta în cel mai scurt timp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Nume complet *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ion Popescu"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="07XX XXX XXX"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@companie.ro"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Serviciu dorit
                  </label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white"
                  >
                    <option value="">Selectează serviciul...</option>
                    <option>Montaj aer condiționat (Arad/Timiș)</option>
                    <option>Service & mentenanță (Arad/Timiș)</option>
                    <option>Sistem VRV comercial/industrial</option>
                    <option>Climatizare spațiu comercial</option>
                    <option>Comandă produse (livrare națională)</option>
                    <option>Colaborare antreprenor — proiect național</option>
                    <option>Alt serviciu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Detalii
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Descrie pe scurt ce ai nevoie: suprafața, tipul spațiului, județul..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center">
                  <Send size={18} />
                  Trimite solicitarea
                </button>

                <p className="text-xs text-dark-300 text-center">
                  Datele tale sunt în siguranță. Nu trimitem spam.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
