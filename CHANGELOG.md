# Tangerine — Changelog

All notable changes to this project are documented here.
Format: Date · Milestone · Description

---

## [2026-04-18] — Milestone 0: Static Landing Page

### Added
- `server.js` — Node.js/Express server serving static files on port 3000
- `public/index.html` — Static landing page with Tangerine branding
  - App name, tagline, Chinese character sample (你好，世界)
  - Color scheme: orange, green, brown
  - KaiTi-style font via Google Fonts (Ma Shan Zheng)
- `package.json` — npm project initialized with Express dependency and `npm start` script
- `.gitignore` — Node.js standard ignores (node_modules, .env, dist, etc.)
- `README.md` — Full project overview, tech stack, features, and roadmap summary
- `AGENT.md` — AI agent instructions, quiz protocol rules, conventions
- `ARCHITECTURE.md` — Technical architecture: system diagram, stack, DB schema, API endpoints
- `ROADMAP.md` — Phased delivery plan from Milestone 0 to full deployment
- `TROUBLESHOOTING.md` — Known issues and fixes log

### Fixed
- Server bound to `0.0.0.0` to allow access from iPhone on local network
  (see TROUBLESHOOTING.md for details)

### Infrastructure
- Git initialized, branch renamed from `master` to `main`
- GitHub repo created: https://github.com/pacificatch/project-tangerine
- Local directory: `~/projects/project-tangerine`

### Deployed
- Wrangler CLI installed (v4.83.0)
- Cloudflare Pages project created: `project-tangerine`
- Static `public/` folder deployed to Cloudflare Pages
- Live URL: https://project-tangerine.pages.dev
- Verified accessible on desktop and mobile via public URL

### Milestone 0 Status: ✅ Complete

---

## [2026-04-18] — Milestone 1: React Frontend Setup

### Added
- `client/` — Vite + React app scaffolded
- `client/src/pages/Dashboard.jsx` — Dashboard placeholder page
- `client/src/pages/Quiz.jsx` — Quiz placeholder page
- `client/src/pages/Upload.jsx` — Upload placeholder page
- `client/src/App.jsx` — App shell with header, nav, routing, footer
- `client/src/App.css` — Tangerine color scheme, responsive layout
- `client/src/index.css` — Global styles, KaiTi font (Ma Shan Zheng via Google Fonts)
- `client/src/test/setup.js` — Vitest test setup
- `client/src/test/App.test.jsx` — 6 unit tests for App component
- `TESTING.md` — Testing documentation file

### Testing
- Vitest + React Testing Library configured
- 6/6 automated tests passed (App render, navigation, routing, footer)

### Infrastructure
- React Router v7 installed for page routing
- Vitest + React Testing Library + jsdom installed

### Infrastructure
- GitHub Actions workflow added (`.github/workflows/deploy.yml`)
- Auto-deploy on every push to main: runs tests → builds → deploys to Cloudflare Pages
- GitHub secrets configured: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- First automated deploy confirmed successful (all steps passed)

### Milestone 1 Status: ✅ Complete

---

## [2026-04-18] — Milestone 2: Backend & Database Foundation

### Added
- `worker/wrangler.toml` — Cloudflare Worker configuration, D1 database binding
- `worker/schema.sql` — Database schema (vocabulary, sessions, answers tables)
- `worker/src/index.js` — Cloudflare Worker with API endpoints:
  - `GET /api/health`
  - `GET /api/vocabulary`
  - `POST /api/session/start`
  - `POST /api/session/answer`
  - `GET /api/dashboard`
- `worker/src/test/worker.test.js` — 7 unit tests for all API endpoints

### Infrastructure
- Cloudflare D1 database created: `tangerine-db`
- Schema applied to live D1 database (3 tables)
- Worker deployed to Cloudflare Workers

### Testing
- 7/7 unit tests passed (Vitest)

### Live URLs
- Worker API: https://tangerine-worker.pacificatch.workers.dev
- Health check: https://tangerine-worker.pacificatch.workers.dev/api/health

### Milestone 2 Status: ✅ Complete

---

## [2026-04-18] — Milestone 3: Vocabulary Upload

### Added
- `client/src/pages/Upload.jsx` — Upload page with file picker, preview, and import
- `client/src/pages/Upload.css` — Upload page styling
- `worker/src/index.js` — Added `POST /api/upload` endpoint with duplicate detection
- `scripts/import-vocabulary.js` — One-time import script for Excel file
- SheetJS (xlsx) installed in React client for browser-side Excel/CSV parsing

### Data
- 375 Level 1 vocabulary words imported from Integrated Chinese (Lessons 1–10)

