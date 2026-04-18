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

## Legend
| Symbol | Meaning |
|--------|---------|
| ✅ Pass | Test passed |
| ❌ Fail | Test failed |
| 🔲 Pending | Not yet written or run |
| ⚠️ Skipped | Intentionally skipped with reason |
