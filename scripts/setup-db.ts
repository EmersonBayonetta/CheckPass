import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

let closeDatabase: (() => Promise<void>) | undefined;

async function loadLocalEnv() {
  const envPath = path.join(process.cwd(), ".env");
  try {
    const content = await fs.readFile(envPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // In Vercel/CI, variables usually come from the environment instead of .env.
  }
}

async function main() {
  await loadLocalEnv();
  const { countGuests, createGuest, sql } = await import("../lib/db");
  closeDatabase = () => sql.end();
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

  await closeDatabase();
  console.log("Banco Postgres pronto.");
}

main().catch(async (error) => {
  console.error(error);
  await closeDatabase?.();
  process.exit(1);
});
