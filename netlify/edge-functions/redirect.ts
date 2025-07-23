export default async (request: Request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  let targetUrl;

  if (pathname.startsWith('/web-development')) {
    const targetPath = pathname.replace(/^\/web-development/, '');
    targetUrl = `https://project2-site.netlify.app/web-development${targetPath}${url.search}`;
  } else if (pathname.startsWith('/mobile-development')) {
    const targetPath = pathname.replace(/^\/mobile-development/, '');
    targetUrl = `https://project2-site.netlify.app/mobile-development${targetPath}${url.search}`;
  } else {
    // Fallback or error handling
    return new Response('Not Found', { status: 404 });
  }

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
    '/mobile-development',
    '/mobile-development/*'
  ],
};