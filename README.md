# Comeback Coach — Academic Recovery Planner

An AI-powered academic recovery app that turns your pile of deadlines, missed assignments, and limited time into a realistic day-by-day comeback plan.

## How it works

1. You enter your academic tasks (exams, assignments, projects) with deadlines and estimated hours
2. AI prioritizes your workload by urgency and impact
3. A deterministic scheduling engine places every study session into your actual free time — respecting busy blocks and daily hour caps

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** + **Lucide React**
- **OpenAI API** (`gpt-4o-mini`) with a deterministic mock fallback
- **Zod** for request validation
- **date-fns** for time math

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-...
```

> **No key?** The app still works — it falls back to a deterministic mock planner that produces a real schedule without AI-generated summaries.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. If you see a cross-origin warning in the terminal

If you're accessing the app from a different IP (e.g. on a local network or VM), add your IP to `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  allowedDevOrigins: ["your.ip.here"],
};
```

Then restart the dev server. Do **not** commit this change.

## Project Structure

```
app/
  page.tsx              ← Landing page
  plan/page.tsx         ← Input form
  results/page.tsx      ← Results display
  api/coach-plan/       ← POST endpoint

components/             ← All UI components
lib/                    ← Backend logic (scheduler, planner, validators, etc.)
types/                  ← Shared TypeScript types
```

## Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/plan` | Student input form |
| `/results` | Generated comeback plan |
| `POST /api/coach-plan` | API endpoint |

## Team

See `team_split.md` for the full work split and branch strategy.
See `api_contract.md` for the agreed request/response shapes.
