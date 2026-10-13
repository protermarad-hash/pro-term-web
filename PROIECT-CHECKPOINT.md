# PRO TERM — Project Checkpoint

## 1. Scopul proiectului

- Repository: `C:\Users\frigo\develop\pro-term-web`
- Producție: https://pro-term.ro
- Branch canonic: `main`
- Proiectul urmărește: coordonarea, redesignul, conținutul, SEO, conversia și promovarea site-ului PRO TERM.

**Direcția vizuală aprobată:**
- modern
- curat
- tehnic
- aerisit
- profesional
- orientat spre conversie
- potrivit B2C și B2B
- mobile friendly
- fără aspect generic de template
- fără animații excesive sau bloat

## 2. Reguli permanente de lucru

- Nu lucrăm direct pe `main`.
- Fiecare etapă are branch separat.
- Înainte de orice etapă verificăm HEAD/main/origin-main/working tree/staging.
- Implementarea se face în etape mici.
- Validăm înainte de commit.
- Commit numai după aprobare.
- Push + PR numai după aprobare.
- Merge numai după aprobare.
- Deploy numai după aprobare separată.
- Nu facem force push.
- Nu facem reset/rebase/clean/stash pentru a ascunde probleme fără aprobare.
- Nu ștergem branch-uri fără aprobare.
- Nu modificăm Supabase/Vercel/auth/RLS/migrations/orders/checkout/NETOPIA/SmartBill/env fără aprobare.
- Nu instalăm/actualizăm dependențe fără aprobare.
- Nu presupunem că o operație a reușit fără dovadă.
- Validarea reală în browser este obligatorie pentru schimbări vizuale.
- Build și TypeScript trebuie verificate când etapa o cere.
- `git diff --check` înainte de commit.

GitHub CLI (`gh`) este instalat și poate fi folosit pentru automatizarea PR-urilor și verificărilor. Merge-ul și deploy-ul rămân însă operații care necesită aprobare explicită.

## 3. Reguli de conținut și credibilitate

**Nu inventăm:**
- ani de experiență
- număr de clienți
- certificări
- parteneriate
- garanții
- statistici
- rezultate comerciale
- specificații tehnice
- prețuri
- discounturi
- arii geografice
- recenzii

Informația existentă în cod **NU** este automat considerată adevărată.

Numele clienților/referințelor nu se publică fără aprobare explicită.

Nu folosi public fără aprobare separată:
- Adevărul
- Lidl
- Kaufland
- Altex

## 4. Adevăruri de business confirmate

- PRO TERM activează în HVAC din 1999.
- Conducerea actuală este implicată direct în PRO TERM din 2008, atât tehnic cât și administrativ.
- Nu spunem că întreaga echipă are 25+ ani experiență.

**Aria comercială:**
- vânzare/livrare echipamente HVAC: la nivel național, în România;
- montaj uzual, service, igienizare, intervenții: în principal Arad și zona apropiată;
- proiecte comerciale și industriale mari: la nivel național.

**PRO TERM poate coordona și livra proiecte HVAC complete:**
- proiectare prin proiectanți colaboratori;
- furnizare echipamente și materiale;
- execuție;
- punere în funcțiune;
- predare finală/la cheie.

PRO TERM poate executa și după proiectul tehnic furnizat de beneficiar.

Pentru specializările care nu sunt acoperite intern se folosesc colaboratori specializați, transparent și coordonat.

## 5. Poziționarea principală

PRO TERM nu trebuie prezentată doar ca firmă de aer condiționat.

Trebuie să comunice:
- climatizare
- încălzire
- ventilație
- echipamente
- service
- proiecte HVAC comerciale și industriale
- soluții complete

## 6. Diferențiere SEO importantă

### `/servicii/climatizare-comerciala-industriala-romania`

**Rol:** „Ce soluție și ce sistem de climatizare se potrivesc spațiului meu?"

