import { Mail } from "lucide-react";

type Props = {
  emailDraft?: string;
};

export function EmailDraftCard({ emailDraft }: Props) {
  if (!emailDraft?.trim()) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
        <Mail className="h-4 w-4" aria-hidden />
        Email draft
      </div>
      <pre className="whitespace-pre-wrap rounded-xl bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
        {emailDraft.trim()}
      </pre>
    </section>
  );
}
