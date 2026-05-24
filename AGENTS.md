# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

This is **Le Temple des Plaisirs**, a React + TypeScript + Vite PWA (progressive web app). It is a frontend-only application with no backend in this repository. All game state is stored in `localStorage`.

### Running the app

- **Dev server:** `npm run dev` (serves on `http://localhost:5173`)
- **Build:** `npm run build`
- **Type-check:** `npm run type-check`
- **Lint:** `npm run lint` — Note: the `eslint.config.js` file is missing from the repo, so this command currently fails. The script exists in `package.json` but the config was never committed.

### Source structure caveat

The source entry point is `src/src/main.tsx` (nested `src/` directory). The `index.html` references `/src/src/main.tsx`. The canonical source code lives under `src/src/` — the outer `src/` also contains some files (`App.tsx`, `types.ts`, etc.) but the Vite entry point resolves through the nested path.

### External dependencies

The PayPal payment integration expects a backend API at `VITE_API_URL` (default `http://localhost:3001`), but no backend code exists in this repository. All free game features work without it.
