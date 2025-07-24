// deno-lint-ignore require-await
export default async (request: Request) => {
  const url = new URL(request.url);
  
  // Define path mappings
  const pathMappings = {
    '/products/ace-calibration-management-system-on-cloud': 'https://acecms.netlify.app/products/ace-calibration-management-system-on-cloud',
    '/products/ace-project-management-software': 'https://aceproject1.netlify.app/products/ace-project-management-software'
  };
  
  // Get the base path (without trailing slashes and sub-paths)
  const basePath = url.pathname.replace(/\/+$/, ''); // Remove trailing slashes
  
  // Find matching target URL
  let targetBaseUrl = null;
  for (const [path, targetUrl] of Object.entries(pathMappings)) {
    if (basePath === path || basePath.startsWith(path + '/')) {
      targetBaseUrl = targetUrl;
      break;
    }
  }
  
  // If no mapping found, return 404
  if (!targetBaseUrl) {
    return new Response('Not Found', { status: 404 });
  }
  
  // Construct the full target URL
  const targetUrl = `${targetBaseUrl}${url.pathname.replace(basePath, '')}${url.search}`;

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