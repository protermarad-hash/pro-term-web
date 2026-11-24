// Content + media configuration for the Vaillant pages (/vaillant and series pages).
// Copy rules: no savings percentages, COP, noise levels, temperature limits or
// performance promises; no "distribuitor/service autorizat" titles. Every
// technical value lives on the product pages, next to its official source.

export interface VideoAsset {
  /** Self-hosted or licensed CDN URL (MP4/H.264). */
  mp4: string;
  webm?: string;
  /** Optimised poster (also the reduced-motion / slow-connection fallback). */
  poster: string;
  /** WebVTT captions — mandatory when the film has voice-over. */
  captions?: string;
  durationSeconds: number;
  source: string;
}

/**
 * Hero film in two framings. Landscape (16:9) for desktop/tablet, portrait for
 * phones. `aiGenerated` films show AI_VIDEO_NOTICE: the outdoor unit in a
 * generated film must never be presented as a genuine Vaillant model.
 */
export interface HeroVideo {
  landscape: VideoAsset;
  portrait?: VideoAsset;
  aiGenerated: boolean;
}

export const AI_VIDEO_NOTICE = 'Film ilustrativ generat cu AI. Echipamentul din film nu reprezintă un model Vaillant.';

/** Portrait framing for narrow / portrait viewports, landscape otherwise. */
export function pickHeroVideo(video: HeroVideo, portraitViewport: boolean): VideoAsset {
  return portraitViewport && video.portrait ? video.portrait : video.landscape;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Official page the file was taken from (usage allowed by Vaillant, confirmed by the PRO TERM owner on 24.11.2026). */
  source: string;
}

const RO = 'https://www.vaillant.com.ro/produse';
const PRO_PAGE = `${RO}/arothermpro/`;
const PLUS_PAGE = `${RO}/arothermplus/`;
const SPLIT_PAGE = `${RO}/arotherm-split-plus/`;
const DIR = '/media/vaillant';

function image(file: string, alt: string, width: number, height: number, source: string): ImageAsset {
  return { src: `${DIR}/${file}`, alt, width, height, source };
}

/**
 * Official Vaillant material (public pages of vaillant.com.ro). Inventory with
 * sources: docs/vaillant/INVENTAR-MEDIA.md. Videos stay `null` until a licensed
 * film exists — the page then renders the poster image only.
 */
export const VAILLANT_MEDIA = {
  /**
   * Google Flow films (landscape 16:9 + portrait) — files to be supplied, then:
   * public/media/vaillant/video/hero-landscape.mp4 (+ poster .jpg),
   * public/media/vaillant/video/hero-portrait.mp4 (+ poster .jpg), aiGenerated: true.
   * Not published to PROD without approval.
   */
  heroVideo: null as HeroVideo | null,
  film: null as VideoAsset | null,
  vaillantLogo: image('vaillant-logo.svg', 'Vaillant', 136, 36, PRO_PAGE),
  vaillantLogoWhite: image('vaillant-logo-white.svg', 'Vaillant', 136, 36, PRO_PAGE),
  hero: image('hero-arotherm-plus.jpg', 'Pompă de căldură Vaillant aroTHERM plus în grădină, în lumina dimineții', 1750, 750, PLUS_PAGE),
  heritage: image('johann-vaillant.jpg', 'Johann Vaillant, fondatorul companiei, lângă o pompă de căldură aroTHERM', 1750, 750, PRO_PAGE),
  seriesPhotos: {
    'arotherm-pro': image('arotherm-pro.png', 'Unitate exterioară Vaillant aroTHERM pro', 1199, 900, PRO_PAGE),
    'arotherm-plus': image('arotherm-plus.png', 'Unitate exterioară Vaillant aroTHERM plus', 1199, 900, PLUS_PAGE),
    'arotherm-split-plus': image('arotherm-split-plus.png', 'Unitate exterioară Vaillant aroTHERM Split plus', 1019, 900, SPLIT_PAGE),
  } as Record<string, ImageAsset>,
  seriesScenes: {
    'arotherm-pro': image('arotherm-pro-exterior.jpg', 'Vaillant aroTHERM pro montată în exterior, lângă vegetație', 2500, 1667, PRO_PAGE),
    'arotherm-plus': image('arotherm-plus-gradina.jpg', 'Vaillant aroTHERM plus montată în grădina unei locuințe', 2500, 1667, PLUS_PAGE),
    'arotherm-split-plus': image('anotimp-vara.jpg', 'Familie care se relaxează acasă, într-o zi de vară', 608, 550, SPLIT_PAGE),
  } as Record<string, ImageAsset>,
  seasons: {
    iarna: image('anotimp-iarna.jpg', 'Pompă de căldură Vaillant acoperită de zăpadă, iarna', 608, 550, PRO_PAGE),
    primavara: image('anotimp-primavara.jpg', 'Femeie care se odihnește într-un hamac, în grădină', 608, 1140, SPLIT_PAGE),
    vara: image('anotimp-vara.jpg', 'Familie care se relaxează acasă, într-o zi de vară', 608, 550, SPLIT_PAGE),
    toamna: image('anotimp-toamna.jpg', 'Femeie care își îmbrățișează câinele, acasă', 608, 550, PLUS_PAGE),
  } as Record<string, ImageAsset>,
  pillars: {
    control: image('control-myvaillant.jpg', 'Aplicația myVAILLANT pe un telefon', 1920, 1581, PRO_PAGE),
    'apa-calda': image('apa-calda-camera-tehnica.jpg', 'Cameră tehnică cu boiler, într-o locuință', 1750, 750, PLUS_PAGE),
  } as Record<string, ImageAsset>,
};

