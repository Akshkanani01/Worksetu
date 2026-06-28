import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const otp = searchParams.get('otp');

  if (!email || !otp) {
    return new Response('Invalid link', { status: 400 });
  }

  // આપણે સીધા ડેશબોર્ડ પર રીડાયરેક્ટ કરીએ છીએ
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/owner`);
}