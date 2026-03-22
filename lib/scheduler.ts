import { addHours, isBefore, startOfDay } from "date-fns";

import type { AIPlanningResult, NormalizedCoachInput } from "@/types/domain";
import type { DailyScheduleDay, SchedulerResult, ScheduledBlock } from "@/types/plan";

import { MAX_BLOCK_HOURS, MIN_CHUNK_HOURS } from "./constants";
import {
  addBreakAfter,
  addHoursToDate,
  clipIntervalToDay,
  eachPlanningDay,
  mergeOverlappingIntervals,
  subtractFromInterval,
  type TimeInterval,
} from "./time";

function workWindowForDay(day: Date, startHour: number, endHour: number): TimeInterval {
  const base = startOfDay(day);
  return {
    start: addHours(base, startHour),
    end: addHours(base, endHour),
  };
}

function busyForDay(day: Date, input: NormalizedCoachInput): TimeInterval[] {
  const intervals: TimeInterval[] = [];
  for (const b of input.busyBlocks) {
    const clipped = clipIntervalToDay({ start: b.start, end: b.end }, day);
    if (clipped) intervals.push(clipped);
  }
  return mergeOverlappingIntervals(intervals);
}

function freeWindowsForDay(day: Date, input: NormalizedCoachInput): TimeInterval[] {
  const { workStartHour, workEndHour } = input.studentContext;
  const work = workWindowForDay(day, workStartHour, workEndHour);
  const busy = busyForDay(day, input);
  let free: TimeInterval[] = [work];
  for (const b of busy) {
    const next: TimeInterval[] = [];
    for (const f of free) {
      next.push(...subtractFromInterval(f, [b]));
    }
    free = next;
  }
  return free.filter((f) => isBefore(f.start, f.end));
}

function hoursBetween(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

function dateKey(day: Date): string {
  return startOfDay(day).toISOString().slice(0, 10);
}

/**
 * Deterministic scheduler: places AI chunks into free windows respecting daily caps.
 */
export function runScheduler(input: NormalizedCoachInput, ai: AIPlanningResult): SchedulerResult {
  const planningDays = input.studentContext.planningWindowDays;
  const maxPerDay = input.studentContext.maxHoursPerDay;
  const start = startOfDay(new Date());
  const days = eachPlanningDay(start, planningDays);

  const taskTitle = new Map(input.tasks.map((t) => [t.id, t.title]));
  const sortedChunks = [...ai.chunks].sort((a, b) => a.order - b.order);

  const daysOut: DailyScheduleDay[] = days.map((d) => ({
    date: dateKey(d),
    blocks: [] as ScheduledBlock[],
  }));

  const hoursUsedPerDay = new Array(planningDays).fill(0);
  // Track where the next block can start on each day to prevent overlaps
  const dayNextSlot: (Date | null)[] = new Array(planningDays).fill(null);
  const unscheduledTaskIds = new Set<string>();
  const warnings: string[] = [];
  let overload = false;

  for (const chunk of sortedChunks) {
    let remaining = chunk.hours;
    const taskId = chunk.taskId;
    const title = taskTitle.get(taskId) ?? "Task";

    for (let d = 0; d < planningDays && remaining > MIN_CHUNK_HOURS / 2; d++) {
      const dayDate = days[d]!;
      const free = freeWindowsForDay(dayDate, input);

      for (const window of free) {
        if (remaining <= MIN_CHUNK_HOURS / 2) break;

        // Start from where we last left off on this day, not the window start
        const cursor = dayNextSlot[d];
        let slotStart =
          cursor && isBefore(window.start, cursor) ? cursor : window.start;

        // If cursor is already past this window, skip it
        if (!isBefore(slotStart, window.end)) continue;

        while (isBefore(slotStart, window.end) && remaining > MIN_CHUNK_HOURS / 2) {
          const roomInDay = maxPerDay - hoursUsedPerDay[d]!;
          if (roomInDay < MIN_CHUNK_HOURS) break;

          const windowLeft = hoursBetween(slotStart, window.end);
          if (windowLeft < MIN_CHUNK_HOURS) break;

          const take = Math.min(remaining, MAX_BLOCK_HOURS, roomInDay, windowLeft);
          if (take < MIN_CHUNK_HOURS) {
            slotStart = addBreakAfter(slotStart);
            if (!isBefore(slotStart, window.end)) break;
            continue;
          }

          const blockEnd = addHoursToDate(slotStart, take);
          if (!isBefore(slotStart, blockEnd) || blockEnd > window.end) {
            slotStart = addBreakAfter(slotStart);
            if (!isBefore(slotStart, window.end)) break;
            continue;
          }

          daysOut[d]!.blocks.push({
            start: slotStart.toISOString(),
            end: blockEnd.toISOString(),
            taskId,
            taskTitle: title,
            chunkLabel: chunk.label,
          });

          hoursUsedPerDay[d] = (hoursUsedPerDay[d] ?? 0) + take;
          remaining -= take;
          slotStart = addBreakAfter(blockEnd);
          dayNextSlot[d] = slotStart;
        }
      }
    }

    if (remaining > MIN_CHUNK_HOURS / 2) {
      unscheduledTaskIds.add(taskId);
      overload = true;
      warnings.push(
        `Could not schedule all hours for "${title}" in the current planning window.`,
      );
    }
  }

  const totalChunkHours = sortedChunks.reduce((s, c) => s + c.hours, 0);
  const roughCapacity = planningDays * maxPerDay;
  if (totalChunkHours > roughCapacity + 0.01) {
    overload = true;
    warnings.push(
      "Total planned work exceeds rough daily capacity for this window — consider narrowing scope or extending the window.",
    );
  }

  return {
    days: daysOut,
    unscheduledTaskIds: [...unscheduledTaskIds],
    overload,
    overloadReason: overload ? warnings[0] : undefined,
    warnings,
  };
}
