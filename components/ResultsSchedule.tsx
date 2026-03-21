import { CalendarClock } from "lucide-react";

import type { DailyScheduleDay } from "@/types/plan";

type Props = {
  dailySchedule: DailyScheduleDay[];
};

function formatRange(isoStart: string, isoEnd: string) {
  const s = new Date(isoStart);
  const e = new Date(isoEnd);
  return `${s.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} – ${e.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}

export function ResultsSchedule({ dailySchedule }: Props) {
  const hasBlocks = dailySchedule.some((d) => d.blocks.length > 0);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
        <CalendarClock className="h-4 w-4" aria-hidden />
        Daily schedule
      </div>
      {!hasBlocks ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No time blocks were placed yet — try widening your planning window or reducing busy blocks.
        </p>
      ) : (
        <div className="space-y-6">
          {dailySchedule.map((day) =>
            day.blocks.length === 0 ? null : (
              <div key={day.date}>
                <h3 className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {new Date(day.date + "T12:00:00").toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                <ul className="space-y-2">
                  {day.blocks.map((b, i) => (
                    <li
                      key={`${day.date}-${i}-${b.start}`}
                      className="flex flex-col gap-1 rounded-xl border border-zinc-100 bg-zinc-50/90 px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/60"
                    >
                      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        {formatRange(b.start, b.end)}
                      </span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">{b.taskTitle}</span>
                      {b.chunkLabel ? (
                        <span className="text-zinc-600 dark:text-zinc-400">{b.chunkLabel}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}