### Testing
- 10/10 Worker unit tests passing (added 3 tests for upload endpoint)

### Milestone 3 Status: ✅ Complete

---

## [2026-04-18] — Milestone 4: Password & Session Recording

### Added
- `worker/src/index.js` — `POST /api/auth` endpoint using Web Crypto SHA-256 hashing
- `client/src/components/PasswordPrompt.jsx` — password modal shown before every quiz
- `client/src/components/PasswordPrompt.css` — styling for password modal
- `client/src/pages/Quiz.jsx` — updated to show password prompt, guest/auth banners
- `client/src/pages/Quiz.css` — guest and auth banner styles
- `scripts/hash-password.js` — helper script to generate password hash securely

### Security
- Password stored as SHA-256 hash in Cloudflare Worker secret (`PASSWORD_HASH`)
- Never stored or transmitted in plaintext
- Wrong password silently treated as guest — no lockout or error

### Testing
- 13/13 Worker unit tests passing
- 7/7 frontend unit tests passing

### Milestone 4 Status: ✅ Complete

---

## [2026-04-18] — Milestone 7: Audio Pronunciation

### Added
- `client/src/components/QuizEngine.jsx` — 🔊 Hear it button in revealed phase
  - Uses Web Speech API (browser built-in, no API key needed)
  - Language set to `zh-TW` (Traditional Chinese Mandarin)
  - Rate set to 0.85 for clearer pronunciation
  - Appears on every revealed answer regardless of direction

### Milestone 7 Status: ✅ Complete

---

## [2026-04-18] — Milestone 6: Core Quiz Engine

### Added
- `client/src/components/QuizEngine.jsx` — full quiz engine component
  - 2 cards per word (character→English and English→character)
  - Shuffled queue, no same-word back-to-back guaranteed
  - Reveal-then-self-mark flow (show answer, mark Correct/Incorrect)
  - Pinyin hidden by default; "Show pinyin" toggle; resets on next card
  - Hint button reveals pinyin and forces incorrect regardless of answer
  - Incorrect answers re-queued at least 2 positions ahead (never next)
  - Card retired after 2 correct answers per direction
  - Progress bar (done/total cards) and live correct/incorrect counters
  - Completion screen with words covered, correct, incorrect, accuracy %
  - Answers recorded to backend via POST /api/session/answer (authenticated only)
- `client/src/components/QuizEngine.css` — quiz card styling

### Testing
- 20/20 frontend unit tests passing (added 5 tests for quiz engine)

### Milestone 6 Status: ✅ Complete

---

## [2026-04-18] — Milestone 5: Session Setup

### Added
- `worker/src/index.js` — `GET /api/lessons` endpoint: returns distinct level/lesson pairs from vocabulary table
- `client/src/components/SessionSetup.jsx` — lesson selector shown after password auth
  - Checkboxes grouped by level, with "Select all / Deselect all" per level
  - Fetches vocabulary for selected lessons in parallel on start
  - Creates session record via `POST /api/session/start` when authenticated (skips if guest)
  - Disabled "Start Session" button until at least one lesson selected
- `client/src/components/SessionSetup.css` — styles for lesson selector
- `client/src/pages/Quiz.jsx` — added `quizState: 'setup' | 'active'` flow
  - Shows SessionSetup after auth, quiz active view after session starts
  - Active view shows word count, selected lessons, session ID, and End Session button
- `client/src/pages/Quiz.css` — styles for active quiz header and end session button

### Testing
- 14/14 Worker unit tests passing (added 1 test for `/api/lessons`)
- 15/15 Frontend unit tests passing (added 4 tests for session setup)

### Milestone 5 Status: ✅ Complete

---

## [2026-04-18] — Milestone 4b: Upload Page Password Gate

### Added
- `client/src/pages/Upload.jsx` — inline password gate above upload controls
  - Password required to enable the Import button
  - Wrong password shows error message; upload stays disabled
  - Correct password shows auth banner and enables import
- `client/src/pages/Upload.css` — styles for auth gate, error message, auth banner

### Testing
- 11/11 frontend unit tests passing (added 4 tests for upload auth gate)

---

## [2026-04-18] — Architecture Decision: Switch to Cloudflare D1

### Changed
- **Database:** PostgreSQL → Cloudflare D1 (SQLite)
- **Backend:** Node.js/Express → Cloudflare Workers
- **Reason:** D1 is native to Cloudflare, no external service needed, SQLite is sufficient for this app, free tier is generous

### Updated
- `ARCHITECTURE.md` — updated system diagram, backend, database sections
- `README.md` — updated tech stack, prerequisites, run commands
- `AGENT.md` — updated stack and key commands
