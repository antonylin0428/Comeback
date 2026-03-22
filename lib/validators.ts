import { z } from "zod";

import {
  MAX_HOURS_PER_DAY_CAP,
  MAX_PLANNING_WINDOW_DAYS,
  MIN_PLANNING_WINDOW_DAYS,
} from "./constants";

const importanceSchema = z.enum(["low", "medium", "high"]);

const studentContextSchema = z
  .object({
    stressLevel: z.number().min(1).max(10),
    planningWindowDays: z
      .number()
      .min(MIN_PLANNING_WINDOW_DAYS)
      .max(MAX_PLANNING_WINDOW_DAYS),
    maxHoursPerDay: z.number().min(0.5).max(MAX_HOURS_PER_DAY_CAP),
    workStartHour: z.number().min(0).max(23).int(),
    workEndHour: z.number().min(1).max(24).int(),
    schedulingPreferences: z.string().max(500).optional(),
  })
  .refine((d) => d.workEndHour > d.workStartHour, {
    message: "workEndHour must be after workStartHour",
    path: ["workEndHour"],
  });

const taskSchema = z.object({
  title: z.string().min(1).max(500),
  type: z.string().min(1).max(100),
  deadline: z.string().datetime({ offset: true }),
  estimatedHours: z.number().min(0.25).max(200),
  importance: importanceSchema,
});

const busyBlockSchema = z.object({
  title: z.string().min(1).max(200),
  start: z.string().datetime({ offset: true }),
  end: z.string().datetime({ offset: true }),
});

export const coachPlanRequestSchema = z
  .object({
    studentContext: studentContextSchema,
    tasks: z.array(taskSchema).min(1).max(50),
    busyBlocks: z.array(busyBlockSchema).max(100),
  })
  .superRefine((data, ctx) => {
    for (let i = 0; i < data.busyBlocks.length; i++) {
      const b = data.busyBlocks[i];
      const start = new Date(b.start);
      const end = new Date(b.end);
      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Busy block ${i}: end must be after start`,
          path: ["busyBlocks", i, "end"],
        });
      }
    }
  });

export type CoachPlanRequestParsed = z.infer<typeof coachPlanRequestSchema>;
