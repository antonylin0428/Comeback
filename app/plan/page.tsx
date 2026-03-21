import { Header } from "@/components/Header";
import { InputForm } from "@/components/InputForm";

export default function PlanPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Build your comeback plan
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Enter your tasks, deadlines, and schedule — we&apos;ll turn them into a day-by-day plan you can actually follow.
          </p>
        </div>
        <InputForm />
      </main>
    </div>
  );
}
