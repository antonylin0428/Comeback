# API Contract — Academic Comeback Coach

**Status: LOCKED before coding begins**

This document is the single source of truth for every data shape that crosses a boundary between Person 1's work and Person 2's work. Both teammates build against this contract independently. If either person needs to change a shape here, they must tell the other person first.

Do not start building logic until both people have read and agreed to this document.

---

## The Boundary That Matters

```
Person 1 builds:                    Person 2 builds:
─────────────────                   ─────────────────
InputForm (frontend)                validators.ts
  sends →                           normalizer.ts
                                    planner.ts (AI layer)
POST /api/coach-plan                assembler.ts
  ← returns                         route.ts

DailyPlanView (frontend)
OverloadWarning (frontend)
  consumes ↑
```

There are two crossing points:
1. **The request payload** — Person 1's form sends it, Person 2's route receives it
2. **The response payload** — Person 2's assembler produces it, Person 1's results components consume it

Both are defined below in full. These shapes are final.

---

## 1. Request Payload

`POST /api/coach-plan`

Person 1's `InputForm` will serialize form state into this exact shape and POST it.
Person 2's `route.ts` and `validators.ts` will receive and validate this exact shape.

```
CoachPlanRequest
├── studentContext
│   ├── stressLevel: number          // integer 1–10
│   ├── planningWindowDays: number   // integer 1–14, how many days to plan across
│   └── maxHoursPerDay: number       // integer 1–8, daily study cap
│
├── tasks: RawTask[]                 // at least 1 required
│   └── RawTask
│       ├── title: string            // required, non-empty
│       ├── type: string             // one of: "exam" | "assignment" | "project" | "reading" | "other"
│       ├── deadline: string         // ISO 8601 datetime, e.g. "2026-03-26T09:00:00"
│       ├── estimatedHours: number   // positive number, e.g. 6
│       └── importance: string       // one of: "high" | "medium" | "low"
│
└── busyBlocks: RawBusyBlock[]       // can be empty array
    └── RawBusyBlock
        ├── title: string            // e.g. "ECON 101"
        ├── start: string            // ISO 8601 datetime
        └── end: string              // ISO 8601 datetime, must be after start
```

