import type { AIPlanningResult, NormalizedCoachInput } from "@/types/domain";
import type { CoachPlanResponse, SchedulerResult } from "@/types/plan";

/**
 * Combines AI output and scheduler output into the final API response.
 */
export function assembleCoachPlan(
  input: NormalizedCoachInput,
  ai: AIPlanningResult,
  schedule: SchedulerResult,
): CoachPlanResponse {
  const seen = new Set<string>();
  const priorities: CoachPlanResponse["priorities"] = [];

  for (const id of ai.rankedTaskIds) {
    const t = input.tasks.find((x) => x.id === id);
    if (!t || seen.has(id)) continue;
    seen.add(id);
    priorities.push({
      id: t.id,
      title: t.title,
      type: t.type,
      deadline: t.deadline.toISOString(),
    });
  }

  for (const t of input.tasks) {
    if (seen.has(t.id)) continue;
    priorities.push({
      id: t.id,
      title: t.title,
      type: t.type,
      deadline: t.deadline.toISOString(),
    });
  }

  const warnings = [...schedule.warnings];

  return {
    summary: ai.summary,
    encouragement: ai.encouragement,
    priorities,
    dailySchedule: schedule.days,
    warnings,
    overload: schedule.overload,
    emailDraft: ai.emailDraft,
  };
}
