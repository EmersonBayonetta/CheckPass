CREATE TABLE IF NOT EXISTS guests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  max_companions INTEGER NOT NULL DEFAULT 0 CHECK (max_companions >= 0),
  companions_count INTEGER NOT NULL DEFAULT 0 CHECK (companions_count >= 0),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'DECLINED')),
  token TEXT NOT NULL UNIQUE,
  confirmed_at TIMESTAMPTZ,
  entry_validated BOOLEAN NOT NULL DEFAULT FALSE,
  entry_validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (companions_count <= max_companions)
);

CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(name);
CREATE INDEX IF NOT EXISTS idx_guests_phone ON guests(phone);
CREATE INDEX IF NOT EXISTS idx_guests_status ON guests(status);
CREATE INDEX IF NOT EXISTS idx_guests_entry_validated ON guests(entry_validated);
