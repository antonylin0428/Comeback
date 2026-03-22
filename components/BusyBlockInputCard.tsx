"use client";

import { X } from "lucide-react";

export interface BusyBlockDraft {
  title: string;
  days: number[]; // 0 = Sunday … 6 = Saturday (matches Date.getDay())
  startTime: string; // "HH:MM" 24-hour
  endTime: string; // "HH:MM" 24-hour
}

interface Props {
  index: number;
  block: BusyBlockDraft;
  onChange: (index: number, updated: BusyBlockDraft) => void;
  onRemove: (index: number) => void;
}

const DAYS = [
  { label: "Su", value: 0 },
  { label: "Mo", value: 1 },
  { label: "Tu", value: 2 },
  { label: "We", value: 3 },
  { label: "Th", value: 4 },
  { label: "Fr", value: 5 },
  { label: "Sa", value: 6 },
];

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500";

const labelClass = "block text-xs font-medium text-zinc-600 dark:text-zinc-400";

export function BusyBlockInputCard({ index, block, onChange, onRemove }: Props) {
  function toggleDay(day: number) {
    const next = block.days.includes(day)
      ? block.days.filter((d) => d !== day)
      : [...block.days, day].sort((a, b) => a - b);
    onChange(index, { ...block, days: next });
  }

  return (
    <div className="relative rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
        aria-label="Remove busy block"
      >
        <X className="h-4 w-4" />
      </button>

      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Busy block {index + 1}
      </p>

      <div className="space-y-3">
        {/* Label */}
        <div>
          <label className={labelClass}>Label</label>
          <input
            type="text"
            className={`${inputClass} mt-1`}
            placeholder="e.g. ECON 101 lecture"
            value={block.title}
            onChange={(e) => onChange(index, { ...block, title: e.target.value })}
          />
        </div>

        {/* Day toggles */}
        <div>
          <label className={labelClass}>Repeats on</label>
          <div className="mt-1.5 flex gap-1.5">
            {DAYS.map((d) => {
              const active = block.days.includes(d.value);
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDay(d.value)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition ${
                    active
                      ? "bg-emerald-600 text-white"
                      : "border border-zinc-200 bg-white text-zinc-500 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Start time</label>
            <input
              type="time"
              className={`${inputClass} mt-1`}
              value={block.startTime}
              onChange={(e) => onChange(index, { ...block, startTime: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>End time</label>
            <input
              type="time"
              className={`${inputClass} mt-1`}
              value={block.endTime}
              onChange={(e) => onChange(index, { ...block, endTime: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
