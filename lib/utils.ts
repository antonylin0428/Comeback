/**
 * Small shared helpers — sorting, formatting, defensive cleaning.
 */

export function sortByDeadline<T extends { deadline: Date }>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function safeTrim(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.trim();
}
