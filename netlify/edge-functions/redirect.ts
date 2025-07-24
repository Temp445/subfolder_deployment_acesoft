// deno-lint-ignore require-await
export default async (request: Request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Define mappings for each product/subfolder
  const mappings: Record<string, string> = {
    '/acecms': 'https://acecms.netlify.app/acecms',
    '/ace-project': 'https://aceprojects.netlify.app/ace-project',
    '/web-development': 'https://project2-site.netlify.app/web-development',
    // Add more subfolders here if needed
  };

  // Find a matching prefix
  const matchedPrefix = Object.keys(mappings).find(prefix =>
    pathname === prefix || pathname.startsWith(prefix + '/')
  );

  if (!matchedPrefix) {
    return new Response('Not Found', { status: 404 });
  }

  const targetBase = mappings[matchedPrefix];
  const targetPath = pathname.replace(matchedPrefix, '');
  const targetUrl = `${targetBase}${targetPath}${url.search}`;

  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  });
};

export const config = {
  path: [
    '/acecms', '/acecms/*',
    '/ace-project', '/ace-project/*',
    '/web-development', '/web-development/*',
    // Add paths here if more products are added
  ],
};
