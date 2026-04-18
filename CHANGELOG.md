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
