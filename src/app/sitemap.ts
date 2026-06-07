import type { MetadataRoute } from 'next';

const baseUrl = 'https://pro-term.ro';

const routes = [
  '',
  '/produse',
  '/despre',
  '/informatii-legale',
  '/termeni-si-conditii',
  '/livrare-si-plata',
  '/politica-confidentialitate',
  '/politica-retur',
  '/politica-cookies',
  '/formular-retragere',
  '/servicii/montaj-aer-conditionat-arad',
  '/servicii/montaj-aer-conditionat-timisoara',
  '/servicii/service-aer-conditionat-arad',
  '/servicii/service-aer-conditionat-timisoara',
  '/servicii/revizie-ac-arad',
  '/servicii/revizie-ac-timisoara',
  '/servicii/curatare-ac-arad',
  '/servicii/curatare-ac-timisoara',
  '/servicii/proiecte-hvac-romania',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' || route === '/produse' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/produse' ? 0.9 : route.startsWith('/servicii') ? 0.75 : 0.65,
  }));
}
