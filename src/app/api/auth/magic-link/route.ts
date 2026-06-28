import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

if (!SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
}

if (!SUPABASE_ANON_KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing");
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: async (url, options) => {
        const controller = new AbortController();

        const timeout = setTimeout(() => {
          controller.abort();
        }, 30000);

        try {
          return await fetch(url, {
            ...options,
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeout);
        }
      },
    },
  }
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body?.email?.trim()?.toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    console.log("📧 Magic Link Request:", email);

    const redirectUrl = APP_URL
      ? `${APP_URL.replace(/\/$/, "")}/dashboard/owner`
      : undefined;

    console.log("🔗 Redirect URL:", redirectUrl);

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error("❌ Supabase Auth Error:");
      console.error(error);
      console.error(JSON.stringify(error, null, 2));

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    console.log("✅ Magic Link Sent Successfully");

    return NextResponse.json({
      success: true,
      message: "Magic link sent successfully",
      data,
    });
  } catch (err: any) {
    console.error("🔥 Unhandled Server Error:");
    console.error(err);
    console.error(err?.stack);

    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}