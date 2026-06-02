# AGENTS: repository guidance for AI coding agents

Purpose: brief, actionable guidance to help AI coding agents be immediately productive in this frontend project. Keep updates minimal and link to existing docs when needed: see `README.md`.

Quick commands
- Install dependencies: `npm install`
- Dev server: `npm run dev` (Vite, default port 5173)
- Build: `npm run build`
- Preview build: `npm run preview`
- Lint: `npm run lint` (ESLint)
- Tests: `npm run test` (Vitest + Testing Library)

Environment
- Node: target Node.js 18+.
- Project uses Vite and expects runtime variables prefixed with `VITE_` (e.g. `VITE_BACKEND_URL`).
- See `README.md` for the canonical list of environment variables. Do NOT commit secrets. Use the repo root `.env` for local development. A placeholder `.env` has been created alongside this file.

Key files and architecture (where to look)
- `src/main.jsx` — app entry
- `src/layout/Dashboard.jsx` — dashboard layout for protected routes
- `src/routes/ProtectedRoute.jsx`, `src/routes/PublicRoute.jsx` — routing guards
- `src/context/storeAuth.jsx`, `src/context/storeProfile.jsx`, `src/context/storeTheme.jsx` — Zustand stores (auth/token is stored here)
- `src/pages/` — page-level components (login, register, dashboard, chat, checkout, profile, list, create, details, etc.)
- `src/components/` — smaller UI pieces (dashboard, profile, create, list, treatments)
- `src/helpers/consultarIA.js` — helper for external IA calls (review before editing)
- `src/hooks/useFetch.js` — generic fetch hook used across the app

Conventions and notes
- State: uses Zustand for global stores; prefer adding selectors rather than sprinkling global state everywhere.
- Styling: Tailwind CSS (config in `tailwind.config.cjs`). Keep utility classes in JSX; extract repeated patterns to components.
- Routing: React Router v7 — use `Navigate` and guard components for protected routes.
- Tests: use Vitest + Testing Library; run `npm run test` locally.
- Linting: ESLint is set up; run `npm run lint` before committing changes.

Agent guidelines (how agents should behave)
- Minimal edits: make small, focused changes. Run linter and tests locally after modifications.
- Do not add secrets or real API keys to repo—use the `.env` file for placeholders.
- If a change requires environment variables or external services, document steps and add a `.env.example` or update `AGENTS.md` linking to `README.md`.
- When modifying API interaction, coordinate with backend (README links to backend docs). Prefer non-breaking changes and add tests for behavior changes.

Where to find more info
- Primary doc: `README.md` (project overview, env vars, run instructions)
- Backend endpoints and admin docs: referenced in `README.md` (../Backend-Inter-IA-main/README.md)

If you want more automation
- Consider adding a skill or instruction specifically for: running local integration (frontend+backend) checks, CI lint/test hooks, or automated PR templates.

---

Generated/modified files

| File | Purpose |
|---|---|
| `AGENTS.md` | Short, actionable instructions for AI agents: commands, key files, conventions, and agent behavior guidance. |
| `.env` | Local placeholders for required Vite env variables (never commit real secrets). |
