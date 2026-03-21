/**
 * Final assembled plan returned to the client (Person 1 defines types; Person 2 assembles).
 */

export interface PriorityItem {
  id: string;
  title: string;
  type: string;
  deadline: string;
}

export interface ScheduledBlock {
  start: string;
  end: string;
  taskId: string;
  taskTitle: string;
  chunkLabel?: string;
}

export interface DailyScheduleDay {
  date: string;
  blocks: ScheduledBlock[];
}

export interface CoachPlanResponse {
  summary: string;
  encouragement: string;
  priorities: PriorityItem[];
  dailySchedule: DailyScheduleDay[];
  warnings: string[];
  overload: boolean;
  emailDraft?: string;
}

export interface SchedulerResult {
  days: DailyScheduleDay[];
  unscheduledTaskIds: string[];
  overload: boolean;
  overloadReason?: string;
  warnings: string[];
}
