// deno-lint-ignore require-await
export default async (request: Request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Define multiple basePath => targetSite mappings
  const routes: Record<string, string> = {
    '/web-development': 'https://project2-site.netlify.app/web-development',
    '/acecms': 'https://acecms.netlify.app/acecms',
    '/graphic-design': 'https://design-site.netlify.app/graphic-design',
  };

  // Find matching base path
  const matchedBasePath = Object.keys(routes).find(base =>
    pathname.startsWith(base)
  );

  if (!matchedBasePath) {
    return new Response('Not Found', { status: 404 });
  }

  const targetBaseUrl = routes[matchedBasePath];

  // Remove the base path to get the subpath
  const subPath = pathname.replace(matchedBasePath, '');
  const targetUrl = `${targetBaseUrl}${subPath}${url.search}`;

  // Proxy the request to the target site
  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  });
};

export const config = {
  path: [
    '/web-development',
    '/web-development/*',
    '/acecms',
    '/acecms/*',
    '/graphic-design',
    '/graphic-design/*',
  ],
};
