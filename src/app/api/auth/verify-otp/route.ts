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

  // 1. ડેટાબેઝમાંથી OTP ચકાસો (છેલ્લા 10 મિનિટનો જ માન્ય)
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

  // 2. OTP મળ્યો → સેશન કૂકી સેટ કરો (Owner તરીકે)
  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/owner`);
  response.cookies.set('worksetu_session', JSON.stringify({
    role: 'owner',
    id: email, // અહીં Owner નો ID (email અથવા user ID) મૂકો
    name: email,
    businessName: '' // પછીથી Onboarding માં સેટ થશે
  }), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  // 3. (વૈકલ્પિક) ડેટાબેઝમાંથી વપરાયેલ OTP ડિલીટ કરો
  await supabase.from('otps').delete().eq('id', data.id);

  return response;
}