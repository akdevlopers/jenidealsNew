import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Helper to check if IP is private or localhost
 */
function isPrivateOrLocalIp(ip) {
  if (!ip) return true;
  const cleanIp = ip.replace(/^::ffff:/, '');
  return (
    cleanIp === '127.0.0.1' ||
    cleanIp === '::1' ||
    cleanIp === 'localhost' ||
    cleanIp.startsWith('10.') ||
    cleanIp.startsWith('192.168.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(cleanIp) ||
    cleanIp.startsWith('fc00:') ||
    cleanIp.startsWith('fe80:')
  );
}

/**
 * Route handler to detect country by IP headers or external geolocation lookup
 */
export async function GET(request) {
  try {
    const headers = request.headers;

    // 1. Check CDN / Hosting Provider Country Headers
    const headerCountry =
      headers.get('cf-ipcountry') ||
      headers.get('x-vercel-ip-country') ||
      headers.get('x-country-code') ||
      headers.get('geoip-country-code');

    if (headerCountry && headerCountry !== 'XX' && headerCountry !== 'T1') {
      const code = headerCountry.toLowerCase();
      return NextResponse.json({
        status: true,
        countryCode: code,
        source: 'header'
      }, {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=86400'
        }
      });
    }

    // 2. Extract Client IP
    const forwardedFor = headers.get('x-forwarded-for');
    const realIp = headers.get('x-real-ip');
    const cfConnectingIp = headers.get('cf-connecting-ip');
    let clientIp = cfConnectingIp || realIp || (forwardedFor ? forwardedFor.split(',')[0].trim() : null);

    const isLocal = isPrivateOrLocalIp(clientIp);

    // 3. Geolocation lookup with fallbacks
    // If local/dev, call without IP to get server/egress public IP location
    const ipParam = isLocal ? '' : clientIp;

    // Service 1: ipwho.is
    try {
      const url = ipParam ? `https://ipwho.is/${ipParam}` : 'https://ipwho.is/';
      const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success !== false && data.country_code) {
          return NextResponse.json({
            status: true,
            countryCode: data.country_code.toLowerCase(),
            country: data.country,
            city: data.city,
            source: 'ipwho.is'
          });
        }
      }
    } catch (e) {}

    // Service 2: api.country.is
    try {
      const url = ipParam ? `https://api.country.is/${ipParam}` : 'https://api.country.is/';
      const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = await res.json();
        if (data && data.country) {
          return NextResponse.json({
            status: true,
            countryCode: data.country.toLowerCase(),
            source: 'country.is'
          });
        }
      }
    } catch (e) {}

    // Service 3: freeipapi.com
    try {
      const url = ipParam ? `https://freeipapi.com/api/json/${ipParam}` : 'https://freeipapi.com/api/json';
      const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = await res.json();
        if (data && data.countryCode) {
          return NextResponse.json({
            status: true,
            countryCode: data.countryCode.toLowerCase(),
            country: data.countryName,
            source: 'freeipapi.com'
          });
        }
      }
    } catch (e) {}

    // Service 4: ip-api.com
    try {
      const url = ipParam ? `http://ip-api.com/json/${ipParam}` : 'http://ip-api.com/json';
      const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = await res.json();
        if (data && data.status === 'success' && data.countryCode) {
          return NextResponse.json({
            status: true,
            countryCode: data.countryCode.toLowerCase(),
            country: data.country,
            source: 'ip-api.com'
          });
        }
      }
    } catch (e) {}

    // Fallback if all lookups failed
    return NextResponse.json({
      status: false,
      countryCode: 'in', // default fallback
      source: 'fallback'
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      countryCode: 'in',
      error: error.message
    }, { status: 500 });
  }
}
