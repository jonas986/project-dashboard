import { describe, it, expect } from "vitest";
import { calculateProgress } from "../lib/progress";
import type { Phase } from "../lib/types";

function makePhase(
  overrides: Partial<Phase> & Pick<Phase, "status">
): Phase {
  return {
    id: "p1",
    project_id: "proj1",
    phase: "planung",
    start_date: "2026-01-01",
    end_date: "2026-03-01",
    sort_order: 0,
    milestones: [],
    ...overrides,
  };
}

describe("calculateProgress", () => {
  it("returns 0 for all upcoming phases", () => {
    const phases: Phase[] = [
      makePhase({ status: "upcoming" }),
      makePhase({ status: "upcoming" }),
      makePhase({ status: "upcoming" }),
      makePhase({ status: "upcoming" }),
    ];
    expect(calculateProgress(phases)).toBe(0);
  });

  it("returns 100 for all completed phases", () => {
    const phases: Phase[] = [
      makePhase({ status: "completed" }),
      makePhase({ status: "completed" }),
      makePhase({ status: "completed" }),
      makePhase({ status: "completed" }),
    ];
    expect(calculateProgress(phases)).toBe(100);
  });

  it("returns 50 for 2 completed, 2 upcoming", () => {
    const phases: Phase[] = [
      makePhase({ status: "completed" }),
      makePhase({ status: "completed" }),
      makePhase({ status: "upcoming" }),
      makePhase({ status: "upcoming" }),
    ];
    expect(calculateProgress(phases)).toBe(50);
  });

  it("calculates active phase progress from milestones", () => {
    const phases: Phase[] = [
      makePhase({ status: "completed" }),
      makePhase({ status: "completed" }),
      makePhase({
        status: "active",
        milestones: [
          { id: "m1", phase_id: "p1", title: "M1", completed: true, sort_order: 0 },
          { id: "m2", phase_id: "p1", title: "M2", completed: true, sort_order: 1 },
          { id: "m3", phase_id: "p1", title: "M3", completed: false, sort_order: 2 },
          { id: "m4", phase_id: "p1", title: "M4", completed: false, sort_order: 3 },
        ],
      }),
      makePhase({ status: "upcoming" }),
    ];
    // 2 completed phases = 50, active with 2/4 milestones = 12.5, total = 62.5 => 63
    expect(calculateProgress(phases)).toBe(63);
  });

  it("active phase with no milestones contributes 0%", () => {
    const phases: Phase[] = [
      makePhase({ status: "completed" }),
      makePhase({ status: "active", milestones: [] }),
      makePhase({ status: "upcoming" }),
      makePhase({ status: "upcoming" }),
    ];
    // 1 completed = 25, active with no milestones = 0
    expect(calculateProgress(phases)).toBe(25);
  });

  it("returns 0 for empty phases array", () => {
    expect(calculateProgress([])).toBe(0);
  });
});
