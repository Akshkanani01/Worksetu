import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. 6-અંકનો OTP જનરેટ કરો
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 2. Magic Link URL બનાવો
    const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${otp}`;

    // 3. Resend વડે ઈમેલ મોકલો (ફ્રી ટાયરમાં ફક્ત તમારો જ ઈમેલ ચાલશે)
    const { data, error } = await resend.emails.send({
      from: 'WorkSetu <onboarding@resend.dev>',
      to: [email], // ⚠️ ટેસ્ટ સમયે ફક્ત તમારો ઈમેલ જ નાખો
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

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: 'Resend error: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Magic Link sent successfully!' });

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}