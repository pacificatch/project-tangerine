# Tangerine — Technical Architecture

## Overview
Tangerine is a full-stack web application for memorizing Traditional Chinese characters. It consists of a React frontend, a Cloudflare Workers backend, and a Cloudflare D1 (SQLite) database — all hosted entirely within Cloudflare.

---

## System Architecture

```
[ Browser / Mobile ]
        |
        v
[ Cloudflare Pages ]  ── KaiTi font (CDN)
   React Frontend         Web Speech API (browser)
        |
        v
[ Cloudflare Workers ]
     Backend API
        |
        v
[ Cloudflare D1 ]
  SQLite Database

All layers hosted on Cloudflare. No external services required.
```

---

## Frontend

- **Framework:** React (Vite)
- **Styling:** CSS Modules
- **Font:** KaiTi — loaded via Google Fonts / CDN for all Chinese character display
- **Audio:** Web Speech API — browser built-in, no external dependency
- **Chinese Input:** User's system IME (pinyin → character selection)
- **Hosting:** Cloudflare Pages
- **Auto-deploy:** GitHub Actions on every push to main

### Key UI Components
- Landing / Dashboard — stats, streaks, last session
- Session Setup — select level(s) and lesson(s)
- Quiz View — character display, answer input, pinyin toggle, audio button
- Upload Interface — CSV/Excel file upload

---

## Backend

- **Runtime:** Cloudflare Workers (replaces Node.js/Express)
- **Responsibilities:**
  - Serve API endpoints consumed by the React frontend
  - Parse and import uploaded CSV/Excel vocabulary files
  - Store and retrieve quiz session data
  - Track progress, accuracy, streaks
  - Bind to Cloudflare D1 database
- **Hosting:** Cloudflare Workers

### Key API Endpoints (planned)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/vocabulary | Fetch vocabulary by level/lesson |
| POST | /api/upload | Upload CSV/Excel vocabulary file |
| POST | /api/session/start | Start a new quiz session |
| POST | /api/session/answer | Submit an answer |
| GET | /api/progress | Fetch progress and stats |
| GET | /api/dashboard | Fetch dashboard stats |

---

## Database

- **Engine:** SQLite via Cloudflare D1
- **Hosting:** Cloudflare D1 (native, no external service)

### Why D1 over PostgreSQL
- Native to Cloudflare — no separate account or service needed
- SQLite is sufficient for this app's data needs
- Free tier is generous
- Zero configuration

### Key Tables (planned)

**vocabulary**
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (autoincrement) |
| level | INTEGER | Textbook level (1–4) |
| lesson | INTEGER | Lesson number |
| traditional | TEXT | Traditional Chinese character(s) |
| simplified | TEXT | Simplified Chinese character(s) |
| pinyin | TEXT | Romanized pronunciation |
| part_of_speech | TEXT | e.g. noun, verb, particle |
| definition | TEXT | English meaning |

**sessions**
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (autoincrement) |
| started_at | TEXT | Session start time (ISO 8601) |
| ended_at | TEXT | Session end time (ISO 8601) |
| levels | TEXT | JSON array of levels covered |
| lessons | TEXT | JSON array of lessons covered |

**answers**
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (autoincrement) |
| session_id | INTEGER | Foreign key → sessions |
| vocabulary_id | INTEGER | Foreign key → vocabulary |
| direction | TEXT | 'char_to_eng' or 'eng_to_char' |
| is_correct | INTEGER | 1 = correct, 0 = incorrect |
| hint_used | INTEGER | 1 = hint requested, 0 = no hint |
| attempt_number | INTEGER | Which attempt (1–4) |
| answered_at | TEXT | Timestamp (ISO 8601) |

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
| Backend API | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |

### Deployment Flow
1. Push code to GitHub (`main` branch)
2. GitHub Actions runs tests → builds React app → deploys to Cloudflare Pages
3. Cloudflare Workers deploy separately via Wrangler

---

## Future Architecture Additions
- Claude API integration (Workers backend) — for AI-generated mnemonics
- Authentication service — for multi-user support
- Spaced repetition engine
- PDF parser for vocabulary upload
- Audio upgrade — TTS API or pre-recorded files
