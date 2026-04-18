# Tangerine — User Testing Guide

This file documents how to manually test the app as a user. Updated as new features are added.

---

## How to Test

### 1. Local Testing (during development)
Run the app on your machine before pushing code:
```bash
cd ~/projects/project-tangerine/client && npm run dev -- --host
```
- Desktop: `http://localhost:5173`
- iPhone (same WiFi): `http://192.168.1.96:5173`

**Best for:** testing changes in real time as features are being built.

---

### 2. Automated Unit Tests
Run the test suite to check all components work correctly:
```bash
cd ~/projects/project-tangerine/client && npm test
```
**Best for:** catching broken logic before it goes live.

---

### 3. Live Site Testing
Open the public URL on any device:
- **https://project-tangerine.pages.dev**

Test on:
- Desktop browser (Chrome, Safari)
- iPhone (Safari)
- iPhone using mobile data (not WiFi) — confirms it's truly live

**Best for:** confirming the deployed version looks and works correctly.

---

### 4. GitHub Actions (automatic)
Every push to `main` automatically runs tests and deploys. View results at:
- **https://github.com/pacificatch/project-tangerine/actions**

If any test fails, the deploy is blocked — broken code never goes live.

**Best for:** confirming the full pipeline (test → build → deploy) is healthy.

---

## Testing Checklist by Milestone

### Milestone 0 — Static Landing Page
- [ ] Open `http://localhost:3000` on desktop — page loads
- [ ] Open `http://192.168.1.96:3000` on iPhone (same WiFi) — page loads
- [ ] Open `https://project-tangerine.pages.dev` on desktop — page loads
- [ ] Open `https://project-tangerine.pages.dev` on iPhone (mobile data) — page loads
- [ ] Tangerine name and branding visible
- [ ] KaiTi font renders correctly

### Milestone 1 — React Frontend
- [ ] Open `http://localhost:5173` on desktop — app loads
- [ ] Open `http://192.168.1.96:5173` on iPhone — app loads
- [ ] Click Dashboard nav link — Dashboard page appears
- [ ] Click Quiz nav link — Quiz page appears
- [ ] Click Upload nav link — Upload page appears
- [ ] Active nav link is visually highlighted
- [ ] Footer shows 橘子 in KaiTi font
- [ ] Layout looks correct on mobile (no overflow, no broken layout)
- [ ] Open `https://project-tangerine.pages.dev` — live site reflects latest changes

### Milestone 2 — Backend & Database (coming soon)
- [ ] To be added

### Milestone 3 — Vocabulary Upload (coming soon)
- [ ] To be added

### Milestone 4 — Session Setup (coming soon)
- [ ] To be added

### Milestone 5 — Quiz Engine (coming soon)
- [ ] To be added

### Milestone 6 — Audio (coming soon)
- [ ] To be added

### Milestone 7 — Dashboard & Progress (coming soon)
- [ ] To be added

---

## What Good Testing Looks Like
- Test on both **desktop and iPhone** for every milestone
- Test the **live URL**, not just localhost
- If something looks wrong, note it here and report it in chat
- Check GitHub Actions passed before considering a milestone done
