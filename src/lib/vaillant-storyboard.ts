// Storyboards for the two /vaillant films. Source of truth for production
// briefs (docs/vaillant/STORYBOARD-VIDEO.md) and for the preview placeholder.
// No film exists yet: VIDEO FINAL = BLOCKED until licensed footage is produced.

export interface StoryboardShot {
  time: string;
  scene: string;
  onScreenText?: string;
}

export const HERO_STORYBOARD: readonly StoryboardShot[] = [
  { time: '0–2 s', scene: 'Dimineață de iarnă: lumină caldă în bucătărie, aburul unei cești de ceai pe pervaz.' },
  { time: '2–4 s', scene: 'Trecere lentă spre o după-amiază de vară: perdea mișcată ușor, interior luminos.' },
  { time: '4–6 s', scene: 'Exterior: unitatea Vaillant reală, model din oferta România, montată curat lângă casă.' },
  { time: '6–9 s', scene: 'Revenire în interior: familie în living, seară de toamnă. Cadru final stabil pentru buclă.' },
];

export const FILM_STORYBOARD: readonly StoryboardShot[] = [
  { time: '0–5 s', scene: 'Iarnă. Copiii intră din zăpadă, casa e caldă. Fără text.' },
  { time: '5–10 s', scene: 'Primăvară și vară. Ferestre deschise, apoi o zi caniculară în care interiorul rămâne plăcut.', onScreenText: 'Confortul se simte.' },
  { time: '10–16 s', scene: 'Tehnologia Vaillant: detalii reale ale unității exterioare și ale automatizării, fără grafice de performanță.', onScreenText: 'Tehnologia îl face posibil.' },
  { time: '16–24 s', scene: 'Echipa PRO TERM: vizită la client, măsurători, montaj ordonat, punere în funcțiune, explicații pentru familie.', onScreenText: 'Consultanță · Dimensionare · Montaj' },
  { time: '24–30 s', scene: 'Toamnă, seara. Casa luminată din exterior. Logo PRO TERM și logo Vaillant (cu acordul Vaillant).', onScreenText: 'Solicită oferta pentru un sistem ales corect.' },
];
