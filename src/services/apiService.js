/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  API SERVICE - NEØ SMART FACTORY                         ║
 * ║  Resilient HTTP client with timeout & error handling     ║
 * ╚═══════════════════════════════════════════════════════════╝
 */

const DEFAULT_TIMEOUT = 10000; // 10s

/**
 * Fetch with automatic timeout
 */
const fetchWithTimeout = async (url, options = {}, timeout = DEFAULT_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

/**
 * Safe API call - handles dev mode gracefully
 * Returns null on failure instead of throwing
 */
export const safeApiCall = async (url, options = {}) => {
  try {
    const res = await fetchWithTimeout(url, options);
    const contentType = res.headers.get('content-type');
    
    // Check if response is JSON (not source code in dev mode)
    if (!contentType?.includes('application/json')) {
      return null;
    }
    
    if (res.ok) {
      return await res.json();
    }
    
    return null;
  } catch (error) {
    // Expected errors in vite dev mode
    if (error.message === 'Request timeout') {
      console.warn('[API] Request timeout:', url);
      return null;
    }
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return null;
    }
    
    if (error.message?.includes('JSON') || error.message?.includes('Unexpected token')) {
      return null;
    }
    
    console.warn('[API] Call failed:', error);
    return null;
  }
};

/**
 * API call with abort signal support (for cleanup)
 */
export const apiCallWithSignal = async (url, options = {}, signal) => {
  try {
    const res = await fetch(url, { ...options, signal });
    const contentType = res.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      return null;
    }
    
    if (res.ok) {
      return await res.json();
    }
    
    return null;
  } catch (error) {
    if (error.name === 'AbortError') {
      return null; // Request was intentionally cancelled
    }
    
    // Silent fail in dev mode
    if (error.name === 'TypeError' || error.message?.includes('JSON')) {
      return null;
    }
    
    console.warn('[API] Request interrupted:', error);
    return null;
  }
};

/**
 * Beacon API for critical events (survives page unload)
 */
export const sendBeacon = (url, data) => {
  if (!navigator.sendBeacon) {
    console.warn('[API] Beacon not supported');
    return false;
  }
  
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  return navigator.sendBeacon(url, blob);
};
