# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a frontend-only React + TypeScript PWA ("Le Temple des Plaisirs") built with Vite. There is no backend in the repository.

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Vite Dev Server | `npm run dev` | 5173 | The only service needed |

### Development Commands

- **Dev server:** `npm run dev` (or `npm run dev -- --host 0.0.0.0` for external access)
- **Type check:** `npm run type-check`
- **Build:** `npm run build`
- **Lint:** `npm run lint` (requires an `eslint.config.js` which is currently missing from the repo — expect this to error)
- **Preview prod build:** `npm run preview`

### Important Notes

- The entry point is `index.html` → `/src/src/main.tsx` (note the nested `src/src/` directory structure).
- The PayPal store feature references a backend at `VITE_API_URL` (port 3001), but no backend code exists in this repo. All games work without it.
- All game state is stored in browser `localStorage`.
- The app has an age verification gate as the first screen.
