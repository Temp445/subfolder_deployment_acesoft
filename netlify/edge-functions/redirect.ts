export default async (request: Request) => {
  const url = new URL(request.url);

  // Map each product prefix to its target domain
  const productMap: Record<string, string> = {
    '/acecms': 'https://acecms.netlify.app',
    '/web-development': 'https://project2-site.netlify.app',
    '/acemrp': 'https://acemrp.netlify.app',
    '/aceplm': 'https://aceplm.netlify.app',
  };

  // Find the matched prefix
  const matchedPrefix = Object.keys(productMap).find(prefix =>
    url.pathname.startsWith(prefix)
  );

  if (!matchedPrefix) {
    return new Response('Not Found', { status: 404 });
  }

  const targetBase = productMap[matchedPrefix];
  const internalPath = url.pathname.replace(matchedPrefix, '');
  const targetUrl = `${targetBase}${matchedPrefix}${internalPath}${url.search}`;

  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  });
};

export const config = {
  path: [
    '/acecms',
    '/acecms/*',
    '/web-development',
    '/web-development/*',
    '/acemrp',
    '/acemrp/*',
    '/aceplm',
    '/aceplm/*'
  ],
};
