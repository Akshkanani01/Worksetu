import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const otp = searchParams.get('otp');

  console.log("🔍 verify-otp called with:", { email, otp });

  if (!email || !otp) {
    console.error("❌ Missing email or otp");
    return NextResponse.json({ error: 'Invalid link' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('otps')
    .select('*')
    .eq('email', email)
    .eq('otp', otp)
    .gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    console.error("❌ OTP verification failed:", error);
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
  }

  await supabase.from('otps').delete().eq('id', data.id);
  console.log("✅ OTP verified and deleted for:", email);

  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/owner`);
  
  response.cookies.set('worksetu_session', JSON.stringify({
    role: 'owner',
    id: email,
    name: email,
    businessName: ''
  }), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax'
  });

  console.log("✅ Cookie 'worksetu_session' SET for:", email);
  return response;
}