export default function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': ['HVACBusiness', 'LocalBusiness', 'Store'],
    name: 'PRO TERM SRL',
    legalName: 'PRO TERM SRL',
    url: 'https://pro-term.ro',
    logo: 'https://pro-term.ro/logo-proterm.jpg',
    image: 'https://pro-term.ro/logo-proterm.jpg',
    telephone: '+40749025610',
    email: 'office@pro-term.ro',
    taxID: '11355602',
    vatID: 'RO11355602',
    identifier: [
      {
        '@type': 'PropertyValue',
        name: 'Nr. ordine Registrul Comerțului',
        value: 'J199900003027',
      },
      {
        '@type': 'PropertyValue',
        name: 'EUID',
        value: 'ROONRC.J199900003027',
      },
      {
        '@type': 'PropertyValue',
        name: 'CAEN',
        value: '4322 - Lucrări de instalații sanitare, de încălzire și de aer condiționat',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Aleea Neptun nr. 4, bl. Y3, etaj 7, ap. 31',
      addressLocality: 'Arad',
      addressRegion: 'Arad',
      addressCountry: 'RO',
    },
    areaServed: [
      { '@type': 'City', name: 'Arad' },
      { '@type': 'City', name: 'Timișoara' },
      { '@type': 'Country', name: 'România' },
    ],
    serviceType: [
      'Comercializare echipamente HVAC',
      'Montaj aer condiționat',
      'Service aer condiționat',
      'Revizie aer condiționat',
      'Mentenanță HVAC',
      'Proiecte HVAC comerciale și industriale',
    ],
    foundingDate: '1999-01-14',
    priceRange: '$$',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+40749025610',
      contactType: 'customer service',
      areaServed: 'RO',
      availableLanguage: ['ro'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
