# Tangerine — Project Roadmap

## How We Work
- One milestone at a time
- Each milestone is fully testable before moving to the next
- User decides which milestone to execute next
- README.md, AGENT.md, and ARCHITECTURE.md are updated as we go

---

## Milestone 0 — Static Landing Page + Live Deployment ✅ COMPLETE
**Goal:** Prove the full pipeline works end-to-end — from local development to a live public URL — before writing any real app code.

### Deliverables
- [x] Static HTML page served by Node.js/Express
- [x] Page displays: app name "Tangerine", a short description, placeholder content
- [x] Basic Tangerine branding: orange/green/brown color scheme, KaiTi font loaded
- [x] Git version tracking confirmed (commit history visible)
- [x] Site accessible locally (localhost)
- [x] Site accessible from mobile phone on the same network
- [x] Static page deployed to Cloudflare Pages
- [x] App accessible on mobile via public URL (not just local network)

### Success Criteria
- [x] Opened live URL on phone using mobile data — confirmed working
- [x] Tangerine name and colors visible
- [x] Git commit captures working state

### Live URL
https://project-tangerine.pages.dev

---

## Milestone 1 — React Frontend Setup ✅ COMPLETE
**Goal:** Replace the static page with a proper React app structure.

### Deliverables
- [x] React app scaffolded (Vite)
- [x] Deploy to Cloudflare Pages
- [x] Basic page routing set up (Dashboard, Quiz, Upload pages — empty for now)
- [x] KaiTi font applied globally
- [x] Tangerine color scheme applied via CSS
- [x] Mobile responsive layout confirmed
- [x] Unit tests written and passing (6/6)
- [x] GitHub Actions auto-deploy on every push to main

### Success Criteria
- [x] App loads in browser and on mobile
- [x] Navigation between pages works
- [x] Font and colors are correct
- [x] Deployed and accessible via public URL

### Live URL
https://project-tangerine.pages.dev

---

## Milestone 2 — Backend & Database Foundation ✅ COMPLETE
**Goal:** Stand up the Cloudflare Worker API and connect it to D1 (SQLite) database.

### Deliverables
- [x] Cloudflare Worker created (`worker/src/index.js`)
- [x] Cloudflare D1 database created (`tangerine-db`)
- [x] `vocabulary` table created
- [x] `sessions` table created
- [x] `answers` table created
- [x] `GET /api/health` — returns 200 OK
- [x] `GET /api/vocabulary` — fetch vocabulary by level/lesson
- [x] `POST /api/session/start` — start a quiz session
- [x] `POST /api/session/answer` — record an answer
- [x] `GET /api/dashboard` — fetch stats
- [x] Worker deployed to Cloudflare
- [x] 7/7 unit tests passing

### Success Criteria
- [x] Health check responds correctly
- [x] Database tables exist and are accessible
- [x] Worker live and reachable

### Live URLs
- Worker API: https://tangerine-worker.pacificatch.workers.dev
- Health check: https://tangerine-worker.pacificatch.workers.dev/api/health

---

## Milestone 3 — Vocabulary Upload ✅ COMPLETE
**Goal:** Import Chinese vocabulary into the database via file upload.

### Deliverables
- [x] Upload interface in the React frontend
- [x] Frontend parses Excel/CSV using SheetJS
- [x] Preview first 10 rows before importing
- [x] Vocabulary inserted into the `vocabulary` table via Worker API
- [x] Display inserted vs skipped count after upload
- [x] Duplicate handling (skip if traditional + level + lesson already exists)
- [x] One-time import script for existing Excel file (375 words loaded)
- [x] 10/10 unit tests passing

### Success Criteria
- [x] Upload a CSV/Excel file from the UI
- [x] Preview rows before importing
- [x] Vocabulary imported into database with duplicate protection

---

## Milestone 4 — Password & Session Recording ✅ COMPLETE
**Goal:** Gate performance recording behind a password. Anyone can use the app, but only the correct password enables results to be saved.

### Deliverables
- [x] Password prompt shown before every quiz session
- [x] Three scenarios handled:
  - No password (skip) → quiz runs, session not recorded
  - Wrong password → quiz runs, session not recorded
  - Correct password → quiz runs, session recorded normally
