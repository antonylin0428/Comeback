import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CalendarCheck,
  CheckCircle,
  Clock,
  ListOrdered,
  Sparkles,
} from "lucide-react";

import { Header } from "@/components/Header";

const steps = [
  {
    number: "01",
    icon: ListOrdered,
    title: "Tell us what you're facing",
    description:
      "Enter your academic tasks — exams, assignments, projects — with deadlines and how long each will take. Add any classes or commitments that block your time.",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI prioritizes your workload",
    description:
      "Our AI ranks your tasks by urgency and impact, breaks large tasks into focused study sessions, and gives you a clear picture of what to tackle first.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Get a realistic day-by-day plan",
    description:
      "A deterministic scheduling engine slots every session into your actual free time — respecting your busy blocks and daily hour cap so the plan is genuinely followable.",
  },
];

const features = [
  {
    icon: Clock,
    title: "Respects your real schedule",
    description:
      "Busy blocks — classes, work, commitments — are subtracted from your available time before a single study session is placed.",
  },
  {
    icon: Sparkles,
    title: "AI that knows what matters",
    description:
      "GPT-4o-mini ranks tasks by deadline proximity and academic impact, not just alphabetical order.",
  },
  {
    icon: CheckCircle,
    title: "Honest about overload",
    description:
      "If there isn't enough time for everything, the app tells you clearly and focuses your plan on the highest-impact tasks first.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white dark:bg-zinc-950">
      <Header />

      {/* Hero */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-16 pt-20 text-center">
        <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
          <Sparkles className="h-3 w-3" aria-hidden />
          AI + deterministic scheduling
        </p>
        <h1 className="text-balance text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
          Stop drowning in deadlines.
          <br />
          <span className="text-emerald-600 dark:text-emerald-400">
            Start with a plan that actually fits.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          Comeback Coach turns your pile of missed assignments, upcoming exams, and limited time into
          a realistic, hour-by-hour recovery plan — built around your actual schedule, not an ideal one.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/plan"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-emerald-600 px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Build my comeback plan
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-12 items-center px-6 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            See how it works
          </a>
        </div>
      </section>

      {/* Social proof strip */}
      <div className="border-y border-zinc-100 bg-zinc-50 py-4 dark:border-zinc-800 dark:bg-zinc-900/40">
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Works without login &nbsp;·&nbsp; No data stored &nbsp;·&nbsp; Free to use &nbsp;·&nbsp; Results in under 30 seconds
        </p>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto w-full max-w-4xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            How it works
          </h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Three steps from overwhelm to a plan you can start right now.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold tabular-nums text-emerald-200 dark:text-emerald-900">
                  {step.number}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <step.icon className="h-5 w-5" aria-hidden />
                </span>
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="mx-auto w-full max-w-4xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Built for students in crunch mode
            </h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Not another generic study tips list. A system that does the thinking for you.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <f.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto w-full max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Ready to stop spiraling and start planning?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">
          It takes about 2 minutes to enter your situation. The plan is ready in under 30 seconds.
        </p>
        <Link
          href="/plan"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-emerald-600 px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Build my comeback plan
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-6 dark:border-zinc-800">
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
          Comeback Coach — Academic Recovery Planner
        </p>
      </footer>
    </div>
  );
}
