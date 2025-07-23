export default async (request: Request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  let targetUrl;
  let targetPath;

  if (pathname.startsWith('/web-development')) {
    targetPath = pathname.replace(/^\/web-development/, '');
    // Ensure path starts with / and handle empty path
    if (!targetPath || targetPath === '') {
      targetPath = '/';
    } else if (!targetPath.startsWith('/')) {
      targetPath = '/' + targetPath;
    }
    targetUrl = `https://project2-site.netlify.app/web-development${targetPath}`;
    // Add search params if they exist
    if (url.search) {
      targetUrl += url.search;
    }
  } else if (pathname.startsWith('/mobile-development')) {
    targetPath = pathname.replace(/^\/mobile-development/, '');
    // Ensure path starts with / and handle empty path  
    if (!targetPath || targetPath === '') {
      targetPath = '/';
    } else if (!targetPath.startsWith('/')) {
      targetPath = '/' + targetPath;
    }
    targetUrl = `https://mobile-project-site.netlify.app${targetPath}`;
    // Add search params if they exist
    if (url.search) {
      targetUrl += url.search;
    }
  } else {
    return new Response('Not Found', { status: 404 });
  }

  try {
    console.log('Fetching:', targetUrl); // Debug log
    
    // Create new headers object to avoid issues with immutable headers
    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
      // Skip headers that might cause issues in production
      if (!['host', 'connection', 'upgrade-insecure-requests'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.clone().arrayBuffer(),
    });

    // Create response with proper headers
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete('x-frame-options'); // Remove if causing issues
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Edge function error:', error);
    console.error('Target URL was:', targetUrl);
    return new Response('Internal Server Error', { status: 500 });
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