// deno-lint-ignore-file
export default async (request: Request) => {
  const url = new URL(request.url);
  let targetUrl: string | null = null;

  if (url.pathname.startsWith('/web-development')) {
    const targetPath = url.pathname.replace(/^\/web-development/, '');
    targetUrl = `https://project2-site.netlify.app/web-development${targetPath}${url.search}`;
  } else if (url.pathname.startsWith('/acecms')) {
    const targetPath = url.pathname.replace(/^\/acecms/, '');
    targetUrl = `https://acecms.netlify.app/web-development${targetPath}${url.search}`;
  }

  if (!targetUrl) {
    return new Response('Not found', { status: 404 });
  }

  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  });
};

export const config = {
  path: ['/web-development', '/web-development/*', '/acecms', '/acecms/*'],
};
