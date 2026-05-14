import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'adlyngo_token';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');
  
  // CORS Configuration
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const allowedOrigins = clientUrl.split(',');
  
  // Add common local origins in development
  if (process.env.NODE_ENV === 'development') {
    const localOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002'
    ];
    localOrigins.forEach(o => {
      if (!allowedOrigins.includes(o)) allowedOrigins.push(o);
    });
  }
  
  // 1. Handle CORS Preflight (OPTIONS)
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    
    // Always allow in development for easier testing, otherwise check allowedOrigins
    if (process.env.NODE_ENV === 'development' || allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-id');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    return response;
  }

  // 2. Authentication & Authorization logic (from former proxy.js)
  
  // Define public API paths that don't need auth
  const isApi = pathname.startsWith('/api/');
  const isAuthApi = pathname.startsWith('/api/auth/');
  const isGetApi = request.method === 'GET'; // Allow GET requests for public API consumption

  // Protect Admin UI (but allow /admin/login)
  const isAdminArea = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  let response = NextResponse.next();

  // If it's a POST/PUT/DELETE to the API (except auth), or accessing the admin area
  if ((isApi && !isAuthApi && !isGetApi) || isAdminArea) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      if (isAdminArea) {
        response = NextResponse.redirect(new URL('/admin/login', request.url));
      } else {
        response = NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
    } else {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        // Clone headers and add the admin ID so API routes can use it
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-admin-id', payload.id);

        // CRITICAL: Re-creating the request with modified headers can cause issues with 
        // large file uploads (FormData stream corruption). We skip this for the upload route.
        if (pathname === '/api/upload') {
          response = NextResponse.next();
        } else {
          response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
        }
      } catch (error) {
        if (isAdminArea) {
          response = NextResponse.redirect(new URL('/admin/login', request.url));
          response.cookies.delete(COOKIE_NAME);
        } else {
          response = NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
      }
    }
  }

  // Redirect authenticated users away from /admin/login
  if (pathname.startsWith('/admin/login')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        response = NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } catch (e) {
        // Token invalid, let them login
      }
    }
  }

  // 3. Apply CORS headers to the final response
  if (process.env.NODE_ENV === 'development' || allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
};
