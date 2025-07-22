export default async (request: Request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  let targetDomain = '';
  let basePath = '';
  let targetPath = '';

  if (pathname.startsWith('/web-development')) {
    targetDomain = 'https://project2-site.netlify.app';
    basePath = '/web-development';
  } else if (pathname.startsWith('/acecms')) {
    targetDomain = 'https://project3-site.netlify.app';
    basePath = '/acecms';
  } else {
    return new Response('Not Found', { status: 404 });
  }

  // Remove basePath from original pathname
  targetPath = pathname.replace(basePath, '');

  const targetUrl = `${targetDomain}${basePath}${targetPath}${url.search}`;

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
    '/acecms/*'
  ]
};
