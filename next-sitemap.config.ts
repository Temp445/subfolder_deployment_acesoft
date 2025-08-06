// next-sitemap.config

import type { IConfig } from 'next-sitemap';
const domainUrl = process.env.NEXT_PUBLIC_API_FRONTEND_URL;

const config: IConfig = {
  siteUrl: `${domainUrl}`, 
  generateRobotsTxt: true, 
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/admin/*', '/blog-admin/*'], // optional
  alternateRefs: [
    { href: `${domainUrl}/en`, hreflang: 'en' }
  ],
};

export default config;
