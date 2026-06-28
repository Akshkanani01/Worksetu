import { createServerClientWithCookies } from '@/lib/supabase.server';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const supabase = await createServerClientWithCookies();
  const path = request.nextUrl.pathname;

  // === 1. Public routes ===
  if (path === '/' || path === '/login' || path.startsWith('/api/')) {
    return NextResponse.next({ request });
  }

  // === 2. Owner Dashboard: Supabase session check ===
  if (path === '/dashboard/owner') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next({ request });
  }

  // === 3. Karigar Dashboard: custom cookie check ===
  if (path === '/dashboard/karigar') {
    const karigarSession = request.cookies.get('worksetu_session');
    if (!karigarSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next({ request });
  }

  // === 4. Login page: if already logged in, redirect ===
  if (path === '/login') {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return NextResponse.redirect(new URL('/dashboard/owner', request.url));
    }
    const karigarSession = request.cookies.get('worksetu_session');
    if (karigarSession) {
      return NextResponse.redirect(new URL('/dashboard/karigar', request.url));
    }
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};