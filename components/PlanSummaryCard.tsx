import { Sparkles } from "lucide-react";

type Props = {
  summary: string;
  encouragement: string;
};

export function PlanSummaryCard({ summary, encouragement }: Props) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
        <Sparkles className="h-4 w-4" aria-hidden />
        Your comeback plan
      </div>
      <p className="text-lg leading-relaxed text-zinc-900 dark:text-zinc-100">{summary}</p>
      <p className="mt-4 border-t border-zinc-100 pt-4 text-base leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        {encouragement}
      </p>
    </section>
  );
}
