import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { formatPhone, publicUrlForToken } from "@/lib/format";
import { updateGuest } from "@/lib/db";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const maxCompanions = Number(body.maxCompanions || 0);

  if (!String(body.name || "").trim() || !String(body.phone || "").trim()) {
    return NextResponse.json({ error: "Nome e telefone sao obrigatorios." }, { status: 400 });
  }

  if (!Number.isInteger(maxCompanions) || maxCompanions < 0) {
    return NextResponse.json({ error: "Quantidade maxima de acompanhantes invalida." }, { status: 400 });
  }

  const guest = await updateGuest({
    id,
    name: String(body.name).trim(),
    phone: formatPhone(String(body.phone)),
    email: String(body.email || "").trim() || null,
    maxCompanions
  });

  if (!guest) {
    return NextResponse.json({ error: "Convidado nao encontrado." }, { status: 404 });
  }

  return NextResponse.json({ guest: { ...guest, link: publicUrlForToken(guest.token) } });
}
