import type { NormalizedCoachInput } from "@/types/domain";

function tasksPayload(input: NormalizedCoachInput) {
  return input.tasks.map((t) => ({
    id: t.id,
    title: t.title,
    type: t.type,
    deadline: t.deadline.toISOString(),
    estimatedHours: t.estimatedHours,
    importance: t.importance,
    importanceWeight: t.importanceWeight,
  }));
}

function busyPayload(input: NormalizedCoachInput) {
  return input.busyBlocks.map((b) => ({
    title: b.title,
    start: b.start.toISOString(),
    end: b.end.toISOString(),
  }));
}

/**
 * Planning prompt: AI must return JSON only with task ids from the payload.
 */
export function buildPlanningPrompt(input: NormalizedCoachInput): string {
  const ctx = input.studentContext;
  const preferencesBlock = ctx.schedulingPreferences?.trim()
    ? `\nStudent scheduling preferences (follow these when ordering and grouping chunks):\n"${ctx.schedulingPreferences.trim()}"\n`
    : "";

  return `You are an academic recovery coach. Given a student's context, tasks, and busy blocks, produce a realistic prioritization and chunk breakdown.

Student context:
- stressLevel (1-10): ${ctx.stressLevel}
- planningWindowDays: ${ctx.planningWindowDays}
- maxHoursPerDay: ${ctx.maxHoursPerDay}
- workStartHour: ${ctx.workStartHour} (daily work window starts at this hour)
- workEndHour: ${ctx.workEndHour} (daily work window ends at this hour)
${preferencesBlock}
Tasks (use these exact task "id" values in rankedTaskIds and chunks — do not invent ids):
${JSON.stringify(tasksPayload(input), null, 2)}

Busy blocks:
${JSON.stringify(busyPayload(input), null, 2)}

Return ONLY valid JSON matching this shape (no markdown):
{
  "summary": "2-4 sentences on the overall plan and mindset",
  "rankedTaskIds": ["task_id_in_urgency_order"],
  "chunks": [
    { "taskId": "task_id", "label": "short label for the chunk", "hours": 1.5, "order": 1 }
  ],
  "encouragement": "one short supportive paragraph",
  "emailDraft": "optional short email draft to professor, or omit"
}

Rules:
- chunks must cover each task's estimatedHours in total (sum of hours per taskId should match estimatedHours within 0.25h).
- order is global sequence (1,2,3...) across all chunks.
- Prefer earlier deadlines and higher importanceWeight when ranking, unless overridden by the student's scheduling preferences above.
- Keep chunks between 0.5 and 2 hours where possible.
- Respect the student's workStartHour and workEndHour when describing when sessions should happen.
`;
}

export function buildEmailDraftPrompt(_input: NormalizedCoachInput, summary: string): string {
  return `Write a brief, polite email from a student to a professor asking for an extension or meeting, based on this plan summary:\n\n${summary}\n\nReturn plain text only, under 200 words.`;
}
