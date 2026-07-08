import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { requireAdmin } from "@/lib/auth";
import { formatPhone, publicUrlForToken } from "@/lib/format";
import { createUniqueToken } from "@/lib/guest";
import { createGuest, listGuests } from "@/lib/db";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.get("q")?.trim();
  const guests = await listGuests({ query: query ? formatPhone(query) || query : undefined, limit: 30 });

  return NextResponse.json({
    guests: guests.map((guest) => ({
      ...guest,
      link: publicUrlForToken(guest.token)
    }))
  });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados do cadastro invalidos." }, { status: 400 });
  }

  try {
    const name = String(body.name || "").trim();
    const phone = formatPhone(String(body.phone || ""));
    const email = String(body.email || "").trim() || null;
    const maxCompanions = Number(body.maxCompanions || 0);

    if (!name || !phone) {
      return NextResponse.json({ error: "Nome e telefone sao obrigatorios." }, { status: 400 });
    }

    if (!Number.isInteger(maxCompanions) || maxCompanions < 0) {
      return NextResponse.json({ error: "Quantidade maxima de acompanhantes invalida." }, { status: 400 });
    }

    const token = await createUniqueToken();
    const guest = await createGuest({
      id: crypto.randomUUID(),
      name,
      phone,
      email,
      maxCompanions,
      token
    });

    return NextResponse.json({ guest: { ...guest, link: publicUrlForToken(guest.token) } }, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar convidado", error);
    return NextResponse.json({ error: "Nao foi possivel cadastrar. Verifique o banco de dados e tente novamente." }, { status: 500 });
  }
}
