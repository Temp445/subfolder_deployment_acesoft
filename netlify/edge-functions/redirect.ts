export default async (request: Request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  console.log('Edge function triggered for:', pathname); // Debug log

  let targetUrl;
  let targetPath;

  if (pathname === '/web-development' || pathname.startsWith('/web-development/')) {
    targetPath = pathname.replace(/^\/web-development/, '');
    // Handle root path
    if (!targetPath || targetPath === '') {
      targetPath = '/';
    }
    targetUrl = `https://project2-site.netlify.app/web-development${targetPath}`;
    if (url.search) {
      targetUrl += url.search;
    }
  } else if (pathname === '/mobile-development' || pathname.startsWith('/mobile-development/')) {
    targetPath = pathname.replace(/^\/mobile-development/, '');
    // Handle root path
    if (!targetPath || targetPath === '') {
      targetPath = '/';
    }
    targetUrl = `https://mobile-project-site.netlify.app${targetPath}`;
    if (url.search) {
      targetUrl += url.search;
    }
  } else {
    console.log('No matching path found for:', pathname);
    return new Response('Not Found', { status: 404 });
  }

  try {
    console.log('Fetching:', targetUrl);
    
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'User-Agent': request.headers.get('User-Agent') || 'Netlify Edge Function',
        'Accept': request.headers.get('Accept') || 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': request.headers.get('Accept-Language') || 'en-US,en;q=0.5',
      },
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      console.log('Target responded with error:', response.status);
      return new Response(`Target site error: ${response.status}`, { status: response.status });
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

  } catch (error) {
    console.error('Edge function error:', error);
    console.error('Target URL was:', targetUrl);
    return new Response(`Proxy Error: ${error.message}`, { status: 502 });
  }
};

export const config = {
  path: [
    '/web-development', 
    '/web-development/*',
    '/mobile-development',
    '/mobile-development/*'
  ],
};