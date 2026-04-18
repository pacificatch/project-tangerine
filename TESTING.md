# Tangerine — Testing Documentation

All tests performed during development are documented here, organized by milestone.

---

## Testing Stack

| Layer | Framework | Purpose |
|-------|-----------|---------|
| Frontend (React) | Vitest + React Testing Library | Component and logic tests |
| Backend (Node.js/Express) | Vitest + Supertest | API endpoint tests |

### How to Run Tests

```bash
# Frontend tests
cd client
npm run test

# Backend tests (once set up)
npm run test
```

---

## Milestone 0 — Static Landing Page + Cloudflare Deployment

### Manual Tests
| Test | Method | Result |
|------|--------|--------|
| Page loads on desktop browser | Open http://localhost:3000 | ✅ Pass |
| Page loads on iPhone (local network) | Open http://192.168.1.96:3000 | ✅ Pass |
| Page loads on desktop via public URL | Open https://project-tangerine.pages.dev | ✅ Pass |
| Page loads on iPhone via public URL (mobile data) | Open URL on iPhone with WiFi off | ✅ Pass |
| Tangerine branding visible | Visual check | ✅ Pass |
| KaiTi font renders correctly | Visual check | ✅ Pass |

### Automated Tests
None — no application logic in Milestone 0.

---

## Milestone 1 — React Frontend Setup

### Manual Tests
| Test | Method | Result |
|------|--------|--------|
| React app loads on desktop | Open http://localhost:5173 | ✅ Pass |
| React app loads on iPhone (local network) | Open http://192.168.1.96:5173 | ✅ Pass |
| Dashboard page renders | Click Dashboard nav link | ✅ Pass |
| Quiz page renders | Click Quiz nav link | ✅ Pass |
| Upload page renders | Click Upload nav link | ✅ Pass |
| Navigation active state highlights correctly | Click each nav link | ✅ Pass |
| KaiTi font renders in footer | Visual check | ✅ Pass |
| Orange/green/brown color scheme applied | Visual check | ✅ Pass |
| Mobile responsive layout | Resize browser / iPhone check | ✅ Pass |

### Automated Tests
| Test | Framework | Status |
|------|-----------|--------|
| Testing framework setup (Vitest + React Testing Library) | Vitest | ✅ Pass |
| App renders without crashing | React Testing Library | ✅ Pass |
| All navigation links render (Dashboard, Quiz, Upload) | React Testing Library | ✅ Pass |
| Dashboard page shown by default | React Testing Library | ✅ Pass |
| Navigates to Quiz page on click | React Testing Library | ✅ Pass |
| Navigates to Upload page on click | React Testing Library | ✅ Pass |
| Footer renders Chinese characters (橘子) | React Testing Library | ✅ Pass |

**Result: 6/6 tests passed** — `client/src/test/App.test.jsx`

---

## Milestone 2 — Backend & Database Foundation

### Manual Tests
| Test | Method | Result |
|------|--------|--------|
| Health check endpoint live | `curl https://tangerine-worker.pacificatch.workers.dev/api/health` | ✅ Pass |
| Returns `{ status: "ok" }` | Visual check of response | ✅ Pass |

### Automated Tests
| Test | Framework | Status |
|------|-----------|--------|
| GET /api/health returns 200 and status ok | Vitest | ✅ Pass |
| OPTIONS preflight returns 200 with CORS headers | Vitest | ✅ Pass |
| GET /api/vocabulary returns array | Vitest | ✅ Pass |
| POST /api/session/start returns sessionId | Vitest | ✅ Pass |
| POST /api/session/answer returns success | Vitest | ✅ Pass |
| GET /api/dashboard returns stats object | Vitest | ✅ Pass |
| Unknown route returns 404 | Vitest | ✅ Pass |

**Result: 7/7 tests passed** — `worker/src/test/worker.test.js`

---

## Milestone 3 — Vocabulary Upload

### Manual Tests
| Test | Method | Result |
|------|--------|--------|
| Upload page loads | Open /upload in browser | ✅ Pass |
| File picker accepts .xlsx/.csv | Select file | 🔲 Pending user test |
| Preview shows first 10 rows | Upload Excel file | 🔲 Pending user test |
| Import button submits to Worker | Click import | 🔲 Pending user test |
| Success screen shows inserted/skipped count | After import | 🔲 Pending user test |
| Duplicate words are skipped | Re-upload same file | 🔲 Pending user test |

