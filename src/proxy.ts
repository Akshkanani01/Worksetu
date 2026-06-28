import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get('worksetu_session');

  // === 1. Public paths (બધાને પરવાનગી) ===
  if (path === '/' || path === '/login' || path.startsWith('/api/')) {
    return NextResponse.next({ request });
  }

  // === 2. Karigar Dashboard (કૂકી હોય તો જ) ===
  if (path === '/dashboard/karigar') {
    if (sessionCookie) {
      return NextResponse.next({ request });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // === 3. Owner Dashboard: હવે કોઈ ચેક નથી (ક્લાયન્ટ સાઈડ ચેક કરશે) ===
  // બધા અન્ય રૂટ્સ (જેમ કે /dashboard/owner) ને મંજૂરી આપો
  return NextResponse.next({ request });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};