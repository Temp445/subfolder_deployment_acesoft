const axios = require('axios');

const domainUrl = process.env.NEXT_PUBLIC_API_FRONTEND_URL || 'https://acesofts.netlify.app';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const locales = ['en', 'fr', 'de', 'es', 'it', 'ja', 'zh', 'hi', 'br', 'kr', 'be', 'ru'];

const staticPaths = [
  '',
  '/about',
  '/contact',
  '/products',
  '/request-callback',
  '/blog',
  '/demo',
];

const config = {
  siteUrl: domainUrl,
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/admin/*', '/blog-admin/*'],

  additionalPaths: async (config) => {
    const paths = [];

    locales.forEach((locale) => {
      staticPaths.forEach((path) => {
        paths.push({
          loc: `/${locale}${path}`,
          changefreq: config.changefreq,
          priority: path === '' ? 1.0 : config.priority,
          lastmod: new Date().toISOString(),
        });
      });
    });

    
    try {
      const blogRes = await axios.get(`${apiUrl}/api/blog`);
      const blogs = blogRes.data || [];

      blogs.forEach((blog) => {
        locales.forEach((locale) => {
          paths.push({
            loc: `/${locale}/blog/${blog.blogpath}`,
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: blog.updatedAt
              ? new Date(blog.updatedAt).toISOString()
              : new Date().toISOString(),
          });
        });
      });
    } catch (err) {
      console.error('Error fetching blogs for sitemap:', err.message);
    }

    return paths;
  },

  transform: async (config, path) => {
    const pathSegments = path.split('/');
    const pathWithoutLocale = '/' + pathSegments.slice(2).join('/');

    const alternateRefs = locales.map((locale) => ({
      hreflang: locale,
      href: `${config.siteUrl}/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
    }));

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
      alternateRefs,
    };
  },
};

module.exports = config;
