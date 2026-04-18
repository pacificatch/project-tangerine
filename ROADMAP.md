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

## Milestone 4 — Password & Session Recording
**Goal:** Gate performance recording behind a password. Anyone can use the app, but only the correct password enables results to be saved.

### Deliverables
- [ ] Password prompt shown before every quiz session
- [ ] Three scenarios handled:
  - No password (skip) → quiz runs, session not recorded
  - Wrong password → quiz runs, session not recorded
  - Correct password → quiz runs, session recorded normally
- [ ] No lockout or error shown for wrong password — silently treated as guest
- [ ] `POST /api/auth` endpoint — verifies password, returns authenticated true/false
- [ ] Password stored as a hashed Cloudflare Worker secret (never plaintext)
- [ ] Guest mode clearly indicated in the UI during quiz
- [ ] Unit tests for auth endpoint

### Success Criteria
- Wrong password → quiz works but nothing recorded in database
- Correct password → quiz results appear in progress/history
- Password never stored or transmitted in plaintext

---

## Milestone 5 — Session Setup
**Goal:** Let user select which level(s) and lesson(s) to drill.

### Deliverables
- [ ] Session setup screen: select level(s) and lesson(s)
- [ ] Vocabulary filtered by selected levels/lessons
- [ ] Session record created in the database on start
- [ ] User can cancel/terminate session at any time

### Success Criteria
- Select Level 1 Lesson 2 → quiz only shows Level 1 Lesson 2 words

---

## Milestone 6 — Core Quiz Engine
**Goal:** The quiz works with correct randomization and direction logic.

### Deliverables
- [ ] Two directions per word: character→English and English→character
- [ ] Randomized word order
- [ ] Same character/word never asked back-to-back
- [ ] Pinyin hidden by default; inline toggle to reveal; resets on next question
- [ ] Correct/incorrect tracked per word per direction
- [ ] Incorrect answers re-queued later (never sequentially)
- [ ] Max 2× correct per direction (4× total per word)
- [ ] Hint system: counts as incorrect even if answered correctly after
- [ ] Sentence hints: Chinese + pinyin only; English on request; 6+ words
- [ ] Ambiguous words show clarifying context in English prompt
- [ ] Conversation mode: plain text only, no formatting tags
- [ ] Session terminates when all words completed or user exits

### Success Criteria
- Full quiz session runs correctly
- Randomization and re-ask logic behaves as specified
- Pinyin toggle works per question

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
| 4 — Password & Session Recording | Not started |
| 5 — Session Setup | Not started |
| 6 — Core Quiz Engine | Not started |
| 7 — Audio Pronunciation | Not started |
| 8 — Dashboard & Progress | Not started |
