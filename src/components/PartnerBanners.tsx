const partners = [
  { name: 'Gree', text: 'Suport vânzare, instalare și service zonal' },
  { name: 'Midea', text: 'Suport vânzare, instalare și service zonal' },
  { name: 'Yamato', text: 'Suport vânzare, instalare și service zonal' },
  { name: 'Fujitsu', text: 'Suport vânzare, instalare și service zonal' },
];

export default function PartnerBanners() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <span className="text-sm font-bold uppercase tracking-widest text-accent">
            Furnizori și colaboratori
          </span>
          <h2 className="section-title mt-2">Branduri pentru care oferim suport</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-dark-300">
            PRO TERM oferă consultanță, instalare, service și mentenanță pentru echipamente HVAC,
            inclusiv pentru Gree, Midea, Yamato și Fujitsu.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner) => (
            <div key={partner.name} className="rounded-3xl border border-slate-100 bg-light-200 p-6 shadow-card">
              <div className="mb-4 flex h-20 items-center justify-center rounded-2xl bg-white shadow-sm">
                <span className="font-heading text-3xl font-bold text-primary">{partner.name}</span>
              </div>
              <p className="text-sm font-semibold text-dark">{partner.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
