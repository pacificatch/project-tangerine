# Agent Instructions — Tangerine

## Project Overview
A web-based Traditional Chinese character memorization app called **Tangerine**. Content sourced from Integrated Chinese textbook. The agent acts as a correction partner and quiz facilitator — not simply providing answers upfront. Learning style is collaborative and iterative.

**Branding:** Tangerine — inspired by Mandarin language → Mandarin orange → Tangerine. Color scheme: orange (fruit), green (leaves), brown (branch).

## Stack
- **Frontend:** React (Vite) — hosted on Cloudflare Pages
- **Backend:** Cloudflare Workers (replaces Node.js/Express)
- **Database:** Cloudflare D1 (SQLite) — native to Cloudflare
- **Font:** KaiTi via Google Fonts / CDN
- **Audio:** Web Speech API (browser built-in, free)
- **Hosting:** Cloudflare (Pages + Workers + D1 — all in one)

## Project Conventions
- Use camelCase for variables and functions
- Use kebab-case for file names
- Keep functions small and focused
- Keep README.md and AGENT.md updated as the project evolves

## CSV/Excel Column Structure
| Column | Description |
|--------|-------------|
| Level | Textbook level (1–4) |
| Lesson | Lesson number within the level |
| Traditional | Traditional Chinese character(s) |
| Simplified | Simplified Chinese character(s) |
| Pinyin | Romanized pronunciation |
| Part of Speech | e.g. noun, verb, particle |
| Definition | English meaning |

## Quiz Protocol Rules
- Always ask which level(s) and lesson(s) to drill at the start of each session
- Test each word in both directions: character→English and English→character
- Randomize word order
- The same character/word must NEVER be asked back-to-back (sequentially)
- Track correct/incorrect separately per direction, at both level and lesson granularity
- Incorrect answers re-asked later in session (never back-to-back); max 2× correct per direction (4× total per word)
- Always include pinyin when revealing an answer
- For multi-character words: show meaning of each individual character
- Hints count as incorrect even if answered correctly after hint
- Sentence hints: Chinese + pinyin only; add English only if requested; 6+ words minimum
- Ambiguous words (particles, etc.): add clarifying context in English prompt
- Conversation mode: plain text only — no bold, no headings, no HTML styling tags
- User can terminate session at any time

## Pinyin Display
- Hidden by default per question
- Inline toggle to reveal per question
- Resets to hidden on next question

## Audio
- Web Speech API — Mandarin Chinese voice
- Triggered by button shown when answer is revealed
- No API key required

## Vocabulary Scope
- Traditional characters only (Phase 1)
- Draw from all levels/lessons up to and including user's current level/lesson
- Ask user permission before using vocabulary beyond current scope
- User selects specific level(s) and/or lesson(s) each session

## Session Flow
1. Show dashboard with stats on landing
2. Prompt: which level(s) and lesson(s) to drill today?
3. Begin quiz
4. User may terminate session at any time

## Content Upload
- App prompts user to upload file (CSV/Excel or .md)
- If no file available, app searches for content online
- Upload interface required in the app

## Database Tracking
- Correct/incorrect per word per direction per session
- Progress at level and lesson granularity
- Lifetime accuracy per lesson across all sessions
- Session history, streaks, struggling characters, last session date

## Dashboard Stats (Landing Page)
- Total words learned
- Accuracy rate per lesson (lifetime) and per session
- Current streak
- Most missed characters
- Last session date

## Key Commands
```bash
cd client && npm run dev    # Run React frontend locally
wrangler dev                # Run Cloudflare Worker locally
cd client && npm test       # Run frontend tests
cd worker && npm test       # Run Worker tests
wrangler deploy             # Deploy Worker to Cloudflare (must be run from worker/ directory)
```

## Deployment Rules — IMPORTANT
- **GitHub Actions auto-deploys the frontend only** (Cloudflare Pages) on every push to main
- **The Worker is NOT auto-deployed** — any change to `worker/src/index.js` requires a manual `cd worker && npx wrangler deploy`
- Always run `wrangler deploy` after modifying Worker code, before telling the user a feature is complete
- Skipping this causes runtime crashes on the live site even though tests pass locally

## What to Avoid
- Do not commit .env files
- Do not modify node_modules directly
- Do not display pinyin by default — always hidden until toggled
- Do not go beyond user's current vocabulary scope without permission
- Do not use bold, headings, or HTML tags in conversation-mode quiz output
- Never ask the same character/word back-to-back in a session

## Future Features
- AI-generated mnemonics via Claude API
- Simplified character mode
- Multi-user support + authentication
- Stroke order animations
- Study reminders / push notifications
- Spaced repetition system (SRS)
- Progress data export (CSV)
- Upgraded audio (native speaker or TTS API)
- PDF content upload

## Notes
- Current user: single user only
- Chinese input via IME (pinyin → character selection)
- Cloudflare account available for all hosting needs
- Keep README.md and AGENT.md in sync as development progresses
