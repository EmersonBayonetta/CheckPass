import crypto from "node:crypto";
import { findGuestByTokenExists } from "@/lib/db";

export function generateToken() {
  return crypto.randomBytes(18).toString("base64url");
}

export async function createUniqueToken() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const token = generateToken();
    if (!(await findGuestByTokenExists(token))) return token;
  }
  throw new Error("Não foi possível gerar token único.");
}

export function confirmationIsEditable() {
  if (process.env.CONFIRMATIONS_LOCKED === "true") return false;
  const eventDate = process.env.EVENT_DATE ? new Date(process.env.EVENT_DATE) : null;
  if (eventDate && Number.isFinite(eventDate.getTime()) && new Date() > eventDate) {
    return false;
  }
  return true;
}