**Accent:**
- split/multisplit comercial
- VRV/VRF
- rooftop
- chiller
- CTA/ventilație
- alegerea și dimensionarea soluției
- aplicații
- montaj
- exploatare
- service și mentenanță

### `/servicii/proiecte-hvac-romania`

**Rol:** „Cine îmi coordonează și execută proiectul HVAC complet?"

**Accent:**
- proiectare
- coordonare
- furnizare
- execuție
- punere în funcțiune
- colaboratori
- proiecte mari
- predare
- nivel național

Cele două pagini **NU** trebuie să concureze pentru aceeași intenție.

## 7. Proiecte reale confirmate

### Sediu de presă, Arad

Proiect complet:
- ventilație cu tubulatură
- apă răcită de la chiller
- două centrale pe gaz de 50 kW
- punct termic
- pompe
- distribuții/colectoare
- materiale și echipamente furnizate
- proiectare prin colaboratori
- execuție completă

Nu menționa public numele Adevărul fără aprobare.

### Casa Tineretului, Vladimirescu

Proiect complet HVAC + sanitar:
- CTA
- apă caldă/rece
- chiller
- centrale pe gaz
- încălzire cu radiatoare
- instalații sanitare pentru băi și bucătării
- furnizare materiale/echipamente
- proiectare prin colaboratori
- execuție completă

**Proiecte suplimentare cunoscute, dar neaprobate pentru publicarea numelor:**
- proiect VRV în Craiova
- alt proiect comercial în Craiova
- proiect VRV + ventilație în Cluj-Napoca

Nu include brandurile client în texte publice fără aprobare.

## 8. Etape finalizate

### Etapa 1 — Homepage Header + Hero

- Feature commit: `bb70c211ed507f53d0835cebe1be83d2d27e0944`
- Merge checkpoint: `a35cd8aec3abe084605b72cc223dfa40b25c37d4`

**Conținut principal:**
- Header desktop/mobile
- navigație
- CTA ofertă
- Hero repoziționat pe soluții HVAC complete
- link Proiecte HVAC
- mobile accessibility/focus
- responsive validat

### Etapa 2 — Despre noi + Proiecte HVAC

- Feature commit: `f2aa833f95d4f3d0273434a3a67fe7b04f66895a`
- Merge checkpoint: `5719e05cbd46354ef041621b4af51b922c2c7cc3`

**Conținut principal:**
- Despre noi rescris
- activitate HVAC din 1999
- implicarea conducerii actuale din 2008
- delimitare național/local/proiecte mari
- proces HVAC complet
- colaboratori specializați
- două studii de caz anonimizate
- eliminarea afirmațiilor neverificate

### Etapa 3 — Climatizare comercială și industrială

- Feature commit: `3f272efa87b7ceefac9576064c01513875947400`
- PR: #9
- Merge checkpoint: `33b99a7495b148563f981ff1cc0a6bd4e5c409f3`

**Conținut principal:**
- diferențiere SEO față de Proiecte HVAC
- H1: „Soluții de climatizare pentru spații comerciale și industriale în România"
- split/multisplit
- VRV/VRF
- rooftop
- chiller
- CTA/ventilație
- alegerea soluției
- aria locală pentru service
- CTA către Proiecte HVAC
- FAQ diferențiat
- cardul din `/servicii` actualizat

### Etapa 4 — Contact Form fix

- Branch: `feature/fix-contact-form`
- Feature commit: `211e3e178eef0d735ad88ac1a1f90fb4cacb69dd`
- PR: #11
- Merge checkpoint: `77ff1e3a5fc12eb3ddc996361569e5d5106dc6af`

**Scop și conținut principal:**

- formularul Contact nu mai afișează succes fals
- POST real către `/api/contact`
- validare server-side (nume, telefon, email, lungimi câmpuri)
- honeypot anti-spam
- escaping HTML pentru datele introduse de utilizator
- `sendContactRequest` verifică `result.error` de la Resend și aruncă eroare dacă trimiterea eșuează
- UI de succes afișat doar după răspuns HTTP ok
- valorile formularului se păstrează la eroare (formularul nu se golește)

