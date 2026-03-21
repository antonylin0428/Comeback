# AI Academic Comeback Coach — Architecture, Tech Stack, and Development Plan

## 1. Project Overview

**AI Academic Comeback Coach** is a web application that helps students recover from academic overwhelm by turning missed assignments, upcoming exams, and limited availability into a realistic, time-based recovery plan. Instead of only giving generic advice, the system combines AI-driven prioritization with deterministic scheduling logic to produce a day-by-day plan students can actually follow.

The core idea is simple: students often know **what** they need to do, but they struggle with **when to do it**, **what to do first**, and **how much is realistic**. This app reduces decision paralysis by transforming raw academic stress into a structured short-term plan.

---

## 2. Product Goals

### Primary Goal
Generate a realistic academic comeback plan that fits a student's workload into a limited planning window.

### Secondary Goals
- Reduce overwhelm and decision paralysis
- Prioritize urgent, high-impact academic work
- Respect real-world time constraints and daily capacity
- Let students review and adjust the generated plan
- Present a polished, demo-friendly workflow for a hackathon setting

### Non-Goals for MVP
- Full production-grade authentication
- Real Google Calendar OAuth integration
- Long-term analytics and user history
- Full database-backed multi-user persistence

---

## 3. Recommended Tech Stack

This stack is optimized for **speed, low setup friction, and strong hackathon output**.

### Frontend
- **Next.js (App Router)** — single framework for frontend and backend
- **React** — component-driven UI
- **TypeScript** — safer data structures and API contracts
- **Tailwind CSS** — fast styling and clean UI polish
- **Lucide React** — lightweight icons

### Backend
- **Next.js Route Handlers** — simple API endpoints without needing a separate backend server
- **Zod** — request validation and schema safety
- **Custom scheduling engine in TypeScript** — deterministic time-block logic

### AI Layer
- **OpenAI API** — for prioritization, task breakdown, summaries, and optional email drafting
- **Structured output approach** — so AI returns predictable data the backend can safely use

### Dev / Deployment
- **Git + GitHub** — version control and collaboration
- **Vercel** — easiest deployment path for a Next.js app
- **Postman or Bruno** — optional API testing
- **ESLint + Prettier** — code cleanliness and consistent formatting

### Optional Nice-to-Have Tools
- **React Hook Form** — cleaner form handling if the input UI grows
- **date-fns** — date and time utilities for scheduling
- **clsx** — cleaner conditional class names

---

## 4. Why This Stack Is the Most Efficient

This stack is ideal because:
- it avoids managing separate frontend and backend repos
- it keeps setup fast for a 2-person team
- it supports a polished UI without much overhead
- it makes deployment simple
- it keeps the core technical innovation in your app logic rather than infrastructure

A separate Express backend, database, or auth system would add complexity without materially improving the hackathon demo.

---

## 5. High-Level System Architecture

## Overall Flow

```text
User Input
   ↓
Frontend Form (Next.js / React)
   ↓
POST /api/coach-plan
   ↓
Validation + Normalization
   ↓
AI Planning Layer
   ↓
Deterministic Scheduling Engine
   ↓
Plan Assembly Layer
   ↓
Frontend Results View
```

## Core Responsibility Split

### AI handles
- prioritization
- breaking down large academic tasks
- generating human-readable explanations
- optionally drafting a professor/TA email

### Backend code handles
- time math
- free-window detection
- daily workload constraints
- chunk placement
- overload detection
- final schedule construction

That split is critical. It lets AI do what it is good at and keeps the fragile temporal/spatial reasoning in code.

---

## 6. Full File Architecture

Below is the recommended file structure for the MVP.

```text
academic-comeback-coach/
├── app/
│   ├── api/
│   │   └── coach-plan/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── results/
│       └── page.tsx
│
├── components/
│   ├── InputForm.tsx
│   ├── TaskInputCard.tsx
│   ├── BusyBlockInputCard.tsx
│   ├── PlanSummaryCard.tsx
│   ├── PriorityList.tsx
│   ├── DailyPlanView.tsx
│   ├── OverloadWarning.tsx
│   ├── EmailDraftCard.tsx
│   └── Header.tsx
│
├── lib/
│   ├── openai.ts
│   ├── prompts.ts
│   ├── validators.ts
│   ├── normalizer.ts
│   ├── scheduler.ts
│   ├── planner.ts
│   ├── assembler.ts
│   ├── time.ts
│   ├── constants.ts
│   └── utils.ts
│
├── types/
│   ├── api.ts
│   ├── domain.ts
│   └── plan.ts
│
├── public/
│   └── logo-placeholder.png
│
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── postcss.config.js
├── eslint.config.js
└── README.md
```

