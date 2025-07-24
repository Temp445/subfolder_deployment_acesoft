// deno-lint-ignore require-await
export default async (request: Request) => {
  const url = new URL(request.url);
  let targetUrl;

  // Handle ace-calibration-management-system-on-cloud
  if (url.pathname.startsWith('/products/ace-calibration-management-system-on-cloud')) {
    targetUrl = `https://acecms.netlify.app${url.pathname}${url.search}`;
  }
  // Handle ace-project-management-software  
  else if (url.pathname.startsWith('/products/ace-project-management-software')) {
    targetUrl = `https://aceproject1.netlify.app${url.pathname}${url.search}`;
  }
  // No match found
  else {
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
    '/products/ace-calibration-management-system-on-cloud',
    '/products/ace-calibration-management-system-on-cloud/*',
    '/products/ace-project-management-software',
    '/products/ace-project-management-software/*'
  ],
};