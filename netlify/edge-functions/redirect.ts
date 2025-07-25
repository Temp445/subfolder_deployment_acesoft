export default async (request: Request) => {
  const url = new URL(request.url);
  let targetUrl;
  
  // Define supported languages
  const supportedLanguages = ['en', 'hi', 'es', 'fr', 'de', 'ja', 'zh', 'kr', 'pt', 'ru', 'be', 'br', 'it'];
  
  // Create regex patterns for language prefixes
  const langPattern = `(${supportedLanguages.join('|')})`;
  const aceCalibrationPattern = new RegExp(`^(\/${langPattern})?\/products\/ace-calibration-management-system-on-cloud`);
  const aceProjectPattern = new RegExp(`^(\/${langPattern})?\/products\/ace-project-management-software`);
  
  // Handle ace-calibration-management-system-on-cloud (with any supported language prefix)
  if (aceCalibrationPattern.test(url.pathname)) {
    // Remove language prefix if present for the target URL
    const cleanPath = url.pathname.replace(new RegExp(`^\/${langPattern}`), '');
    targetUrl = `https://acecms.netlify.app${cleanPath}${url.search}`;
  }
  // Handle ace-project-management-software (with any supported language prefix)
  else if (aceProjectPattern.test(url.pathname)) {
    // Remove language prefix if present for the target URL
    const cleanPath = url.pathname.replace(new RegExp(`^\/${langPattern}`), '');
    targetUrl = `https://aceproject1.netlify.app${cleanPath}${url.search}`;
  }
  // No match found
  else {
    return new Response(`Not Found - No match for: ${url.pathname}`, { status: 404 });
  }
  
  console.log('Making fetch request to:', targetUrl);
  
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

// Generate paths for all supported languages
const generatePaths = () => {
  const supportedLanguages = ['en', 'hi', 'es', 'fr', 'de', 'ja', 'zh', 'be', 'br', 'ru', 'kr','it'];
  const basePaths = [
    '/products/ace-calibration-management-system-on-cloud',
    '/products/ace-calibration-management-system-on-cloud/*',
    '/products/ace-project-management-software',
    '/products/ace-project-management-software/*'
  ];
  
  const paths = [...basePaths]; // Include base paths without language prefix
  
  // Add paths with language prefixes
  supportedLanguages.forEach(lang => {
    basePaths.forEach(path => {
      paths.push(`/${lang}${path}`);
    });
  });
  
  return paths;
};

export const config = {
  path: generatePaths()
};