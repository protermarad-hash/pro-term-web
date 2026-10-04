# Conformare: informarea consumatorilor privind garanțiile (2026)

Document intern PRO TERM. Ultima actualizare: **04.10.2026**.
Branch de implementare: `feature/legal-guarantee-compliance-2026` (bază `origin/main` @ `a46c8ac`).

> Acest document descrie implementarea tehnică și interpretarea folosită. Nu este consultanță juridică.
> Punctele marcate „Decizie necesară” trebuie confirmate de PRO TERM (eventual cu un jurist).

---

## 1. Baza legală și data aplicării

| Act | Ce reglementează | Aplicare |
|---|---|---|
| **OUG nr. 18/2026** (M.Of. nr. 236/26.03.2026) | Modifică OUG nr. 34/2014; transpune Directiva (UE) 2024/825 | art. I și art. II pct. 1, 4–7, 9–12, 16: **27.09.2026** |
| **OUG nr. 34/2014**, forma actualizată | art. 2 pct. 22–26, art. 4 alin. (1) lit. e)–e^4), k), l), art. 6 alin. (1) lit. l)–l^3), m), ț), u), art. 8 alin. (2), **art. 22^1** | 27.09.2026 |
| **Regulamentul de punere în aplicare (UE) 2025/1960** | Designul și conținutul notificării armonizate (anexa I) și al etichetei GARAN (anexa II) | **27.09.2026** (art. 3) |
| **OUG nr. 140/2021** | Garanția legală de conformitate (art. 9–14), garanțiile comerciale și garanția de durabilitate a producătorului (art. 15) | în vigoare |
| Ghidul Comisiei (DG JUST, aprilie 2026) | Recomandări practice de afișare (fără valoare juridică obligatorie) | — |

**Obligațiile se aplică deja** (de la 27.09.2026). Implementarea de pe acest branch nu este încă în producție.

## 2. Concluzii verificate în sursele oficiale

Toate concluziile de mai jos au fost verificate direct în textul oficial (Portal Legislativ, Jurnalul Oficial al UE în limba română, site-ul Comisiei).

1. **Notificarea armonizată este obligatorie.** Art. 4 alin. (1) lit. e) și art. 6 alin. (1) lit. l): mențiunea privind garanția legală de conformitate „inclusiv durata sa minimă de doi ani … într-un mod vizibil, utilizând notificarea armonizată menționată la art. 22^1”. Art. 22^1 alin. (2): notificarea „trebuie să respecte designul și conținutul prevăzute în anexa I” la Reg. 2025/1960.
2. **Online = color RGB.** Anexa I, observația 5: „Pentru contractele la distanță încheiate prin intermediul unei interfețe online, notificarea armonizată … trebuie să fie color (RGB).” Anexa II, observația 5: și eticheta trebuie să fie color.
3. **Elementele notificării nu se editează.** Anexa I, observația 1: „Niciunul dintre elementele notificării armonizate nu poate fi editat.” Ghidul Comisiei: fără modificări de culori, tipografie, spațiere, QR, decupare, întindere, elemente adăugate; „No colour substitutions or format conversions should be made outside of the provided files.”
4. **Eticheta GARAN se folosește NUMAI dacă** (art. 4 alin. (1) lit. e^1) / art. 6 alin. (1) lit. l^1)):
   - **producătorul** oferă consumatorului o garanție comercială de durabilitate;
   - **fără costuri suplimentare**;
   - care **acoperă întregul bun**;
   - cu o durată **mai mare de doi ani**;
   - **iar producătorul pune aceste informații la dispoziția** comerciantului.
   Ghidul precizează că vânzătorul nu trebuie să caute singur informația (de ex. pe site-urile producătorilor).
