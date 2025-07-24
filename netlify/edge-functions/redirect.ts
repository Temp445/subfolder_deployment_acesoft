// deno-lint-ignore require-await
export default async (request: Request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Define mappings from route prefix → target base URL
  const mappings: Record<string, string> = {
    '/products/ace-calibration-management-system-on-cloud': 'https://acecms.netlify.app/products/ace-calibration-management-system-on-cloud',
    '/products/ace-project-management-software': 'https://aceproject1.netlify.app/products/ace-project-management-software',
    '/web-development': 'https://project2-site.netlify.app/web-development',
  };

  // Match the most specific prefix (longest match)
  const matchedPrefix = Object.keys(mappings)
    .sort((a, b) => b.length - a.length)
    .find(prefix => pathname === prefix || pathname.startsWith(prefix + '/'));

  if (!matchedPrefix) {
    return new Response('Not Found', { status: 404 });
  }

  const targetBase = mappings[matchedPrefix];
  const suffixPath = pathname.slice(matchedPrefix.length); 
  const targetUrl = `${targetBase}${suffixPath}${url.search}`;

  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  });
};

export const config = {
  path: [
    '/products/ace-calibration-management-system-on-cloud',
    '/products/ace-calibration-management-system-on-cloud/*',
    '/products/ace-project-management-software',
    '/products/ace-project-management-software/*',
    '/web-development',
    '/web-development/*',
  ],
};
