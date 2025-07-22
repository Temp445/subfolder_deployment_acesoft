export default async (request: Request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Mapping of path prefixes to their respective Netlify project URLs
  const routeMap: Record<string, string> = {
    '/acecms': 'https://acecms.netlify.app',
    '/web-development': 'https://acecrm.netlify.app',
    '/aceerp': 'https://aceerp.netlify.app'
  };

  // Match the request path to a known base route
  const matchedBase = Object.keys(routeMap).find(prefix =>
    pathname.startsWith(prefix)
  );

  // If no match found, return 404
  if (!matchedBase) {
    return new Response('Not Found', { status: 404 });
  }

  // Construct the target URL
  const targetDomain = routeMap[matchedBase];
  const targetPath = pathname.replace(matchedBase, '');
  const targetUrl = `${targetDomain}${matchedBase}${targetPath}${url.search}`;

  // Proxy the request to the appropriate Netlify project
  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body
  });
};

// Register all route prefixes
export const config = {
  path: [
    '/acecms',
    '/acecms/*',
    '/web-development',
    '/web-development/*',
    '/aceerp',
    '/aceerp/*'
  ]
};
