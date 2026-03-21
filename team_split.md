# Team Split — Academic Comeback Coach

## Overview

This document defines how two teammates divide the work for the Academic Comeback Coach project. Both people work across the full stack — each person owns a vertical slice of the product that spans frontend components and backend logic.

The original architecture (see `academic_comeback_coach_architecture.md`) is referenced throughout. This document does not change the architecture — it only assigns ownership.

---

## Split Philosophy

Rather than assigning one person to pure frontend and the other to pure backend, the work is divided into two **vertical slices**:

- **Person 1** owns the **input side** of the product — data modeling, the student input experience (frontend), and the deterministic scheduling engine (backend).
- **Person 2** owns the **output side** of the product — validation, normalization, AI planning (backend), and the results display experience (frontend).

This ensures both teammates build confidence with both frontend and backend work.

---

## Branch Strategy

All feature work branches off `main`. Each branch maps to a focused deliverable. Merges into `main` happen after the feature is tested and working.

```
main
├── feature/project-setup            (shared — both contribute)
├── feature/types-and-domain         (Person 1)
├── feature/input-form               (Person 1)
├── feature/scheduling-engine        (Person 1)
├── feature/daily-plan-view          (Person 1)
├── feature/validation-normalization (Person 2)
├── feature/ai-planning              (Person 2)
├── feature/api-route-assembler      (Person 2)
├── feature/results-page             (Person 2)
└── feature/polish-and-deploy        (shared — both contribute)
```

**Rule:** never commit directly to `main` after the initial scaffold. All work goes through a feature branch and is merged via pull request.

---

## Person 1 — Input & Scheduling

### Role Summary
Person 1 defines the shared data contracts that the whole app depends on, builds the student-facing input experience, and implements the scheduling engine that turns AI output into a real time-blocked plan.

### Feature Branches

| Branch | Purpose |
|---|---|
| `feature/types-and-domain` | All shared TypeScript types and domain models |
| `feature/input-form` | Full student input UI — form, task cards, busy block cards |
| `feature/scheduling-engine` | Time utilities and the deterministic scheduling algorithm |
| `feature/daily-plan-view` | Daily schedule and overload warning components on results page |

### Files Owned

**Frontend**

| File | Description |
|---|---|
| `app/page.tsx` | Landing page — renders the intro, input form, and handles submission |
| `components/Header.tsx` | Top branding and app title |
| `components/InputForm.tsx` | Main input container — student context, tasks, busy blocks, submit |
| `components/TaskInputCard.tsx` | Individual task entry — title, type, deadline, hours, importance |
| `components/BusyBlockInputCard.tsx` | Busy time block entry — name, day, start/end time |
| `components/DailyPlanView.tsx` | Day-by-day schedule display — date, time blocks, assigned tasks |
| `components/OverloadWarning.tsx` | Overload and infeasibility warning display |

**Backend / Shared**

| File | Description |
|---|---|
| `types/api.ts` | Request and response type definitions |
| `types/domain.ts` | Internal normalized domain object types |
| `types/plan.ts` | Final assembled plan structure types |
| `lib/constants.ts` | App-level constants — planning window, hour caps, block sizes, breaks |
| `lib/time.ts` | Time utilities — interval comparison, overlap detection, free window math |
| `lib/scheduler.ts` | Scheduling engine — free window generation, greedy chunk placement, overload detection |

### Phases Owned

| Phase | Deliverable |
|---|---|
| Phase 2 (partial) | `types/` definitions, `lib/constants.ts` |
| Phase 3 | Full input UI and submission flow |
| Phase 5 | Scheduling engine (`time.ts`, `scheduler.ts`) |
| Phase 6 (partial) | `DailyPlanView.tsx`, `OverloadWarning.tsx` |

### Exit Criteria per Branch

- **`feature/types-and-domain`** — Both teammates can import and use the types without errors. A sample payload passes type-checking end to end.
- **`feature/input-form`** — A user can fill in all fields, add and remove tasks and busy blocks, and hit submit. The frontend sends a correctly shaped payload to the backend.
- **`feature/scheduling-engine`** — Given a fixed input, the scheduler returns a deterministic, constraint-respecting plan on every run. Unit-tested with at least 3 sample workloads.
- **`feature/daily-plan-view`** — The daily schedule and overload warning render correctly with realistic mock data from the API.

---

## Person 2 — AI & Results

### Role Summary
Person 2 validates and normalizes incoming data, owns the full AI planning layer and prompt engineering, wires up the core API route, assembles the final response, and builds the results display experience.

### Feature Branches

| Branch | Purpose |
|---|---|
| `feature/validation-normalization` | Request validation, normalization pipeline, and shared utilities |
| `feature/ai-planning` | OpenAI client, prompt strategy, and AI planning orchestration |
| `feature/api-route-assembler` | Core API route handler and final plan assembly |
| `feature/results-page` | Full results page and summary/priority/email components |

### Files Owned

**Frontend**

| File | Description |
|---|---|
| `app/results/page.tsx` | Results display page — summary, priorities, schedule, warnings, email draft |
| `components/PlanSummaryCard.tsx` | Final summary and encouragement display |
| `components/PriorityList.tsx` | Top priorities in ranked order |
| `components/EmailDraftCard.tsx` | Optional AI-generated professor/TA email draft |