---

## 7. File-by-File Responsibilities

## `app/page.tsx`
The main landing page.
- renders the app intro
- renders the student input form
- handles submission
- sends the payload to the backend

## `app/results/page.tsx`
Results display page.
- renders generated plan data
- shows summary, priorities, daily schedule, warnings
- optionally supports regeneration or editing later

## `app/api/coach-plan/route.ts`
The core backend route.
- receives POST request
- validates payload
- normalizes raw input
- calls AI planning layer
- calls scheduler
- assembles final response
- returns structured JSON

## `components/InputForm.tsx`
Main user input container.
- student context fields
- academic tasks list
- busy time blocks
- submit button

## `components/TaskInputCard.tsx`
Task entry UI.
- title
- type
- deadline
- estimated hours
- importance

## `components/BusyBlockInputCard.tsx`
Busy schedule entry UI.
- block name
- day/date
- start time
- end time

## `components/PlanSummaryCard.tsx`
Displays final summary and encouragement.

## `components/PriorityList.tsx`
Displays top priorities in order.

## `components/DailyPlanView.tsx`
Displays the day-by-day schedule.
- date
- time blocks
- tasks assigned to each block

## `components/OverloadWarning.tsx`
Displays overload or infeasibility warnings.

## `components/EmailDraftCard.tsx`
Optional.
Displays AI-generated professor email draft.

## `components/Header.tsx`
Top branding and app title.

## `lib/openai.ts`
OpenAI client initialization.
- reads API key from environment
- exports client helper

## `lib/prompts.ts`
Stores prompt templates.
- planning prompt
- email draft prompt
- fallback prompt variants

## `lib/validators.ts`
Request schema validation.
- validates student context
- validates tasks
- validates busy blocks
- rejects malformed input early

## `lib/normalizer.ts`
Converts raw input into clean domain objects.
- fills defaults
- standardizes timestamps
- converts labels to numeric weights
- assigns IDs

## `lib/scheduler.ts`
Deterministic scheduling logic.
- calculates free windows
- applies daily limits
- places chunks into time slots
- handles splitting and overflow
- flags unschedulable tasks

## `lib/planner.ts`
AI planning orchestration.
- builds AI request payload
- sends normalized data to AI
- parses structured result
- validates AI output before scheduling

## `lib/assembler.ts`
Combines AI output + scheduler output into final frontend response.

## `lib/time.ts`
Shared time utilities.
- compare intervals
- detect overlaps
- subtract busy blocks from free windows
- compute duration

## `lib/constants.ts`
App-level constants.
- default planning window
- max hours per day
- max block size
- break duration

## `lib/utils.ts`
Small shared helpers.
- sorting
- formatting
- defensive object cleaning

## `types/api.ts`
Defines request and response shapes.

## `types/domain.ts`
Defines internal normalized domain objects.

## `types/plan.ts`
Defines final assembled plan structures.

---

## 8. Backend Architecture in Detail

## Endpoint
`POST /api/coach-plan`

## Input Payload
The backend should receive a structured object like this:

```json
{
  "studentContext": {
    "stressLevel": 7,
    "planningWindowDays": 7,
    "maxHoursPerDay": 4
  },
  "tasks": [
    {
      "title": "Calculus Midterm",
      "type": "exam",
      "deadline": "2026-03-26T09:00:00",
      "estimatedHours": 6,
      "importance": "high"
    }
  ],
  "busyBlocks": [
    {
      "title": "Class",
      "start": "2026-03-22T10:00:00",
      "end": "2026-03-22T12:00:00"
    }
  ]
}
```

## Pipeline Stages

### Stage 1 — Validation
- ensure required fields exist
- ensure deadlines are valid
- ensure busy block times are valid
- ensure estimated hours are in a reasonable range

### Stage 2 — Normalization
- assign internal IDs
- convert importance strings to weights
- sort tasks by deadline
- normalize dates and times into consistent structures
- merge overlapping busy blocks if needed

### Stage 3 — AI Planning
The AI receives normalized tasks and context and returns:
- task priority ranking
- chunk breakdown
- summary explanation
- optional encouragement
- optional email draft prompt data

### Stage 4 — Scheduling Engine
The backend then:
- computes available windows across the planning range
- respects busy blocks and user daily limits
- places task chunks into time slots
- splits chunks when they do not fit
- marks unscheduled tasks if necessary
- generates overload warnings when the schedule is impossible

### Stage 5 — Plan Assembly
The backend combines:
- AI summary and priorities
- deterministic daily schedule
- overload warnings
- encouragement text
- optional email draft

