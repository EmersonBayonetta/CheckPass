import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { countGuests, createGuest, sql } from "../lib/db";

async function main() {
  const schema = await fs.readFile(path.join(process.cwd(), "prisma/schema.sql"), "utf8");
  for (const statement of schema.split(";").map((item) => item.trim()).filter(Boolean)) {
    await sql.unsafe(statement);
  }

  if ((await countGuests()).count === 0) {
    const guests = [
      ["Ana Martins", "11999990001", "ana@example.com", 2],
      ["Bruno Costa", "21988880002", null, 1],
      ["Carla Souza", "31977770003", "carla@example.com", 0]
    ];

    for (const [name, phone, email, maxCompanions] of guests) {
      await createGuest({
        id: crypto.randomUUID(),
        name: String(name),
        phone: String(phone),
        email: email ? String(email) : null,
        maxCompanions: Number(maxCompanions),
        token: crypto.randomBytes(18).toString("base64url")
      });
    }
  }

  await sql.end();
  console.log("Banco Postgres pronto.");
}

main().catch(async (error) => {
  console.error(error);
  await sql.end();
  process.exit(1);
});