export const EXPERIENCE_HERO = {
  eyebrow: 'Pompe de căldură Vaillant, prin PRO TERM',
  headline: ['Confortul se simte.', 'Tehnologia îl face posibil.'],
  subheadline:
    'Pompe de căldură Vaillant pentru încălzire, răcire și apă caldă, alese, configurate și instalate corect de echipa PRO TERM.',
  primaryCta: 'Solicită ofertă',
  secondaryCta: 'Descoperă gama',
  attribution: 'Pagină realizată de PRO TERM. Vaillant este o marcă înregistrată a proprietarului său; imagini și documente: vaillant.com.ro.',
} as const;

export const STRATEGIC_MESSAGE =
  'PRO TERM transformă tehnologia Vaillant într-o soluție corect aleasă, corect instalată și corect pusă în funcțiune.';

export const WHY_VAILLANT = {
  title: 'De ce Vaillant?',
  intro: 'O marcă germană cu tradiție, cu tehnologie pentru casa întreagă și documentație publică pentru fiecare model.',
  benefits: [
    { id: 'traditie', title: 'Tradiție din 1874', text: 'Compania a fost fondată de Johann Vaillant în 1874 și are sediul în Remscheid, Germania.' },
    { id: 'r290', title: 'Agent frigorific natural R290', text: 'aroTHERM pro și aroTHERM plus folosesc agent frigorific R290, cu GWP 0,02 conform documentației Vaillant.' },
    { id: 'sistem', title: 'Încălzire, răcire și apă caldă', text: 'Un sistem pentru toate trei, cu componentele potrivite, stabilite la ofertare.' },
    { id: 'control', title: 'Control din aplicație', text: 'Monitorizare și control din aplicația myVAILLANT, cu automatizarea și accesoriile compatibile.' },
    { id: 'documentatie', title: 'Documentație publică în română', text: 'Broșuri, fișe tehnice ErP și instrucțiuni oficiale, disponibile pentru fiecare serie.' },
    { id: 'reparatii', title: 'Rețea de service Vaillant', text: 'Reparațiile sunt realizate prin rețeaua de parteneri service autorizați Vaillant.' },
  ],
} as const;

export const SEASONS = [
  { id: 'iarna', name: 'Iarnă', line: 'Casa caldă, chiar și în diminețile reci.' },
  { id: 'primavara', name: 'Primăvară', line: 'Trecerea lină între zile reci și zile blânde.' },
  { id: 'vara', name: 'Vară', line: 'Răcoare în casă, acolo unde configurația o permite.' },
  { id: 'toamna', name: 'Toamnă', line: 'Apă caldă și confort pregătite pentru serile lungi.' },
] as const;

export const COMFORT_SECTION = {
  title: 'Acasă, fiecare anotimp trebuie să se simtă bine.',
  text:
    'Un sistem bine ales nu atrage atenția. Se simte în dimineața în care casa e caldă, în după-amiaza de vară în care e plăcut înăuntru și în seara în care apa caldă e pregătită când ai nevoie de ea.',
} as const;

export interface SeriesCopy {
  tagline: string;
  benefit: string;
  description: string;
  highlights: readonly string[];
  configuration: readonly string[];
}

