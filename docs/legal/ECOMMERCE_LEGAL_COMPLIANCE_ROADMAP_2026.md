# Roadmap conformare e-commerce PRO TERM — România & UE (2026)

Ultima actualizare: 04.10.2026

Scop: listă versionată a obligațiilor juridice și tehnice care trebuie verificate/implementate pentru magazinul online PRO TERM. Acest document completează `CONSUMER_GUARANTEE_COMPLIANCE_2026.md` și nu înlocuiește consultanța juridică.

## Prioritate P0 — obligatoriu înainte de producție

### LEGAL-2 — Funcția online de retragere din contract
Bază de verificat: OUG 34/2014, astfel cum a fost modificată prin OUG 18/2026, inclusiv art. 11^1 și dispozițiile aplicabile din 19.06.2026.

De implementat:
- funcție permanent accesibilă în perioada legală de retragere;
- acțiune clară de tip „Retrageți-vă din contract aici”;
- colectarea datelor minime necesare identificării consumatorului și comenzii;
- pas separat de confirmare de tip „Confirmați retragerea”;
- înregistrarea datei și orei;
- confirmare fără întârziere pe suport durabil;
- trasabilitate în backend/admin;
- protecție împotriva retragerilor duplicate și audit log;
- teste E2E pentru flux complet;
- verificare distinctă pentru produse/servicii/excepțiile de la dreptul de retragere.

Criteriu de acceptare:
un consumator care a comandat online poate exercita complet dreptul de retragere online, fără apel telefonic și fără document extern obligatoriu.

### LEGAL-2A — ANPC/SAL actual 2026
Bază de verificat: Ordinul ANPC nr. 449/2022 în forma actualizată prin Ordinul nr. 270/2026.

De verificat/implementat:
- eliminarea completă a vechilor referințe SOL/ODR;
- păstrarea/afișarea pictogramei oficiale SAL cerute în forma actuală;
- dimensiuni și link oficial conform actului în vigoare;
- verificare homepage, footer, informații legale și termeni;
- test automat care previne reapariția URL-urilor ODR vechi.

#### Stare LEGAL-2A (PR #13) — implementat, cu o decizie deschisă

Text verificat în Portal Legislativ (Ordinul 449/2022, forma actualizată; Ordinul 270/2026, M.Of. nr. 420/19.05.2026):
- art. 2 alin. (1): pictogramele din anexa nr. 2 se afișează „pe prima pagină a site-ului - home page”. Comunicatele de presă menționează și „bara de meniu”, dar textul ordinului nu o cere.
- art. 2 alin. (2): pictograma are „250 (L) x 50 (H) pixeli” și „un link extern către platforma electronică SAL, disponibilă la adresa: https://reclamatiisal.anpc.ro”.
- art. 2 alin. (3): pictograma se descarcă de pe site-ul oficial ANPC.

| Cerință | Stare |
|---|---|
| Eliminare SOL/ODR (Reg. (UE) 2024/3228, platformă desființată la 20.07.2025) | ✅ Footer, Informații legale, Termeni secț. 11; teste regresive pe homepage, footer, Informații legale, Termeni, `/garantii` |
| Pictograma SAL oficială pe homepage | ✅ `ConsumerProtectionNotice` (blocul „Informare consumatori”), lângă linkurile ANPC și `/garantii` |
| Asset oficial, nemodificat | ✅ `public/legal/anpc-sal-pictograma.png` = „PICTOGRAMA SAL ONLINE” de pe <https://anpc.ro/sal> (`/download/sal/SAL-PICTOGRAMA.png`, Last-Modified 04.05.2026), byte-identic, SHA-256 `22c8a456…15d5ed` verificat în `tests/legal-assets.test.ts` |
| 250 × 50 px | ✅ Zona-link și elementul imagine au exact 250 × 50 px în Chrome, la 1280, 390 și 280 px |
| Link `https://reclamatiisal.anpc.ro` | ✅ href exact, filă nouă, accesibil de la tastatură, text alternativ |
| Teste | ✅ `tests/homepage-sal.test.tsx` (homepage randat integral), E2E `npm run test:e2e` |

**Decizie deschisă:** fișierul oficial ANPC are **201 × 50 px**, iar și versiunea vectorială (`pictogramaSAL.tif`, 680 × 169) are același raport (≈ 4,02 : 1). ANPC nu publică o variantă 250 × 50 (5 : 1). Ca să nu deformăm pictograma oficială, elementul are exact 250 × 50 px, iar graficul este afișat nedeformat în interior (`object-fit: contain`). Recomandare: confirmare cu ANPC (Direcția SAL). Dacă se cere întinderea, se schimbă doar clasa CSS.

Rămâne în afara site-ului: **placheta SAL fizică** (art. 1, anexa nr. 1, minimum 16 × 16 cm) în spațiul de comercializare, dacă există spațiu deschis consumatorilor — acțiune manuală PRO TERM, descărcare de pe <https://anpc.ro/sal>.

## Prioritate P1 — produse fizice HVAC

### LEGAL-3 — GPSR / siguranța generală a produselor
Bază: Regulamentul (UE) 2023/988.

Audit și implementare:
- producător;
- adresă/contact producător;
- persoană/operator economic responsabil în UE, unde este necesar;
- identificator produs/model/tip;
- avertismente și informații de siguranță aplicabile;
- documente și instrucțiuni relevante;
- structură Supabase separată de câmpurile GARAN;
- afișare pe pagina produsului înainte de cumpărare;
- admin cu validări;
- fără inventarea datelor lipsă.