- [x] No lockout or error shown for wrong password — silently treated as guest
- [x] `POST /api/auth` endpoint — verifies password, returns authenticated true/false
- [x] Password stored as a hashed Cloudflare Worker secret (never plaintext)
- [x] Guest mode banner shown during quiz
- [x] Authenticated mode banner shown during quiz
- [x] `scripts/hash-password.js` — helper to generate password hash securely
- [x] 13/13 Worker unit tests passing
- [x] 7/7 frontend unit tests passing

### Success Criteria
- [x] Skip/wrong password → guest banner shown, nothing recorded
- [x] Correct password → authenticated banner shown, results recorded
- [x] Password never stored or transmitted in plaintext

---

## Milestone 5 — Session Setup ✅ COMPLETE
**Goal:** Let user select which level(s) and lesson(s) to drill.

### Deliverables
- [x] Session setup screen: select level(s) and lesson(s)
- [x] Vocabulary filtered by selected levels/lessons
- [x] Session record created in the database on start (authenticated only)
- [x] User can end/terminate session at any time (End Session button)

### Success Criteria
- [x] Select Level 1 Lesson 2 → quiz only shows Level 1 Lesson 2 words

---

## Milestone 6 — Core Quiz Engine ✅ COMPLETE
**Goal:** The quiz works with correct randomization and direction logic.

### Deliverables
- [x] Two directions per word: character→English and English→character
- [x] Randomized word order
- [x] Same character/word never asked back-to-back
- [x] Pinyin hidden by default; inline toggle to reveal; resets on next question
- [x] Correct/incorrect tracked per word per direction
- [x] Incorrect answers re-queued later (never sequentially)
- [x] Max 2× correct per direction (4× total per word)
- [x] Hint system (reveals pinyin): counts as incorrect even if answered correctly after
- [x] Session terminates when all words completed or user exits
- [x] Completion screen with accuracy stats
- [ ] Sentence hints — deferred (no sentence data in DB yet)
- [ ] Ambiguous word context — deferred to content enrichment phase

### Success Criteria
- [x] Full quiz session runs correctly
- [x] Randomization and re-ask logic behaves as specified
- [x] Pinyin toggle works per question

---

## Milestone 7 — Audio Pronunciation
**Goal:** Tap a button to hear the character pronounced in Mandarin.

### Deliverables
- [ ] Audio button appears when answer is revealed
- [ ] Web Speech API reads character aloud in Mandarin Chinese
- [ ] Button works on desktop and mobile

### Success Criteria
- Tap the button → hear the Mandarin pronunciation

---

## Milestone 8 — Dashboard & Progress Tracking
**Goal:** Landing page shows meaningful stats about learning progress.

### Deliverables
- [ ] Total words learned
- [ ] Accuracy rate per lesson (lifetime)
- [ ] Accuracy rate per session
- [ ] Current streak (days studied in a row)
- [ ] Most missed characters
- [ ] Last session date
- [ ] Session history view

### Success Criteria
- After completing a quiz session, stats update on the dashboard

---

## Future Milestones (Not Yet Scheduled)
- **AI Mnemonics** — Claude API integration for vivid character mnemonics
- **Simplified Mode** — switchable Traditional/Simplified character display
- **PDF Upload** — parse vocabulary from Integrated Chinese PDF files
- **Spaced Repetition (SRS)** — smart scheduling of character reviews
- **Stroke Order Animations** — visual stroke order for each character
- **Study Reminders** — push notifications or email reminders
- **Progress Export** — download progress data as CSV
- **Multi-user Support** — accounts, login/signup, separate progress per user
- **Upgraded Audio** — native speaker recordings or TTS API

---

## Current Status
| Milestone | Status |
|-----------|--------|
| 0 — Static Landing Page + Live Deployment | ✅ Complete |
| 1 — React Frontend Setup | ✅ Complete |
| 2 — Backend & Database | ✅ Complete |
| 3 — Vocabulary Upload | ✅ Complete |
| 4 — Password & Session Recording | ✅ Complete |
| 5 — Session Setup | ✅ Complete |
| 6 — Core Quiz Engine | ✅ Complete |
| 7 — Audio Pronunciation | Not started |
| 8 — Dashboard & Progress | Not started |
