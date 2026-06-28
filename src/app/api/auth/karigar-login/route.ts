import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { karigarId, pin } = await req.json();
    console.log("🔑 Karigar login attempt:", { karigarId, pin });

    if (!karigarId || !pin || pin.length !== 4) {
      console.error("❌ Invalid input");
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 400 }
      );
    }

    const { data: karigar, error } = await supabase
      .from('karigars')
      .select('id, pin_hash, name, owner_id')
      .eq('id', karigarId)
      .single();

    console.log("🔍 Database result:", { karigar, error });

    if (error || !karigar) {
      console.error("❌ Karigar not found:", error);
      return NextResponse.json(
        { success: false, error: 'Karigar not found' },
        { status: 401 }
      );
    }

    const isValid = bcrypt.compareSync(pin, karigar.pin_hash);
    console.log("🔐 PIN valid?", isValid);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Incorrect PIN' },
        { status: 401 }
      );
    }

    // Set session cookie
    const response = NextResponse.json(
      { success: true, redirect: '/dashboard/karigar' },
      { status: 200 }
    );

    response.cookies.set('worksetu_session', JSON.stringify({
      role: 'karigar',
      id: karigar.id,
      name: karigar.name,
      owner_id: karigar.owner_id
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    console.log("✅ Login successful, cookie set");
    return response;
  } catch (error) {
    console.error("🔥 Unhandled error:", error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}