
export default async (request: Request) => {
  const url = new URL(request.url);
  let targetUrl;

  console.log('=== EDGE FUNCTION DEBUG START ===');
  console.log('Request method:', request.method);
  console.log('Request URL:', request.url);
  console.log('URL pathname:', url.pathname);
  console.log('URL search:', url.search);
  console.log('URL hash:', url.hash);

  // Handle ace-calibration-management-system-on-cloud (with or without /en/ prefix)
  if (url.pathname.startsWith('/products/ace-calibration-management-system-on-cloud') || 
      url.pathname.startsWith('/en/products/ace-calibration-management-system-on-cloud')) {
    // Remove /en prefix if present for the target URL
    const cleanPath = url.pathname.replace(/^\/en/, '');
    targetUrl = `https://acecms.netlify.app${cleanPath}${url.search}`;
    console.log('✅ MATCHED: ace-calibration path');
    console.log('Original path:', url.pathname);
    console.log('Clean path:', cleanPath);
    console.log('Target URL:', targetUrl);
  }
  // Handle ace-project-management-software (with or without /en/ prefix)
  else if (url.pathname.startsWith('/products/ace-project-management-software') || 
           url.pathname.startsWith('/en/products/ace-project-management-software')) {
    // Remove /en prefix if present for the target URL
    const cleanPath = url.pathname.replace(/^\/en/, '');
    targetUrl = `https://aceproject1.netlify.app${cleanPath}${url.search}`;
    console.log('✅ MATCHED: ace-project path');
    console.log('Original path:', url.pathname);
    console.log('Clean path:', cleanPath);
    console.log('Target URL:', targetUrl);
  }
  // No match found
  else {
    console.log('❌ NO MATCH FOUND for pathname:', url.pathname);
    console.log('Available paths:');
    console.log('  - /products/ace-calibration-management-system-on-cloud');
    console.log('  - /en/products/ace-calibration-management-system-on-cloud');
    console.log('  - /products/ace-project-management-software');
    console.log('  - /en/products/ace-project-management-software');
    return new Response(`Not Found - No match for: ${url.pathname}`, { status: 404 });
  }

  console.log('Making fetch request to:', targetUrl);
  
  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    });
    
    console.log('✅ Fetch successful');
    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('=== EDGE FUNCTION DEBUG END ===');
    
    return response;
  } catch (error) {
    console.log('❌ Fetch failed');
    console.error('Fetch error:', error);
    
    // Handle unknown error type safely
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
    
    console.error('Error message:', errorMessage);
    console.error('Error stack:', errorStack);
    console.log('=== EDGE FUNCTION DEBUG END ===');
    
    return new Response(`Proxy error: ${errorMessage}`, { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};

export const config = {
  path: [
    '/products/ace-calibration-management-system-on-cloud',
    '/products/ace-calibration-management-system-on-cloud/*',
    '/en/products/ace-calibration-management-system-on-cloud',
    '/en/products/ace-calibration-management-system-on-cloud/*',
    '/products/ace-project-management-software',
    '/products/ace-project-management-software/*',
    '/en/products/ace-project-management-software',
    '/en/products/ace-project-management-software/*'
  ],
};