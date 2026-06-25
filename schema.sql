CREATE TABLE IF NOT EXISTS runs (
  id TEXT PRIMARY KEY,
  profile TEXT,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  run_id TEXT,
  company_name TEXT,
  website TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS competitors (
  id TEXT PRIMARY KEY,
  run_id TEXT,
  name TEXT,
  website TEXT,
  strengths TEXT,
  weaknesses TEXT
);

CREATE TABLE IF NOT EXISTS outreach (
  id TEXT PRIMARY KEY,
  lead_id TEXT,
  subject TEXT,
  body TEXT
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  run_id TEXT,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);