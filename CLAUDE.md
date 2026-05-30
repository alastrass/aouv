# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit (no emit, just validation)
```

## Architecture

**Le Temple des Plaisirs** is a French-language adult couples game PWA. React 18 + Vite + Tailwind CSS. No routing library — navigation is pure state machine.

### Navigation Model

`App.tsx` owns a single `appState: AppState` (union type in `types.ts`). All screen transitions are handler functions passed as props. To add a new screen: add its string literal to `AppState`, add a handler in App, add an `if (appState === '...')` render branch, and wire a navigation entry point.

### Source Layout

All source lives under `src/src/` (double-nested — do not move files without updating Tailwind's content glob and Vite's root).

- `App.tsx` — state machine, top-level handlers, screen routing
- `types.ts` — all shared TypeScript types (`AppState`, `Challenge`, `Player`, etc.)
- `components/` — one file per screen or reusable UI piece
- `data/` — static game content (challenges, Kamasutra positions, kiffe phrases, content packs, payment plans)
- `hooks/` — `usePWA`, `usePayPal`, `useRemoteSync`

### State Management

No global store. State flows: `App.tsx` → props → components → callbacks → `App.tsx`. Game-specific state lives inside each game component and is persisted to `localStorage` with a game-specific prefix (`truthOrDare_*`, `stopTergiverser_*`, etc.) to survive refreshes.

### Game Component Pattern

Each game component (`TruthOrDareGame`, `StopTergiverserGame`, etc.) follows this pattern:
1. Renders `PlayerSetup` when `gameState === 'setup'`
2. Manages its own `usedChallenges`, `currentChallenge`, `players`, `turnCount` state
3. Calls `onBack()` to exit, `onGameOver()` when a winner is detected
4. `getAllChallenges()` gates custom challenges behind `turnCount >= 2` so they appear from turn 2 onward
5. Resets `turnCount` to 0 in every reset/restart function

### Custom Challenges

`PlayerSetup` collects custom challenges during setup. Each game component receives them, stores them in state + localStorage, and includes them in the available pool only after 2 turns have passed (`turnCount >= 2`). This applies to both `TruthOrDareGame` and `StopTergiverserGame`.

### Remote Multiplayer

`useRemoteSync` hook simulates real-time sync via `localStorage` events (no WebSocket, no backend). Sessions are keyed `remote_session_[code]`. Used only by `KiffeOuKiffePasGame`.

### PWA

Configured via `vite-plugin-pwa` in `vite.config.ts`. `usePWA` hook handles install prompts and standalone detection. Icons at `public/icons/`. Theme color `#1e1b4b`.

### Payments

PayPal integration via `usePayPal` hook. Unlocked state stored in localStorage (`unlockedContentPacks`, `hasLifetimeAccess`). No backend validation. Env vars: `VITE_PAYPAL_CLIENT_ID`, `VITE_API_URL`.

### Tailwind Conventions

No custom theme extensions. Custom utilities defined in `src/src/index.css`:
- `.mobile-button` — 44×44px minimum touch target
- `.safe-area-inset` — padding for notch/home indicator
- `.touch-action-none` — disables browser touch gestures for drag interactions

Standard dark gradient used across all screens: `bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900`.

### TypeScript

Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`. Run `npm run type-check` before considering any change complete.
