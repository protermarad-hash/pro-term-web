'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock, UserRound } from 'lucide-react';

const contactInfo = [
  {
    icon: UserRound,
    label: 'Persoană contact',
    value: 'Herman Sebastian',
    href: null,
  },
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
    label: 'Adresă',
    value: 'Arad, România',
    href: '#',
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
            Ofertă rapidă
          </span>
          <h2 className="section-title mt-2">Cere ofertă pentru produs, montaj sau service</h2>
          <p className="section-subtitle mx-auto text-center">
            Spune-ne ce produs te interesează, suprafața spațiului și dacă ai nevoie de montaj.
            Te contactăm rapid cu recomandarea potrivită.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
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
                  {href && href !== '#' ? (
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

            <div className="rounded-2xl bg-accent p-5 text-white">
              <div className="font-bold font-heading text-lg mb-1">
                Ai nevoie de ajutor la alegere?
              </div>
              <p className="text-white/80 text-sm mb-3">
                Sunăm înapoi pentru recomandare de produs, montaj sau intervenție.
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

          <div className="lg:col-span-3 card">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  <Send size={28} className="text-secondary" />
                </div>
                <h3 className="text-xl font-bold font-heading text-dark mb-2">
                  Solicitarea a fost înregistrată!
                </h3>
                <p className="text-dark-300">
                  Te vom contacta pentru confirmarea produsului, disponibilitate și montaj.
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
                    Ce te interesează?
                  </label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white"
                  >
                    <option value="">Selectează opțiunea...</option>
                    <option>Vreau să comand un produs</option>
                    <option>Produs + montaj</option>
                    <option>Recomandare aparat aer condiționat</option>
                    <option>Service / mentenanță</option>
                    <option>Refrigerare comercială sau industrială</option>
                    <option>Altă solicitare</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Detalii produs / spațiu
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Ex: apartament 2 camere, 45 mp, Arad; mă interesează aparat 12.000 BTU cu montaj."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center">
                  <Send size={18} />
                  Trimite cererea de ofertă
                </button>

                <p className="text-xs text-dark-300 text-center">
                  Datele tale sunt folosite doar pentru a răspunde solicitării.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
