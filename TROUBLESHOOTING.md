# Tangerine — Troubleshooting & Known Fixes

A running log of issues encountered during development and how they were resolved.

---

## Issue: App not accessible from iPhone on local network

**Milestone:** 0 — Static Landing Page
**Date:** 2026-04-18

### Symptom
The app runs fine on `http://localhost:3000` on the Mac, but opening `http://192.168.1.96:3000` on iPhone returns no response.

### Cause
`app.listen(PORT)` without a host argument can restrict the server to only the loopback interface (`127.0.0.1`), making it unreachable from other devices on the same network.

### Fix
Explicitly bind the server to `0.0.0.0` so it listens on all network interfaces:

```js
// Before
app.listen(PORT, () => { ... });

// After
app.listen(PORT, '0.0.0.0', () => { ... });
```

### Notes
- No macOS firewall changes were required
- This pattern should be used for all Express servers in this project
