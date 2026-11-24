# Storyboard — filme PRO TERM × Vaillant

Concept: **„Confortul se simte. Tehnologia îl face posibil.”**
Campanie originală PRO TERM. Nu reproduce reclame existente (Vaillant sau alte mărci).

**VIDEO FINAL = BLOCKED.** Niciun film nu a fost produs. Documentul de față este brief-ul de producție.
Sursa cadrelor în cod: `src/lib/vaillant-storyboard.ts`.

## Video A — Hero (7–10 s, buclă, fără sunet)

| Timp | Cadru | Note de producție |
|---|---|---|
| 0–2 s | Dimineață de iarnă: lumină caldă în bucătărie, aburul unei cești de ceai pe pervaz. | Ritm lent, fără oameni în prim-plan. |
| 2–4 s | Trecere lentă spre o după-amiază de vară: perdea mișcată ușor, interior luminos. | Tranziție prin lumină, nu prin efect grafic. |
| 4–6 s | Exterior: unitatea Vaillant reală, model din oferta România, montată curat lângă casă. | Produs real, montaj corect, fără logo-uri adăugate în post. |
| 6–9 s | Revenire în interior: familie în living, seară de toamnă. Cadru final stabil pentru buclă. | Ultimul cadru se leagă vizual de primul. |

Cerințe tehnice: 16:9 și 9:16 (variantă mobil), MP4 H.264 ≤ 2,5 MB, poster AVIF/WebP ≤ 150 KB.
Pe site: autoplay doar fără sunet, buton de pauză, poster static pentru `prefers-reduced-motion`,
Save-Data și conexiuni 2G (implementat în `HeroBackdrop`).

## Video B — Film principal (~30 s, redare la click)

| Timp | Cadru | Text pe ecran |
|---|---|---|
| 0–5 s | Iarnă. Copiii intră din zăpadă, casa e caldă. | — |
| 5–10 s | Primăvară și vară. Ferestre deschise, apoi o zi caniculară în care interiorul rămâne plăcut. | „Confortul se simte.” |
| 10–16 s | Tehnologia Vaillant: detalii reale ale unității exterioare și ale automatizării, fără grafice de performanță. | „Tehnologia îl face posibil.” |
| 16–24 s | Echipa PRO TERM: vizită la client, măsurători, montaj ordonat, punere în funcțiune, explicații pentru familie. | „Consultanță · Dimensionare · Montaj” |
| 24–30 s | Toamnă, seara. Casa luminată din exterior. Logo PRO TERM și logo Vaillant (cu acordul Vaillant). | „Solicită oferta pentru un sistem ales corect.” |

Reguli de conținut:
- fără procente de economie, COP, niveluri de zgomot, temperaturi sau promisiuni de performanță;
- scenele de răcire apar doar dacă oferta include configurații compatibile;
- fără statut de service autorizat, certificări sau garanții neconfirmate;
- actori și locații cu acord scris (model release / property release);
- muzică licențiată pentru web;
- dacă există voce: subtitrare WebVTT în română (`captions` în `VAILLANT_MEDIA.film`).

Pe site: filmul nu se descarcă până la click (`FilmPlayer`) și nu concurează cu hero-ul.
În producție, secțiunea filmului apare numai după ce filmul există.