5. **Imediat înainte de comandă.** Art. 8 alin. (2), modificat: informațiile de la art. 6 alin. (1) lit. a), e), **l^1)**, o), p) se aduc la cunoștință „de o manieră clară și foarte vizibilă, imediat înainte ca acesta să plaseze comanda”. Deci **eticheta GARAN (lit. l^1)) trebuie arătată în checkout, înaintea butonului de comandă**, pentru produsele eligibile. Notificarea (lit. l)) nu este în această listă, dar ghidul Comisiei o recomandă și la checkout – am aplicat varianta conservatoare.
6. **Editabile pe etichetă** (anexa II, obs. 1): doar „XX” (durata), „Brand/Trademark” (denumirea producătorului) și „Model identifier”. Pe afișarea imbricată (nested) se editează doar „XX”. Durata: ani întregi sau jumătăți („2,5”), conform ghidului. Fontul: Inter. QR ≥ 2 × 2 cm (ghid).
7. **Afișare imbricată permisă online** doar pentru etichetă (anexa II): eticheta completă „trebuie să apară în întregime la efectuarea primului clic …, la prima trecere pe deasupra cu mouse-ul sau la prima extindere … pe un ecran tactil”. Pentru notificare, ghidul dă ca exemplu o frază („Drepturile tale privind garanția legală”) la care notificarea completă apare la primul clic, pe pagina de produs, în header sau la checkout.
8. **Alte informații** (când producătorul le furnizează): servicii post-vânzare și garanții comerciale (art. 6 alin. (1) lit. m)), perioada minimă de actualizări software pentru bunuri cu elemente digitale (lit. l^3)), piese de schimb / instrucțiuni de reparare / restricții (lit. u)), punctaj de reparabilitate „acolo unde este cazul” (lit. ț)).
9. **Consumator vs. firmă.** OUG nr. 140/2021 și OUG nr. 34/2014 protejează consumatorul (persoană fizică ce acționează în afara activității profesionale). Textele de pe site păstrează această distincție.

## 3. Ce am implementat

### Fișierele oficiale UE (neschimbate)

