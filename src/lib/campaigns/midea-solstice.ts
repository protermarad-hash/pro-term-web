// Midea Solstice — campanie octombrie 2026. Sursă unică pentru datele
// comerciale confirmate, ca să nu existe prețuri/date duplicate și divergente
// între banner, scriptul de activare și mecanismul de revenire automată.
//
// Prețurile de campanie sunt cele confirmate comercial — afișate ca atare,
// fără recalculare. Activarea campaniei NU trebuie să seteze un "preț
// anterior" (originalPrice): mecanismul de verificare a celui mai mic preț
// din ultimele 30 de zile (necesar legal pentru a afișa o reducere/preț
// barat) nu este implementat în proiect — vezi
// docs/legal/ECOMMERCE_LEGAL_COMPLIANCE_ROADMAP_2026.md, LEGAL-4. De aceea
// scriptul de activare (src/lib/campaigns/midea-solstice-server.ts) șterge
// explicit original_price la activare, indiferent de valoarea sa anterioară
// — nu presupunem că e NULL.

export interface MideaSolsticeModel {
  slug: string;
  btu: 9000 | 12000;
  name: string;
  smartbillCode: string;
  /** Preț de campanie — confirmat comercial, nerecalculat. */
  campaignPrice: number;
  /** Preț normal, dinainte de campanie — ținta de revenire automată. */
  normalPrice: number;
}

export const MIDEA_SOLSTICE_MODELS: readonly MideaSolsticeModel[] = [
  {
    slug: 'midea-solstice-9000-btu',
    btu: 9000,
    name: 'Midea Solstice 9000 BTU',
    smartbillCode: 'EZ-09RD6-I',
    campaignPrice: 2149,
    normalPrice: 2575,
  },
  {
    slug: 'midea-solstice-12000-btu',
    btu: 12000,
    name: 'Midea Solstice 12000 BTU',
    smartbillCode: 'EZ-12RD6-I',
    campaignPrice: 2294,
    normalPrice: 2685,
  },
];

/** Ultima zi a campaniei, inclusiv, ora României (EET, UTC+2 — DST se încheie
 * duminică 25.10.2026, deci 30.10.2026 este deja oră de iarnă). */
export const MIDEA_SOLSTICE_CAMPAIGN_END = new Date('2026-10-30T23:59:59+02:00');

export const MIDEA_SOLSTICE_CAMPAIGN_END_LABEL = MIDEA_SOLSTICE_CAMPAIGN_END.toLocaleDateString('ro-RO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** `now` injectabil pentru teste; implicit data curentă. */
export function isMideaSolsticeCampaignActive(now: Date = new Date()): boolean {
  return now.getTime() <= MIDEA_SOLSTICE_CAMPAIGN_END.getTime();
}