**Backend**

| File | Description |
|---|---|
| `lib/validators.ts` | Zod schemas — validates student context, tasks, busy blocks |
| `lib/normalizer.ts` | Converts raw input to clean domain objects, fills defaults, standardizes timestamps |
| `lib/utils.ts` | Shared small helpers — sorting, formatting, defensive cleaning |
| `lib/openai.ts` | OpenAI client initialization, reads API key from environment |
| `lib/prompts.ts` | Prompt templates — planning prompt, email draft prompt, fallback variants |
| `lib/planner.ts` | AI planning orchestration — builds request, sends to AI, parses and validates response |
| `lib/assembler.ts` | Combines AI output and scheduler output into the final frontend response |
| `app/api/coach-plan/route.ts` | Core POST endpoint — validation → normalization → AI → scheduling → assembly → response |

### Phases Owned

| Phase | Deliverable |
|---|---|
| Phase 2 (partial) | `lib/validators.ts`, `lib/normalizer.ts`, `lib/utils.ts` |
| Phase 4 | Full AI planning layer — `openai.ts`, `prompts.ts`, `planner.ts` |
| Phase 6 (partial) | `route.ts`, `assembler.ts`, `results/page.tsx`, results components |

### Exit Criteria per Branch

- **`feature/validation-normalization`** — A sample payload passes validation cleanly. A malformed payload is rejected with a clear error. Normalization produces stable domain objects with assigned IDs and numeric weights.
- **`feature/ai-planning`** — For at least 3 realistic student scenarios, the AI returns correctly structured planning data (summary, ranked tasks, chunk breakdown, encouragement).
- **`feature/api-route-assembler`** — The full pipeline runs end to end. A valid POST to `/api/coach-plan` returns a complete structured JSON response.
- **`feature/results-page`** — The results page renders a full plan including summary, priorities, and daily schedule using real API data.

---

## Shared Work

| Phase | What Both People Do |
|---|---|
| Phase 0 | Align on scope, finalize MVP checklist, decide what is out of scope |
| Phase 1 | One person scaffolds (`create-next-app`, installs deps, creates folder structure); both verify local dev works and push initial commit together |
| Phase 7 | Each person polishes their own components — copy, spacing, icons, loading states, empty states, error messages |
| Phase 8 | Stretch features negotiated based on remaining time. Do not start until MVP is working end to end |
| Phase 9 | Deploy to Vercel, configure environment variables, test on real devices, rehearse demo flow |

---

## Dependency Order

Some branches depend on others being merged first. Follow this order to avoid blocking each other.

```
Phase 0–1:  Shared setup (both)
    │
    ├── Person 1: feature/types-and-domain  ◄── must merge first
    │       │
    │       ├── Person 1: feature/input-form
    │       ├── Person 1: feature/scheduling-engine
    │       └── Person 2: feature/validation-normalization
    │               │
    │               ├── Person 2: feature/ai-planning
    │               └── Person 2: feature/api-route-assembler
    │                       │
    │                       ├── Person 1: feature/daily-plan-view
    │                       └── Person 2: feature/results-page
    │
Phase 7–9:  Polish and deploy (both)
```

**Key constraint:** `feature/types-and-domain` must be merged before anyone builds logic that imports from `types/`. Person 1 should prioritize this first.

---

## Coordination Checklist

Before starting each new branch, confirm with your teammate:

- [ ] The branch it depends on has been merged to `main`
- [ ] You have pulled the latest `main`
- [ ] You are not editing a file the other person currently owns
- [ ] You have agreed on any interface that crosses the ownership boundary (e.g., the shape of the API response that connects Person 2's route to Person 1's results components)

The one shared interface to align on early is the **final API response shape** (`types/plan.ts`). Person 1 defines the types, but Person 2's assembler produces them and Person 1's `DailyPlanView` consumes them. Agree on this shape before either branch starts building against it.

---

## Stretch Features (Phase 8)

If the MVP is complete and stable, these are available to pick up:

| Feature | Natural Owner | Branch Name |
|---|---|---|
| AI professor/TA email draft | Person 2 (owns AI layer + EmailDraftCard) | `feature/email-draft` |
| Editable schedule adjustments | Person 1 (owns scheduling + DailyPlanView) | `feature/editable-schedule` |
| Minimum viable comeback mode | Person 2 (owns assembler + planner) | `feature/minimum-viable-mode` |
| Exportable plan view | Person 1 (owns DailyPlanView) | `feature/export-plan` |

Do not start any stretch feature unless the full MVP is demoed and working.

---

## Summary

| | Person 1 | Person 2 |
|---|---|---|
| **Frontend** | Input form, task cards, busy block cards, daily plan view, overload warning | Results page, summary card, priority list, email draft card |
| **Backend** | Shared types, constants, time utilities, scheduling engine | Validation, normalization, AI planning, assembler, API route |
| **Phases** | 2 (types), 3 (input UI), 5 (scheduler), 6 partial | 2 (validation), 4 (AI), 6 (route + results) |
| **Key branches** | `feature/types-and-domain`, `feature/input-form`, `feature/scheduling-engine`, `feature/daily-plan-view` | `feature/validation-normalization`, `feature/ai-planning`, `feature/api-route-assembler`, `feature/results-page` |
