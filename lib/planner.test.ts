import { describe, expect, it } from "vitest";

import { normalizeCoachPlanInput } from "./normalizer";
import { getMockPlanningResult, runPlanner } from "./planner";
import { coachPlanRequestSchema } from "./validators";

function scenario(name: string, stress: number, hours: number[]) {
  const now = new Date();
  const deadline = (days: number) => new Date(now.getTime() + days * 86400000).toISOString();
  const raw = {
    studentContext: {
      stressLevel: stress,
      planningWindowDays: 7,
      maxHoursPerDay: 4,
    },
    tasks: hours.map((estimatedHours, i) => ({
      title: `${name} task ${i + 1}`,
      type: "assignment",
      deadline: deadline(i + 2),
      estimatedHours,
      importance: "medium" as const,
    })),
    busyBlocks: [] as { title: string; start: string; end: string }[],
  };
  const parsed = coachPlanRequestSchema.parse(raw);
  return normalizeCoachPlanInput(parsed);
}

describe("getMockPlanningResult", () => {
  it("scenario A: single heavy task", () => {
    const input = scenario("A", 8, [8]);
    const plan = getMockPlanningResult(input);
    expect(plan.summary.length).toBeGreaterThan(10);
    expect(plan.rankedTaskIds.length).toBe(1);
    expect(plan.chunks.length).toBeGreaterThan(0);
    expect(plan.chunks.every((c) => c.taskId === input.tasks[0]!.id)).toBe(true);
  });

  it("scenario B: two competing deadlines", () => {
    const input = scenario("B", 5, [3, 5]);
    const plan = getMockPlanningResult(input);
    expect(plan.rankedTaskIds.length).toBe(2);
    expect(plan.chunks.reduce((s, c) => s + c.hours, 0)).toBeCloseTo(8, 0);
  });

  it("scenario C: many small tasks", () => {
    const input = scenario("C", 4, [1, 1, 1, 2]);
    const plan = getMockPlanningResult(input);
    expect(plan.chunks.length).toBeGreaterThanOrEqual(4);
    expect(plan.encouragement.length).toBeGreaterThan(5);
  });
});

describe("runPlanner", () => {
  it("returns structured planning data without throwing", async () => {
    const input = scenario("async", 6, [2, 2]);
    const plan = await runPlanner(input);
    expect(plan.summary).toBeTruthy();
    expect(Array.isArray(plan.chunks)).toBe(true);
  });
});
