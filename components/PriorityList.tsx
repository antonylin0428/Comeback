import { ListOrdered } from "lucide-react";

import type { PriorityItem } from "@/types/plan";

type Props = {
  priorities: PriorityItem[];
};

export function PriorityList({ priorities }: Props) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
        <ListOrdered className="h-4 w-4" aria-hidden />
        Top priorities
      </div>
      <ol className="space-y-3">
        {priorities.map((p, i) => (
          <li
            key={p.id}
            className="flex gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{p.title}</p>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                {p.type} · due {new Date(p.deadline).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
