import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get('worksetu_session');

  // === 1. Public paths (બધાને પરવાનગી) ===
  if (path === '/' || path === '/login' || path.startsWith('/api/')) {
    return NextResponse.next({ request });
  }

  // === 2. Owner Dashboard (કૂકી હોય તો જ પરવાનગી) ===
  if (path === '/dashboard/owner') {
    if (sessionCookie) {
      console.log("✅ Owner cookie found. Allowing access.");
      return NextResponse.next({ request });
    }
    console.log("🔴 No Owner cookie. Redirecting to login.");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // === 3. Karigar Dashboard (કૂકી હોય તો જ પરવાનગી) ===
  if (path === '/dashboard/karigar') {
    if (sessionCookie) {
      return NextResponse.next({ request });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};