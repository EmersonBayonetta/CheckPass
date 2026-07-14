import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") || "").trim();
  const adminPassword = (process.env.ADMIN_PASSWORD || "admin123").trim();

  if (password !== adminPassword) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
  }

  const response = NextResponse.redirect(new URL("/admin", request.url));
  setSession(response);
  return response;
}
