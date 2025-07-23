// deno-lint-ignore require-await
export default async (request: Request) => {
  const url = new URL(request.url);

  const targetPath = url.pathname.replace(/^\/ace-project/, ''); 
  const targetUrl = `https://aceprojects.netlify.app/ace-project/${targetPath}${url.search}`;

  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  });
};

export const config = {
  path: ['/ace-project', '/ace-project/*'],
};