/**
 * Resilient fetch that handles "Bad Gateway" (HTML) responses from tunnels
 * and ensures we always return valid JSON or a clear error.
 */
export async function resilientFetch(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type');
    
    if (!res.ok) {
      // If it's a 502/504 Bad Gateway from Localtunnel/Cloudflare
      if (res.status === 502 || res.status === 504) {
        throw new Error('Tunnel Timeout (Bad Gateway). Please refresh or wait a moment.');
      }
      
      try {
        const errorData = await res.json();
        throw new Error(errorData.error || `Request failed with status ${res.status}`);
      } catch (e) {
        throw new Error(`Request failed with status ${res.status}`);
      }
    }

    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    
    // If we got HTML (likely a tunnel error page or login redirect)
    const text = await res.text();
    if (text.includes('Bad Gateway') || text.includes('localtunnel')) {
      throw new Error('Tunnel Error (Bad Gateway). Try refreshing the page.');
    }
    
    throw new Error('Received non-JSON response from server.');
  } catch (error: any) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
}
