// Check if we're on server or client
const isServer = typeof window === 'undefined';

// Get environment variables directly without hardcoded fallback URLs
const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_BASE_URL;
const CLOUD_BASE_URL = process.env.NEXT_PUBLIC_CLOUD_BASE_URL;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// Select base URL based on environment variable
// Use proxy on client to avoid CORS, use direct URL on server
const PROXY_BASE_URL = process.env.NEXT_PUBLIC_PROXY_BASE_URL;
const BASE_URL = isServer 
  ? (API_BASE === 'local' ? LOCAL_BASE_URL : CLOUD_BASE_URL)
  : (PROXY_BASE_URL || '/api/v5');

/**
 * API request utility using native fetch (no cookies, no CSRF issues)
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(process.env.NEXT_PUBLIC_USER_AGENT ? { 'User-Agent': process.env.NEXT_PUBLIC_USER_AGENT } : {}),
    ...options.headers,
  };

  // Add auth token if available and we're on client
  if (!isServer) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      // IMPORTANT: No credentials = No CSRF issues
      credentials: 'omit',
    });

    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      
      // Handle API level errors
      if (data && data.status === false) {
        throw new Error(data.message || 'API Error');
      }
      
      return data;
    } else {
      const textResponse = await response.text();
      const cleanText = textResponse.replace(/<[^>]*>/g, '').trim().slice(0, 100);
      throw new Error(cleanText || `Request failed with status ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
}

// Axios-like API for backward compatibility
const axiosInstance = { 
  get: (url, config) => apiRequest(url, { method: 'GET', ...config }),
  post: (url, data, config) => apiRequest(url, { 
    method: 'POST', 
    body: JSON.stringify(data),
    ...config 
  }),
  put: (url, data, config) => apiRequest(url, { 
    method: 'PUT', 
    body: JSON.stringify(data),
    ...config 
  }),
  delete: (url, config) => apiRequest(url, { method: 'DELETE', ...config }),
};

export default axiosInstance;
