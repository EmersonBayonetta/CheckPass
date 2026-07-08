import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { findGuestById, validateGuestEntry } from "@/lib/db";

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const id = String(body.id || "");

  const guest = await findGuestById(id);
  if (!guest) {
    return NextResponse.json({ error: "Convidado nao encontrado." }, { status: 404 });
  }

  if (guest.status !== "CONFIRMED") {
    return NextResponse.json({ error: "Este convidado ainda nao confirmou presenca." }, { status: 400 });
  }

  if (guest.entryValidated) {
    return NextResponse.json({ error: "Entrada ja validada anteriormente." }, { status: 409 });
  }

  const updated = await validateGuestEntry(id);

  return NextResponse.json({ guest: updated });
}
