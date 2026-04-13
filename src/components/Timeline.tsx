"use client";

import type { Phase } from "@/lib/types";
import { PHASE_LABELS } from "@/lib/types";

interface TimelineProps {
  phases: Phase[];
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const sDay = String(s.getDate()).padStart(2, "0");
  const sMonth = String(s.getMonth() + 1).padStart(2, "0");
  const eDay = String(e.getDate()).padStart(2, "0");
  const eMonth = String(e.getMonth() + 1).padStart(2, "0");
  const eYear = e.getFullYear();
  return `${sDay}.${sMonth}. – ${eDay}.${eMonth}.${eYear}`;
}

export function Timeline({ phases }: TimelineProps) {
  const sorted = [...phases].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="relative pl-8">
      {/* Vertical gradient line */}
      <div
        className="absolute left-[11px] top-2 bottom-2 w-[2px]"
        style={{
          background: "linear-gradient(to bottom, #E60000, #FF4D4D)",
        }}
      />

      <div className="flex flex-col gap-6">
        {sorted.map((phase) => (
          <div key={phase.id} className="relative">
            {/* Dot */}
            {phase.status === "completed" ? (
              <div className="absolute -left-8 top-0.5 w-[22px] h-[22px] rounded-full bg-vodafone-red shadow-[0_0_0_4px_rgba(230,0,0,0.15)]" />
            ) : phase.status === "active" ? (
              <div className="absolute -left-8 top-0.5 w-[22px] h-[22px] rounded-full border-2 border-vodafone-red bg-white animate-dot-pulse" />
            ) : (
              <div className="absolute -left-8 top-0.5 w-[22px] h-[22px] rounded-full border-2 border-black/10 bg-white" />
            )}

            {/* Phase content */}
            <div>
              <p
                className={`text-sm font-semibold ${
                  phase.status === "upcoming"
                    ? "text-muted"
                    : "text-heading"
                }`}
              >
                {PHASE_LABELS[phase.phase]}
              </p>
              <p className="text-xs text-muted mt-0.5">
                {formatDateRange(phase.start_date, phase.end_date)}
              </p>

              {/* Milestones */}
              {phase.milestones.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1">
                  {phase.milestones.map((m) => {
                    if (phase.status === "completed" || m.completed) {
                      return (
                        <li
                          key={m.id}
                          className="text-xs text-vodafone-red font-medium"
                        >
                          ✓ {m.title}
                        </li>
                      );
                    }
                    if (phase.status === "active") {
                      return (
                        <li
                          key={m.id}
                          className="text-xs text-vodafone-red font-medium"
                        >
                          → {m.title}
                        </li>
                      );
                    }
                    return (
                      <li key={m.id} className="text-xs text-muted">
                        {m.title}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
