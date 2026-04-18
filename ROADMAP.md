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

## Milestone 1 — React Frontend Setup
**Goal:** Replace the static page with a proper React app structure.

### Deliverables
- [ ] React app scaffolded (Vite or Create React App)
- [ ] Node.js/Express backend serves the React frontend
- [ ] Basic page routing set up (Dashboard, Quiz, Upload pages — empty for now)
- [ ] KaiTi font applied globally
- [ ] Tangerine color scheme applied via CSS
- [ ] Mobile responsive layout confirmed

### Success Criteria
- App loads in browser and on mobile
- Navigation between pages works
- Font and colors are correct

---

## Milestone 2 — Backend & Database Foundation
**Goal:** Stand up the backend API and connect it to PostgreSQL.

### Deliverables
- [ ] Node.js/Express API running
- [ ] PostgreSQL database connected
- [ ] `vocabulary` table created
- [ ] `sessions` table created
- [ ] `answers` table created
- [ ] Basic health check endpoint: GET /api/health returns 200 OK
- [ ] Environment variables configured (.env)

### Success Criteria
- Backend runs locally
- Database tables exist and are accessible
- Health check endpoint responds correctly

---

## Milestone 3 — Vocabulary Upload
**Goal:** Import Chinese vocabulary into the database via file upload.

### Deliverables
- [ ] Upload interface in the React frontend
- [ ] Backend parses CSV/Excel file
- [ ] Vocabulary inserted into the `vocabulary` table
- [ ] Display uploaded vocabulary list (level, lesson, character, pinyin, definition)
- [ ] Duplicate handling (don't insert the same word twice)

### Success Criteria
- Upload a CSV file from the UI
- Vocabulary appears in the database and on screen

---

## Milestone 4 — Session Setup
**Goal:** Let user select which level(s) and lesson(s) to drill.

### Deliverables
- [ ] Session setup screen: select level(s) and lesson(s)
- [ ] Vocabulary filtered by selected levels/lessons
- [ ] Session record created in the database on start
- [ ] User can cancel/terminate session at any time

### Success Criteria
- Select Level 1 Lesson 2 → quiz only shows Level 1 Lesson 2 words

---

## Milestone 5 — Core Quiz Engine
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

## Milestone 6 — Audio Pronunciation
**Goal:** Tap a button to hear the character pronounced in Mandarin.

### Deliverables
- [ ] Audio button appears when answer is revealed
- [ ] Web Speech API reads character aloud in Mandarin Chinese
- [ ] Button works on desktop and mobile

### Success Criteria
- Tap the button → hear the Mandarin pronunciation

---

## Milestone 7 — Dashboard & Progress Tracking
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
| 1 — React Frontend Setup | Not started |
| 2 — Backend & Database | Not started |
| 3 — Vocabulary Upload | Not started |
| 4 — Session Setup | Not started |
| 5 — Core Quiz Engine | Not started |
| 6 — Audio Pronunciation | Not started |
| 7 — Dashboard & Progress | Not started |