**Example request body:**

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
    },
    {
      "title": "History Essay",
      "type": "assignment",
      "deadline": "2026-03-28T23:59:00",
      "estimatedHours": 4,
      "importance": "medium"
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

---

## 2. Response Payload

`POST /api/coach-plan` → 200 OK

Person 2's `assembler.ts` produces this shape.
Person 1's `DailyPlanView`, `OverloadWarning`, and `app/results/page.tsx` consume it.

```
CoachPlanResponse
├── summary: string                  // 2–4 sentence AI-generated plan overview
├── encouragement: string            // 1 sentence motivational message from AI
│
├── prioritizedTasks: PrioritizedTask[]
│   └── PrioritizedTask
│       ├── id: string               // internal task ID, e.g. "task_0"
│       ├── title: string            // same as input title
│       ├── rank: number             // 1 = highest priority
│       ├── reasoning: string        // AI-generated explanation of why this rank
│       └── chunks: TaskChunk[]      // how this task is broken into study sessions
│           └── TaskChunk
│               ├── taskId: string   // matches PrioritizedTask.id
│               ├── taskTitle: string
│               └── durationHours: number  // e.g. 1.5
│
├── dailySchedule: DayPlan[]
│   └── DayPlan
│       ├── date: string             // "YYYY-MM-DD", e.g. "2026-03-22"
│       └── timeBlocks: ScheduledBlock[]
│           └── ScheduledBlock
│               ├── start: string    // "HH:MM" 24-hour, e.g. "09:00"
│               ├── end: string      // "HH:MM" 24-hour, e.g. "10:30"
│               └── taskChunk: TaskChunk
│
├── overloadWarning: OverloadWarning | null   // null if everything fits
│   └── OverloadWarning
│       ├── unscheduledTasks: string[]        // task titles that didn't fit
│       └── message: string                  // human-readable explanation
│
└── emailDraft: string | null        // null if not generated, plain text if present
```

**Example response body:**

```json
{
  "summary": "You have 10 hours of work across 2 tasks in a 7-day window with 4 hours available per day. Your Calculus Midterm is the most urgent and should come first. Here is a realistic plan to get you through the week.",
  "encouragement": "You've got this — one session at a time.",
  "prioritizedTasks": [
    {
      "id": "task_0",
      "title": "Calculus Midterm",
      "rank": 1,
      "reasoning": "Earliest deadline and highest importance — failure here has the most academic impact.",
      "chunks": [
        { "taskId": "task_0", "taskTitle": "Calculus Midterm", "durationHours": 2 },
        { "taskId": "task_0", "taskTitle": "Calculus Midterm", "durationHours": 2 },
        { "taskId": "task_0", "taskTitle": "Calculus Midterm", "durationHours": 2 }
      ]
    },
    {
      "id": "task_1",
      "title": "History Essay",
      "rank": 2,
      "reasoning": "Later deadline but still needs steady progress to avoid a last-minute crunch.",
      "chunks": [
        { "taskId": "task_1", "taskTitle": "History Essay", "durationHours": 2 },
        { "taskId": "task_1", "taskTitle": "History Essay", "durationHours": 2 }
      ]
    }
  ],
  "dailySchedule": [
    {
      "date": "2026-03-22",
      "timeBlocks": [
        {
          "start": "08:00",
          "end": "10:00",
          "taskChunk": { "taskId": "task_0", "taskTitle": "Calculus Midterm", "durationHours": 2 }
        },
        {
          "start": "13:00",
          "end": "15:00",
          "taskChunk": { "taskId": "task_1", "taskTitle": "History Essay", "durationHours": 2 }
        }
      ]
    },
    {
      "date": "2026-03-23",
      "timeBlocks": [
        {
          "start": "08:00",
          "end": "10:00",
          "taskChunk": { "taskId": "task_0", "taskTitle": "Calculus Midterm", "durationHours": 2 }
        }
      ]
    }
  ],
  "overloadWarning": null,
  "emailDraft": null
}
```

**Overload example** (when tasks don't fit):

```json
{
  "overloadWarning": {
    "unscheduledTasks": ["History Essay"],
    "message": "There isn't enough time to schedule everything before the deadline. The tasks below could not be placed. Focus on the scheduled items first and consider reaching out to your professor."
  }
}
```

---

## 3. Error Response

If the request is invalid or the server errors, Person 2's route returns:

```json
{
  "error": "string describing what went wrong"
}
```

HTTP status codes:
- `400` — validation failed (bad input)
- `500` — internal error (AI call failed, scheduling error, etc.)

Person 1's form should handle both and show a user-facing error message.

---

## 4. Internal Pipeline Types (for reference only)

These types are used inside the backend between pipeline stages. Person 1 does not consume these directly, but they are documented here so both teammates understand what is flowing through the system.

```
NormalizedStudentContext
├── stressLevel: number
├── planningWindowDays: number
├── maxHoursPerDay: number
└── planningStartDate: Date          // set to current date at request time

NormalizedTask
├── id: string                       // "task_0", "task_1", etc.
├── title: string
├── type: string
├── deadline: Date
├── estimatedHours: number
├── importanceWeight: number         // high=3, medium=2, low=1
└── remainingHours: number           // starts equal to estimatedHours

NormalizedBusyBlock
├── id: string
├── title: string
├── start: Date
└── end: Date
```

These are produced by Person 2's `normalizer.ts` and consumed internally by `planner.ts` and `scheduler.ts`.

---

## 5. Rules Both Teammates Must Follow

1. **Do not rename fields** in these shapes without telling the other person first. A rename in `assembler.ts` that is not reflected in `DailyPlanView.tsx` will silently break the UI.

2. **Nullable means nullable** — `overloadWarning` and `emailDraft` can be `null`. Both Person 1's components and Person 2's assembler must handle the null case.

3. **Dates in the response are always strings** — `date` is `"YYYY-MM-DD"`, times are `"HH:MM"`. No Date objects cross the API boundary. Person 1's components format them for display. Person 2's assembler serializes them before returning.

4. **Task IDs are assigned by normalizer** — Person 2's `normalizer.ts` assigns `"task_0"`, `"task_1"`, etc. These IDs are used consistently across `prioritizedTasks`, `dailySchedule`, and `taskChunk`. Person 1 can rely on them being stable within a single response.

5. **`dailySchedule` only includes days that have at least one block** — Person 1's `DailyPlanView` should not expect an entry for every day in the planning window.

---

## 6. How to Use This Document with Your AI

Both teammates can paste this file into their AI assistant at the start of a session with this prompt:

> "This is the agreed API contract for our project. I am building [Person 1's / Person 2's] side. Do not deviate from the request or response shapes defined in this document."

This ensures both AIs produce code that is compatible at the boundary without either person needing to see the other's implementation.

---

*Agreed before coding: Mar 21, 2026*
*Reference: academic_comeback_coach_architecture.md, team_split.md*
