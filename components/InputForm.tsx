"use client";

import { Plus } from "lucide-react";
import { useRef, useState } from "react";

import type { CoachPlanRequest } from "@/types/api";
import type { CoachPlanResponse } from "@/types/plan";

import { BusyBlockInputCard, type BusyBlockDraft } from "./BusyBlockInputCard";
import { TaskInputCard, type TaskDraft } from "./TaskInputCard";

const STORAGE_KEY = "coachPlanResponse";

function toIso(localDatetime: string): string {
  if (!localDatetime) return "";
  return new Date(localDatetime).toISOString();
}

function defaultTask(): TaskDraft {
  return {
    title: "",
    type: "exam",
    deadline: "",
    estimatedHours: 2,
    importance: "high",
  };
}

function defaultBlock(): BusyBlockDraft {
  return { title: "", days: [], startTime: "", endTime: "" };
}

/**
 * Expands recurring busy blocks into one BusyBlockInput per matching day
 * across the planning window, so the backend scheduler can work with exact dates.
 */
function expandRecurringBlocks(
  blocks: BusyBlockDraft[],
  planningWindowDays: number,
): CoachPlanRequest["busyBlocks"] {
  const result: CoachPlanRequest["busyBlocks"] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const block of blocks) {
    if (!block.title.trim() || block.days.length === 0 || !block.startTime || !block.endTime) {
      continue;
    }
    const [startH, startM] = block.startTime.split(":").map(Number) as [number, number];
    const [endH, endM] = block.endTime.split(":").map(Number) as [number, number];

    for (let i = 0; i < planningWindowDays; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);

      if (!block.days.includes(day.getDay())) continue;

      const start = new Date(day);
      start.setHours(startH, startM, 0, 0);
      const end = new Date(day);
      end.setHours(endH, endM, 0, 0);

      if (end <= start) continue;

      result.push({
        title: block.title.trim(),
        start: start.toISOString(),
        end: end.toISOString(),
      });
    }
  }

  return result;
}

const sectionHeadingClass =
  "text-base font-semibold text-zinc-900 dark:text-zinc-50";

const sectionSubClass =
  "mt-0.5 text-sm text-zinc-500 dark:text-zinc-400";

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

const labelClass = "block text-xs font-medium text-zinc-600 dark:text-zinc-400";

const addButtonClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-600 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-emerald-500 dark:hover:text-emerald-400";

export function InputForm() {
  const errorRef = useRef<HTMLDivElement>(null);

  const [stressLevel, setStressLevel] = useState(5);
  const [planningWindowDays, setPlanningWindowDays] = useState(7);
  const [maxHoursPerDay, setMaxHoursPerDay] = useState(4);

  const [tasks, setTasks] = useState<TaskDraft[]>([defaultTask()]);
  const [busyBlocks, setBusyBlocks] = useState<BusyBlockDraft[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addTask() {
    setTasks((prev) => [...prev, defaultTask()]);
  }

  function updateTask(index: number, updated: TaskDraft) {
    setTasks((prev) => prev.map((t, i) => (i === index ? updated : t)));
  }

  function removeTask(index: number) {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  }

  function addBlock() {
    setBusyBlocks((prev) => [...prev, defaultBlock()]);
  }

  function updateBlock(index: number, updated: BusyBlockDraft) {
    setBusyBlocks((prev) => prev.map((b, i) => (i === index ? updated : b)));
  }

  function removeBlock(index: number) {
    setBusyBlocks((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    setError(null);

    // Basic client-side guard — at least one task with a title and deadline
    const incompleteTasks = tasks.filter((t) => !t.title.trim() || !t.deadline);
    if (incompleteTasks.length > 0) {
      setError("Each task needs a title and a deadline before submitting.");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }

    const incompleteBlocks = busyBlocks.filter(
      (b) => b.title.trim() && (b.days.length === 0 || !b.startTime || !b.endTime),
    );
    if (incompleteBlocks.length > 0) {
      setError("Each busy block needs at least one day selected and a start and end time.");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }

    const payload: CoachPlanRequest = {
      studentContext: {
        stressLevel,
        planningWindowDays,
        maxHoursPerDay,
      },
      tasks: tasks.map((t) => ({
        title: t.title.trim(),
        type: t.type,
        deadline: toIso(t.deadline),
        estimatedHours: t.estimatedHours,
        importance: t.importance,
      })),
      busyBlocks: expandRecurringBlocks(busyBlocks, planningWindowDays),
    };

    setLoading(true);
    try {
      const res = await fetch("/api/coach-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errBody?.error ?? `Request failed (${res.status})`);
      }

      const data = (await res.json()) as CoachPlanResponse;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.location.href = "/results";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-10">
      {/* Error banner — top of form so it's always visible */}
      {error ? (
        <div
          ref={errorRef}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {/* Student context */}
      <section className="space-y-4">
        <div>
          <h2 className={sectionHeadingClass}>Your situation</h2>
          <p className={sectionSubClass}>
            Tell us how much time you have and how you&apos;re feeling.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>
              Stress level — <span className="font-semibold text-emerald-700 dark:text-emerald-400">{stressLevel}</span> / 10
            </label>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="mt-2 w-full accent-emerald-600"
            />
          </div>

          <div>
            <label className={labelClass}>Planning window (days)</label>
            <input
              type="number"
              min={1}
              max={30}
              step={1}
              value={planningWindowDays}
              onChange={(e) => setPlanningWindowDays(Number(e.target.value))}
              className={`${inputClass} mt-1`}
            />
          </div>

          <div>
            <label className={labelClass}>Max study hours / day</label>
            <input
              type="number"
              min={0.5}
              max={12}
              step={0.5}
              value={maxHoursPerDay}
              onChange={(e) => setMaxHoursPerDay(Number(e.target.value))}
              className={`${inputClass} mt-1`}
            />
          </div>
        </div>
      </section>

      {/* Tasks */}
      <section className="space-y-4">
        <div>
          <h2 className={sectionHeadingClass}>Academic tasks</h2>
          <p className={sectionSubClass}>
            Add every exam, assignment, or project you need to tackle.
          </p>
        </div>

        {tasks.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            No tasks yet — add one below.
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <TaskInputCard
                key={i}
                index={i}
                task={task}
                onChange={updateTask}
                onRemove={removeTask}
              />
            ))}
          </div>
        )}

        <button type="button" onClick={addTask} className={addButtonClass}>
          <Plus className="h-4 w-4" />
          Add task
        </button>
      </section>

      {/* Busy blocks */}
      <section className="space-y-4">
        <div>
          <h2 className={sectionHeadingClass}>Busy blocks</h2>
          <p className={sectionSubClass}>
            Optional — add classes, jobs, or commitments the scheduler should work around.
          </p>
        </div>

        {busyBlocks.length > 0 && (
          <div className="space-y-3">
            {busyBlocks.map((block, i) => (
              <BusyBlockInputCard
                key={i}
                index={i}
                block={block}
                onChange={updateBlock}
                onRemove={removeBlock}
              />
            ))}
          </div>
        )}

        <button type="button" onClick={addBlock} className={addButtonClass}>
          <Plus className="h-4 w-4" />
          Add busy block
        </button>
      </section>

      {/* Submit */}
      <div className="space-y-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={loading || tasks.length === 0}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-emerald-600 px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {loading ? "Building your plan…" : "Generate my comeback plan"}
        </button>

        {tasks.length === 0 && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Add at least one task to continue.</p>
        )}
      </div>
    </form>
  );
}
