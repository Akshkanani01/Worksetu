import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${otp}`;

    const { data, error } = await resend.emails.send({
      from: 'WorkSetu <onboarding@resend.dev>',
      to: [email],
      subject: '🔐 Your WorkSetu Magic Link',
      html: `... (your html)`
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