### Stage 6 — Response
The backend returns JSON that the frontend can render directly.

---

## 9. Frontend Architecture in Detail

The frontend should stay thin and mostly presentation-focused.

## Input Layer
The homepage form should collect:
- planning window
- stress level
- max hours per day
- task list
- schedule constraints / busy blocks

## Output Layer
The results page should render:
- summary
- top priorities
- daily schedule
- overload warnings
- optional email draft

## UI Design Goal
Keep the design clean and hackathon-friendly:
- 1 main form page
- 1 results page
- simple cards
- clear typography
- easy visual before/after transformation

---

## 10. Key Concerns and How the Architecture Solves Them

## Concern 1: AI is weak at temporal and scheduling math
This is a real concern. Chat models often produce plans that sound good but are not actually feasible.

### Solution
Do not let AI perform final schedule construction.

Instead:
- AI proposes priorities and chunked work
- your backend scheduling engine performs all real time calculations

This creates a hybrid system:
- **AI for reasoning**
- **code for math and constraints**

That is the correct design for this product.

---

## Concern 2: AI may overload the user
AI often suggests too much work in too little time.

### Solution
The scheduler enforces:
- daily hour caps
- max block size
- breaks
- no scheduling after a chosen cutoff
- overload warnings when there is not enough time

This makes the system realistic and more trustworthy.

---

## Concern 3: OAuth and Google Calendar take too much time
Real OAuth setup can easily become a hackathon time sink.

### Solution
For MVP:
- use manual busy block input
- structure the architecture so Google Calendar can be added later as an input adapter

In other words:
- current input source: form
- future input source: Google Calendar

That keeps the architecture extensible without slowing the initial build.

---

## Concern 4: AI output may be inconsistent or malformed
Generative output can drift.

### Solution
- require structured AI output
- validate AI output before it reaches the scheduler
- fall back gracefully if a field is missing

Never trust raw AI output directly in the UI.

---

## Concern 5: The workload may simply be impossible
Some students will not have enough time to complete everything.

### Solution
The system should explicitly support infeasible plans:
- flag overload
- produce a “minimum viable comeback plan”
- recommend the highest-impact tasks first

This makes the app feel honest and supportive instead of fake.

---

## 11. Development Phases

Below is the recommended development plan from setup to final production-ready demo.

## Phase 0 — Planning and Scope Lock

### Goal
Agree on the exact MVP before writing code.

### Must Achieve
- finalize project name
- finalize project paragraph
- finalize core feature list
- identify MVP vs stretch goals
- split team responsibilities
- decide what is explicitly out of scope

### Deliverables
- one written project summary
- one MVP checklist
- one team role split

### Exit Criteria
Both teammates can explain the exact MVP in one minute without adding extra features.

---

## Phase 1 — Repository and Framework Setup

### Goal
Set up the project foundation cleanly so both teammates can work in parallel.

### Must Achieve
- initialize Git repository
- create GitHub repo
- scaffold Next.js app with TypeScript and Tailwind
- configure ESLint / formatting
- install core dependencies
- create environment variable file
- verify local dev environment works

### Tasks
- run `create-next-app`
- install `openai`, `zod`, `date-fns`, `lucide-react`, `clsx`
- create base folder structure
- create placeholder pages and components
- push initial commit

### Deliverables
- working local dev server
- project builds successfully
- both teammates can pull and run it

### Exit Criteria
`npm run dev` works on both machines and the base app is committed.

---

## Phase 2 — Types, Validation, and Domain Modeling

### Goal
Define the data contracts before building features.

### Must Achieve
- define request and response types
- define normalized domain models
- implement validation schemas
- implement normalization helpers

### Tasks
- create `types/api.ts`, `types/domain.ts`, `types/plan.ts`
- create Zod schemas in `validators.ts`
- create normalizer functions
- create constants and default values

### Deliverables
- stable internal data models
- testable normalization pipeline
- no ambiguous payload shapes

### Exit Criteria
You can pass a sample payload through validation and normalization successfully.

---

## Phase 3 — Input UI and Submission Flow

### Goal
Build the full user input experience.

### Must Achieve
- form for student context
- form for tasks
- form for busy blocks
- submit action wired to backend route
- loading and error states

### Tasks
- build `InputForm.tsx`
- build task and busy block cards
- add dynamic add/remove functionality
- connect submit button to `POST /api/coach-plan`

### Deliverables
- users can enter their situation and submit it
- frontend sends a clean payload to backend

### Exit Criteria
A sample user can fully enter their information and hit submit without UI blockers.

---

## Phase 4 — AI Planning Layer

