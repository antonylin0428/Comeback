import { X } from "lucide-react";

export interface BusyBlockDraft {
  title: string;
  start: string;
  end: string;
}

interface Props {
  index: number;
  block: BusyBlockDraft;
  onChange: (index: number, updated: BusyBlockDraft) => void;
  onRemove: (index: number) => void;
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500";

const labelClass = "block text-xs font-medium text-zinc-600 dark:text-zinc-400";

export function BusyBlockInputCard({ index, block, onChange, onRemove }: Props) {
  function update<K extends keyof BusyBlockDraft>(key: K, value: BusyBlockDraft[K]) {
    onChange(index, { ...block, [key]: value });
  }

  return (
    <div className="relative rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
        aria-label="Remove busy block"
      >
        <X className="h-4 w-4" />
      </button>

      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Busy block {index + 1}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Label</label>
          <input
            type="text"
            className={`${inputClass} mt-1`}
            placeholder="e.g. ECON 101 lecture"
            value={block.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Start</label>
          <input
            type="datetime-local"
            className={`${inputClass} mt-1`}
            value={block.start}
            onChange={(e) => update("start", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>End</label>
          <input
            type="datetime-local"
            className={`${inputClass} mt-1`}
            value={block.end}
            onChange={(e) => update("end", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
