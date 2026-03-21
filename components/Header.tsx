import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <GraduationCap className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold leading-none text-zinc-900 dark:text-zinc-50">
              Comeback Coach
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Turn overwhelm into a plan you can actually follow
            </p>
          </div>
        </Link>

        <Link
          href="/plan"
          className="inline-flex h-9 items-center rounded-full bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Get my plan
        </Link>
      </div>
    </header>
  );
}
