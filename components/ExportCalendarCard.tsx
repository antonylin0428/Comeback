"use client";

import { CalendarDays, Download, ExternalLink } from "lucide-react";
import { useState } from "react";

import { buildIcsString, countScheduledBlocks } from "@/lib/ics";
import type { CoachPlanResponse } from "@/types/plan";

type Props = {
  plan: CoachPlanResponse;
};

export function ExportCalendarCard({ plan }: Props) {
  const [downloaded, setDownloaded] = useState(false);
  const blockCount = countScheduledBlocks(plan);
  const isEmpty = blockCount === 0;

  function handleDownload() {
    const icsString = buildIcsString(plan);
    const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "comeback-study-plan.ics";
    anchor.click();

    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
        <CalendarDays className="h-4 w-4" aria-hidden />
        Add to calendar
      </div>

      <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        Download your study schedule as a <span className="font-medium text-zinc-900 dark:text-zinc-100">.ics file</span> and import it into Google Calendar, Apple Calendar, or Outlook in one click.
      </p>

      {isEmpty ? (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          No scheduled blocks to export yet.
        </p>
      ) : (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {blockCount} study {blockCount === 1 ? "block" : "blocks"} will be added to your calendar.
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={handleDownload}
          disabled={isEmpty}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download className="h-4 w-4" aria-hidden />
          {downloaded ? "Downloaded!" : "Download .ics file"}
        </button>

        <a
          href="https://calendar.google.com/calendar/r/settings/export"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 underline-offset-4 hover:text-emerald-700 hover:underline dark:text-zinc-400 dark:hover:text-emerald-400"
        >
          Open Google Calendar import
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>

      <p className="mt-4 border-t border-zinc-100 pt-4 text-xs leading-relaxed text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
        In Google Calendar: go to{" "}
        <span className="font-medium text-zinc-500 dark:text-zinc-400">
          Settings → Import &amp; export → Import
        </span>{" "}
        and select the downloaded file.
      </p>
    </section>
  );
}