Copiate byte-cu-byte din pachetele Comisiei
(<https://commission.europa.eu/publications/practical-guidelines-and-high-resolution-vector-files-eu-notice-and-label-product-guarantees_en>, publicat 19.03.2026, actualizat 01.04.2026). Testul `tests/legal-assets.test.ts` verifică hash-urile.

| Fișier | Sursa | SHA-256 |
|---|---|---|
| `public/legal/eu-notificare-garantie-legala-ro.svg` | `SVG.zip` › `Legal guarantee_notice RO.svg` (color) | `dc168eca…5b2a` |
| `public/legal/eu-notificare-garantie-legala-ro.png` | `PNG and JPG.zip` › `PNG/Legal guarantee_notice_RO.png` (color, RGB) | `51d641e2…a032` |
| `public/legal/eu-eticheta-garan-color.svg` | `GARAN label for website.zip` › `GARAN Label_colour.svg` | `3414c836…1ab1` |
| `public/legal/eu-eticheta-garan-imbricata.svg` | `GARAN label for website.zip` › `GARAN Label_nested display.svg` | `1c1122b2…b994` |

**Observație despre culori.** Regulamentul indică drept culori de referință albastru `#003399` și galben `#FFED00`; fișierele oficiale publicate de Comisie folosesc `#0b4f9e`/`#034ea2` și `#faea26`/`#fff200`, iar imaginea din Jurnalul Oficial are tot `≈#034DA2`. Am folosit **fișierele oficiale exact cum sunt**, conform instrucțiunii explicite a Comisiei de a nu face substituții de culoare. Dacă ANPC sau un jurist cere strict valorile din regulament, se înlocuiește doar fișierul (nu codul).

**Modificări tehnice permise la etichetă** (`src/lib/garan-label-svg.ts`): completarea celor 3 câmpuri editabile; prefixarea id-urilor/claselor (regulile `<style>` din SVG inline sunt globale, iar fișierele folosesc aceleași nume `cls-N`); fontul este mapat la Inter-ul încărcat de site. Câmpul „Model identifier” este aliniat la dreapta pe marginea măsurată a textului original (x = 263,27), ca să nu iasă din etichetă. Testele verifică că orice alt element (QR, scut, calendar, traduceri, rame, culori) rămâne identic.

### Pagini, componente și locuri de afișare

| Unde | Ce | Fișiere |
|---|---|---|
| **Pagina produsului**, imediat sub preț / stoc / „Adaugă în coș” | Secțiunea „Garanție și drepturile consumatorului”: text despre răspunderea vânzătorului, buton „Drepturile tale privind garanția legală” → notificarea completă la primul clic; eticheta GARAN imbricată (doar pentru produse eligibile) → eticheta completă la primul clic; garanția comercială din certificat (dacă e completată); distincția consumator/firmă; link `/garantii` | `src/components/legal/ProductGuaranteeSection.tsx`, `src/app/produse/[slug]/*` |
| Pagina produsului, sub specificații | „Service, piese de schimb și reparare” – doar câmpurile completate | `src/components/legal/ProductConsumerInfo.tsx` |
| **Checkout**, direct deasupra butonului „Comandă cu obligație de plată” | Acces la notificare + eticheta GARAN pentru fiecare produs eligibil din coș (date citite proaspăt din server). **Fail-closed:** comanda este blocată până când verificarea GARAN reușește (vezi mai jos) | `src/components/legal/CheckoutGuaranteeInfo.tsx`, `src/components/legal/useGuaranteeLabelCheck.ts`, `src/lib/guarantee-label-check.ts`, `src/app/api/products/guarantee-labels/route.ts` |
| **`/garantii`** (nou) | Notificarea completă afișată inline + garanția legală (cu articolele din OUG 140/2021), garanția comercială, eticheta GARAN, procedura de sesizare, servicii post-vânzare, clienți persoane juridice, contact, temei legal | `src/app/garantii/page.tsx` |
| **Footer** | Link „Garanții și drepturile consumatorului” (secțiunea Legal) | `src/components/Footer.tsx` |
| Homepage (bloc A.N.P.C.), Informații legale, sitemap | Link către `/garantii` | `ConsumerProtectionNotice.tsx`, `informatii-legale/page.tsx`, `sitemap.ts` |
| **E-mailul de confirmare a comenzii** | Notificarea oficială (PNG RGB) + link Your Europe + link `/garantii` | `src/lib/email.ts` |
| **Admin produse** | Secțiunea „Garanții și informații pentru consumatori”, cu avertismentul obligatoriu pentru GARAN | `src/app/admin/AdminClient.tsx`, `src/app/api/admin/products/route.ts` |

**Verificarea GARAN în checkout (fail-closed).** Starea verificării este `loading` → `ready` sau `error`, legată exact de produsele din coș (orice schimbare a coșului repornește verificarea).
- `loading`: butonul de comandă este dezactivat, iar mesajul „Se verifică informațiile de garanție…” este vizibil.
- `ready`: doar după un răspuns valid al serverului. Etichetele se afișează, iar un răspuns valid fără produse eligibile este acceptat.
- `error` (HTTP ≠ 2xx, eroare de rețea, răspuns invalid): butonul rămâne dezactivat, apare mesajul „Nu am putut verifica informațiile de garanție. Reîncearcă înainte de plasarea comenzii.” și butonul „Reîncearcă verificarea”. O eroare nu este tratată niciodată ca „fără etichete”.
- `handleSubmit` verifică explicit `status === 'ready'` înainte de orice POST către `/api/orders`, deci comanda este blocată și dacă butonul dezactivat ar fi ocolit.
- Pe server, `/api/products/guarantee-labels` răspunde 503 dacă datele nu pot fi citite. Singura excepție este coloana inexistentă (`42703`, migrația neaplicată), situație în care niciun produs nu poate fi eligibil.

Componentele oficiale nu sunt stilizate. Doar containerul (bordură, fundal, spațiere, titlu) urmează designul PRO TERM.

**Accesibilitate:** dialoguri native `<dialog>` (focus trap, Esc, focus returnat pe buton – verificat în browser); notificarea are text alternativ complet (transcriere verbatim din PDF-ul oficial RO, `LEGAL_NOTICE_TEXT_RO`); butoane ≥ 44 px; contrast text ≥ 4,5:1 (verificat E2E).
**Lizibilitate:** notificarea nu se afișează niciodată sub 600 px lățime (≈ 12 px corp de text). Pe ecrane înguste, containerul derulează orizontal, nu micșorează textul. Eticheta completă nu scade sub 344 px, astfel încât QR-ul rămâne ≥ 2 cm.

## 4. Garanția legală vs. garanția comercială

| | Garanția legală de conformitate | Garanția comercială | Garanția comercială de durabilitate (GARAN) |
|---|---|---|---|
| Sursă | Legea (OUG 140/2021) | Certificat de garanție (opțională) | Angajamentul **producătorului** (art. 15 alin. (2) OUG 140/2021) |
| Cine răspunde | **Vânzătorul** (PRO TERM) | Garantul din certificat | **Producătorul**, direct față de consumator |
| Durată | 2 ani de la livrare pentru neconformități existente la livrare | Conform certificatului | > 2 ani |
| Cost | Gratuit | Poate avea condiții | Fără cost suplimentar, întregul bun |
| Pe site | Notificarea armonizată (toate produsele) | Text în secțiunea de garanție a produsului | Eticheta GARAN (doar produse eligibile) |

O garanție de tip „5 ani cu montaj autorizat” sau „X ani la compresor” este o **garanție comercială obișnuită**, nu o garanție de durabilitate, și **nu primește eticheta GARAN**.

## 5. Datele per produs (Supabase `public.products`)

Migrația `supabase/migrations/20261004120000_product_consumer_guarantee_info.sql` (aditivă, idempotentă):

| Coloană | Tip / implicit | Afișare publică | Observații |
|---|---|---|---|
| `durability_guarantee_eligible` | boolean, **default `false`** | eticheta GARAN | Doar `true` explicit activează eticheta |
| `durability_guarantee_years` | numeric(3,1) | „XX” pe etichetă | CHECK: > 2, ≤ 99, ani întregi sau jumătăți |
| `durability_guarantee_source` | text | **nu** (intern) | Documentul producătorului; obligatoriu când e eligibil |
| `manufacturer_name` | text | etichetă (Brand/Trademark) | max 30 caractere; nu se completează automat din `brand` |
| `manufacturer_model_identifier` | text | etichetă (Model identifier) | max 30; producător + model ≤ 40 caractere (spațiu pe etichetă) |
| `commercial_warranty_terms` | text | secțiunea garanție | Text din certificat |
| `commercial_warranty_conditions_url` | text | link | CHECK: doar `https://` |
| `after_sales_service_info` | text | card service | art. 6 lit. m) |
| `spare_parts_info` | text | card service | art. 6 lit. u) |
| `repair_info` | text | card service | art. 6 lit. u) |
| `software_updates_info` | text | card service | art. 6 lit. l^3), doar bunuri cu elemente digitale |

