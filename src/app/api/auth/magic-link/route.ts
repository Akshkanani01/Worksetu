import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ડીબગ: ચેક કરો કે વેરિયેબલ્સ છે કે નહીં
console.log("🔍 Checking env vars:");
console.log("NEXT_PUBLIC_APP_URL =", process.env.NEXT_PUBLIC_APP_URL);
console.log("NEXT_PUBLIC_SUPABASE_URL =", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅" : "❌");
console.log("SUPABASE_SERVICE_ROLE_KEY =", process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅" : "❌");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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