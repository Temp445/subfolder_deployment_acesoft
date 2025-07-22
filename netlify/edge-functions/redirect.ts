export default async (request: Request) => {
  const url = new URL(request.url);

  const path = ['https://acecms.netlify.app', 'https://project2-site.netlify.app']
  // List of supported product path prefixes
  const supportedPrefixes = ['/acecms', '/web-development', '/acemrp', '/aceplm'];

  // Find the matching prefix
  const matchedPrefix = supportedPrefixes.find(prefix => url.pathname.startsWith(prefix));

  if (!matchedPrefix) {
    return new Response('Not Found', { status: 404 });
  }

  // Remove the prefix and prepare the target path
  const targetPath = url.pathname.replace(matchedPrefix, '');

  // Use the matchedPrefix (without slash) as subfolder
  const subfolder = matchedPrefix.replace('/', ''); // e.g., 'acecms'

  const targetUrl = `${path}/${subfolder}${targetPath}${url.search}`;

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
