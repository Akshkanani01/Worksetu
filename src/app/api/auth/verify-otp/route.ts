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

  if (!email || !otp) {
    return NextResponse.json({ error: 'Invalid link' }, { status: 400 });
  }

  // OTP ચકાસો
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
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
  }

  await supabase.from('otps').delete().eq('id', data.id);

  // કૂકી સેટ કરો – sameSite: 'none' અને secure: true ફરજિયાત
  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/owner`);
  response.cookies.set('worksetu_session', JSON.stringify({
    role: 'owner',
    id: email,
    name: email,
    businessName: ''
  }), {
    httpOnly: false,
    secure: true,          // HTTPS પર જ કામ કરે
    sameSite: 'none',      // ક્રોસ-ડોમેન રીડાયરેક્ટ માટે જરૂરી
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  console.log("✅ Cookie set with sameSite:none for:", email);
  return response;
}