### Automated Tests
| Test | Framework | Status |
|------|-----------|--------|
| POST /api/upload returns 400 for empty rows | Vitest | ✅ Pass |
| POST /api/upload skips duplicate entries | Vitest | ✅ Pass |
| POST /api/upload inserts new rows successfully | Vitest | ✅ Pass |

**Result: 10/10 tests passed** — `worker/src/test/worker.test.js`

---

## Milestone 4 — Password & Session Recording

### Manual Tests
| Test | Method | Result |
|------|--------|--------|
| Password prompt appears on Quiz page | Navigate to /quiz | 🔲 Pending user test |
| Skip shows guest banner | Click skip | 🔲 Pending user test |
| Wrong password shows guest banner | Enter wrong password | 🔲 Pending user test |
| Correct password shows auth banner | Enter correct password | 🔲 Pending user test |

### Automated Tests
| Test | Framework | Status |
|------|-----------|--------|
| POST /api/auth returns false for empty password | Vitest | ✅ Pass |
| POST /api/auth returns false for wrong password | Vitest | ✅ Pass |
| POST /api/auth returns false when secret not set | Vitest | ✅ Pass |
| Password prompt renders on Quiz page | React Testing Library | ✅ Pass |
| Skip button shows guest banner | React Testing Library | ✅ Pass |

**Worker result: 13/13 tests passed** — `worker/src/test/worker.test.js`
**Frontend result: 11/11 tests passed** — `client/src/test/App.test.jsx`

---

## Milestone 4b — Upload Page Password Gate

### Manual Tests
| Test | Method | Result |
|------|--------|--------|
| Password gate appears on Upload page | Navigate to /upload | 🔲 Pending user test |
| Wrong password shows error message | Enter wrong password, click Unlock | 🔲 Pending user test |
| Correct password shows auth banner | Enter correct password, click Unlock | 🔲 Pending user test |
| Import button disabled when locked | Load file without unlocking | 🔲 Pending user test |
| Import button enabled after unlock | Unlock then load file | 🔲 Pending user test |

### Automated Tests
| Test | Framework | Status |
|------|-----------|--------|
| Password gate renders on Upload page | React Testing Library | ✅ Pass |
| Import button absent when locked (no file loaded) | React Testing Library | ✅ Pass |
| Wrong password shows error message | React Testing Library | ✅ Pass |
| Correct password shows auth banner | React Testing Library | ✅ Pass |

**Frontend result: 11/11 tests passed** — `client/src/test/App.test.jsx`

---

## Milestone 5 — Session Setup

### Manual Tests
| Test | Method | Result |
|------|--------|--------|
| Session setup screen appears after auth/skip | Navigate to Quiz, skip password | 🔲 Pending user test |
| Lessons load and display as checkboxes | Visual check | 🔲 Pending user test |
| Select All / Deselect All per level works | Click button | 🔲 Pending user test |
| Start Session disabled until a lesson selected | Visual check | 🔲 Pending user test |
| Start Session loads words and transitions to active view | Select lesson, click Start | 🔲 Pending user test |
| Active view shows word count and lesson labels | Visual check | 🔲 Pending user test |
| Session ID shown when authenticated | Log in, start session | 🔲 Pending user test |
| End Session returns to setup screen | Click End Session | 🔲 Pending user test |

### Automated Tests
| Test | Framework | Status |
|------|-----------|--------|
| GET /api/lessons returns level/lesson pairs | Vitest | ✅ Pass |
| Session setup renders after skipping password | React Testing Library | ✅ Pass |
| Lesson checkboxes visible after load | React Testing Library | ✅ Pass |
| Start Session disabled with no lessons selected | React Testing Library | ✅ Pass |
| Start Session enabled after selecting a lesson | React Testing Library | ✅ Pass |

**Worker result: 14/14 tests passed** — `worker/src/test/worker.test.js`
**Frontend result: 15/15 tests passed** — `client/src/test/App.test.jsx`

---

## Legend
| Symbol | Meaning |
|--------|---------|
| ✅ Pass | Test passed |
| ❌ Fail | Test failed |
| 🔲 Pending | Not yet written or run |
| ⚠️ Skipped | Intentionally skipped with reason |
