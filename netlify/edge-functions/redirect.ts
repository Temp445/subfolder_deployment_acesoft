// deno-lint-ignore require-await
export default async (request: Request) => {
  const url = new URL(request.url);

  const targetPath = url.pathname.replace(/^\/web-development/, ''); 
  const targetUrl = `https://acecms.netlify.app/products/ace-calibration-management-system-on-cloud/${targetPath}${url.search}`;

  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  });
};

export const config = {
  path: ['/products/ace-calibration-management-system-on-cloud', '/products/ace-calibration-management-system-on-cloud//*'],
};