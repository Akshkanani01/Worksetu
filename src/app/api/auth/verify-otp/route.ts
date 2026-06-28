import { NextRequest, NextResponse } from 'next/server';

// આ ફક્ત ડેમો છે. પ્રોડક્શનમાં તમારે OTP ને ડેટાબેઝમાં સેવ કરીને ચકાસવો પડશે.
// અહીં આપણે સિમ્પલ લોજિક વાપરીશું.

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const otp = searchParams.get('otp');

  if (!email || !otp) {
    return new Response('Invalid link', { status: 400 });
  }

  // *** અહીં તમારે ડેટાબેઝમાંથી OTP ચકાસવો પડશે ***
  // હાલ માટે આપણે ફક્ત સીધો ડેશબોર્ડ પર મોકલીએ છીએ (ટેસ્ટિંગ માટે)
  
  // સફળ લૉગિન - યુઝરને ડેશબોર્ડ પર મોકલો
  // Supabase સેશન કે કસ્ટમ સેશન સેટ કરવાનું રહેશે (અત્યારે ડેવ મોડ માટે બાયપાસ)
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/owner`);
}