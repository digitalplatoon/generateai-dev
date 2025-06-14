
export interface SiteMapRoute {
  path: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastmod?: string;
}

export const siteMapRoutes: SiteMapRoute[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/auth', priority: 0.8, changefreq: 'monthly' },
  { path: '/dashboard', priority: 0.9, changefreq: 'daily' },
  { path: '/paths', priority: 0.9, changefreq: 'weekly' },
  { path: '/prompts', priority: 0.8, changefreq: 'weekly' },
  { path: '/rag-lab', priority: 0.8, changefreq: 'weekly' },
  { path: '/agents', priority: 0.8, changefreq: 'weekly' },
  { path: '/docs', priority: 0.7, changefreq: 'weekly' },
  { path: '/api', priority: 0.7, changefreq: 'monthly' },
  { path: '/community', priority: 0.6, changefreq: 'weekly' },
  { path: '/blog', priority: 0.8, changefreq: 'daily' },
  { path: '/about', priority: 0.5, changefreq: 'monthly' },
  { path: '/careers', priority: 0.4, changefreq: 'monthly' },
  { path: '/contact', priority: 0.5, changefreq: 'monthly' },
  { path: '/subscription', priority: 0.7, changefreq: 'weekly' },
  { path: '/terms', priority: 0.3, changefreq: 'yearly' },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { path: '/cookies', priority: 0.3, changefreq: 'yearly' }
];

export const generateSitemap = (baseUrl: string = 'https://generateai.dev'): string => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${siteMapRoutes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${route.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};
