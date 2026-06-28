import { createServerClientWithCookies } from '@/lib/supabase.server';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = await createServerClientWithCookies();
  const path = request.nextUrl.pathname;

  // === 1. Public routes (કોઈ ઓથ ચેક નહીં) ===
  if (path === '/' || path === '/login' || path.startsWith('/api/')) {
    return supabaseResponse;
  }

  // === 2. Karigar Dashboard ===
  if (path === '/dashboard/karigar') {
    const karigarSession = request.cookies.get('worksetu_session');
    if (!karigarSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // === 3. Owner Dashboard ===
  // ... બાકીનો કોડ ...

if (path === '/dashboard/owner') {
  const sessionCookie = request.cookies.get('worksetu_session');
  const session = sessionCookie ? JSON.parse(sessionCookie.value) : null;
  if (!session || session.role !== 'owner') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return supabaseResponse;
}

// ... બાકીનો કોડ ...

  // === 4. Login page: જો પહેલેથી લૉગિન હોય તો ડેશબોર્ડ પર મોકલો ===
  if (path === '/login') {
    const { data: { user } } = await supabase.auth.getUser();
    const karigarSession = request.cookies.get('worksetu_session');
    if (user) {
      return NextResponse.redirect(new URL('/dashboard/owner', request.url));
    }
    if (karigarSession) {
      return NextResponse.redirect(new URL('/dashboard/karigar', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};