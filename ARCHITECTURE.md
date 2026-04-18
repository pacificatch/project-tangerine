# Tangerine — Technical Architecture

## Overview
Tangerine is a full-stack web application for memorizing Traditional Chinese characters. It consists of a React frontend, a Node.js/Express backend, and a PostgreSQL database, all hosted on Cloudflare.

---

## System Architecture

```
[ Browser / Mobile ]
        |
        v
[ React Frontend ]  ── KaiTi font (CDN)
        |               Web Speech API (browser)
        v
[ Node.js + Express Backend ]
        |
        v
[ PostgreSQL Database ]

All layers hosted on Cloudflare infrastructure.
```

---

## Frontend

- **Framework:** React
- **Styling:** TBD (CSS Modules or Tailwind CSS)
- **Font:** KaiTi — loaded via Google Fonts / CDN for all Chinese character display
- **Audio:** Web Speech API — browser built-in, no external dependency
- **Chinese Input:** User's system IME (pinyin → character selection)
- **Hosting:** Cloudflare Pages

### Key UI Components
- Landing / Dashboard — stats, streaks, last session
- Session Setup — select level(s) and lesson(s)
- Quiz View — character display, answer input, pinyin toggle, audio button
- Upload Interface — CSV/Excel file upload

---

## Backend

- **Runtime:** Node.js
- **Framework:** Express
- **Responsibilities:**
  - Serve API endpoints consumed by the React frontend
  - Parse and import uploaded CSV/Excel vocabulary files
  - Store and retrieve quiz session data
  - Track progress, accuracy, streaks
- **Hosting:** Cloudflare Workers

### Key API Endpoints (planned)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/vocabulary | Fetch vocabulary by level/lesson |
| POST | /api/upload | Upload CSV/Excel vocabulary file |
| POST | /api/session/start | Start a new quiz session |
| POST | /api/session/answer | Submit an answer |
| GET | /api/progress | Fetch progress and stats |
| GET | /api/dashboard | Fetch dashboard stats |

---

## Database

- **Engine:** PostgreSQL
- **Hosting:** Cloudflare (D1 or connected Postgres service)

### Key Tables (planned)

**vocabulary**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| level | INT | Textbook level (1–4) |
| lesson | INT | Lesson number |
| traditional | TEXT | Traditional Chinese character(s) |
| simplified | TEXT | Simplified Chinese character(s) |
| pinyin | TEXT | Romanized pronunciation |
| part_of_speech | TEXT | e.g. noun, verb, particle |
| definition | TEXT | English meaning |

**sessions**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| started_at | TIMESTAMP | Session start time |
| ended_at | TIMESTAMP | Session end time |
| levels | INT[] | Levels covered |
| lessons | INT[] | Lessons covered |

**answers**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| session_id | UUID | Foreign key → sessions |
| vocabulary_id | UUID | Foreign key → vocabulary |
| direction | TEXT | 'char_to_eng' or 'eng_to_char' |
| is_correct | BOOLEAN | Whether answered correctly |
| hint_used | BOOLEAN | Whether a hint was requested |
| attempt_number | INT | Which attempt (1, 2, 3, 4) |
| answered_at | TIMESTAMP | Timestamp of answer |

---

## Content Upload

- **Phase 1:** CSV / Excel / Markdown (.md)
- **Phase 2:** PDF
- Upload interface in the React frontend
- Backend parses the file and inserts rows into the `vocabulary` table
- If no file is available, app attempts to source content online

---

## Hosting & Deployment (Cloudflare)

| Layer | Cloudflare Service |
|-------|--------------------|
| Frontend (React) | Cloudflare Pages |
| Backend (Node/Express) | Cloudflare Workers |
| Database (PostgreSQL) | Cloudflare D1 or external Postgres |

---

## Future Architecture Additions
- Claude API integration (backend) — for AI-generated mnemonics
- Authentication service — for multi-user support
- Spaced repetition engine
- PDF parser for vocabulary upload
- Audio upgrade — TTS API or pre-recorded files
