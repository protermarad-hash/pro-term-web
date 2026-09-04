const steps = [
  {
    title: 'Ne spui ce ai nevoie',
    text: 'Ne trimiți informațiile despre spațiu, proiect sau echipamentul existent.',
  },
  {
    title: 'Analizăm și recomandăm',
    text: 'Verificăm necesarul și îți explicăm variantele potrivite, fără complicații inutile.',
  },
  {
    title: 'Livrăm și instalăm',
    text: 'Pregătim echipamentele, materialele și executăm lucrarea în condițiile stabilite.',
  },
  {
    title: 'Verificăm funcționarea',
    text: 'Realizăm probele, punerea în funcțiune și îți explicăm utilizarea sistemului.',
  },
];

export default function WorkProcess() {
  return (
    <section className="bg-light-200 py-14 lg:py-20">
      <div className="container mx-auto px-4">
        <h2 className="section-title mx-auto max-w-2xl text-center">
          Simplu pentru tine. Gestionat complet de noi.
        </h2>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
              <span className="font-heading text-4xl font-bold text-primary/25">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-heading text-lg font-bold text-dark">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-300">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
