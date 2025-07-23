export default async (request: Request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  console.log('Edge function triggered for:', pathname);

  let targetUrl;
  let targetPath;

  if (pathname === '/web-development' || pathname.startsWith('/web-development/')) {
    targetPath = pathname.replace(/^\/web-development/, '');
    if (!targetPath || targetPath === '') {
      targetPath = '/';
    }
    // REPLACE THESE WITH YOUR ACTUAL SITE URLS
    targetUrl = `https://project2-site.netlify.app/web-development${targetPath}`;
    if (url.search) {
      targetUrl += url.search;
    }
  } else if (pathname === '/acecms' || pathname.startsWith('/acecms/')) {
    targetPath = pathname.replace(/^\/acecms/, '');
    if (!targetPath || targetPath === '') {
      targetPath = '/';
    }
    // REPLACE THESE WITH YOUR ACTUAL SITE URLS  
    targetUrl = `https://acecms.netlify.app/acecms${targetPath}`;
    if (url.search) {
      targetUrl += url.search;
    }
  } else {
    console.log('No matching path found for:', pathname);
    return new Response('Not Found - Edge Function Working', { status: 404 });
  }

  // First check if target site exists
  try {
    console.log('Testing target URL:', targetUrl);
    
    const testResponse = await fetch(targetUrl, { method: 'HEAD' });
    console.log('Target site response:', testResponse.status);
    
    if (!testResponse.ok) {
      return new Response(`Target site not accessible: ${targetUrl} (Status: ${testResponse.status})`, { 
        status: 502,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  } catch (error) {
    console.error('Target site error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(`Target site unreachable: ${targetUrl} - ${errorMessage}`, { 
      status: 502,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // If target exists, proxy the request
  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'User-Agent': request.headers.get('User-Agent') || 'Netlify Edge Function',
        'Accept': request.headers.get('Accept') || 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

  } catch (error) {
    console.error('Proxy error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(`Proxy Error: ${errorMessage}`, { status: 502 });
  }
};

export const config = {
  path: [
    '/web-development', 
    '/web-development/*',
    '/acecms',
    '/acecms/*'
  ],
};