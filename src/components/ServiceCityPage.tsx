import Link from 'next/link';
import {
  CheckCircle2,
  ChevronRight,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';

type ServiceType = 'montaj' | 'service' | 'igienizare' | 'revizie';

export type ServiceCityPageProps = {
  city: 'Arad' | 'Timișoara';
  service: ServiceType;
};

const phoneDisplay = '0749 025 610';
const phoneHref = 'tel:+40749025610';
const phoneWhatsapp = '40749025610';

function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${phoneWhatsapp}?text=${encodeURIComponent(message)}`;
}

type FaqItem = {
  question: string;
  answer: string;
};

type ServiceContent = {
  label: string;
  heroSubtitle: string;
  ctaLabel: string;
  pricingTitle: string;
  pricingFrom?: string;
  pricingText: string;
  pricingIncludes?: string[];
  pricingExcludes?: string[];
  includeTitle: string;
  includeItems: string[];
  whenNeedTitle: string;
  whenNeedItems: string[];
  processTitle: string;
  processSteps: string[];
  trustTitle: string;
  trustItems: string[];
  faq: FaqItem[];
  relatedLinks: { label: string; href: string }[];
};

const serviceContent: Record<ServiceType, ServiceContent> = {
  montaj: {
    label: 'Montaj aer conditionat',
    heroSubtitle:
      'Montaj aer conditionat pentru locuinte, birouri si spatii comerciale mici, cu pozitionare corecta, verificare finala si recomandari utile pentru exploatare.',
    ctaLabel: 'Cere oferta de montaj',
    pricingTitle: 'Pret montaj aer conditionat',
    pricingFrom: 'de la 750 RON / montaj standard',
    pricingText:
      'Pentru montaj standard, preturile pornesc de la 750 RON cu TVA, in functie de capacitatea aparatului si conditiile de instalare. Pentru o estimare corecta, trimite-ne localitatea, modelul aparatului si cateva poze cu locul de montaj.',
    includeTitle: 'Ce include serviciul',
    includeItems: [
      'Montaj aer conditionat in Arad si imprejurimi, in functie de programare si conditiile tehnice.',
      'Instalare unitate interioara si unitate exterioara in pozitiile stabilite impreuna cu clientul.',
      'Realizare traseu frigorific si verificarea configuratiei potrivite pentru aparat si spatiu.',
      'Racord pentru evacuare condens si verificarea scurgerii corecte.',
      'Verificare finala, punere in functiune si explicatii de utilizare.',
      'Recomandare sa trimiti poze din locatie pentru o oferta mai rapida si mai corecta.',
    ],
    whenNeedTitle: 'Cand ai nevoie de acest serviciu',
    whenNeedItems: [
      'Cand ai cumparat un aparat nou si vrei montaj aer conditionat in Arad cu executie corecta.',
      'Cand schimbi aparatul vechi si ai nevoie de evaluare pentru traseu, pozitionare si evacuare condens.',
      'Cand amenajezi un apartament, o casa, un birou sau un spatiu comercial mic.',
      'Cand vrei sa eviti montajele improvizate care pot influenta functionarea si durata de viata a echipamentului.',
    ],
    processTitle: 'Cum decurge programarea si interventia',
    processSteps: [
      'Ne suni sau ne scrii pe WhatsApp si ne spui modelul aparatului, adresa si ce ai nevoie.',
      'Pentru oferta, poti trimite poze cu locul unde vrei montajul pentru unitatea interioara si exterioara.',
      'Confirmam disponibilitatea, discutam conditiile din locatie si stabilim programarea.',
      'La interventie, montam aparatul, verificam functionarea si iti explicam pasii de utilizare.',
    ],
    trustTitle: 'De ce sa discuti cu PRO TERM',
    trustItems: [
      'PRO TERM activeaza in domeniul HVAC din 1999.',
      'Oferim servicii pentru locuinte, birouri si spatii comerciale mici.',
      'Discuti cu o echipa tehnica ce poate oferi si consultanta practica, nu doar executie.',
      'Intervenim in Arad si in localitatile din jur, in functie de programare.',
    ],
    faq: [
      {
        question: 'Cat dureaza montajul unui aparat de aer conditionat?',
        answer:
          'Durata depinde de spatiu, acces si configuratia instalarii, dar o estimare corecta se poate da dupa ce discutam detaliile lucrarii.',
      },
      {
        question: 'Ce informatii trebuie sa trimit pentru oferta?',
        answer:
          'Ajuta sa trimiti modelul aparatului, localitatea si cateva poze cu zona pentru unitatea interioara si exterioara.',
      },
      {
        question: 'Interveniti si in localitatile din jurul Aradului?',
        answer:
          'Da, in functie de programare si de conditiile logistice, putem prelua lucrari si in imprejurimi.',
      },
      {
        question: 'De ce conteaza montajul corect?',
        answer:
          'Montajul corect influenteaza functionarea aparatului, confortul, evacuarea condensului si durata de viata a echipamentului.',
      },
      {
        question: 'Puteti recomanda si pozitionarea aparatului?',
        answer:
          'Da, iti putem spune ce varianta este mai potrivita pentru spatiu, astfel incat aparatul sa functioneze eficient.',
      },
    ],
    relatedLinks: [
      { label: 'Service aer conditionat Arad', href: '/servicii/service-aer-conditionat-arad' },
      { label: 'Curatare AC Arad', href: '/servicii/curatare-ac-arad' },
      { label: 'Revizie AC Arad', href: '/servicii/revizie-ac-arad' },
    ],
  },
  service: {
    label: 'Service aer conditionat',
    heroSubtitle:
      'Service aer conditionat in Arad pentru aparate care nu mai racesc corect, curg apa, fac zgomot, miros neplacut sau au nevoie de verificare tehnica.',
    ctaLabel: 'Programeaza diagnostic',
    pricingTitle: 'Verificare / diagnostic aer conditionat — de la 150 RON / aparat',
    pricingText:
      'Tariful de baza include verificari initiale ale functionarii aparatului si identificarea problemei aparente. Reparatiile, piesele, incarcarea cu agent frigorific sau interventiile suplimentare se comunica separat inainte de executie.',
    pricingIncludes: [
      'verificare pornire/oprire aparat',
      'verificare mod racire/incalzire, daca este cazul',
      'verificare vizuala unitate interioara',
      'verificare vizuala unitate exterioara, daca accesul este simplu',
      'verificare filtre',
      'verificare evacuare condens',
      'verificare zgomote, vibratii, mirosuri',
      'recomandare tehnica pentru curatare, revizie, service sau reparatie',
    ],
    pricingExcludes: [
      'reparatii',
      'piese',
      'incarcare cu agent frigorific',
      'interventii electrice',
      'demontari complexe',
      'lucrari la inaltime sau acces dificil',
      'deplasari in afara zonei standard',
    ],
    includeTitle: 'Ce poate include serviciul',
    includeItems: [
      'Diagnostic pentru aparat care nu mai raceste sau nu porneste.',
      'Verificare atunci cand apar scurgeri de apa, zgomote sau miros neplacut.',
      'Control vizual si tehnic pentru functionarea generala a echipamentului.',
      'Recomandari privind urmatorii pasi: curatare, revizie, reparatie sau monitorizare.',
      'Programare pentru interventie in Arad si imprejurimi, in functie de disponibilitate.',
    ],
    whenNeedTitle: 'Cand ai nevoie de service aer conditionat',
    whenNeedItems: [
      'Aparatul nu mai raceste suficient sau functioneaza slab.',
      'Curge apa din unitatea interioara sau apar probleme la condens.',
      'Se aud zgomote neobisnuite in timpul functionarii.',
      'Apar mirosuri neplacute sau semne clare de murdarie acumulata.',
      'Aparatul nu porneste sau se opreste neobisnuit si ai nevoie de verificare tehnica.',
    ],
    processTitle: 'Cum decurge programarea si interventia',
    processSteps: [
      'Ne spui la telefon sau pe WhatsApp ce simptome are aparatul si unde este montat.',
      'Daca este nevoie, iti cerem poze sau videoclipuri scurte pentru orientare initiala.',
      'Stabilim programarea pentru verificare si diagnostic.',
      'Dupa evaluare, iti explicam ce am constatat si ce solutie este potrivita pentru aparat.',
    ],
    trustTitle: 'Un partener local pentru interventii HVAC',
    trustItems: [
      'PRO TERM activeaza in HVAC din 1999.',
      'Lucram pentru locuinte, birouri si spatii comerciale mici.',
      'Oferim consultanta tehnica si explicam clar ce observam la interventie.',
      'Serviciile sunt disponibile in Arad si imprejurimi, in functie de programare.',
    ],
    faq: [
      {
        question: 'De ce nu mai raceste aerul conditionat?',
        answer:
          'Pot exista mai multe cauze, de la filtre murdare si schimb de aer slab pana la probleme care necesita verificare tehnica.',
      },
      {
        question: 'De ce curge apa din aerul conditionat?',
        answer:
          'Scurgerile pot aparea din cauza evacuarii condensului, a murdariei acumulate sau a altor probleme ce trebuie verificate la fata locului.',
      },
      {
        question: 'Puteti interveni daca aparatul face zgomot?',
        answer:
          'Da, zgomotele neobisnuite sunt un motiv bun pentru programare si verificare tehnica.',
      },
      {
        question: 'Trebuie sa trimit poze inainte de programare?',
        answer:
          'Nu este obligatoriu, dar pozele sau un scurt video ne ajuta sa intelegem mai repede situatia.',
      },
      {
        question: 'Interveniti si in localitatile din jurul Aradului?',
        answer:
          'Da, in functie de programare si de zona, putem organiza interventii si in imprejurimi.',
      },
    ],
    relatedLinks: [
      { label: 'Curatare AC Arad', href: '/servicii/curatare-ac-arad' },
      { label: 'Revizie AC Arad', href: '/servicii/revizie-ac-arad' },
      { label: 'Montaj aer conditionat Arad', href: '/servicii/montaj-aer-conditionat-arad' },
    ],
  },
  igienizare: {
    label: 'Curatare aer conditionat',
    heroSubtitle:
      'Curatare si igienizare aer conditionat in Arad pentru aparate cu mirosuri neplacute, praf acumulat, eficienta scazuta si nevoie de aer mai curat in spatiu.',
    ctaLabel: 'Programeaza curatarea',
    pricingTitle: 'Curatare / igienizare aer conditionat — de la 200 RON / aparat',
    pricingText:
      'Serviciul de baza include curatarea filtrelor, igienizarea zonelor accesibile si verificari simple pentru evacuarea condensului. Pentru aparate foarte murdare, acces dificil sau curatare profunda, costul se confirma inainte de executie.',
    pricingIncludes: [
      'curatare filtre',
      'curatare/igienizare zone accesibile ale unitatii interioare',
      'indepartare praf si impuritati accesibile',
      'verificare de baza evacuare condens',
      'recomandari de intretinere',
    ],
    pricingExcludes: [
      'demontare completa unitate',
      'curatare profunda daca aparatul este foarte murdar',
      'reparatii',
      'piese',
      'lucrari cu acces dificil',
      'interventii asupra traseului frigorific',
    ],
    includeTitle: 'Ce include serviciul',
    includeItems: [
      'Curatare si igienizare pentru unitatea interioara a aparatului de aer conditionat.',
      'Indepartarea murdariei vizibile, a prafului si a impuritatilor acumulate.',
      'Verificare de baza pentru evacuarea condensului si functionarea generala.',
      'Recomandari de intretinere pentru confort si aer mai curat.',
      'Programare in Arad si imprejurimi, in functie de disponibilitate.',
    ],
    whenNeedTitle: 'Cand se recomanda curatarea aparatului',
    whenNeedItems: [
      'Cand apar mirosuri neplacute la pornire sau in timpul functionarii.',
      'Cand observi praf si impuritati in zona unitatii interioare.',
      'Cand aparatul pare mai putin eficient decat in mod normal.',
      'Inainte de sezonul cald, pentru confort mai bun si aer mai curat.',
      'Cand folosesti aparatul frecvent in locuinte, birouri sau spatii comerciale mici.',
    ],
    processTitle: 'Cum decurge programarea si interventia',
    processSteps: [
      'Ne contactezi telefonic sau pe WhatsApp si ne spui modelul aparatului si localitatea.',
      'Stabilim o programare pentru curatare si iti spunem ce informatii sunt utile inainte de interventie.',
      'La fata locului facem curatarea si igienizarea componentelor accesibile ale unitatii.',
      'La final iti spunem daca aparatul are nevoie doar de intretinere sau si de revizie/service.',
    ],
    trustTitle: 'De ce aleg clientii acest tip de interventie',
    trustItems: [
      'PRO TERM activeaza in domeniul HVAC din 1999.',
      'Oferim servicii pentru locuinte, birouri si spatii comerciale mici.',
      'Te ajutam cu recomandari practice pentru intretinerea aparatului dupa curatare.',
      'Intervenim in Arad si in zonele apropiate, in functie de programare.',
    ],
    faq: [
      {
        question: 'Cand se recomanda curatarea aparatului de aer conditionat?',
        answer:
          'De regula, inainte de sezonul cald sau atunci cand apar mirosuri, praf vizibil ori scadere de confort.',
      },
      {
        question: 'Curatarea ajuta daca aparatul miroase neplacut?',
        answer:
          'Da, mirosurile neplacute sunt un motiv frecvent pentru curatare si igienizare.',
      },
      {
        question: 'Curatarea imbunatateste confortul din incapere?',
        answer:
          'Da, un aparat mai curat poate contribui la un aer mai placut si la functionare mai buna.',
      },
      {
        question: 'Curatarea este acelasi lucru cu revizia?',
        answer:
          'Nu neaparat. Curatarea este orientata spre igienizare si murdarie acumulata, iar revizia urmareste mai clar verificarea functionarii si preventia.',
      },
      {
        question: 'Interveniti si in localitatile din jurul Aradului?',
        answer:
          'Da, in functie de programare si de zona, putem prelua lucrari si in imprejurimi.',
      },
    ],
    relatedLinks: [
      { label: 'Revizie AC Arad', href: '/servicii/revizie-ac-arad' },
      { label: 'Service aer conditionat Arad', href: '/servicii/service-aer-conditionat-arad' },
      { label: 'Montaj aer conditionat Arad', href: '/servicii/montaj-aer-conditionat-arad' },
    ],
  },
  revizie: {
    label: 'Revizie aer conditionat',
    heroSubtitle:
      'Revizie aer conditionat in Arad pentru verificarea functionarii, prevenirea defectiunilor si mentinerea unui consum eficient in locuinte, birouri si spatii comerciale mici.',
    ctaLabel: 'Programeaza revizia',
    pricingTitle: 'Revizie minima aer conditionat — de la 150 RON / aparat',
    pricingText:
      'Revizia minima include verificari de functionare si recomandari pentru prevenirea problemelor. Lucrarile suplimentare, piesele sau interventiile complexe se confirma separat.',
    pricingIncludes: [
      'verificare generala functionare',
      'verificare filtre',
      'verificare evacuare condens',
      'verificare stare generala unitate interioara',
      'verificare vizuala unitate exterioara, daca accesul este simplu',
      'recomandari pentru prevenirea defectiunilor si eficienta',
    ],
    pricingExcludes: [
      'reparatii',
      'piese',
      'incarcare cu agent frigorific',
      'curatare profunda',
      'interventii electrice',
      'lucrari suplimentare',
    ],
    includeTitle: 'Ce poate include revizia',
    includeItems: [
      'Verificare de functionare inainte de sezonul cald sau atunci cand vrei mentenanta preventiva.',
      'Control general al aparatului si observatii privind functionarea curenta.',
      'Verificare pentru condens, filtre si starea generala a echipamentului.',
      'Recomandari pentru prevenirea defectiunilor si mentinerea eficientei.',
      'Programare pentru locuinte, birouri si spatii comerciale mici din Arad si imprejurimi.',
    ],
    whenNeedTitle: 'Cand ai nevoie de revizie AC',
    whenNeedItems: [
      'Inainte de sezonul cald, pentru a porni aparatul in conditii bune.',
      'Cand vrei sa previi defectiunile si opririle neplacute in perioadele aglomerate.',
      'Cand aparatul functioneaza, dar vrei sa verifici eficienta si consumul.',
      'Cand echipamentul este folosit in locuinte, birouri sau spatii comerciale mici si vrei mentenanta preventiva.',
    ],
    processTitle: 'Cum decurge programarea si interventia',
    processSteps: [
      'Ne contactezi si ne spui unde este aparatul si ce tip de utilizare are.',
      'Stabilim programarea pentru revizie in Arad sau imprejurimi.',
      'La interventie verificam functionarea generala si punctele importante pentru exploatare corecta.',
      'La final primesti recomandari practice privind urmatoarea revizie, curatare sau service, daca este cazul.',
    ],
    trustTitle: 'Sprijin tehnic local, fara promisiuni exagerate',
    trustItems: [
      'PRO TERM activeaza in HVAC din 1999.',
      'Lucram pentru clienti rezidentiali si pentru spatii comerciale mici.',
      'Oferim consultanta tehnica si explicatii utile dupa verificare.',
      'Serviciile sunt disponibile in Arad si in localitatile din jur, in functie de programare.',
    ],
    faq: [
      {
        question: 'Cat de des se face revizia aerului conditionat?',
        answer:
          'Frecventa depinde de cat de mult este folosit aparatul si de mediul in care functioneaza, dar revizia preventiva este utila inainte de sezon.',
      },
      {
        question: 'Revizia ajuta la prevenirea defectiunilor?',
        answer:
          'Da, revizia este utila tocmai pentru a observa din timp semnele care pot duce la probleme mai mari.',
      },
      {
        question: 'Este recomandata revizia pentru birouri si spatii comerciale mici?',
        answer:
          'Da, mai ales acolo unde aparatul functioneaza constant si confortul trebuie mentinut.',
      },
      {
        question: 'Revizia poate arata daca aparatul consuma mai mult decat ar trebui?',
        answer:
          'Revizia poate scoate la iveala semne de functionare ineficienta si te poate ajuta sa intelegi daca sunt necesari alti pasi.',
      },
      {
        question: 'Interveniti si in localitatile din jurul Aradului?',
        answer:
          'Da, in functie de programare si de zona, putem organiza interventii si in imprejurimi.',
      },
    ],
    relatedLinks: [
      { label: 'Service aer conditionat Arad', href: '/servicii/service-aer-conditionat-arad' },
      { label: 'Curatare AC Arad', href: '/servicii/curatare-ac-arad' },
      { label: 'Montaj aer conditionat Arad', href: '/servicii/montaj-aer-conditionat-arad' },
    ],
  },
};

export default function ServiceCityPage({ city, service }: ServiceCityPageProps) {
  const content = serviceContent[service];
  const locationLabel = city === 'Arad' ? 'Arad si imprejurimi' : `${city} si zone apropiate`;

  const whatsappUrl = buildWhatsAppUrl(
    `Buna ziua, doresc detalii pentru ${content.label.toLowerCase()} in ${city}.`,
  );
  const pricingWhatsappUrl = buildWhatsAppUrl(
    service === 'montaj'
      ? `Buna ziua, vreau o estimare pentru ${content.label.toLowerCase()} in ${city}. Trimit localitatea, modelul aparatului si poze cu locul de montaj.`
      : service === 'service'
        ? `Buna ziua, vreau detalii pentru ${content.label.toLowerCase()} in ${city}. Trimit simptomele aparatului pentru o estimare.`
        : service === 'igienizare'
          ? `Buna ziua, vreau o estimare pentru ${content.label.toLowerCase()} in ${city}. Trimit cateva detalii despre aparat.`
          : `Buna ziua, vreau o estimare pentru ${content.label.toLowerCase()} in ${city}. Trimit detalii despre aparat si locatie.`,
  );

  const trustPoints = [
    'PRO TERM activeaza in domeniul HVAC din 1999.',
    'Personal tehnic profesionist cu consultanta practica inclusa.',
    `Servicii disponibile in ${locationLabel}, in functie de programare.`,
  ];

  return (
    <main className="bg-light-200 pt-24">

      {/* 1. HERO — compact */}
      <section className="bg-hero-gradient py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/90 ring-1 ring-white/20">
              <MapPin size={14} />
              {content.label} in {city}
            </span>
            <h1 className="font-heading text-3xl font-bold leading-tight md:text-5xl">
              {content.label} {city}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
              {content.heroSubtitle}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 font-bold text-primary transition hover:bg-slate-100"
              >
                <Phone size={18} />
                {phoneDisplay}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3.5 font-bold text-white transition hover:bg-green-600"
              >
                <MessageCircle size={18} />
                Cere oferta pe WhatsApp
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              {['PRO TERM din 1999', 'F-Gas Autorizat', locationLabel].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold text-white/90"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRICING — vizibil imediat dupa hero */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl border border-primary/15 bg-white p-6 shadow-card md:p-8">
            <h2 className="font-heading text-xl font-bold text-dark md:text-2xl">
              {content.pricingTitle}
            </h2>
            {content.pricingFrom && (
              <div className="mt-3 inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                {content.pricingFrom}
              </div>
            )}
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-dark-300">
              {content.pricingText}
            </p>

            {(content.pricingIncludes || content.pricingExcludes) && (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {content.pricingIncludes && (
                  <div className="rounded-2xl bg-light-200 p-4">
                    <h3 className="mb-3 text-sm font-bold text-dark">Include</h3>
                    <ul className="space-y-2">
                      {content.pricingIncludes.slice(0, 5).map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-dark-300">
                          <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {content.pricingExcludes && (
                  <div className="rounded-2xl bg-light-200 p-4">
                    <h3 className="mb-3 text-sm font-bold text-dark">Nu include</h3>
                    <ul className="space-y-2">
                      {content.pricingExcludes.slice(0, 4).map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-dark-300">
                          <ChevronRight size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={pricingWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-5 py-3 font-bold text-white transition hover:bg-green-600"
              >
                <MessageCircle size={16} />
                {service === 'montaj' ? 'Cere oferta pe WhatsApp' : 'Cere estimare pe WhatsApp'}
              </a>
              <a
                href={phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/25 px-5 py-3 font-bold text-primary transition hover:border-primary hover:bg-primary/5"
              >
                <Phone size={16} />
                Suna pentru detalii
              </a>
              {service === 'montaj' && (
                <Link
                  href="/servicii/montaj"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-primary px-5 py-3 font-bold text-primary transition hover:bg-primary hover:text-white"
                >
                  Vezi lista completa de tarife
                  <ChevronRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. TREI CARDURI — Ce include / Cand ai nevoie / Cum programezi */}
      <section className="pb-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-5 md:grid-cols-3">

            {/* Card 1: Ce include */}
            <div className="card">
              <h2 className="mb-4 font-heading text-base font-bold text-dark">
                {content.includeTitle}
              </h2>
              <ul className="space-y-2.5">
                {content.includeItems.slice(0, 4).map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-dark-300">
                    <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2: Cand ai nevoie */}
            <div className="card">
              <h2 className="mb-4 font-heading text-base font-bold text-dark">
                {content.whenNeedTitle}
              </h2>
              <ul className="space-y-2.5">
                {content.whenNeedItems.slice(0, 4).map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-dark-300">
                    <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3: Cum programezi — cu CTA */}
            <div className="card flex flex-col">
              <h2 className="mb-4 font-heading text-base font-bold text-dark">
                {content.processTitle}
              </h2>
              <ol className="space-y-2.5">
                {content.processSteps.slice(0, 4).map((step, i) => (
                  <li key={step} className="flex gap-2.5 text-sm text-dark-300">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <div className="mt-5 flex flex-col gap-2 pt-4 border-t border-slate-100">
                <a
                  href={phoneHref}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
                >
                  <Phone size={15} />
                  Suna acum — {phoneDisplay}
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-600"
                >
                  <MessageCircle size={15} />
                  {content.ctaLabel}
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. TRUST — compact, 3 puncte fixe */}
      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="mb-5 flex items-center gap-2.5">
            <ShieldCheck size={22} className="text-primary" />
            <h2 className="font-heading text-lg font-bold text-dark">{content.trustTitle}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {trustPoints.map((item) => (
              <div key={item} className="rounded-2xl bg-light-200 p-4">
                <p className="text-sm leading-relaxed text-dark-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ — primele 3 intrebari */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">FAQ</span>
          <h2 className="mt-1 mb-6 font-heading text-xl font-bold text-dark">
            Intrebari frecvente
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {content.faq.slice(0, 3).map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <h3 className="font-heading text-sm font-bold text-dark">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LINKURI INTERNE — discrete, la final */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dark-300">
            Ai nevoie si de:
          </p>
          <div className="flex flex-wrap gap-2">
            {content.relatedLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-light-200 px-4 py-1.5 text-sm font-semibold text-dark-300 transition hover:border-primary/40 hover:text-primary"
              >
                {item.label}
                <ChevronRight size={13} />
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
