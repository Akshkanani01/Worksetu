import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ડીબગ લોગ્સ
console.log("🔍 Checking env vars:");
console.log("NEXT_PUBLIC_APP_URL =", process.env.NEXT_PUBLIC_APP_URL);
console.log("NEXT_PUBLIC_SUPABASE_URL =", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅" : "❌");
console.log("SUPABASE_SERVICE_ROLE_KEY =", process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅" : "❌");

// Supabase ક્લાયન્ટ (કસ્ટમ ટાઈમઆઉટ સાથે)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    },
    global: {
      // 30 સેકન્ડ ટાઈમઆઉટ ઉમેરો
      fetch: (url, options) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); 
        return fetch(url, { ...options, signal: controller.signal })
          .finally(() => clearTimeout(timeoutId));
      }
    }
  }
);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log("📧 Sending magic link to:", email);

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/owner`,
      },
    });

    if (error) {
      console.error("❌ Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Magic link sent successfully");
    return NextResponse.json({ success: true, message: 'Magic Link sent!' });
  } catch (error) {
    console.error("🔥 Unhandled error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}