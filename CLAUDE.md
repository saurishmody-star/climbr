# climbr

Gym manager tool for wall setting — photo upload → AI colour detection → grade assignment.

## Quick start
```
npm install
npm run dev   # http://localhost:5173
```

## Architecture
Single-page React + Vite app (frontend only). No backend — Anthropic API calls go direct from browser using `anthropic-dangerous-direct-browser-access` header. API key entered at runtime, never stored.

## Key files
```
src/
  App.jsx                  # Main state + layout
  components/
    UploadZone.jsx          # Drag-drop / file picker
    RouteCard.jsx           # Per-route grade + notes card
  lib/
    analyseWall.js          # Claude vision API call + prompt
    grades.js               # V-scale / Font grade lists + sync helper
```

## Model
Uses `claude-sonnet-4-6` via `/v1/messages` with vision. Prompt asks Claude to return a JSON array of routes grouped by hold colour.

## Demo mode
Bypasses the API — renders 6 hardcoded demo routes. Useful for UI testing without a key.

## What's next (planned)
- Wall map view: click holds on the photo to associate them with a route
- Persist sets to localStorage
- Gym/wall management (multi-wall support)
- Climber-facing view (read-only route browser)
