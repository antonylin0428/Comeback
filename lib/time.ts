import {
  addDays,
  addHours,
  addMinutes,
  areIntervalsOverlapping,
  endOfDay,
  isBefore,
  isEqual,
  max as maxDate,
  min as minDate,
  parseISO,
  startOfDay,
} from "date-fns";

import { BREAK_HOURS } from "./constants";

export type TimeInterval = { start: Date; end: Date };

export function parseIsoDate(iso: string): Date {
  return parseISO(iso);
}

export function ensureValidInterval(start: Date, end: Date): TimeInterval {
  if (isBefore(end, start) || isEqual(end, start)) {
    throw new Error("Invalid interval: end must be after start");
  }
  return { start, end };
}

export function mergeOverlappingIntervals(intervals: TimeInterval[]): TimeInterval[] {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a.start.getTime() - b.start.getTime());
  const merged: TimeInterval[] = [];
  let current = { ...sorted[0] };
  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i];
    if (next.start.getTime() <= current.end.getTime()) {
      current.end = maxDate([current.end, next.end]);
    } else {
      merged.push(current);
      current = { ...next };
    }
  }
  merged.push(current);
  return merged;
}

/** Subtract busy intervals from a single free interval; returns ordered disjoint free pieces. */
export function subtractFromInterval(
  free: TimeInterval,
  busyList: TimeInterval[],
): TimeInterval[] {
  let pieces: TimeInterval[] = [{ ...free }];
  for (const busy of busyList) {
    const nextPieces: TimeInterval[] = [];
    for (const piece of pieces) {
      if (!areIntervalsOverlapping(piece, busy, { inclusive: true })) {
        nextPieces.push(piece);
        continue;
      }
      const overlapStart = maxDate([piece.start, busy.start]);
      const overlapEnd = minDate([piece.end, busy.end]);
      if (isBefore(piece.start, overlapStart)) {
        nextPieces.push({ start: piece.start, end: overlapStart });
      }
      if (isBefore(overlapEnd, piece.end)) {
        nextPieces.push({ start: overlapEnd, end: piece.end });
      }
    }
    pieces = nextPieces.filter((p) => isBefore(p.start, p.end));
  }
  return pieces;
}

export function clipIntervalToDay(interval: TimeInterval, day: Date): TimeInterval | null {
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);
  const start = maxDate([interval.start, dayStart]);
  const end = minDate([interval.end, dayEnd]);
  if (!isBefore(start, end)) return null;
  return { start, end };
}

export function eachPlanningDay(start: Date, planningWindowDays: number): Date[] {
  const days: Date[] = [];
  const base = startOfDay(start);
  for (let i = 0; i < planningWindowDays; i++) {
    days.push(addDays(base, i));
  }
  return days;
}

export function addHoursToDate(d: Date, hours: number): Date {
  return addHours(d, hours);
}

export function addBreakAfter(d: Date): Date {
  return addMinutes(d, Math.round(BREAK_HOURS * 60));
}
