import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/',
        '/api/',
        '/cont/profil',
        '/cont/profil/',
        '/checkout',
        '/checkout/',
        '/comanda-confirmata/',
        '/formular-retragere',
      ],
    },
    sitemap: 'https://pro-term.ro/sitemap.xml',
  };
}
