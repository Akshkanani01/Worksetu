import { NextResponse } from "next/server";

export async function GET() {
  // later JWT/cookie attach karishu
  return NextResponse.json({
    user: null,
    message: "Auth ready"
  });
}
