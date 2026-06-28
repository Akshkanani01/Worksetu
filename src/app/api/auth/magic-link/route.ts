import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Resend અને Supabase ક્લાયન્ટ ઇનિશિયલાઇઝ કરો
const resend = new Resend(process.env.RESEND_API_KEY!);
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

    // 1. 6-અંકનો રેન્ડમ OTP જનરેટ કરો
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. OTP ને ડેટાબેઝમાં સેવ કરો (જેથી verify-otp માં ચકાસી શકાય)
    const { error: dbError } = await supabase
      .from('otps')
      .insert({ email, otp });

    if (dbError) {
      console.error('❌ Failed to save OTP to database:', dbError);
      return NextResponse.json({ error: 'Failed to save OTP' }, { status: 500 });
    }

    // 3. Magic Link URL બનાવો (verify-otp રૂટ પર જશે)
    const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${otp}`;

    // 4. Resend વડે ઈમેલ મોકલો
    const { data, error: emailError } = await resend.emails.send({
      from: 'WorkSetu <onboarding@resend.dev>',
      to: [email],
      subject: '🔐 Your WorkSetu Magic Link',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #0B1120; color: white; border-radius: 12px; border: 1px solid #333;">
          <h2 style="color: #a855f7; text-align: center;">WorkSetu</h2>
          <h3 style="text-align: center;">You requested a Magic Link</h3>
          <p style="text-align: center; color: #aaa;">Click the button below to securely log in to your workshop dashboard.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLinkUrl}" style="background: linear-gradient(135deg, #a855f7, #3b82f6); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              🔑 Login to Dashboard
            </a>
          </div>
          <p style="text-align: center; font-size: 12px; color: #666;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    });

    if (emailError) {
      console.error('❌ Resend Error:', emailError);
      return NextResponse.json({ error: 'Resend error: ' + emailError.message }, { status: 500 });
    }

    console.log(`✅ Magic Link sent to ${email} with OTP: ${otp}`);
    return NextResponse.json({ success: true, message: 'Magic Link sent successfully!' });

  } catch (error) {
    console.error('🔥 Unhandled Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}