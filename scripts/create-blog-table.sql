-- Tabelă blog_posts pentru PRO TERM Web
-- Rulați în Supabase SQL Editor: https://supabase.com/dashboard/project/dydzfhyndsdbrhrwvgib/sql

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  excerpt         TEXT,
  content         TEXT,
  image_url       TEXT,
  category        TEXT,
  author          TEXT NOT NULL DEFAULT 'Echipa PRO TERM',
  read_time       INTEGER,
  published       BOOLEAN NOT NULL DEFAULT FALSE,
  published_at    TIMESTAMPTZ,
  meta_title      TEXT,
  meta_description TEXT,
  tags            TEXT[]
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='public_read') THEN
    CREATE POLICY "public_read" ON public.blog_posts FOR SELECT USING (published = TRUE);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='admin_all') THEN
    CREATE POLICY "admin_all" ON public.blog_posts FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Seed: 5 articole SEO
INSERT INTO public.blog_posts (slug, title, excerpt, content, category, author, read_time, published, published_at, meta_title, meta_description, tags)
VALUES
(
  'cum-alegi-aerul-conditionat-potrivit',
  'Cum alegi aerul condiționat potrivit pentru casa ta în 2026',
  'Ghid complet pentru alegerea aparatului de aer condiționat: capacitate BTU, eficiență energetică, branduri recomandate și sfaturi de la specialiști cu 25 ani experiență.',
  '## Introducere

Alegerea unui aparat de aer condiționat poate părea o sarcină simplă, dar există mulți factori de care trebuie să ții cont pentru a face alegerea corectă. Un aparat subdimensionat va consuma mai mult curent și nu va asigura confortul dorit, în timp ce unul supradimensionat va cicleza prea des și va crește costurile de întreținere.

## Capacitatea BTU — cel mai important factor

Capacitatea unui aparat de aer condiționat se măsoară în BTU (British Thermal Units) sau kW. Regula generală este că ai nevoie de aproximativ **30 BTU pe metru cub** de spațiu de răcit.

**Ghid orientativ:**
- **9.000 BTU** — camere de 16-20 m²
- **12.000 BTU** — camere de 20-30 m²
- **18.000 BTU** — camere de 30-45 m²
- **24.000 BTU** — camere de 45-70 m²

Aceste valori sunt orientative. Trebuie ajustate în funcție de expunerea la soare, numărul de ferestre, etajul și echipamentele electronice din cameră.

## Clasa energetică — economie pe termen lung

Eficiența energetică a unui aparat de aer condiționat se măsoară prin:

- **SEER** (Seasonal Energy Efficiency Ratio) — eficiența la răcire
- **SCOP** (Seasonal Coefficient of Performance) — eficiența la încălzire

Clasele energetice A+++ și A++ oferă cele mai bune performanțe și cel mai mic consum de energie. Deși prețul inițial este mai mare, economiile la facturile de curent compensează diferența în 2-3 ani.

## Inverter vs non-inverter

**Aparatele inverter** reprezintă tehnologia modernă standard:
- Compresorul funcționează continuu la turații variabile
- Consum de curent cu 30-50% mai mic față de aparatele clasice
- Nivel de zgomot mai redus
- Temperatura se menține constant, fără fluctuații

**Aparatele non-inverter** (clasice) pornesc și opresc compresorul, ceea ce duce la fluctuații de temperatură și consum mai mare.

**Recomandarea noastră:** Optați întotdeauna pentru un aparat inverter.

## Branduri recomandate în România

### Midea — lider mondial
Midea este cel mai mare producător de aparate de aer condiționat din lume. Avantaje:
- Tehnologie AI EcoMaster pentru optimizare automată
- Eficiență energetică A+++ pe toată gama
- Raport calitate-preț excelent
- Service și piese de schimb disponibile în România

### Gree — inovație continuă
Gree este al doilea producător mondial, cu o gamă extinsă pentru uz rezidențial și comercial:
- Sistem Cold Plasma pentru purificarea aerului
- Filtre antibacteriene incluse
- Conectivitate Wi-Fi pe toată gama premium
- Proiecte VRF pentru spații comerciale mari

### Yamato — fiabilitate japoneză
Yamato oferă aparate cu un raport calitate-preț excelent:
- Tratament Golden Fin pe condensator (rezistență la coroziune)
- Agent frigorific R32 ecologic
- Nivel de zgomot redus
- Gamă largă BTU disponibilă în România

## Ce să verifici înainte de cumpărare

1. **Garanția** — minimum 2 ani pentru piese și 5 ani pentru compresor
2. **Agentul frigorific** — R32 sau R410A (R32 este mai ecologic)
3. **Nivel sonor** — sub 40 dB(A) pentru unitatea interioară
4. **Funcția de auto-curățare** — prelungește durata de viață a filtrelor
5. **Conectivitate Wi-Fi** — permite controlul de la distanță

## Concluzie

Pentru o locuință medie, un aparat inverter de 12.000 BTU clasa A++ sau A+++ reprezintă alegerea optimă. PRO TERM SRL oferă consultanță gratuită pentru alegerea aparatului potrivit nevoilor tale.

Sunați la **0749 025 610** sau vizitați catalogul nostru online pentru a vedea toată gama disponibilă.',
  'Ghiduri',
  'Echipa PRO TERM',
  8,
  TRUE,
  NOW(),
  'Cum alegi aerul condiționat potrivit 2026 | Ghid BTU | PRO TERM',
  'Ghid complet pentru alegerea aerului condiționat: capacitate BTU, clase energetice, branduri Gree/Midea/Yamato. Consultanță gratuită PRO TERM.',
  ARRAY['aer conditionat', 'ghid cumparare', 'BTU', 'inverter']
),
(
  'montaj-aer-conditionat-arad',
  'Montaj aer condiționat în Arad și Timiș — Tot ce trebuie să știi',
  'Ghid complet despre montajul aerului condiționat în județul Arad și Timiș. Prețuri, condiții, certificări necesare și ce să eviți.',
  '## De ce montajul profesional face diferența

Montajul corect al unui aparat de aer condiționat este la fel de important ca și calitatea echipamentului. Un montaj defectuos poate duce la:
- Consum crescut de energie (10-30% mai mult)
- Scurgeri de agent frigorific
- Zgomot excesiv
- Defectarea prematură a compresorului
- Pierderea garanției producătorului

## Ce include montajul standard PRO TERM

Montajul standard pentru un aparat split monosplit include:

**Pregătire și instalare:**
- Evaluarea locului de montaj și stabilirea traseului
- Montarea suporților pentru unitatea exterioară
- Montarea consolei pentru unitatea interioară
- Trecerea țevilor frigorifice prin perete (forare inclus)

**Conectare și punere în funcțiune:**
- Conectarea țevilor frigorifice (cupru, maximum 3 m inclus în prețul standard)
- Conectarea electrică la tablou sau priză dedicată
- Vidarea instalației și verificarea etanșeității
- Testare completă și reglaj parametri
- Instruirea clientului pentru utilizare corectă

## Prețuri montaj standard (2026)

| Capacitate | Preț montaj standard |
|------------|---------------------|
| 9.000 - 12.000 BTU | 750 RON |
| 18.000 BTU | 900 RON |
| 24.000 BTU | 1.100 RON |

*Prețurile includ TVA 21%. Sunt valabile pentru montaj în zona Arad și Timiș.*

**Situații care pot implica costuri suplimentare:**
- Distanța unitate interioară-exterioară > 3 m (+50 RON/ml)
- Tavan fals sau materiale dure (gresie, marmură): +100-200 RON
- Etaj mai înalt cu acces dificil: la cerere
- Cablaj electric de la tablou: la cerere

## Certificarea F-Gas — de ce contează

Tehnicianul care manipulează agentul frigorific trebuie să dețină **certificat F-Gas** (AGFR), conform Regulamentului UE 517/2014. Lucrul cu agenți frigorifici de către persoane necertificate este ilegal și periculos.

**Toți tehnicienii PRO TERM dețin certificare F-Gas.**

## Zona de acoperire

PRO TERM oferă servicii de montaj în:
- **Județul Arad** — Arad, Curtici, Pecica, Ineu, Lipova, Chișineu-Criș și localitățile învecinate
- **Județul Timiș** — Timișoara, Lugoj, Jimbolia, Sânnicolau Mare și zonele adiacente

Pentru alte județe, putem livra echipamentele și recomanda instalatori autorizați locali.

## Garanție post-montaj

PRO TERM oferă **garanție de 2 ani** pentru lucrările de montaj, independent de garanția producătorului pentru echipament. În cazul oricărei probleme cauzate de montaj, intervenim gratuit.

## Cum programezi montajul

1. Contactați-ne la **0749 025 610** sau prin formularul de pe site
2. Convenim data și ora potrivite
3. Tehnicianul vine echipat cu tot necesarul
4. Montaj finalizat în 2-4 ore (depinde de complexitate)

Nu amânați montajul — în sezonul cald, programările se fac uneori cu 1-2 săptămâni în avans.',
  'Montaj & Service',
  'Echipa PRO TERM',
  6,
  TRUE,
  NOW(),
  'Montaj aer condiționat Arad și Timiș | Prețuri 2026 | PRO TERM',
  'Montaj profesional aer condiționat în Arad și Timiș. Prețuri de la 750 RON, tehnicieni F-Gas, garanție 2 ani. Programare rapidă.',
  ARRAY['montaj aer conditionat', 'Arad', 'Timis', 'instalare']
),
(
  'service-intretinere-aer-conditionat',
  'Service și întreținere aer condiționat — De câte ori pe an și ce implică',
  'Află cât de des trebuie să faci service la aerul condiționat, ce verificări se fac și de ce întreținerea regulată îți economisește bani pe termen lung.',
  '## De ce este important service-ul periodic

Un aparat de aer condiționat care funcționează fără întreținere regulată:
- Consumă cu 15-20% mai mult curent
- Răcește/încălzește mai puțin eficient
- Poate distribui bacterii și alergeni în aer
- Se defectează prematur (durata de viață scade cu 30-40%)
- Pierderea garanției la modele noi

**Regulă simplă:** un aparat curățat și verificat periodic costă mai puțin în exploatare și durează mai mult.

## Frecvența recomandată pentru service

### Service anual (minim obligatoriu)
Cel puțin o dată pe an, înainte de sezonul de vară:
- Curățarea și dezinfectarea filtrelor
- Curățarea evaporatorului și condensatorului
- Verificarea presiunilor de lucru ale agentului frigorific
- Verificarea curenților absorbiți de compressor
- Controlul conexiunilor electrice
- Testare completă funcționare

### Service biannual (recomandat)
De două ori pe an (primăvară + toamnă), recomandat pentru:
- Apartamente cu mulți ocupanți
- Birouri cu program intens
- Aparate în funcțiune peste 8 ore/zi
- Spații cu praf sau fum

## Ce se verifică la revizie

**Verificări mecanice:**
- Starea și gradul de colmatare al filtrelor
- Starea lamelor evaporatorului și condensatorului
- Nivelul de vibrații și zgomotul anormal
- Starea conexiunilor de cupru și a izolaților

**Verificări electrice:**
- Tensiunea de alimentare
- Curentul absorbit de motor și compresor
- Starea siguranțelor și a conexiunilor
- Funcționarea termistorilor

**Verificări frigorifice:**
- Presiunile de lucru ale agentului frigorific
- Temperatura de evaporare și condensare
- Detectarea eventuală a scurgerilor de agent

## Curățarea filtrelor — ce poți face singur

Filtrele se pot curăța lunar de utilizator, fără a fi necesară intervenția unui tehnician:

1. Oprești aparatul și deconectezi alimentarea
2. Deschizi capacul frontal al unității interioare
3. Scoți filtrele (sunt de obicei detașabile)
4. Clătești filtrele cu apă călduță (nu fierbinte)
5. Lași filtrele să se usuce complet
6. Reinstalezi filtrele și repornești aparatul

**Nu folosi detergenți agresivi sau jet de apă puternic.**

## Semnale că aparatul are nevoie de service urgent

- Mirosuri neplăcute sau mucegai la pornire
- Sunete anormale (zgomot metalic, vibrații puternice)
- Aparatul nu răcește/încălzește suficient
- Formare de gheață pe unitatea interioară
- Scurgeri de apă (alta decât condensul normal)
- Creștere bruscă a consumului de curent
- Cod de eroare afișat pe panou

## Costuri service PRO TERM

Service anual standard (inclusiv curățare): 200-300 RON
Curățare chimică profundă (recomandat la 3-5 ani): 400-600 RON
Reîncărcare agent frigorific (la detectarea pierderii): 300-500 RON

Programați revizia anuală la **0749 025 610**. Disponibil în Arad și Timiș.',
  'Montaj & Service',
  'Echipa PRO TERM',
  7,
  TRUE,
  NOW(),
  'Service aer condiționat — frecvență și costuri 2026 | PRO TERM Arad',
  'Ghid complet service și întreținere aer condiționat. Revizii anuale în Arad și Timiș. Curățare, verificare agent frigorific, garanție lucrare.',
  ARRAY['service aer conditionat', 'intretinere', 'revizie', 'Arad']
),
(
  'pompa-de-caldura-vs-aer-conditionat',
  'Pompă de căldură vs Aer condiționat — Care e mai potrivit pentru tine?',
  'Comparăm pompele de căldură cu aparatele de aer condiționat: costuri, eficiență, confort și în ce situații să alegi fiecare soluție.',
  '## Ce sunt și cum funcționează

### Aparatul de aer condiționat (split)
Un aparat de aer condiționat clasic funcționează pe principiul transferului de căldură:
- Vara: extrage căldura din interior și o evacuează afară (răcire)
- Iarna: poate funcționa invers, aducând căldura din exterior în interior (încălzire)

Aparatele moderne de tip **Inverter R32** cu funcție pompă de căldură pot funcționa eficient până la temperaturi exterioare de -15°C sau chiar -25°C (modele special concepute).

### Pompa de căldură dedicată (aer-apă)
O pompă de căldură aer-apă este un sistem complet de încălzire/răcire:
- Preia căldura din aer exterior
- O transferă la un circuit de apă (radiatoare, pardoseală radiantă)
- Poate asigura și apa caldă menajeră

## Comparație detaliată

| Criteriu | Aer condiționat | Pompă de căldură aer-apă |
|----------|----------------|--------------------------|
| Cost instalare | 2.000 – 8.000 RON | 15.000 – 40.000 RON |
| Cost operare | Redus (COP 3-5) | Redus (COP 3-4.5) |
| Răcire | ✅ Excelent | ✅ Posibil (reversibil) |
| Încălzire | ✅ Eficient | ✅ Foarte eficient |
| ACM (apă caldă) | ❌ Nu | ✅ Da |
| Compatibil cu panouri solare | Parțial | ✅ Excelent |
| Complexitate instalare | Simplă | Complexă |
| Întreținere | Simplă | Moderată |

## Când alegi un aparat de aer condiționat

Aerul condiționat este soluția potrivită dacă:

1. Ai deja un sistem de încălzire funcțional (centrală termică, CAF)
2. Dorești răcire în sezonul estival + un plus de încălzire
3. Bugetul disponibil este limitat (2.000-6.000 RON)
4. Locuiești la apartament sau casă mică
5. Vrei o soluție rapidă de instalat (1 zi)

## Când alegi o pompă de căldură aer-apă

Pompa de căldură este soluția potrivită dacă:

1. Construiești o casă nouă sau renovezi complet
2. Vrei să renunți complet la gazul natural
3. Ai pardoseală radiantă sau radiatoare cu temperatură joasă
4. Dorești și prepararea apei calde menajere
5. Poți investi 20.000-40.000 RON în instalare

## Eficiența energetică și costurile

**Aparatele de aer condiționat moderne** au COP (Coefficient of Performance) de 3-5, adică pentru 1 kW de energie electrică consumată produc 3-5 kW de energie termică.

**Pompele de căldură aer-apă** au COP similar dar sunt optimizate pentru funcționare continuă la temperaturi mai scăzute.

## Sisteme VRV/VRF pentru spații comerciale

Pentru clădiri comerciale, birouri, retail sau industrial, **sistemele VRV/VRF** (Variable Refrigerant Volume/Flow) reprezintă soluția profesională:

- Un singur compresor exterior servește multiple unități interioare
- Control individual al temperaturii în fiecare zonă
- Recuperare de căldură între zone (zona caldă cedează căldura zonei reci)
- Soluție economică pentru clădiri cu > 5 zone climatizate

PRO TERM proiectează și instalează sisteme VRV la nivel național.

## Concluzie

**Pentru uz rezidențial** cu sistem de încălzire existent: aer condiționat.
**Pentru case noi fără gaz**: pompă de căldură aer-apă.
**Pentru birouri și retail**: sisteme VRV/VRF.

Contactați-ne la **0749 025 610** pentru o consultanță personalizată.',
  'Ghiduri',
  'Echipa PRO TERM',
  9,
  TRUE,
  NOW(),
  'Pompă de căldură vs Aer condiționat — Comparație completă 2026',
  'Comparație completă pompă de căldură vs aer condiționat: costuri, eficiență, instalare. Ghid PRO TERM pentru alegerea corectă.',
  ARRAY['pompa caldura', 'aer conditionat', 'eficienta energetica', 'VRV']
),
(
  'gree-midea-yamato-comparatie',
  'Gree vs Midea vs Yamato — Comparație completă pentru piața din România 2026',
  'Comparăm cele mai populare branduri de aer condiționat disponibile în România: Gree, Midea și Yamato. Specificații, prețuri, garanție și recomandări.',
  '## Introducere

Piața română de aer condiționat este dominată de trei branduri principale: Gree, Midea și Yamato. Toate trei oferă aparate de calitate, dar cu filozofii diferite de produs. Iată comparația noastră detaliată, bazată pe 25 de ani de experiență în service și vânzări HVAC.

## Gree — inovatorul chinez

**Fondat în:** 1991, Zhuhai, China
**Cotă de piață globală:** Locul 1 la unele categorii de produse

### Gama de produse disponibilă în România
- **Gree Clivia** — seria entry-level, R32, A++
- **Gree Cora** — seria mid-range, Wi-Fi integrat
- **Gree Pular** — seria premium cu autodiagnosticare
- **Gree U-Crown** — design vertical, camerele cu spații mici
- **Sistem VRF Gree GMV** — pentru aplicații comerciale

### Tehnologii distinctive Gree
- **Cold Plasma Generator** — ionizare pentru purificarea aerului
- **I-Feel** — senzor de temperatură în telecomandă
- **G10 Inverter** — compresor de generație 10 cu eficiență maximă
- **Auto-curățare** — evaporatorul se curăță automat după oprire

### Prețuri orientative Gree (cu TVA)
| Capacitate | Preț |
|------------|------|
| 9.000 BTU | 1.800-2.200 RON |
| 12.000 BTU | 2.200-2.800 RON |
| 18.000 BTU | 3.200-4.000 RON |
| 24.000 BTU | 4.500-5.500 RON |

## Midea — gigantul global

**Fondat în:** 1968, Foshan, China
**Statut:** Cel mai mare producător de aparate de aer condiționat din lume (500+ milioane unități fabricate)

### Gama de produse disponibilă în România
- **Midea Blanc** — seria accesibilă, R32, A++
- **Midea Xtreme Save** — focalizat pe eficiență energetică maximă
- **Midea Comfee** — gama cu AI integrat
- **Midea Aurora** — design premium, A+++
- **Midea M-Thermal** — pompe de căldură aer-apă

### Tehnologii distinctive Midea
- **AI EcoMaster** — inteligență artificială pentru optimizarea consumului
- **Inverter Compressor 3D** — comprimare pe 3 axe
- **HRF control** — recuperarea caldurii reziduele
- **Freezing Protection** — protecție la temperaturi exterioare de -30°C

### Prețuri orientative Midea (cu TVA)
| Capacitate | Preț |
|------------|------|
| 9.000 BTU | 1.600-2.000 RON |
| 12.000 BTU | 2.000-2.600 RON |
| 18.000 BTU | 2.900-3.700 RON |
| 24.000 BTU | 4.000-5.000 RON |

## Yamato — fiabilitatea japoneză

**Fondat în:** 2003, distribuit prin rețeaua japoneză Yamato Holdings
**Prezență România:** Din 2010, distribuit prin rețea națională

### Gama de produse disponibilă în România
- **Yamato Avanti** — seria standard, R32
- **Yamato Inverter Plus** — eficiență A++
- **Yamato Avanti Black** — design exclusivist

### Tehnologii distinctive Yamato
- **Golden Fin** — tratament anti-coroziv pe condensator, ideal pentru zone costiere sau cu umiditate ridicată
- **R32 standard** — toată gama folosește agentul frigorific R32 ecologic
- **Auto-restart** — repornire automată după o cădere de curent
- **Sleep mode** — reglaj automat al temperaturii pe durata nopții

### Prețuri orientative Yamato (cu TVA)
| Capacitate | Preț |
|------------|------|
| 9.000 BTU | 1.500-1.900 RON |
| 12.000 BTU | 1.900-2.400 RON |
| 18.000 BTU | 2.700-3.400 RON |
| 24.000 BTU | 3.800-4.800 RON |

## Comparație directă

| Criteriu | Gree | Midea | Yamato |
|----------|------|-------|--------|
| Calitate fabricație | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Raport calitate-preț | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Eficiență energetică | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Funcții smart/Wi-Fi | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Disponibilitate piese | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Gamă VRV/comercial | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Garanție standard | 2+3 ani | 2+3 ani | 2+2 ani |

## Recomandările noastre

**Alegeți Midea dacă:** Vreți cel mai bun raport calitate-preț cu tehnologie AI și eficiență maximă.

**Alegeți Gree dacă:** Vreți o gamă extinsă cu funcții avansate și planificați să extindeți sistemul cu unități VRF comerciale.

**Alegeți Yamato dacă:** Bugetul este mai redus și doriți un aparat fiabil fără funcții smart, sau locuiți în zone cu umiditate ridicată (Golden Fin).

## Concluzie

Toate trei branduri sunt de calitate și pot fi o alegere bună. PRO TERM vă oferă consultanță gratuită pentru a alege aparatul potrivit situației dumneavoastră specifice.

Sună la **0749 025 610** sau vizitează catalogul nostru: [Midea](/produse?brand=Midea) | [Gree](/produse?brand=Gree) | [Yamato](/produse?brand=Yamato)',
  'Comparații',
  'Echipa PRO TERM',
  10,
  TRUE,
  NOW(),
  'Gree vs Midea vs Yamato — Comparație 2026 | PRO TERM România',
  'Comparație completă Gree, Midea și Yamato aer condiționat în România. Prețuri, tehnologii, eficiență, garanție. Dealer autorizat PRO TERM.',
  ARRAY['Gree', 'Midea', 'Yamato', 'comparatie', 'aer conditionat Romania']
)
ON CONFLICT (slug) DO NOTHING;
