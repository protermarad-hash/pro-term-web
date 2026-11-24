# Inventar materiale foto/video — pagini Vaillant

Stare la 24.11.2026. Configurare în cod: `src/lib/vaillant-experience.ts` (`VAILLANT_MEDIA`) și
`src/lib/vaillant-documents.ts` (documentații).

## Drept de utilizare

Ownerul PRO TERM a confirmat (decizie din 24.11.2026) că reprezentanții Vaillant au permis utilizarea
documentațiilor publice, a imaginilor și a logo-ului oficial Vaillant pe site-ul PRO TERM.
Rămân valabile: verificările tehnice și comerciale înaintea publicării, fără titulaturile
„Distribuitor autorizat Vaillant” / „Service autorizat Vaillant” până la o confirmare separată,
respectarea eventualelor instrucțiuni de brand Vaillant.

## Imagini și logo (fișiere în `public/media/vaillant/`)

Toate au fost descărcate pe 24.11.2026 de pe paginile publice vaillant.com.ro. Fișierele originale
sunt găzduite de Vaillant pe `vaillantprod-media.e-spirit.cloud` și `waaminioprodfc9546ee.blob.core.windows.net`.

| Fișier | Conținut | Pagina sursă | Fișier original | Utilizare pe site |
|---|---|---|---|---|
| vaillant-logo.svg | Logo Vaillant (verde #00917e) | /produse/arothermpro/ | /logos/vaillant.svg | Antet serie, pagină produs |
| vaillant-logo-white.svg | Logo Vaillant alb | /produse/arothermpro/ | /logos/white/vaillant.svg | Hero /vaillant |
| arotherm-pro.png | Unitate aroTHERM pro, fundal neutru | /produse/arothermpro/ | b2c-products/HP25-914421_01.png | Card serie, hero serie, imagine produs |
| arotherm-pro-lateral.png | aroTHERM pro, vedere laterală | /produse/arothermpro/ | b2c-products/HP25-914558_01.png | Rezervă (galerie) |
| arotherm-plus.png | Unitate aroTHERM plus | /produse/arothermplus/ | b2c-products/HP24-913911_01.png | Card serie, hero serie, imagine produs |
| arotherm-plus-2.png | aroTHERM plus, altă variantă | /produse/arothermplus/ | b2c-products/HP25-914496_01.png | Rezervă (galerie) |
| arotherm-split-plus.png | Unitate aroTHERM Split plus | /produse/arotherm-split-plus/ | b2c-products/aroTHERMsplitplus_white_background.jpg | Card serie, hero serie |
| hero-arotherm-plus.jpg | Key visual aroTHERM plus, răsărit | /produse/arothermplus/ | importedmedia/key-visual-arotherm-plus-4-3_IMAGE_21_9.jpg | Hero /vaillant (LCP) |
| johann-vaillant.jpg | Johann Vaillant lângă aroTHERM | /produse/arothermpro/ | importedmedia/johann-vaillant-21-9-green-background_IMAGE_21_9.jpg | „De ce Vaillant?” |
| anotimp-iarna.jpg | Unitate cu zăpadă | /produse/arothermpro/ | importedmedia/featurecard-260220-vaillant-quality.jpg | Anotimpuri |
| anotimp-primavara.jpg | Hamac în grădină | /produse/arotherm-split-plus/ | importedmedia/featurecard-arotherm-split-plus-silent.jpg | Anotimpuri (fără afirmații acustice) |
| anotimp-vara.jpg | Familie acasă | /produse/arotherm-split-plus/ | importedmedia/featurecard-arotherm-split-cooling.jpg | Anotimpuri, scenă Split plus |
| anotimp-toamna.jpg | Acasă, cu câinele | /produse/arothermplus/ | importedmedia/featurecard-warm-water-608x550-1.jpg | Anotimpuri |
| control-myvaillant.jpg | Aplicația myVAILLANT | /produse/arothermpro/ | importedmedia/featurecard-sensocomfort-myvaillant.jpg | Tehnologie: control |
| apa-calda-camera-tehnica.jpg | Cameră tehnică cu boiler | /produse/arothermplus/ | importedmedia/hp25-314243-01_IMAGE_21_9.jpg | Tehnologie: apă caldă |
| arotherm-pro-exterior.jpg | aroTHERM pro în exterior | /produse/arothermpro/ | importedmedia/hp25-000464-01.jpg | Scenă pagină serie pro |
| arotherm-plus-gradina.jpg | aroTHERM plus în grădină | /produse/arothermplus/ | importedmedia/hp25-000174-1.jpg | Scenă pagină serie plus |
| arotherm-pro-compact.jpg | aroTHERM pro lângă casă | /produse/arothermpro/ | importedmedia/featurecard-arotherm-pro-compact-608x550.jpg | Rezervă |
| arotherm-plus-detaliu.jpg | aroTHERM plus, detaliu | /produse/arothermplus/ | importedmedia/featurecard-arotherm-plus-new-efficiency-ok.jpg | Rezervă |

Reguli aplicate:
- imaginile de produs provin de pe pagina seriei din România (aceeași generație ca SKU-urile publicate);
- o imagine de serie nu este atribuită unui model anume (ex. 55 vs 125), pentru că sursa nu precizează modelul;
  pe pagina de produs rămâne mențiunea „Imaginile produsului au caracter informativ”;
- nu se folosesc imagini cu instalatori lângă textele despre echipa PRO TERM, ca să nu sugereze că sunt angajați PRO TERM.

## Video

| Slot | Status |
|---|---|
| Video A — hero (7–10 s) | **BLOCKED**: nu există clip descărcat sau licențiat. Infrastructura (`HeroBackdrop`) e gata; hero-ul folosește key visual-ul oficial. |
| Video B — film (~30 s) | **BLOCKED**: storyboard în `STORYBOARD-VIDEO.md`; secțiunea apare doar pe Preview. |

Canalele video oficiale Vaillant nu au fost verificate pentru încorporare (embed). Dacă se folosesc,
embed-ul trebuie să respecte consimțământul cookie.

## Documentații

Linkuri directe către PDF-urile oficiale (broșuri RO, fișe tehnice ErP, etichete ErP, instrucțiuni),
extrase din metadatele paginilor de serie: `src/lib/vaillant-documents.ts`. Lipsesc etichete ErP
publice pentru 5 modele aroTHERM pro și pentru VWL 105/8.1 A 400V.
