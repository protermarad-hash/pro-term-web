export interface MontajOption {
  slug: string;
  name: string;
  price: number;
  btuLabel: string;
}

export const MONTAJ_SERVICE_AREA = ['Arad', 'Timiș'];

export function getMontajForBtu(btu: number): MontajOption {
  if (btu <= 12000) {
    return {
      slug: 'montaj-standard-9000-12000-btu',
      name: 'Montaj Standard 9.000–12.000 BTU',
      price: 750,
      btuLabel: '9.000–12.000 BTU',
    };
  }
  if (btu <= 18000) {
    return {
      slug: 'montaj-standard-18000-btu',
      name: 'Montaj Standard 18.000 BTU',
      price: 850,
      btuLabel: '18.000 BTU',
    };
  }
  return {
    slug: 'montaj-standard-24000-btu',
    name: 'Montaj Standard 24.000 BTU',
    price: 1150,
    btuLabel: '24.000 BTU',
  };
}

export function isInMontajServiceArea(county: string): boolean {
  return MONTAJ_SERVICE_AREA.some((c) => county.toLowerCase().includes(c.toLowerCase()));
}

export function isMontajSlug(slug: string): boolean {
  return slug.startsWith('montaj-standard-');
}
