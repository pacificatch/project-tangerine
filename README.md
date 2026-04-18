# Tangerine

## Overview
A web-based app to help memorize Traditional Chinese characters sourced from the Integrated Chinese textbook. The app provides structured, interactive practice with an AI agent acting as a correction partner and quiz facilitator — not simply providing answers upfront. Learning style is collaborative and iterative: write first, receive targeted feedback second.

**Branding:** Tangerine — inspired by Mandarin language → Mandarin orange → Tangerine. Color scheme: orange (fruit), green (leaves), brown (branch).

## Tech Stack
- **Frontend:** React
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Font:** KaiTi via Google Fonts / CDN
- **Audio:** Web Speech API (browser built-in, free)
- **Hosting:** Cloudflare (frontend, backend, database)

## Phase 1 Features

### Quiz Protocol
- Always ask which level(s) and lesson(s) to drill before each session
- Two quiz directions per word:
  - Show character → user writes English
  - Show English → user types character (via Chinese IME/keyboard)
- Each word tested both directions at least once
- Randomized order
- The same character/word must NEVER be asked back-to-back (sequentially)
- Correct/incorrect tracked separately per direction
- Incorrect answers re-asked later in session (never sequentially); max 2× correct per direction (4× total per word)
- Pinyin always included when revealing an answer
- For multi-character words: show meaning of each individual character
- User can terminate session at any time

### Hints
- User can request hints at any time
- Hints count as incorrect — even if answered correctly after hint
- Sentence hints: Chinese sentence + pinyin only; English translation added only if requested
- Sentence must be 6+ words for sufficient context

### Pinyin Display
- Hidden by default per question
- Inline toggle button to reveal pinyin for that question
- Resets to hidden on next question

### Audio Pronunciation
- Web Speech API (browser built-in)
- Button appears when character/answer is revealed
- Reads character aloud in Mandarin Chinese
- Free, no API required

### Vocabulary Scope
- Traditional characters only (Phase 1)
- Draw from all levels and lessons up to and including current level/lesson
- Ask user permission before using vocabulary beyond current scope
- User selects specific level(s) and/or lesson(s) per session

### Ambiguous Words
- Add clarifying context in English prompt for particles and ambiguous terms

### Conversation Mode
- Display characters in plain text only — no bold, no heading formatting, no HTML styling tags

## Content Upload

### File Format
- Phase 1: Excel/CSV or Markdown (.md)
- Phase 2: PDF support
- Source: Integrated Chinese (Traditional character edition)
- App prompts user to upload file; if no file available, app searches online

### CSV/Excel Column Structure
| Column | Description |
|--------|-------------|
| Level | Textbook level (1–4) |
| Lesson | Lesson number within the level |
| Traditional | Traditional Chinese character(s) |
| Simplified | Simplified Chinese character(s) |
| Pinyin | Romanized pronunciation |
| Part of Speech | e.g. noun, verb, particle |
| Definition | English meaning |

## Progress & History
- Progress persisted in PostgreSQL backend database
- Track at both level and lesson granularity
- Per-session correct/incorrect tracking per word per direction
- History dashboard showing performance over time, struggling characters, streaks
- Each session starts with a prompt: which level(s) and lesson(s) to drill

## Dashboard (Landing Page)
- Total words learned
- Accuracy rate per lesson (lifetime) and per session
- Current streak
- Most missed characters
- Last session date

## Display
- KaiTi font for all Chinese characters
- Responsive design: works on both desktop and mobile

## Deployment
- Hosted entirely on Cloudflare (frontend, backend, database)

## Future Features
- AI-generated vivid visual mnemonics using radical/component breakdown (Claude API)
- Simplified character mode (switchable)
- Multi-user support with individual accounts, login/signup, and separate progress tracking
- User authentication system
- Stroke order animations
- Study reminders / push notifications
- Spaced repetition system (SRS)
- Progress data export (CSV)
- Upgraded audio (native speaker recordings or TTS API)
- PDF content upload support

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL

### Installation
```bash
npm install
```

### Environment Variables
```
DATABASE_URL=your_postgres_url_here
```

### Running the Project
```bash
npm start
```

## Notes
- Current user: single user (myself)
- Cloudflare account available for hosting/infrastructure
- Chinese character input via IME/Chinese keyboard (standard pinyin input method)
