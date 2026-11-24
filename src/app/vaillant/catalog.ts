import 'server-only';

import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSupabaseServiceClient } from '@/lib/supabase-admin';
import { fetchBrandCatalog, type CatalogItem } from '@/lib/product-commercial-server';
import { isDraftPreviewEnabled } from '@/lib/product-commercial';
import { HEAT_PUMP_CATEGORY, VAILLANT_BRAND } from '@/lib/vaillant-catalog';

export const SITE_URL = 'https://pro-term.ro';

export interface VaillantCatalog {
  items: CatalogItem[];
  isLive: boolean;
  preview: boolean;
}

/**
 * Launch gate for every /vaillant page: in production the pages exist only
 * once at least one Vaillant heat pump is active (published from admin).
 * Before that they are drafts, visible only in development / Vercel Preview.
 */
export const getVaillantCatalog = cache(async (): Promise<VaillantCatalog> => {
  const preview = isDraftPreviewEnabled();
  const catalog = await fetchBrandCatalog(getSupabaseServiceClient(), {
    brand: VAILLANT_BRAND,
    category: HEAT_PUMP_CATEGORY,
    includeDrafts: preview,
  });
  return { ...catalog, preview };
});

export async function requireVaillantCatalog(): Promise<VaillantCatalog> {
  const catalog = await getVaillantCatalog();
  if (!catalog.isLive && !catalog.preview) notFound();
  return catalog;
}

/** Drafts and preview deployments are never indexed. */
export function vaillantRobots(catalog: VaillantCatalog): Metadata['robots'] {
  return catalog.isLive && !catalog.preview ? undefined : { index: false, follow: false };
}

export function showDraftBanner(catalog: VaillantCatalog): boolean {
  return catalog.preview && !catalog.isLive;
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
