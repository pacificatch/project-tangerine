-- Tangerine Database Schema
-- Engine: Cloudflare D1 (SQLite)

CREATE TABLE IF NOT EXISTS vocabulary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level INTEGER NOT NULL,
  lesson INTEGER NOT NULL,
  traditional TEXT NOT NULL,
  simplified TEXT,
  pinyin TEXT NOT NULL,
  part_of_speech TEXT,
  definition TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  levels TEXT NOT NULL,
  lessons TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  vocabulary_id INTEGER NOT NULL,
  direction TEXT NOT NULL CHECK(direction IN ('char_to_eng', 'eng_to_char')),
  is_correct INTEGER NOT NULL CHECK(is_correct IN (0, 1)),
  hint_used INTEGER NOT NULL DEFAULT 0 CHECK(hint_used IN (0, 1)),
  attempt_number INTEGER NOT NULL,
  answered_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id),
  FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id)
);
