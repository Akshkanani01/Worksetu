import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    // 1. 6-અંકનો OTP જનરેટ કરો
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. OTP ને ડેટાબેઝમાં સેવ કરો
    const { error: dbError } = await supabase
      .from('otps')
      .insert({ email, otp });

    if (dbError) {
      console.error('DB Error:', dbError);
      return NextResponse.json({ error: 'Failed to save OTP' }, { status: 500 });
    }

    // 3. Magic Link URL બનાવો
    const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${otp}`;

    // 4. Resend વડે ઈમેલ મોકલો
    const { error: emailError } = await resend.emails.send({
      from: 'WorkSetu <onboarding@resend.dev>',
      to: [email],
      subject: '🔐 Your WorkSetu Magic Link',
      html: `... (તમારો અગાઉનો HTML કોડ) ...` // તમારો HTML અહીં મૂકો
    });

    if (emailError) {
      console.error('Resend Error:', emailError);
      return NextResponse.json({ error: 'Resend error: ' + emailError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Magic Link sent successfully!' });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}