import { NextResponse } from 'next/server';

const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_BASE_URL;
const CLOUD_BASE_URL = process.env.NEXT_PUBLIC_CLOUD_BASE_URL;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const TARGET_BASE_URL = API_BASE === 'local' ? LOCAL_BASE_URL : CLOUD_BASE_URL;

/**
 * Generic proxy handler to forward requests to the external API
 * bypasses CORS by making the request from the server side.
 */
async function handleRequest(request, { params }) {
  try {
    const pathArr = params.path || [];
    const path = pathArr.join('/');
    
    // Construct the target URL
    const url = new URL(request.url);
    const targetUrl = new URL(`${TARGET_BASE_URL}${path ? '/' + path : ''}`);
    
    // Append original search params
    url.searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });

    const method = request.method;
    
    // Prepare headers for the target request
    const headers = new Headers();
    
    // Forward essential headers
    const headersToForward = ['content-type', 'accept', 'authorization', 'user-agent', 'x-api-key', 'app-token', 'country'];
    headersToForward.forEach(headerName => {
      const value = request.headers.get(headerName);
      if (value) {
        headers.set(headerName, value);
      }
    });

    // Set Host header to the target domain URL from .env
    headers.set('host', targetUrl.host);

    if (process.env.NEXT_PUBLIC_USER_AGENT) {
      headers.set('user-agent', process.env.NEXT_PUBLIC_USER_AGENT);
    }

    let body = null;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        const contentType = request.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          body = JSON.stringify(await request.json());
        } else {
          // For multipart/form-data or others, we can proxy the raw body
          body = await request.blob();
        }
      } catch (e) {
        // Body might be empty or unreadable
      }
    }

    const response = await fetch(targetUrl.toString(), {
      method,
      headers,
      body,
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const data = await response.text();
      return new NextResponse(data, {
        status: response.status,
        headers: { 'Content-Type': contentType }
      });
    }
  } catch (error) {
    return NextResponse.json({ 
      status: false, 
      message: error.message || 'Internal Server Error',
      error: 'Proxy Error'
    }, { status: 500 });
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const OPTIONS = handleRequest;
