import { createServerClientWithCookies } from '@/lib/supabase.server';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const supabase = await createServerClientWithCookies();
  const path = request.nextUrl.pathname;

  if (path === '/' || path === '/login' || path.startsWith('/api/')) {
    return NextResponse.next({ request });
  }

  const sessionCookie = request.cookies.get('worksetu_session');

  if (path === '/dashboard/owner') {
    if (!sessionCookie) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.next({ request });
  }

  if (path === '/dashboard/karigar') {
    if (!sessionCookie) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.next({ request });
  }

  return NextResponse.next({ request });
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };