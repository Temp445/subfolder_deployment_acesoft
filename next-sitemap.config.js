/** @type {import('next-sitemap').IConfig} */

const domainUrl = process.env.NEXT_PUBLIC_API_FRONTEND_URL || 'https://acesofts.netlify.app'; 

const config = {
  siteUrl: domainUrl,
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/admin/*', '/blog-admin/*'], // optional
  alternateRefs: [
    {
      href: `${domainUrl}/en`,
      hreflang: 'en',
    },
  ],
};

module.exports = config;
