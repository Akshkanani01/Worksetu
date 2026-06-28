import { createServerClientWithCookies } from '@/lib/supabase.server';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = await createServerClientWithCookies();
  const path = request.nextUrl.pathname;

  // === Public routes ===
  if (path === '/' || path === '/login' || path.startsWith('/api/')) {
    return supabaseResponse;
  }

  // === Cookie check (simple) ===
  const sessionCookie = request.cookies.get('worksetu_session');

  // === Owner Dashboard ===
  if (path === '/dashboard/owner') {
    // જો કૂકી હોય, તો Owner ગણો (પાર્સિંગ ભૂલ હોય તો પણ)
    if (sessionCookie) {
      console.log("✅ Owner cookie found, allowing access");
      return supabaseResponse;
    }
    // નહીંતર લૉગિન
    console.log("🔴 No owner cookie, redirecting to login");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // === Karigar Dashboard ===
  if (path === '/dashboard/karigar') {
    if (sessionCookie) {
      // Try to parse to ensure it's karigar, but for simplicity, allow if cookie exists
      // You can add stricter check if needed
      return supabaseResponse;
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // === Login page redirect if already logged in ===
  if (path === '/login') {
    if (sessionCookie) {
      // Redirect to owner dashboard (or karigar if applicable)
      return NextResponse.redirect(new URL('/dashboard/owner', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};