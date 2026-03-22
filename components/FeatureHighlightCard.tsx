"use client";

import type { LucideIcon } from "lucide-react";

import { GlowingEffect } from "./ui/glowing-effect";

type FeatureHighlightCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function FeatureHighlightCard({ icon: Icon, title, description }: FeatureHighlightCardProps) {
  return (
    <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* inactiveZone default 0.7 hides the glow for most of the card (center “dead zone”). Keep it ~0 so the border lights when the cursor is over the card. */}
      <GlowingEffect
        disabled={false}
        inactiveZone={0}
        proximity={64}
        spread={50}
        borderWidth={3}
        movementDuration={1.5}
        className="z-0"
      />
      <div className="relative z-10 flex flex-col">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
    </div>
  );
}
