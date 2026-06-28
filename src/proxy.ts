import { createServerClientWithCookies } from '@/lib/supabase.server';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = await createServerClientWithCookies();
  const path = request.nextUrl.pathname;

  console.log("🛡️ Middleware running for path:", path);

  // === Public routes ===
  if (path === '/' || path === '/login' || path.startsWith('/api/')) {
    console.log("🟢 Public path allowed:", path);
    return supabaseResponse;
  }

  // === Read sessions ===
  const karigarSession = request.cookies.get('worksetu_session');
  const ownerCookie = request.cookies.get('worksetu_session');
  
  console.log("🍪 Cookies in Middleware:", {
    karigar: karigarSession?.value ? true : false,
    owner: ownerCookie?.value ? true : false
  });

  if (ownerCookie) {
    console.log("📦 Owner cookie value:", ownerCookie.value);
  }

  // === Owner Dashboard Protection ===
  if (path === '/dashboard/owner') {
    let isOwner = false;
    if (ownerCookie) {
      try {
        const session = JSON.parse(ownerCookie.value);
        console.log("👤 Parsed Owner Session:", session);
        if (session.role === 'owner') isOwner = true;
      } catch (e) {
        console.error("🔴 Error parsing owner cookie:", e);
      }
    }

    if (!isOwner) {
      console.log("🔴 Owner session invalid, redirecting to login.");
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log("🟢 Owner session valid, allowing access.");
    return supabaseResponse;
  }

  // === Karigar Dashboard Protection ===
  if (path === '/dashboard/karigar') {
    let isKarigar = false;
    if (karigarSession) {
      try {
        const session = JSON.parse(karigarSession.value);
        if (session.role === 'karigar') isKarigar = true;
      } catch (e) {}
    }

    if (!isKarigar) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};