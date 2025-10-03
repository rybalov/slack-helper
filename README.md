# Slack Helper

Minimal web UI to quickly inspect Slack workspace users (admins, bots, deleted accounts) via the Slack Web API.

## Features
- Paste a Slack Bot/User token (not stored) and fetch users.list
- Sorting (name, email, admin, bot, updated) & toggle to show only deleted users
- Lightweight React + Vite + Tailwind stack
- Built‑in dev proxy: /api/slack/* -> https://slack.com/api

## Required Slack Token Scopes
For the displayed fields you typically need:
- users:read
- users:read.email (emails)  
Create a Slack app, install to workspace, copy the Bot/User OAuth token (xoxb-/xoxp-).

## Quick Start (Local)
```bash
pnpm install
pnpm dev
# open http://localhost:5173
```
Paste your token and press "Load Users".

Build & preview (static production build):
```bash
pnpm build
pnpm preview
```

## Run with Docker (dev mode)
```bash
docker build -t slack-helper .
docker run --rm -p 5173:5173 slack-helper
```
Note: Current Dockerfile starts the Vite dev server (not an optimized production image). For production you might multi-stage: build then serve dist/ with a static server.

## Scripts
- dev: Vite dev server
- build: Type check + production bundle
- preview: Preview built dist
- lint: Run ESLint

## Project Structure (key parts)
```
src/
  App.tsx            UI + token form
  hooks/useSlackUsers.ts  Data fetch logic
  components/UserTable.tsx Table + sorting/filter
  types/User.ts      Slack user typings
```
Vite proxy rewrites /api/slack/users.list -> https://slack.com/api/users.list.

## Security Notes
Token is kept only in component state (not persisted, not sent anywhere except directly to Slack API via proxy). Do not commit tokens. For multi-user or deployed scenarios, move calls server-side and inject token securely.

## Limitations / Next Ideas
- No pagination (large workspaces) or rate limit handling yet
- No caching
- Could add search & export (CSV) later