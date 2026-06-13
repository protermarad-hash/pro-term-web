import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const baseUrl = 'https://pro-term.ro';

const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1.0, changeFrequency: 'daily' },
  { path: '/produse', priority: 0.9, changeFrequency: 'daily' },
  { path: '/multisplit', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/servicii', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/servicii/montaj', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/servicii/montaj-aer-conditionat-arad', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/servicii/montaj-aer-conditionat-timisoara', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/servicii/service-aer-conditionat-arad', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/servicii/service-aer-conditionat-timisoara', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/servicii/revizie-ac-arad', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/servicii/revizie-ac-timisoara', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/servicii/curatare-ac-arad', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/servicii/curatare-ac-timisoara', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/servicii/proiecte-hvac-romania', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/servicii/climatizare-comerciala-industriala-romania', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/calculator-btu', priority: 0.65, changeFrequency: 'monthly' },
  { path: '/despre', priority: 0.65, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.65, changeFrequency: 'weekly' },
  { path: '/informatii-legale', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/termeni-si-conditii', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/livrare-si-plata', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/politica-confidentialitate', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/politica-retur', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/politica-cookies', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/formular-retragere', priority: 0.3, changeFrequency: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return staticEntries;
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('active', true)
    .order('updated_at', { ascending: false });

  const productEntries: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${baseUrl}/produse/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
