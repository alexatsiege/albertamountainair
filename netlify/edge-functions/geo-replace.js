// Netlify Edge Function — Dynamic location insertion
// Replaces {{city}} placeholders in HTML with the visitor's detected city
// Falls back to a default if the city isn't in the service area

export default async (request, context) => {
  // Let POST requests (form submissions) and Netlify internals pass through unmodified
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return context.next();
  }

  const url = new URL(request.url);
  // Skip Netlify's internal paths
  if (url.pathname.startsWith('/.netlify/')) {
    return context.next();
  }

  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';

  // Only process HTML responses
  if (!contentType.includes('text/html')) {
    return response;
  }

  let html = await response.text();

  // Skip if no placeholders found
  if (!html.includes('{{city}}')) {
    return new Response(html, response);
  }

  // Service area towns (lowercase for matching)
  const serviceAreaTowns = [
    // Worcester County
    'ashburnham', 'athol', 'berlin', 'bolton', 'boylston', 'clinton',
    'fitchburg', 'gardner', 'harvard', 'holden', 'hubbardston', 'hudson',
    'lancaster', 'leominster', 'lunenburg', 'marlborough', 'northborough',
    'oakham', 'paxton', 'philipston', 'princeton', 'rutland', 'shrewsbury',
    'southborough', 'spencer', 'sterling', 'templeton', 'west boylston',
    'westborough', 'westminster', 'winchendon', 'worcester',
    // Middlesex County
    'acton', 'ashby', 'ayer', 'boxborough', 'carlisle', 'concord',
    'dunstable', 'framingham', 'groton', 'lexington', 'lincoln',
    'littleton', 'maynard', 'pepperell', 'shirley', 'stow', 'sudbury',
    'townsend', 'wayland', 'westford', 'weston',
  ];

  // Default fallback text when city is unknown or outside service area
  const fallback = 'Worcester County';

  // Get city from Netlify's built-in geo (powered by MaxMind)
  const detectedCity = context.geo?.city || '';
  const isInServiceArea = serviceAreaTowns.includes(detectedCity.toLowerCase());

  // Use detected city if in service area, otherwise fallback
  // Capitalize properly (e.g., "west boylston" → "West Boylston")
  const displayCity = isInServiceArea
    ? detectedCity.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    : fallback;

  // Replace all {{city}} placeholders
  html = html.replaceAll('{{city}}', displayCity);

  return new Response(html, {
    status: response.status,
    headers: response.headers,
  });
};

export const config = {
  // Run on all paths — only processes HTML with {{city}} placeholders
  path: '/*',
};
