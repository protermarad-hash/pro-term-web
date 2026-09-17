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

## 9. Checkpoint canonic curent

**Checkpoint canonic curent:**

```
33b99a7495b148563f981ff1cc0a6bd4e5c409f3
```

La momentul creării acestui document:

- HEAD = main = origin/main = `33b99a7495b148563f981ff1cc0a6bd4e5c409f3`
- working tree: curat
- staging: gol
- deploy după aceste etape: **NU** a fost făcut intenționat

## 10. Ordinea de lucru pentru etapele următoare

Plan curent — poate fi ajustat dacă apar informații noi.

1. **Homepage sub Hero**
   - servicii
   - poziționare
   - proiecte
   - încredere
   - CTA-uri
   - fără afirmații neverificate

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

8. **Deploy**
   - numai după stabilirea unui checkpoint aprobat
   - nu automat doar pentru că un PR a fost merge-uit

## 11. Workflow standard pentru fiecare etapă

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

## 12. Regula de actualizare a acestui fișier

La sfârșitul fiecărei etape merge-uite:

- actualizează checkpoint-ul canonic;
- adaugă etapa finalizată;
- actualizează „ordinea următoare" dacă este necesar;
- nu rescrie istoricul corect;
- nu elimina decizii aprobate fără motiv documentat.

Documentul trebuie să rămână sursa principală de continuitate operațională.
