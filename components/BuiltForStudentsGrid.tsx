"use client";

import { CheckCircle, Clock, Sparkles } from "lucide-react";

import { FeatureHighlightCard } from "@/components/FeatureHighlightCard";

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

export function BuiltForStudentsGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {features.map((f) => (
        <FeatureHighlightCard
          key={f.title}
          icon={f.icon}
          title={f.title}
          description={f.description}
        />
      ))}
    </div>
  );
}
