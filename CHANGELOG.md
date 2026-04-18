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

---

## [Upcoming] — Milestone 0 continued: Cloudflare Deployment

### Planned
- Deploy static page to Cloudflare Pages
- Deploy Node.js backend to Cloudflare Workers
- Configure environment variables in Cloudflare
- Verify app accessible via public URL on mobile