export const SERIES_COPY: Record<string, SeriesCopy> = {
  'arotherm-pro': {
    tagline: 'Monobloc, pentru case noi și renovări.',
    benefit: 'Agent frigorific R290 (GWP 0,02)',
    description: 'Pompă de căldură aer-apă monobloc, cu variante de alimentare 230 V și 400 V.',
    highlights: [
      'Monobloc: circuitul frigorific rămâne în unitatea exterioară',
      'Variante cu alimentare 230 V (monofazat) și 400 V (trifazat)',
      'Agent frigorific R290 (GWP 0,02)',
    ],
    configuration: [
      'Prețul publicat include unitatea exterioară.',
      'Automatizarea, unitatea interioară sau modulul hidraulic, boilerul și accesoriile se aleg la ofertare.',
      'Răcirea se oferă numai în configurațiile compatibile.',
    ],
  },
  'arotherm-plus': {
    tagline: 'Monobloc, publicată împreună cu automatizarea VWZ AI /7.',
    benefit: 'Agent frigorific R290 (GWP 0,02)',
    description: 'Pompă de căldură aer-apă monobloc, prezentată împreună cu automatizarea VWZ AI /7.',
    highlights: [
      'Pachet publicat: unitate exterioară + automatizare VWZ AI /7',
      'Modelele 55 și 75: 230 V; modelele 105 și 125: 400 V',
      'Agent frigorific R290 (GWP 0,02)',
    ],
    configuration: [
      'Prețul publicat include unitatea exterioară și automatizarea VWZ AI /7.',
      'Unitatea interioară sau modulul cu boiler, boilerul și accesoriile se aleg la ofertare.',
      'Răcirea se oferă numai în configurațiile compatibile.',
    ],
  },
  'arotherm-split-plus': {
    tagline: 'Split, cu unitate interioară legată prin circuit frigorific.',
    benefit: 'Unitate exterioară și unitate interioară legate prin circuit frigorific',
    description: 'Pompă de căldură aer-apă split. Modelele se ofertează la cerere.',
    highlights: [
      'Sistem split: unitate exterioară + unitate interioară',
      'Agent frigorific R32 (GWP 675)',
      'Alimentare 230 V',
    ],
    configuration: [
      'Modelele și configurațiile se ofertează la cerere.',
      'Componentele interioare și accesoriile se aleg după analiza instalației.',
    ],
  },
};

export const TECH_PILLARS = [
  {
    id: 'incalzire',
    title: 'Încălzire',
    text: 'Pompa de căldură aer-apă încălzește locuința prin radiatoare sau încălzire în pardoseală, după verificarea instalației existente.',
  },
  {
    id: 'racire',
    title: 'Răcire',
    text: 'Funcția de răcire se oferă numai în configurațiile compatibile, stabilite și verificate la ofertare.',
  },
  {
    id: 'apa-calda',
    title: 'Apă caldă menajeră',
    text: 'Prepararea apei calde necesită componentele adecvate, de exemplu un boiler sau un modul cu boiler integrat, incluse în oferta de sistem.',
  },
  {
    id: 'control',
    title: 'Control inteligent',
    text: 'Posibilitățile de control și monitorizare depind de automatizarea și accesoriile compatibile din configurația aleasă.',
  },
  {
    id: 'eficienta',
    title: 'Eficiență și confort acustic',
    text: 'Clasa energetică și datele acustice ale fiecărui model sunt cele din documentația oficială Vaillant, afișată pe pagina produsului.',
  },
] as const;

export const PROCESS_SECTION = {
  title: 'Nu vindem doar echipamentul. Livrăm sistemul corect.',
  intro:
    'O pompă de căldură performantă funcționează bine doar într-un sistem ales și instalat corect. Te însoțim de la prima discuție până la punerea în funcțiune.',
  steps: [
    { id: 'consultanta', name: 'Consultanță', text: 'Discutăm despre locuință, instalația existentă și nevoile familiei.' },
    { id: 'dimensionare', name: 'Alegerea puterii', text: 'Puterea se alege după calculul necesarului termic, nu după suprafață.' },
    { id: 'configuratie', name: 'Soluție completă', text: 'Alegem componentele compatibile: unitate interioară, boiler, automatizare, accesorii.' },
    { id: 'montaj', name: 'Montaj', text: 'Instalare realizată de echipa PRO TERM în județele Arad și Timiș; pentru alte zone, la cerere.' },
    { id: 'pif', name: 'PIF', text: 'Punerea în funcțiune se coordonează conform cerințelor producătorului.' },
    { id: 'suport', name: 'Suport', text: 'Rămânem disponibili pentru întrebări. Reparațiile se fac prin rețeaua de parteneri service autorizați Vaillant.' },
  ],
} as const;

export const CONVERSION_SECTION = {
  title: 'Casa ta merită un sistem ales corect.',
  subtitle: 'Spune-ne câteva lucruri despre locuința ta. Echipa PRO TERM te ajută să identifici o soluție potrivită.',
} as const;

export const FILM_SECTION = {
  title: 'Un an întreg de confort, în 30 de secunde',
  playLabel: 'Pornește filmul',
} as const;
