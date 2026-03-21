/**
 * Normalized domain objects used after validation and normalization.
 */

import type { Importance } from "./api";

export interface NormalizedStudentContext {
  stressLevel: number;
  planningWindowDays: number;
  maxHoursPerDay: number;
}

export interface NormalizedTask {
  id: string;
  title: string;
  type: string;
  deadline: Date;
  estimatedHours: number;
  importance: Importance;
  importanceWeight: number;
}

export interface NormalizedBusyBlock {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export interface NormalizedCoachInput {
  studentContext: NormalizedStudentContext;
  tasks: NormalizedTask[];
  busyBlocks: NormalizedBusyBlock[];
}

/** A planned chunk of work to be scheduled (from AI planner). */
export interface PlannedChunk {
  taskId: string;
  label: string;
  hours: number;
  order: number;
}

export interface AIPlanningResult {
  summary: string;
  rankedTaskIds: string[];
  chunks: PlannedChunk[];
  encouragement: string;
  emailDraft?: string;
}
