import { HomePlanCTA } from "@/components/HomePlanCTA";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-6 py-20 text-center">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Academic Comeback Coach
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Turn overwhelm into a week you can actually follow
          </h1>
          <p className="text-pretty text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Combine AI prioritization with deterministic scheduling to build a realistic recovery plan around your
            deadlines and busy blocks.
          </p>
        </div>
        <HomePlanCTA />
      </main>
    </div>
  );
}
