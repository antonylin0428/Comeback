import { describe, expect, it } from "vitest";

import { coachPlanRequestSchema } from "./validators";

function validBody() {
  const now = new Date();
  const deadline = new Date(now.getTime() + 3 * 86400000).toISOString();
  return {
    studentContext: {
      stressLevel: 6,
      planningWindowDays: 7,
      maxHoursPerDay: 4,
    },
    tasks: [
      {
        title: "Essay",
        type: "assignment",
        deadline,
        estimatedHours: 3,
        importance: "high" as const,
      },
    ],
    busyBlocks: [] as { title: string; start: string; end: string }[],
  };
}

describe("coachPlanRequestSchema", () => {
  it("accepts a well-formed payload", () => {
    const parsed = coachPlanRequestSchema.safeParse(validBody());
    expect(parsed.success).toBe(true);
  });

  it("rejects when busy block end is before start", () => {
    const start = new Date().toISOString();
    const end = new Date(Date.now() - 3600000).toISOString();
    const parsed = coachPlanRequestSchema.safeParse({
      ...validBody(),
      busyBlocks: [{ title: "Bad", start, end }],
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects empty tasks", () => {
    const parsed = coachPlanRequestSchema.safeParse({
      ...validBody(),
      tasks: [],
    });
    expect(parsed.success).toBe(false);
  });
});
