import type { CoachPlanRequest } from "@/types/api";
import type {
  NormalizedBusyBlock,
  NormalizedCoachInput,
  NormalizedStudentContext,
  NormalizedTask,
} from "@/types/domain";

import {
  DAY_END_HOUR,
  DAY_START_HOUR,
  DEFAULT_PLANNING_WINDOW_DAYS,
  MAX_PLANNING_WINDOW_DAYS,
} from "./constants";
import { mergeOverlappingIntervals, parseIsoDate, type TimeInterval } from "./time";
import { clamp, sortByDeadline } from "./utils";
import type { CoachPlanRequestParsed } from "./validators";

const importanceWeight: Record<NormalizedTask["importance"], number> = {
  low: 1,
  medium: 2,
  high: 3,
};

function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

function intervalsOverlap(a: TimeInterval, b: TimeInterval): boolean {
  return a.start < b.end && b.start < a.end;
}

export function normalizeCoachPlanInput(raw: CoachPlanRequest | CoachPlanRequestParsed): NormalizedCoachInput {
  const studentContext: NormalizedStudentContext = {
    stressLevel: clamp(Math.round(raw.studentContext.stressLevel), 1, 10),
    planningWindowDays: clamp(
      Math.round(raw.studentContext.planningWindowDays),
      1,
      MAX_PLANNING_WINDOW_DAYS,
    ),
    maxHoursPerDay: raw.studentContext.maxHoursPerDay,
    workStartHour: clamp(Math.round(raw.studentContext.workStartHour ?? DAY_START_HOUR), 0, 23),
    workEndHour: clamp(Math.round(raw.studentContext.workEndHour ?? DAY_END_HOUR), 1, 24),
    schedulingPreferences: raw.studentContext.schedulingPreferences?.trim() || undefined,
    planningAnchorIso: raw.studentContext.planningAnchorIso?.trim() || undefined,
    timeZone: raw.studentContext.timeZone?.trim() || undefined,
  };

  if (!Number.isFinite(studentContext.planningWindowDays) || studentContext.planningWindowDays < 1) {
    studentContext.planningWindowDays = DEFAULT_PLANNING_WINDOW_DAYS;
  }

  const tasks: NormalizedTask[] = raw.tasks.map((t) => ({
    id: newId("task"),
    title: t.title.trim(),
    type: t.type.trim(),
    deadline: parseIsoDate(t.deadline),
    estimatedHours: t.estimatedHours,
    importance: t.importance,
    importanceWeight: importanceWeight[t.importance],
  }));

  const sortedTasks = sortByDeadline(tasks);

  const rawBusy = raw.busyBlocks.map((b) => ({
    title: b.title.trim(),
    interval: {
      start: parseIsoDate(b.start),
      end: parseIsoDate(b.end),
    } satisfies TimeInterval,
  }));

  const mergedIntervals = mergeOverlappingIntervals(rawBusy.map((b) => b.interval));

  const busyBlocks: NormalizedBusyBlock[] = mergedIntervals.map((interval, i) => {
    const overlapping = rawBusy.find((b) => intervalsOverlap(b.interval, interval));
    return {
      id: newId("busy"),
      title: overlapping?.title || `Busy ${i + 1}`,
      start: interval.start,
      end: interval.end,
    };
  });

  return {
    studentContext,
    tasks: sortedTasks,
    busyBlocks,
  };
}
