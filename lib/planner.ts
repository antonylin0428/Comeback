import { z } from "zod";

import type { AIPlanningResult, NormalizedCoachInput, PlannedChunk } from "@/types/domain";

import { getOpenAIClient } from "./openai";
import { buildPlanningPrompt } from "./prompts";

const aiPlanSchema = z.object({
  summary: z.string(),
  rankedTaskIds: z.array(z.string()),
  chunks: z.array(
    z.object({
      taskId: z.string(),
      label: z.string(),
      hours: z.number().positive(),
      order: z.number().int().nonnegative(),
    }),
  ),
  encouragement: z.string(),
  emailDraft: z.string().optional(),
});

const DEFAULT_MODEL = "gpt-4o-mini";

function normalizeAIResult(
  data: z.infer<typeof aiPlanSchema>,
  input: NormalizedCoachInput,
): AIPlanningResult {
  const validIds = new Set(input.tasks.map((t) => t.id));
  const chunks = data.chunks
    .filter((c) => validIds.has(c.taskId))
    .map((c, i) => ({
      ...c,
      order: c.order || i + 1,
    }));

  const rankedTaskIds = data.rankedTaskIds.filter((id) => validIds.has(id));
  for (const t of input.tasks) {
    if (!rankedTaskIds.includes(t.id)) rankedTaskIds.push(t.id);
  }

  return {
    summary: data.summary.trim(),
    rankedTaskIds,
    chunks,
    encouragement: data.encouragement.trim(),
    emailDraft: data.emailDraft?.trim() || undefined,
  };
}

/**
 * Deterministic mock when no API key or AI fails — still respects domain task ids.
 */
export function getMockPlanningResult(input: NormalizedCoachInput): AIPlanningResult {
  const ranked = [...input.tasks].sort(
    (a, b) => a.deadline.getTime() - b.deadline.getTime() || b.importanceWeight - a.importanceWeight,
  );

  const chunks: PlannedChunk[] = [];
  let order = 1;
  for (const t of ranked) {
    let remaining = t.estimatedHours;
    while (remaining > 0.01) {
      const target = Math.min(2, Math.max(0.5, remaining));
      const hours = Math.round(target * 4) / 4;
      const actual = Math.min(hours, remaining);
      chunks.push({
        taskId: t.id,
        label: `Block: ${t.title.slice(0, 40)}`,
        hours: actual,
        order: order++,
      });
      remaining -= actual;
    }
  }

  return {
    summary: `A structured comeback plan for ${ranked.length} task(s) across ${input.studentContext.planningWindowDays} day(s), respecting your busy blocks and daily limit of ${input.studentContext.maxHoursPerDay}h.`,
    rankedTaskIds: ranked.map((t) => t.id),
    chunks,
    encouragement:
      "Small steps add up. Focus on the next block only — you've already done the hard part by planning.",
  };
}

/**
 * Calls OpenAI when configured; otherwise returns mock planning data.
 */
export async function runPlanner(input: NormalizedCoachInput): Promise<AIPlanningResult> {
  const client = getOpenAIClient();
  if (!client) {
    return getMockPlanningResult(input);
  }

  const prompt = buildPlanningPrompt(input);

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL,
      messages: [
        { role: "system", content: "You are a helpful academic coach. Reply with JSON only." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return getMockPlanningResult(input);
    }

    const parsed: unknown = JSON.parse(raw);
    const validated = aiPlanSchema.safeParse(parsed);
    if (!validated.success) {
      return getMockPlanningResult(input);
    }

    return normalizeAIResult(validated.data, input);
  } catch {
    return getMockPlanningResult(input);
  }
}