### LEGAL-3A — Etichete energetice / EPREL
Categorii prioritare:
- aparate de aer condiționat;
- pompe de căldură / încălzitoare;
- boilere / preparare ACM;
- unități de ventilare rezidențiale;
- alte categorii din catalog pentru care există obligații specifice.

De verificat pentru fiecare categorie:
- regulament delegat aplicabil;
- obligația de afișare online a etichetei energetice;
- fișa cu informații despre produs;
- link/identificator EPREL, unde este aplicabil;
- poziționarea pe pagina produsului și în listări;
- sursa oficială a datelor.

Nu este suficient un text simplu „A+++” dacă regulamentul specific cere eticheta/fișa.

## Prioritate P1 — prețuri și promoții

### LEGAL-4 — Istoric de preț și reduceri
Bază de verificat: OG 99/2000 și legislația privind anunțurile de reducere.

De implementat înainte de promoții:
- istoric server-side al prețurilor;
- determinarea automată a celui mai mic preț din perioada legală relevantă;
- imposibilitatea introducerii manuale arbitrare a unui „preț vechi”;
- audit trail pentru modificările de preț;
- reguli separate pentru excepțiile legale, dacă există;
- teste pentru promoții și prețul de referință.

## Prioritate P1 — marketing și conținut

### LEGAL-5 — Green claims / afirmații de mediu
Bază: modificările introduse prin OUG 18/2026 și legislația UE aferentă practicilor comerciale neloiale.

De implementat:
- audit pentru expresii precum „eco”, „verde”, „sustenabil”, „prietenos cu mediul”, „carbon neutral” etc.;
- fiecare afirmație de mediu trebuie să aibă sursă/document justificativ;
- interzicerea etichetelor de sustenabilitate necertificate;
- evitarea prezentării unei obligații legale ca avantaj unic de marketing;
- scanner automat în CI pentru termeni sensibili;
- review manual pentru afirmații despre eficiență/impact de mediu.

### LEGAL-5A — Recenzii
Dacă se introduc review-uri:
- declarație clară dacă și cum este verificată autenticitatea;
- mecanism „verified purchase”;
- prevenirea/semnalarea recenziilor fabricate;
- trasabilitate pentru moderare.

## Prioritate P1 — informații precontractuale

### LEGAL-6 — Audit complet OUG 34/2014
Verificare câmp cu câmp:
- identitatea comerciantului;
- adresă, telefon, e-mail;
- caracteristicile principale ale bunului/serviciului;
- preț total, TVA și costuri suplimentare;
- livrare și restricții;
- modalități de plată;
- drept de retragere și excepții;
- garanția legală/comercială;
- servicii post-vânzare;
- piese de schimb / reparare / software, unde se aplică;
- condiții privind serviciile începute în perioada de retragere;
- confirmarea contractului pe suport durabil.

### LEGAL-6A — Legea 365/2002 / comerț electronic
Verificare permanentă a informațiilor societății și accesibilitatea lor directă/gratuită:
- denumire;
- sediu;
- date de contact;
- registrul comerțului;
- CUI;
- autorizații/organisme profesionale, dacă sunt relevante;
- prețuri și TVA;
- costuri de livrare.

## Prioritate P2 — accesibilitate

### LEGAL-7 — European Accessibility Act / Legea 232/2022
De stabilit mai întâi dacă PRO TERM beneficiază de excepția pentru microîntreprinderi prestatoare de servicii.

Chiar dacă există excepție, păstrăm ca standard intern:
- operare integrală din tastatură;
- focus vizibil;
- contrast adecvat;
- etichete/formulare accesibile;
- dialoguri corecte;
- text alternativ;
- responsive real inclusiv viewport-uri înguste;
- teste automate și E2E.

## Reguli transversale

1. Nu se inventează date juridice sau informații despre producători.
2. Sursele oficiale au prioritate: Portal Legislativ, EUR-Lex, Comisia Europeană, ANPC.
3. Fiecare cerință legală nouă se implementează pe branch separat, cu teste.
4. Nicio migrație Supabase nu se aplică înainte de review și backup/verificare.
5. Orice funcție critică legal trebuie să fie fail-closed atunci când lipsa datelor ar putea permite o comandă neconformă.
6. Documentele și asset-urile oficiale se păstrează byte-identic atunci când regulamentul cere formă armonizată.
7. Se separă clar B2C de B2B.
8. Orice text juridic vechi sau link oficial expirat trebuie detectat prin căutare globală și teste regresive.

## Ordine propusă

1. Finalizare PR #13: garanții + eliminare ODR + SAL actualizat.
2. LEGAL-2: retragere online.
3. LEGAL-3 + 3A: GPSR și energy labels / EPREL.
4. LEGAL-4: prețuri/reduceri.
5. LEGAL-5 + 5A: green claims și reviews.
6. LEGAL-6 + 6A: audit precontractual complet.
7. LEGAL-7: accesibilitate și verificarea excepției.

## Gate de lansare

Magazinul nu se consideră juridic pregătit pentru lansare B2C până când P0 și P1 relevante pentru catalogul efectiv sunt închise sau documentate explicit ca neaplicabile.
