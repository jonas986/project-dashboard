"use client";

import { useState } from "react";
import type { Phase } from "@/lib/types";
import { MilestoneList } from "./MilestoneList";

interface TimelineProps {
  phases: Phase[];
  onMilestoneReordered: () => void;
  onAddMilestone: (phaseId: string, title: string) => void;
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

function MilestoneInput({
  phaseId,
  onAdd,
}: {
  phaseId: string;
  onAdd: (phaseId: string, title: string) => void;
}) {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit() {
    if (value.trim()) {
      onAdd(phaseId, value.trim());
      setValue("");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setValue("");
      setIsOpen(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-2 flex items-center gap-1 text-xs text-muted hover:text-vodafone-red transition-colors cursor-pointer"
      >
        <span className="w-4 h-4 rounded-full border border-dashed border-current flex items-center justify-center text-[10px]">+</span>
        <span>Meilenstein hinzufügen</span>
      </button>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <input
        type="text"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Meilenstein eingeben..."
        className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white outline-none focus:ring-2 focus:ring-vodafone-red/20 focus:border-vodafone-red placeholder:text-muted/50"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="text-xs bg-vodafone-red text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-dark transition-colors disabled:opacity-30"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => { setValue(""); setIsOpen(false); }}
        className="text-xs text-muted hover:text-heading transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

export function Timeline({
  phases,
  onMilestoneReordered,
  onAddMilestone,
}: TimelineProps) {
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
                {phase.phase}
              </p>
              <p className="text-xs text-muted mt-0.5">
                {formatDateRange(phase.start_date, phase.end_date)}
              </p>

              {/* Milestones */}
              <MilestoneList
                milestones={phase.milestones}
                phaseStatus={phase.status}
                onReordered={onMilestoneReordered}
              />
              <MilestoneInput phaseId={phase.id} onAdd={onAddMilestone} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
