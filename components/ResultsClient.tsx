"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { CoachPlanResponse } from "@/types/plan";

import { EmailDraftCard } from "./EmailDraftCard";
import { ExportCalendarCard } from "./ExportCalendarCard";
import { OverloadBanner } from "./OverloadBanner";
import { PlanSummaryCard } from "./PlanSummaryCard";
import { PriorityList } from "./PriorityList";
import { ResultsSchedule } from "./ResultsSchedule";

const STORAGE_KEY = "coachPlanResponse";

export function ResultsClient() {
  const [data, setData] = useState<CoachPlanResponse | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      if (cancelled) return;
      try {
        setData(JSON.parse(raw) as CoachPlanResponse);
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, []);

  if (!data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">No plan yet</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Generate a plan from the home page — we&apos;ll show it here.
        </p>
        <Link
          href="/plan"
          className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Build a plan
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          Academic Comeback Coach
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Your plan is ready
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Here&apos;s a prioritized path based on your deadlines, importance, and availability.
        </p>
      </header>

      <OverloadBanner overload={data.overload} warnings={data.warnings} />

      <PlanSummaryCard summary={data.summary} encouragement={data.encouragement} />

      <PriorityList priorities={data.priorities} />

      <ResultsSchedule dailySchedule={data.dailySchedule} />

      <ExportCalendarCard plan={data} />

      <EmailDraftCard emailDraft={data.emailDraft} />

      <div className="flex justify-center pb-8">
        <Link
          href="/plan"
          className="text-sm font-medium text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
        >
          ← Plan again
        </Link>
      </div>
    </div>
  );
}
