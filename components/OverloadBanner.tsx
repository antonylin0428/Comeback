import { AlertTriangle } from "lucide-react";

type Props = {
  overload: boolean;
  warnings: string[];
};

export function OverloadBanner({ overload, warnings }: Props) {
  if (!overload && warnings.length === 0) return null;

  return (
    <div
      className={`rounded-2xl border p-4 ${
        overload
          ? "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
          : "border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200"
      }`}
      role="status"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <div className="space-y-2 text-sm leading-relaxed">
          {overload ? (
            <p className="font-semibold">Heads up — this plan may be tight or incomplete.</p>
          ) : null}
          {warnings.length > 0 ? (
            <ul className="list-disc space-y-1 pl-4">
              {warnings.map((w, i) => (
                <li key={`${i}-${w.slice(0, 32)}`}>{w}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
