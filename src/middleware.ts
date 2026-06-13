import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Fast pre-filter for API admin routes — full is_admin check happens inside each route handler
  if (pathname.startsWith('/api/admin/')) {
    const auth = request.headers.get('Authorization');
    if (!auth || !/^Bearer\s+\S/i.test(auth)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Redirect unauthenticated users away from admin UI
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const hasSession = request.cookies.get('sb-session');
    if (!hasSession) {
      return NextResponse.redirect(new URL('/cont/autentificare', request.url));
    }
  }

  const response = NextResponse.next();

  const shouldDisableCache =
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/api/admin/') ||
    pathname.startsWith('/produse/') ||
    pathname.startsWith('/api/products/');

  if (shouldDisableCache) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
  }

  return response;
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*', '/produse/:path*', '/api/products/:path*'],
};
