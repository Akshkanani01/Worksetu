import { createServerClientWithCookies } from '@/lib/supabase.server';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  console.log("🛡️ Proxy running for path:", request.nextUrl.pathname);
  
  const supabase = await createServerClientWithCookies();
  const path = request.nextUrl.pathname;

  // === 1. Public routes ===
  if (path === '/' || path === '/login' || path.startsWith('/api/')) {
    console.log("🟢 Public route allowed:", path);
    return NextResponse.next({ request });
  }

  // === 2. Owner Dashboard Protection ===
  if (path === '/dashboard/owner') {
    console.log("🔍 Checking owner session...");
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log("👤 User result:", { user: user?.id, error: error?.message });
    
    if (!user) {
      console.log("🔴 No user found, redirecting to login.");
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log("✅ User found, allowing access.");
    return NextResponse.next({ request });
  }

  // === 3. Karigar Dashboard Protection ===
  if (path === '/dashboard/karigar') {
    console.log("🔍 Checking karigar session...");
    const karigarSession = request.cookies.get('worksetu_session');
    console.log("🍪 karigarSession cookie present?", !!karigarSession);
    
    if (!karigarSession) {
      console.log("🔴 No karigar session, redirecting to login.");
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log("✅ Karigar session found, allowing access.");
    return NextResponse.next({ request });
  }

  // === 4. Login Page Redirect if already logged in ===
  if (path === '/login') {
    const { data: { user } } = await supabase.auth.getUser();
    const karigarSession = request.cookies.get('worksetu_session');
    
    if (user) {
      console.log("🟢 User already logged in, redirecting to owner dashboard.");
      return NextResponse.redirect(new URL('/dashboard/owner', request.url));
    }
    if (karigarSession) {
      console.log("🟢 Karigar already logged in, redirecting to karigar dashboard.");
      return NextResponse.redirect(new URL('/dashboard/karigar', request.url));
    }
  }

  console.log("🟠 No match, proceeding.");
  return NextResponse.next({ request });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};