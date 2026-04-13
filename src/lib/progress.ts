import type { Phase } from "./types";

export function calculateProgress(phases: Phase[]): number {
  if (phases.length === 0) return 0;

  const phaseWeight = 100 / 4;
  let progress = 0;

  for (const phase of phases) {
    if (phase.status === "completed") {
      progress += phaseWeight;
    } else if (phase.status === "active") {
      const total = phase.milestones.length;
      if (total > 0) {
        const completed = phase.milestones.filter((m) => m.completed).length;
        progress += phaseWeight * (completed / total);
      }
    }
  }

  return Math.round(progress);
}