### Goal
Generate meaningful academic priorities and chunked tasks from user input.

### Must Achieve
- implement OpenAI client
- build prompt strategy
- parse AI response
- validate AI response shape
- return stable intermediate planning data

### Tasks
- create `openai.ts`
- create planning prompts in `prompts.ts`
- create `planner.ts`
- test AI output across several example workloads

### Deliverables
- AI can produce:
  - summary
  - prioritized tasks
  - chunk breakdown
  - encouragement

### Exit Criteria
For at least 3 realistic student scenarios, AI returns usable planning data that matches the expected structure.

---

## Phase 5 — Scheduling Engine

### Goal
Turn AI planning output into a realistic schedule.

### Must Achieve
- compute available windows
- apply busy blocks
- enforce daily hour limits
- place chunks into time blocks
- support chunk splitting
- support overload detection

### Tasks
- create `time.ts`
- create `scheduler.ts`
- implement free-window generation
- implement greedy scheduling algorithm
- implement overload and unscheduled task logic

### Deliverables
- deterministic day-by-day schedule generation
- warning system for impossible workloads

### Exit Criteria
Given a fixed payload, the scheduling engine returns a sensible and constraint-respecting plan every time.

---

## Phase 6 — Final Plan Assembly and Results UI

### Goal
Display the generated plan clearly and convincingly.

### Must Achieve
- combine AI + scheduler outputs into final response
- build results page
- render summary, priorities, daily schedule, warnings
- optionally render email draft

### Tasks
- create `assembler.ts`
- build `PlanSummaryCard.tsx`
- build `PriorityList.tsx`
- build `DailyPlanView.tsx`
- build `OverloadWarning.tsx`

### Deliverables
- polished results page
- easy-to-follow daily comeback plan

### Exit Criteria
A user can submit data and see a clean full plan from end to end.

---

## Phase 7 — Polish, UX, and Demo Readiness

### Goal
Make the project feel thoughtful and finished.

### Must Achieve
- improve UI polish
- improve wording and empty states
- improve loading and error messages
- make the results page visually compelling
- add small UX details that improve demo quality

### Tasks
- tighten copywriting
- improve spacing and hierarchy
- add icons and visual grouping
- add fallback messaging
- improve edge-case behavior

### Deliverables
- polished, presentation-friendly UI
- stronger first impression for judges

### Exit Criteria
The app feels coherent, clear, and stable enough for a live demo.

---

## Phase 8 — Optional Stretch Features

### Goal
Add bonus features only if the MVP is complete and stable.

### Stretch Options
- AI-generated professor/TA email draft
- simple editable schedule adjustments
- “minimum viable comeback plan” mode
- exportable plan view
- mock or read-only calendar import

### Important Rule
Do not enter this phase unless the MVP is already working end to end.

### Exit Criteria
Only add a stretch feature if it does not risk demo stability.

---

## Phase 9 — Production / Deployment

### Goal
Deploy the project and ensure it is safe to present.

### Must Achieve
- deploy to Vercel
- configure environment variables in deployment
- test final production build
- verify API route works in deployed environment
- rehearse demo flow

### Tasks
- connect GitHub repo to Vercel
- add `OPENAI_API_KEY`
- test on real devices / browsers
- fix deployment-specific issues
- create demo seed scenarios

### Deliverables
- live deployed URL
- stable production demo
- backup scenarios for presentation

### Exit Criteria
The deployed app works reliably enough to present without local-only dependencies.

---

## 12. Suggested Team Split

## Teammate A — Frontend / UX
- form experience
- results page
- visual polish
- loading and error states

## Teammate B — Backend / AI
- route handler
- validation
- normalization
- prompt engineering
- scheduling engine

## Shared
- testing sample scenarios
- product decisions
- presentation and demo script

---

## 13. MVP Checklist

A feature belongs in MVP only if it directly improves the core promise.

### MVP
- input academic tasks
- input busy schedule constraints
- AI prioritization
- deterministic scheduling
- results page with daily plan
- overload handling

### Nice-to-Have
- professor email draft
- editable plan
- export

### Cut for Now
- OAuth
- auth system
- database
- long-term user history

---

## 14. Final Recommendation

The strongest version of this project is not “ChatGPT makes a study plan.”

The strongest version is:

**An AI-powered academic recovery system where AI determines what matters, and deterministic backend logic turns that into a realistic plan that respects time, workload, and human limits.**

That framing makes the project feel smarter, more trustworthy, and more technically intentional.

---

## 15. One-Sentence Summary

**This architecture combines AI reasoning with rule-based scheduling to convert academic overwhelm into a realistic, time-blocked comeback plan students can actually follow.**
