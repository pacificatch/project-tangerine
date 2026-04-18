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

### Milestone 2 — Backend & Database
- [ ] Open https://tangerine-worker.pacificatch.workers.dev/api/health in browser — should show `{"status":"ok","message":"Tangerine API is running"}`
- [ ] Confirm no errors in the response

### Milestone 3 — Vocabulary Upload
- [ ] Open the app and click **Upload** in the nav
- [ ] Select your `Chinese_I_Vocabulary.xlsx` file
- [ ] Confirm the preview shows the first 10 rows with correct characters, pinyin, and definitions
- [ ] Click **Import** and confirm the success screen shows inserted count
- [ ] Upload the same file again — confirm skipped count equals total rows (duplicate protection works)

### Milestone 4 — Password & Session Recording

#### How to change your password
1. Generate a new hash — run this and type your new password when prompted:
```bash
node ~/projects/project-tangerine/scripts/hash-password.js
```
2. Copy the hash it outputs, then set it as the Cloudflare secret:
```bash
cd ~/projects/project-tangerine/worker && wrangler secret put PASSWORD_HASH
```
3. Paste the hash when prompted. This overwrites the old password immediately.

#### Fixing an accidental secret
If you accidentally set the wrong value as a secret name, delete it with:
```bash
cd ~/projects/project-tangerine/worker && wrangler secret delete <accidental-secret-name>
```

#### Testing the password flow
- [ ] Open the app and start a quiz session
- [ ] Skip the password prompt — confirm guest mode indicator is shown
- [ ] Enter a wrong password — confirm guest mode indicator is shown, no error or lockout
- [ ] Enter the correct password — confirm authenticated mode, results recorded
- [ ] Complete a guest session — confirm nothing appears in progress/history
- [ ] Complete an authenticated session — confirm results appear in progress/history

### Milestone 5 — Session Setup (coming soon)
- [ ] To be added

### Milestone 6 — Quiz Engine (coming soon)
- [ ] To be added

### Milestone 7 — Audio (coming soon)
- [ ] To be added

### Milestone 8 — Dashboard & Progress (coming soon)
- [ ] To be added

---

## What Good Testing Looks Like
- Test on both **desktop and iPhone** for every milestone
- Test the **live URL**, not just localhost
- If something looks wrong, note it here and report it in chat
- Check GitHub Actions passed before considering a milestone done
