import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { assembleCoachPlan } from "@/lib/assembler";
import { normalizeCoachPlanInput } from "@/lib/normalizer";
import { runPlanner } from "@/lib/planner";
import { runScheduler } from "@/lib/scheduler";
import { coachPlanRequestSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const json: unknown = await req.json();
    const parsed = coachPlanRequestSchema.parse(json);
    const normalized = normalizeCoachPlanInput(parsed);
    const ai = await runPlanner(normalized);
    const schedule = runScheduler(normalized, ai);
    const response = assembleCoachPlan(normalized, ai, schedule);
    return NextResponse.json(response);
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: e.flatten() },
        { status: 400 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
