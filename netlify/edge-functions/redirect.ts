export default async (request: Request) => {
  const url = new URL(request.url);
  let targetUrl;

  // Extract locale from pathname (e.g., /en/, /es/, /fr/, etc.)
  const localeMatch = url.pathname.match(/^\/([a-z]{2})\//);
  const locale = localeMatch ? localeMatch[1] : null;
  const pathWithoutLocale = locale ? url.pathname.replace(`/${locale}`, '') : url.pathname;

  console.log('Locale detected:', locale);
  console.log('Path without locale:', pathWithoutLocale);
  console.log('Original pathname:', url.pathname);

  // Handle ace-calibration-management-system-on-cloud
  if (pathWithoutLocale.startsWith('/products/ace-calibration-management-system-on-cloud')) {
    // Forward the request with locale preserved to target site
    const targetPath = locale ? `/${locale}${pathWithoutLocale}` : pathWithoutLocale;
    targetUrl = `https://acecms.netlify.app${targetPath}${url.search}`;
  }
  // Handle ace-project-management-software
  else if (pathWithoutLocale.startsWith('/products/ace-project-management-software')) {
    // Forward the request with locale preserved to target site
    const targetPath = locale ? `/${locale}${pathWithoutLocale}` : pathWithoutLocale;
    targetUrl = `https://aceproject1.netlify.app${targetPath}${url.search}`;
  }
  // No match found
  else {
    return new Response(`Not Found - No match for: ${url.pathname}`, { status: 404 });
  }

  console.log('Target URL with locale:', targetUrl);
  
  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    });
    
    return response;
  } catch (error) {
    // Handle unknown error type safely
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
    
    console.error('Error message:', errorMessage);
    console.error('Error stack:', errorStack);
    
    return new Response(`Proxy error: ${errorMessage}`, { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};

export const config = {
  path: [
    // Without locale
    '/products/ace-calibration-management-system-on-cloud',
    '/products/ace-calibration-management-system-on-cloud/*',
    '/products/ace-project-management-software',
    '/products/ace-project-management-software/*',
    // With any 2-letter locale (en, es, fr, de, etc.)
    '/*/products/ace-calibration-management-system-on-cloud',
    '/*/products/ace-calibration-management-system-on-cloud/*',
    '/*/products/ace-project-management-software',
    '/*/products/ace-project-management-software/*'
  ],
};