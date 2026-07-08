import postgres from "postgres";

export type Guest = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  maxCompanions: number;
  companionsCount: number;
  status: string;
  token: string;
  confirmedAt: string | null;
  entryValidated: boolean;
  entryValidatedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type GuestRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  max_companions: number;
  companions_count: number;
  status: string;
  token: string;
  confirmed_at: Date | string | null;
  entry_validated: boolean;
  entry_validated_at: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL nao configurada. Configure uma URL Postgres no .env ou na Vercel.");
}

const globalForSql = globalThis as unknown as { sql?: postgres.Sql };

export const sql =
  globalForSql.sql ??
  postgres(databaseUrl, {
    max: 3,
    prepare: false,
    ssl: databaseUrl.includes("localhost") ? false : "require"
  });

if (process.env.NODE_ENV !== "production") {
  globalForSql.sql = sql;
}

function toIso(value: Date | string | null) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}

function toGuest(row: GuestRow): Guest {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    maxCompanions: row.max_companions,
    companionsCount: row.companions_count,
    status: row.status,
    token: row.token,
    confirmedAt: toIso(row.confirmed_at),
    entryValidated: row.entry_validated,
    entryValidatedAt: toIso(row.entry_validated_at),
    createdAt: toIso(row.created_at) || "",
    updatedAt: toIso(row.updated_at) || ""
  };
}

export async function countGuests() {
  const [row] = await sql<{ count: string }[]>`SELECT COUNT(*)::text as count FROM guests`;
  return { count: Number(row.count) };
}

export async function findGuestByToken(token: string) {
  const [row] = await sql<GuestRow[]>`SELECT * FROM guests WHERE token = ${token}`;
  return row ? toGuest(row) : null;
}

export async function findGuestById(id: string) {
  const [row] = await sql<GuestRow[]>`SELECT * FROM guests WHERE id = ${id}`;
  return row ? toGuest(row) : null;
}

export async function findGuestByTokenExists(token: string) {
  const [row] = await sql<{ id: string }[]>`SELECT id FROM guests WHERE token = ${token}`;
  return Boolean(row);
}

export async function listGuests(filter?: { status?: string; validated?: boolean; query?: string; limit?: number }) {
  const limit = filter?.limit || 200;

  if (filter?.query) {
    const query = `%${filter.query}%`;
    const rows = await sql<GuestRow[]>`
      SELECT * FROM guests
      WHERE LOWER(name) LIKE LOWER(${query}) OR phone LIKE ${query}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return rows.map(toGuest);
  }

  if (filter?.status) {
    const rows = await sql<GuestRow[]>`
      SELECT * FROM guests
      WHERE status = ${filter.status}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return rows.map(toGuest);
  }

  if (typeof filter?.validated === "boolean") {
    const rows = await sql<GuestRow[]>`
      SELECT * FROM guests
      WHERE entry_validated = ${filter.validated}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return rows.map(toGuest);
  }

  const rows = await sql<GuestRow[]>`
    SELECT * FROM guests
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows.map(toGuest);
}

export async function createGuest(data: {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  maxCompanions: number;
  token: string;
}) {
  const [row] = await sql<GuestRow[]>`
    INSERT INTO guests (id, name, phone, email, max_companions, token)
    VALUES (${data.id}, ${data.name}, ${data.phone}, ${data.email}, ${data.maxCompanions}, ${data.token})
    RETURNING *
  `;
  return toGuest(row);
}

export async function updateGuestConfirmation(token: string, status: string, companionsCount: number) {
  const [row] = await sql<GuestRow[]>`
    UPDATE guests
    SET status = ${status},
        companions_count = ${companionsCount},
        confirmed_at = NOW(),
        updated_at = NOW()
    WHERE token = ${token}
    RETURNING *
  `;
  return toGuest(row);
}

export async function updateGuest(data: {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  maxCompanions: number;
}) {
  const [row] = await sql<GuestRow[]>`
    UPDATE guests
    SET name = ${data.name},
        phone = ${data.phone},
        email = ${data.email},
        max_companions = ${data.maxCompanions},
        updated_at = NOW()
    WHERE id = ${data.id}
    RETURNING *
  `;
  return row ? toGuest(row) : null;
}

export async function deleteGuest(id: string) {
  const [row] = await sql<{ id: string }[]>`
    DELETE FROM guests
    WHERE id = ${id}
    RETURNING id
  `;
  return Boolean(row);
}

export async function validateGuestEntry(id: string) {
  const [row] = await sql<GuestRow[]>`
    UPDATE guests
    SET entry_validated = TRUE,
        entry_validated_at = NOW(),
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return toGuest(row);
}

export async function eventTotals() {
  const [confirmed] = await sql<{ guests: string; companions: string }[]>`
    SELECT COUNT(*)::text as guests, COALESCE(SUM(companions_count), 0)::text as companions
    FROM guests
    WHERE status = 'CONFIRMED'
  `;
  const [validated] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text as count
    FROM guests
    WHERE entry_validated = TRUE
  `;

  return {
    confirmedGuests: Number(confirmed.guests),
    confirmedCompanions: Number(confirmed.companions),
    validatedGuests: Number(validated.count)
  };
}
