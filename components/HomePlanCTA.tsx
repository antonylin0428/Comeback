"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { CoachPlanResponse } from "@/types/plan";

const STORAGE_KEY = "coachPlanResponse";

function buildSamplePayload() {
  const now = new Date();
  const iso = (d: Date) => d.toISOString();
  const busyStart = new Date(now);
  busyStart.setHours(10, 0, 0, 0);
  const busyEnd = new Date(now);
  busyEnd.setHours(12, 0, 0, 0);

  const deadlineA = new Date(now.getTime() + 3 * 86400000);
  const deadlineB = new Date(now.getTime() + 5 * 86400000);

  return {
    studentContext: {
      stressLevel: 7,
      planningWindowDays: 7,
      maxHoursPerDay: 4,
    },
    tasks: [
      {
        title: "History paper",
        type: "assignment",
        deadline: iso(deadlineA),
        estimatedHours: 4,
        importance: "medium" as const,
      },
      {
        title: "Calculus midterm",
        type: "exam",
        deadline: iso(deadlineB),
        estimatedHours: 6,
        importance: "high" as const,
      },
    ],
    busyBlocks: [
      {
        title: "Class block",
        start: iso(busyStart),
        end: iso(busyEnd),
      },
    ],
  };
}

export function HomePlanCTA() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/coach-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildSamplePayload()),
      });
      if (!res.ok) {
        const errBody = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errBody?.error ?? `Request failed (${res.status})`);
      }
      const data = (await res.json()) as CoachPlanResponse;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      router.push("/results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => void generate()}
        disabled={loading}
        className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Building your plan…" : "Generate a sample comeback plan"}
      </button>
      {error ? <p className="max-w-md text-center text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      <p className="max-w-md text-center text-xs text-zinc-500 dark:text-zinc-400">
        Uses the real <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">POST /api/coach-plan</code>{" "}
        pipeline (validation → AI/mock → scheduler → assembly).
      </p>
    </div>
  );
}