**Validare reală:**

- testat pe Vercel Preview
- formularul a afișat succes
- emailul de test a fost primit efectiv în inbox
- cauza inițială a erorii: `RESEND_API_KEY` invalidă
- cheia Resend a fost rotită (cheie nouă activă în Production și Preview)
- domain sending pentru pro-term.ro era valid (DKIM/SPF confirmate)
- receiving MX avea un conflict separat, neafectat de această etapă — **NU** a fost modificat

**Risc tehnic separat rămas (nerezolvat în PR #11, în afara scope-ului aprobat):**

- `sendOrderConfirmationToClient` și `sendOrderNotificationToAdmin` folosesc aceeași `RESEND_API_KEY`
- aceste funcții nu verifică `result.error`
- o eroare Resend la trimiterea emailurilor de comandă poate rămâne complet silențioasă
- order flow **NU** a fost modificat în PR #11 (vezi §11.A — risc reconfirmat, încă deschis)

### Etapa 5 — Homepage sub Hero — repoziționare și redesign

- Branch: `feature/redesign-homepage-content`
- Feature commit: `1bb1b9a6fc4735ede7adfa44e24ff1107b4e2441`
- PR: #12
- Merge checkpoint: `a46c8ac08f0a9a40c92282b7e371a7fad9e4761b`

**Fișiere integrate:**
- `src/app/page.tsx`
- `src/components/About.tsx`
- `src/components/Footer.tsx`
- `src/components/MideaBanner.tsx`
- `src/components/PartnerBanners.tsx`
- `src/components/ProiecteRealizate.tsx`
- `src/components/Services.tsx`

**Conținut principal:**

- homepage repoziționat pentru oferta HVAC completă (nu doar aer condiționat)
- `Services` redesenat ca „Ce oferim” cu 4 direcții clare:
  1. Echipamente HVAC
  2. Montaj și service
  3. Climatizare comercială și industrială
  4. Proiecte HVAC complete
- `About` + `WhyUs` consolidate într-o singură secțiune („De ce PRO TERM”)
- `WhyUs.tsx` rămâne în repo, dar nefolosit (neșters intenționat)
- claims neconfirmate eliminate de pe homepage: „25+” ani, „echipă de 6 specialiști”, ISO 9001, F-Gas/AGFR, claims de dealer/partener neconfirmate (MideaBanner, PartnerBanners), superlative de brand („cel mai mare producător mondial”, „lider mondial”), garanții neconfirmate
- proiectele fabricate/neconfirmate eliminate din `ProiecteRealizate.tsx`; homepage folosește exclusiv cele două proiecte reale confirmate:
  - Sediu de presă, Arad
  - Casa Tineretului, Vladimirescu
- numele „Adevărul” **NU** este publicat
- title homepage: „PRO TERM | Climatizare, Încălzire și Proiecte HVAC”
- internal linking confirmat către: `/produse`, `/servicii`, `/servicii/climatizare-comerciala-industriala-romania`, `/servicii/proiecte-hvac-romania`, `/despre`, `/#contact`
- overflow-ul preexistent de la aproximativ 768px a fost eliminat (odată cu badge-ul „25+” poziționat absolut)
- Preview Vercel (proiectul `pro-term-web`) a fost aprobat manual vizual înainte de merge
- Header, Hero și logica formularului Contact **NU** au fost modificate în această etapă

### Etapa 6 — Conformitate garanție legală 2026 (GARAN, ANPC/SAL, ODR)

- Branch: `feature/legal-guarantee-compliance-2026`
- Feature commits principale: `ae21dac` (eticheta GARAN + notificare armonizată), `11db6c2` (blocare checkout până la verificare GARAN), `0ebc9df` (eliminare link-uri ODR desființate), `505c7d5` (roadmap conformitate), `00bf559` (pictogramă oficială SAL pe homepage), `03f5f1b` (aliniere versiune migrație cu producția)
- PR: #13
- Merge checkpoint: `45bc58d50371bb30c08cb22b589a5c9d1537a9be`

**Conținut principal:**

- eticheta GARAN (Reg. (UE) 2025/1960) + notificarea armonizată UE privind garanția legală — pagină produs, checkout, email confirmare comandă
- pagină nouă `/garantii`
- verificare GARAN fail-closed **în UI** (`CheckoutClient.tsx` + `useGuaranteeLabelCheck`): stare loading/error blochează butonul de comandă, `handleSubmit` verifică explicit statusul înainte de POST
- eliminare completă a referințelor ODR/SOL (platforma UE desființată la 20.07.2025, Reg. (UE) 2024/3228) din footer, informații legale, termeni și condiții — linkuri ANPC și SAL păstrate, inclusiv adresarea instanțelor competente
- pictograma oficială SAL ANPC adăugată pe homepage (`ConsumerProtectionNotice`), 250×50px, verificată byte-identic cu fișierul oficial ANPC
- migrație Supabase: `supabase/migrations/20261004115751_product_consumer_guarantee_info.sql` (coloane noi pe `products`, additivă, backward-compatible, cu constrângeri CHECK)
- 60 de teste unitare noi + suită e2e dedicată (`tests/e2e/run-e2e.mjs`, DevTools Protocol, fără npm nou)

**Gap identificat ulterior, printr-un audit read-only separat (2026-10-05):** verificarea GARAN era fail-closed doar în UI; `/api/orders/route.ts` nu conținea nicio verificare GARAN server-side — un `POST` direct către acest endpoint, ocolind complet checkout-ul, crea comanda fără nicio validare de conformitate. Corecție documentată în §10 „Lucru în curs”.

### Etapa 7 — Funcție de retragere online din contract

- Branch: `feature/legal-online-withdrawal-2026` + `chore/legal-withdrawal-hardening`
- Feature commits principale: `380f6c4` (funcție de retragere în doi pași), `d2379d4` (aliniere versiune migrație cu producția), `48b9afd` (hardening server-only)
- PR: #18, #19
- Merge checkpoint: `225402f557ba89d10173627ae68906a6b9b425ab`

**Conținut principal:**

- funcție online de retragere din contract (OUG 34/2014 art. 11^1), permanent accesibilă din footer-ul global (`/formular-retragere`)
- flux în doi pași: completare date (validare locală) → confirmare explicită distinctă (`Confirmă retragerea`, apelează efectiv `/api/withdrawal`)
- confirmare pe suport durabil prin email, cu referință, declarație și marcă temporală
- migrații Supabase: `supabase/migrations/20261004123545_online_withdrawal_phase1.sql`, `supabase/migrations/20261004123920_online_withdrawal_server_only.sql`

**Notă din audit:** testul unitar `tests/withdrawal.test.tsx` („uses a distinct second confirmation function”) conținea o asertiune eronată — căuta text literal inexistent în sursă, în loc să verifice comportamentul real. Corectat în etapa descrisă la §10, fără nicio schimbare funcțională a fluxului de retragere.

## 9. Checkpoint canonic curent

**Checkpoint canonic curent:**

```
225402f557ba89d10173627ae68906a6b9b425ab
```

După merge PR #19 (ultimul merge-uit în `main`, confirmat la sincronizarea din 2026-10-05):

- HEAD = main = origin/main = `225402f557ba89d10173627ae68906a6b9b425ab`
- working tree: curat (la momentul sincronizării)
- staging: gol
- deploy după aceste etape: **NU** a fost făcut intenționat

## 10. Lucru în curs — NEINTEGRAT (în review, fără aprobare de merge)

**Corecție GARAN fail-closed server-side**

- Branch: `fix/garan-server-side-fail-closed` (creat din `main` = `225402f557ba89d10173627ae68906a6b9b425ab`)
- Stare: **NEMERGE-UIT, NEPUSH-UIT** — în așteptare de review/aprobare explicită
- **NU** a fost făcut deploy. **NU** a fost executată nicio migrație Supabase. **NU** a fost modificată producția.

**Problema identificată** (vezi nota din Etapa 6): mecanismul GARAN fail-closed era complet doar la nivel de UI. `/api/orders/route.ts` nu verifica nimic legat de GARAN — un `POST` direct, ocolind checkout-ul, crea comanda fără nicio validare.

**Corecție implementată (neintegrată încă):**

- `src/lib/consumer-guarantee-server.ts`: funcție nouă `assertOrderGuaranteeVerified(supabase, ids)` — reutilizează `fetchProductGuaranteeInfo(..., {strict:true})` și `getDurabilityLabel` (ambele deja existente și testate din Etapa 6); aruncă eroare dacă verificarea DB eșuează SAU dacă un produs marcat eligibil are date de etichetă incomplete/invalide. Nicio regulă de business nouă sau divergentă.
- `src/app/api/orders/route.ts`: validare minimă a structurii `items` (fiecare element necesită un `id` string valid) + apel obligatoriu la `assertOrderGuaranteeVerified` înainte de orice inserare în `orders`; eroare → răspuns 503 cu mesajul deja folosit în checkout (`GUARANTEE_CHECK_ERROR_MESSAGE`), fără detalii interne (Supabase, stack traces) expuse clientului.

**Teste adăugate:** `tests/orders-guarantee.test.ts` (7 teste, folosind `node:test` module mocking — `--experimental-test-module-mocks`, adăugat în scriptul `test` din `package.json`) — apelează handler-ul real `POST` din `/api/orders` cu un client Supabase fals controlat. Acoperă: produs valid (comandă continuă), eroare DB la verificare (comandă refuzată), bypass direct API fără a trece prin checkout (comandă refuzată), date GARAN incomplete pentru produs eligibil (comandă refuzată), produs fără necesitate de etichetă (comandă continuă), payload manipulat fără `id` (refuzat înainte de verificarea GARAN), și migrație neaplicată (comportament identic cu endpoint-ul de etichete existent — niciun produs nu poate fi eligibil, comanda continuă).

**Test corectat:** `tests/withdrawal.test.tsx` — asertiunea verifică acum wiring-ul real (funcții handler distincte pentru pasul de intrare vs. pasul de confirmare, iar funcția de confirmare este cea care face efectiv `fetch('/api/withdrawal')`), nu prezența unui text literal. Verificat manual că testul detectează o regresie reală (mutație temporară + revert).

**Stare migrație Supabase:** neconfirmată direct în această etapă (nicio interogare nouă executată). Indiciile din Etapa 6 (redenumirea `03f5f1b` + interogarea read-only datată 04.10.2026 din `docs/legal/PRODUCTS_GUARANTEE_DATA_TODO.md`) sugerează că migrația `20261004115751_product_consumer_guarantee_info.sql` e deja aplicată în producție, dar asta rămâne neconfirmat direct. Corecția server-side din această etapă **nu necesită o migrație nouă** — folosește exclusiv schema deja definită de migrația existentă.

**Verificări locale:** 79/79 teste unitare verzi (72 preexistente − 1 fals-negativ corectat + 7 noi + 1 corectat), TypeScript curat, lint curat (doar 2 warning-uri preexistente, neafectate de această etapă), build reușit.

## 11. Riscuri tehnice și task-uri deschise

Nu sunt blocante pentru etapele deja finalizate, dar rămân de rezolvat separat.

### A. Order email reliability (reconfirmat 2026-10-05)

- `sendOrderConfirmationToClient` și `sendOrderNotificationToAdmin` (`src/lib/email.ts`) tot nu verifică `result.error` de la Resend.
- O eroare API la trimiterea emailurilor de comandă poate rămâne complet silențioasă (clientul/adminul crede că emailul a plecat).
- Corecție minimă recomandată (neimplementată, scope separat): după `const result = await resend.emails.send(...)`, adaugă `if (result.error) throw new Error(...)` — exact pattern-ul deja folosit de `sendContactRequest` în același fișier.
- Necesită etapă dedicată, cu aprobare explicită.

### B. Global UX

- Cookie banner-ul mobil rămâne intruziv — acoperă conținut/CTA-uri pe ecrane mici.
- Necesită verificare a conflictului vizual dintre cookie banner și butonul WhatsApp.
- `WhyUs.tsx` rămâne nefolosit în repo — decizie de păstrare/ștergere necesară.
- Posibilă problemă preexistentă de asset/logo Gree în `PartnerBanners` — necesită verificare separată.
- `MideaBanner` + `BannerSlider` rămân apropiate/redundante vizual — neconsiderat blocant.

### C. Tracking / marketing (verificat 2026-10-05, read-only)

- Zero cod/integrare Google Ads sau Supermetrics în repository — niciun risc de scriere/cheltuială automată, pentru că nu există cod care ar putea face asta.
- GA4 (`G-58E9WQ01JX`) este singura integrare de tracking prezentă, gated corect de consimțământul din `CookieConsent.tsx`.
- Niciun eveniment de conversie (GA4 sau Ads) legat de comenzi/formular de contact — necesar înainte de repornirea oricărei campanii.
- Campania „Montaj AC Arad” rămâne PAUSED — neschimbată, nicio acțiune externă efectuată.

## 12. Ordinea de lucru pentru etapele următoare

Plan curent — poate fi ajustat dacă apar informații noi.

1. **Review + merge corecție GARAN server-side** (`fix/garan-server-side-fail-closed`) — doar după aprobare explicită separată.
2. **Restul paginilor de servicii**
   - audit
   - diferențiere SEO
   - eliminare duplicate
   - conversie

3. **Products / Shop**
   - structură
   - UX
   - categorii
   - conversie
   - SEO produse

4. **Portofoliu / proiecte reale**
   - pe măsură ce există informații și permisiuni
   - fără publicarea numelor/logourilor/fotografiilor fără aprobare

5. **UX global**
   - cookie banner pe mobil
   - WhatsApp
   - overflow-uri preexistente
   - consistență responsive

6. **SEO tehnic și on-page global**
   - metadata
   - internal linking
   - cannibalization
   - schema
   - indexare
   - fără inventarea volumelor sau rezultatelor

7. **Promovare**
   - numai după ce fundația site-ului este suficient de stabilă
   - campaniile plătite necesită aprobare explicită înainte de lansare
   - tracking de conversii (GA4/Ads) trebuie pregătit înainte de repornirea campaniilor (§11.C)

8. **Deploy**
   - numai după stabilirea unui checkpoint aprobat
   - nu automat doar pentru că un PR a fost merge-uit

## 13. Workflow standard pentru fiecare etapă

1. verificare Git/checkpoint
2. audit read-only
3. stabilire obiectiv și scope
4. branch separat
5. implementare
6. validare tehnică
7. validare vizuală reală
8. review editorial/SEO
9. commit după aprobare
10. push + PR după aprobare
11. checks
12. merge după aprobare
13. verificare post-merge
14. fast-forward local main
15. stabilire nou checkpoint canonic
16. actualizare `PROIECT-CHECKPOINT.md`
17. deploy doar dacă este aprobat separat

## 14. Regula de actualizare a acestui fișier

La sfârșitul fiecărei etape merge-uite:

- actualizează checkpoint-ul canonic;
- adaugă etapa finalizată;
- actualizează „ordinea următoare" dacă este necesar;
- nu rescrie istoricul corect;
- nu elimina decizii aprobate fără motiv documentat.

Lucrul neintegrat (branch-uri în review, nemerge-uite) se documentează separat, la §10, și **nu** se trece la „Etape finalizate” până la merge efectiv.

Documentul trebuie să rămână sursa principală de continuitate operațională.
