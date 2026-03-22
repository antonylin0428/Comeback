/**
 * Wire-level request and response shapes for the coach API.
 */

export type Importance = "low" | "medium" | "high";

export interface StudentContextInput {
  stressLevel: number;
  planningWindowDays: number;
  maxHoursPerDay: number;
  workStartHour: number;
  workEndHour: number;
  schedulingPreferences?: string;
  /** ISO-8601 instant of local midnight today (from the browser). Used so work hours apply in the user's timezone, not UTC on the server. */
  planningAnchorIso?: string;
  /** IANA timezone, e.g. America/Los_Angeles — used for calendar day labels. */
  timeZone?: string;
}

export interface TaskInput {
  title: string;
  type: string;
  deadline: string;
  estimatedHours: number;
  importance: Importance;
}

export interface BusyBlockInput {
  title: string;
  start: string;
  end: string;
}

export interface CoachPlanRequest {
  studentContext: StudentContextInput;
  tasks: TaskInput[];
  busyBlocks: BusyBlockInput[];
}
