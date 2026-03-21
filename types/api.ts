/**
 * Wire-level request and response shapes for the coach API.
 */

export type Importance = "low" | "medium" | "high";

export interface StudentContextInput {
  stressLevel: number;
  planningWindowDays: number;
  maxHoursPerDay: number;
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
