import { X } from "lucide-react";

import type { Importance } from "@/types/api";

export interface TaskDraft {
  title: string;
  type: string;
  deadline: string;
  estimatedHours: number;
  importance: Importance;
}

interface Props {
  index: number;
  task: TaskDraft;
  onChange: (index: number, updated: TaskDraft) => void;
  onRemove: (index: number) => void;
}

const TASK_TYPES = ["exam", "assignment", "project", "reading", "other"] as const;
const IMPORTANCE_OPTIONS: { value: Importance; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500";

const labelClass = "block text-xs font-medium text-zinc-600 dark:text-zinc-400";

export function TaskInputCard({ index, task, onChange, onRemove }: Props) {
  function update<K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) {
    onChange(index, { ...task, [key]: value });
  }

  return (
    <div className="relative rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
        aria-label="Remove task"
      >
        <X className="h-4 w-4" />
      </button>

      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Task {index + 1}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Title</label>
          <input
            type="text"
            className={`${inputClass} mt-1`}
            placeholder="e.g. Calculus Midterm"
            value={task.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Type</label>
          <select
            className={`${inputClass} mt-1`}
            value={task.type}
            onChange={(e) => update("type", e.target.value)}
          >
            {TASK_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Importance</label>
          <select
            className={`${inputClass} mt-1`}
            value={task.importance}
            onChange={(e) => update("importance", e.target.value as Importance)}
          >
            {IMPORTANCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Deadline</label>
          <input
            type="datetime-local"
            className={`${inputClass} mt-1`}
            value={task.deadline}
            onChange={(e) => update("deadline", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Estimated hours</label>
          <input
            type="number"
            min={0.25}
            max={200}
            step={0.25}
            className={`${inputClass} mt-1`}
            value={task.estimatedHours}
            onChange={(e) => update("estimatedHours", parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  );
}
