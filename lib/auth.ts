import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

const COOKIE_NAME = "organizer_session";

function secret() {
  return process.env.AUTH_SECRET || "dev-secret";
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSessionValue() {
  const payload = JSON.stringify({ role: "admin", createdAt: Date.now() });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function isValidSession(value?: string) {
  if (!value) return false;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return false;
  const expected = sign(encoded);
  if (signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function requireAdmin() {
  const session = (await cookies()).get(COOKIE_NAME)?.value;
  return isValidSession(session);
}

export function setSession(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, createSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/"
  });
}

export function clearSession(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
}
