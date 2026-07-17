# Render deploy: backend build fails with "Missing script: build"

Render (or similar platforms) often runs `npm run build` during the build step.

Your backend `package.json` has scripts:
- start: node server.js
- dev: nodemon server.js
- test: vitest run

But **no** `build` script => deploy fails.

## Fix (recommended)
Add this to `backend/package.json`:
```json
"build": "echo 'No build step for Node backend.'"
```

This makes Render’s `npm run build` succeed without changing runtime behavior.

## Alternative
Change Render settings to use `npm run start` / disable build step. But simplest is adding `build` script.

