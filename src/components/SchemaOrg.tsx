export default function SchemaOrg() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://pro-term.ro/#organization',
    name: 'PRO TERM SRL',
    alternateName: 'PROTERM',
    description:
      'Firmă HVAC din Arad fondată în 1999. Dealer autorizat Gree, Midea și Yamato. Montaj și service aer condiționat în județele Arad și Timiș. Livrare echipamente în toată România. Proiecte VRV comerciale și industriale la nivel național.',
    url: 'https://pro-term.ro',
    telephone: '+40749025610',
    email: 'proterm.arad@gmail.com',
    foundingDate: '1999',
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 6 },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Arad',
      addressLocality: 'Arad',
      addressRegion: 'Arad',
      postalCode: '310000',
      addressCountry: 'RO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 46.1865,
      longitude: 21.3123,
    },
    /* Montaj/service: Arad + Timiș; vânzare produse + proiecte VRV: toată România */
    areaServed: [
      {
        '@type': 'AdministrativeArea',
        name: 'Județul Arad',
        description: 'Montaj, service și mentenanță aer condiționat',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Județul Timiș',
        description: 'Montaj, service și mentenanță aer condiționat',
      },
      {
        '@type': 'Country',
        name: 'Romania',
        description: 'Livrare echipamente HVAC și proiecte VRV comerciale',
      },
    ],
    serviceType: [
      'Montaj aer condiționat',
      'Service HVAC',
      'Mentenanță HVAC',
      'Sisteme VRV',
      'Climatizare comercială',
      'Climatizare industrială',
      'Livrare echipamente HVAC',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Echipamente HVAC și Climatizare',
    },
    brand: [
      { '@type': 'Brand', name: 'Gree' },
      { '@type': 'Brand', name: 'Midea' },
      { '@type': 'Brand', name: 'Yamato' },
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'ISO 9001',
        name: 'Sistem de management al calității certificat internațional',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'F-Gas/AGFR',
        name: 'Certificare manipulare agenți frigorifici fluorurați',
      },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    currenciesAccepted: 'RON',
    paymentAccepted: 'Cash, Transfer bancar',
    knowsAbout: [
      'HVAC',
      'Climatizare',
      'Sisteme VRV',
      'Refrigerare industrială',
      'Aer condiționat',
      'Pompe de căldură',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
