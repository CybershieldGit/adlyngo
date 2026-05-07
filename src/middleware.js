import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'adlyngo_token';

// Protect API Routes (POST, PUT, DELETE only for CMS) and /admin routes
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Define public API paths that don't need auth
  const isApi = pathname.startsWith('/api/');
  const isAuthApi = pathname.startsWith('/api/auth/');
  const isGetApi = request.method === 'GET'; // Allow GET requests for public API consumption

  // Protect Admin UI (but allow /admin/login)
  const isAdminArea = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  // If it's a POST/PUT/DELETE to the API (except auth), or accessing the admin area
  if ((isApi && !isAuthApi && !isGetApi) || isAdminArea) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      if (isAdminArea) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      // Clone headers and add the admin ID so API routes can use it
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-admin-id', payload.id);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      if (isAdminArea) {
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete(COOKIE_NAME);
        return response;
      }
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }
  }

  // Redirect authenticated users away from /admin/login
  if (pathname.startsWith('/admin/login')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } catch (e) {
        // Token invalid, let them login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
};