Constrângeri: `products_durability_guarantee_requires_data` (eticheta necesită durată, producător, model și sursă), `products_durability_guarantee_years_valid`, `products_commercial_warranty_conditions_url_https`. Nu sunt necesare modificări de RLS sau de grant-uri: `products` are grant `SELECT` la nivel de tabel pentru `anon`/`authenticated`, iar politica `products_public_read_active` rămâne neschimbată.

**De ce nu există `legal_guarantee_notice_enabled`:** notificarea este obligatorie la nivel de magazin pentru orice bun vândut consumatorilor. Un comutator per produs ar permite dezactivarea ei din greșeală.

**Compatibilitate:** codul funcționează și înainte de aplicarea migrației. Citirea datelor de garanție este separată și tolerantă la erori: paginile de produs și checkout-ul rămân funcționale, notificarea apare oricum, iar câmpurile opționale lipsesc. Formularul de admin trimite câmpurile noi numai dacă baza de date le are sau dacă au fost completate; altfel API-ul răspunde cu un mesaj clar că migrația lipsește.

## 6. Ce NU trebuie făcut

- Nu edita, nu recolora, nu decupa, nu redimensiona neproporțional și nu „stiliza” (glassy, umbre, filtre) notificarea sau eticheta.
- Nu înlocui fișierele din `public/legal/` decât cu fișiere oficiale noi de la Comisie (și actualizează hash-urile din test).
- Nu activa eticheta GARAN pentru o garanție comercială obișnuită, pentru o garanție doar pe componente, cu condiții plătite sau oferită de vânzător/importator în loc de producător.
- Nu deduce garanția din brand, din fișe tehnice sau din site-ul producătorului. Informația trebuie primită de la producător.
- Nu copia datele GARAN la duplicarea unui produs (adminul le resetează automat).
- Nu completa câmpuri „ca să nu fie goale”. Câmpurile goale nu apar pe site.
- Nu prezenta garanția legală pentru consumatori ca fiind identică pentru persoane juridice.

## 7. Procedura pentru un produs nou

