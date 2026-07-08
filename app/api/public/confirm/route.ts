import { NextRequest, NextResponse } from "next/server";
import { confirmationIsEditable } from "@/lib/guest";
import { findGuestByToken, updateGuestConfirmation } from "@/lib/db";

export async function POST(request: NextRequest) {
  if (!confirmationIsEditable()) {
    return NextResponse.json({ error: "As confirmações estão bloqueadas." }, { status: 403 });
  }

  const body = await request.json();
  const token = String(body.token || "");
  const status = body.status === "CONFIRMED" || body.status === "DECLINED" ? body.status : null;
  const companionsCount = Number(body.companionsCount || 0);

  if (!token || !status) {
    return NextResponse.json({ error: "Resposta inválida." }, { status: 400 });
  }

  const guest = await findGuestByToken(token);
  if (!guest) {
    return NextResponse.json({ error: "Convite não encontrado." }, { status: 404 });
  }

  if (!Number.isInteger(companionsCount) || companionsCount < 0 || companionsCount > guest.maxCompanions) {
    return NextResponse.json({ error: `O limite de acompanhantes e ${guest.maxCompanions}.` }, { status: 400 });
  }

  const updated = await updateGuestConfirmation(token, status, status === "CONFIRMED" ? companionsCount : 0);

  return NextResponse.json({ guest: updated });
}
