import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🟢 API received body:", body);

    const { owner_id, name } = body;

    if (!owner_id || !name) {
      console.error("🔴 Missing owner_id or name");
      return NextResponse.json(
        { success: false, error: 'Owner ID and Name are required' },
        { status: 400 }
      );
    }

    // 1. Generate a random 4-digit PIN
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("🔑 Generated PIN:", pin);

    // 2. Hash the PIN
    const pin_hash = bcrypt.hashSync(pin, 10);
    console.log("🔐 Hashed PIN:", pin_hash);

    // 3. Generate a new Karigar ID (e.g., KAR001, KAR002, ...)
    const { data: lastKarigar } = await supabase
      .from('karigars')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    let newId = 'KAR001';
    if (lastKarigar) {
      const num = parseInt(lastKarigar.id.replace('KAR', '')) + 1;
      newId = `KAR${num.toString().padStart(3, '0')}`;
    }
    console.log("🆕 New Karigar ID:", newId);

    // 4. Insert into database
    console.log("📦 Attempting to insert into DB...");
    const { data, error } = await supabase
      .from('karigars')
      .insert({
        id: newId,
        name: name,
        owner_id: owner_id,
        pin_hash: pin_hash,
      })
      .select();

    if (error) {
      console.error("🔴 Supabase Insert Error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log("✅ Insert successful:", data);
    return NextResponse.json({
      success: true,
      message: 'Karigar added successfully',
      karigarId: newId,
      pin: pin,
    });
  } catch (error) {
    console.error("🔥 Unhandled Error:", error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}