1. Adaugă produsul normal în admin.
2. În „Garanții și informații pentru consumatori” completează **doar** ce ai în documentele producătorului/importatorului: garanția comercială (textul din certificat și linkul https), service post-vânzare, piese de schimb, reparare, actualizări software (numai pentru bunuri cu elemente digitale).
3. **Eticheta GARAN** – bifează numai dacă ai de la producător confirmarea că garanția de durabilitate este fără cost, pe întregul produs și mai mare de 2 ani. Completează durata, numele producătorului și identificatorul de model exact ca în documentul producătorului, plus referința documentului (câmp intern).
4. Verifică pagina produsului: secțiunea „Garanție și drepturile consumatorului” și, dacă e cazul, eticheta (deschide-o cu un clic).
5. Lista produselor existente de verificat: `docs/legal/PRODUCTS_GUARANTEE_DATA_TODO.md`.

## 8. Teste și validare

- `npm test` – 57 de teste (Node test runner, fără dependențe noi): logica de eligibilitate, validarea din admin, integritatea fișierelor oficiale, transformarea etichetei, randarea paginii de produs, footer, `/garantii`, sitemap, checkout, e-mail.
- `npm run test:e2e` – 18 verificări în Chrome real (inclusiv stările loading / ready / error / retry ale verificării GARAN din checkout; `/api/orders` este interceptat în browser, deci nu se creează comenzi) (DevTools Protocol, fără dependențe noi) pe un server pornit (`BASE_URL`): desktop 1280, tabletă 820, mobil 390, Z Fold 280; tastatură; QR ≥ 2 cm; contrast. Eticheta GARAN este testată în checkout prin interceptarea răspunsului API **în browser**, fără nicio scriere în baza de date.
- Migrația a fost testată pe Postgres izolat (PGlite, în afara proiectului): aplicare dublă, valori implicite, constrângeri, compatibilitate cu payload-ul vechi.

## 9. Ordinea de punere în producție

1. Review și aprobare PR.
2. **Aplicarea migrației** în Supabase (de exemplu `supabase db push` din mediul care are proiectul legat, după verificarea că migrațiile din repo = migrațiile aplicate).
3. Merge în `main` → deploy Vercel (necesită aprobare separată).
4. Completarea datelor per produs (secțiunea 7).

Pașii 2 și 3 pot fi inversați fără ca site-ul să se strice: doar salvarea câmpurilor de garanție din admin va cere migrația.

## 10. Limitări și decizii deschise

- **Eticheta GARAN în e-mailul de confirmare** (recomandată de ghid): nu este implementată. Ar necesita o imagine raster a etichetei generată per produs, pentru că clienții de e-mail nu afișează SVG. În acest moment niciun produs nu este eligibil. Decizie necesară înainte de primul produs eligibil.
- **Discrepanța de culori** între regulament și fișierele Comisiei (secțiunea 3).
- **Punctajul de reparabilitate** (art. 6 lit. ț)) nu are câmp, pentru că nu se aplică în prezent aparatelor de climatizare. Se poate adăuga când devine aplicabil.
- **Lățimi foarte mici (280 px):** pagina de produs și checkout-ul (cu produse în coș) se lățesc deja la ~385 px pe `origin/main`, înainte de această modificare (verificat pe un build de bază). Componentele noi se încadrează în coloana lor.

## 11. Surse oficiale

- OUG nr. 18/2026: <https://legislatie.just.ro/Public/DetaliiDocumentAfis/308474>
- OUG nr. 34/2014 (forma actualizată): <https://legislatie.just.ro/Public/DetaliiDocument/307805>
- OUG nr. 140/2021 (forma actualizată): <https://legislatie.just.ro/Public/DetaliiDocument/303291>
- Regulamentul (UE) 2025/1960: <https://eur-lex.europa.eu/eli/reg_impl/2025/1960/oj> (versiunea RO a fost citită din depozitul Oficiului pentru Publicații, `publications.europa.eu/resource/celex/32025R1960`)
- Comisia Europeană – ghid practic și fișiere oficiale: <https://commission.europa.eu/publications/practical-guidelines-and-high-resolution-vector-files-eu-notice-and-label-product-guarantees_en>
- Your Europe – garanții (destinația QR a notificării RO): <https://europa.eu/youreurope/garan%C8%9Bii>
- Your Europe – garanția comercială de durabilitate (destinația QR a etichetei): <https://europa.eu/youreurope/commercial-guarantee-durability/index.htm>
