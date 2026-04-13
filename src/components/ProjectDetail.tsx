"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/lib/types";
import { calculateProgress } from "@/lib/progress";
import { supabase } from "@/lib/supabase";
import { Timeline } from "./Timeline";

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRefetch: () => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export function ProjectDetail({
  project,
  onClose,
  onEdit,
  onDelete,
  onRefetch,
}: ProjectDetailProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const progress = calculateProgress(project.phases);

  const sortedPhases = [...project.phases].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const startDate =
    sortedPhases.length > 0 ? sortedPhases[0].start_date : null;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function addMilestone(phaseId: string, title: string) {
    const maxSort = project.phases
      .flatMap((p) => p.milestones)
      .reduce((max, m) => Math.max(max, m.sort_order), -1);
    const { error } = await supabase.from("milestones").insert({
      phase_id: phaseId,
      title,
      completed: false,
      sort_order: maxSort + 1,
    });
    if (error) {
      alert(`Fehler: ${error.message}`);
      return;
    }
    onRefetch();
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-overlay-in"
    >
      <div className="relative w-full max-w-[720px] mx-4 max-h-[90vh] overflow-y-auto bg-white rounded-[24px] shadow-modal animate-modal-in">
        {/* Cover image */}
        <div className="h-[140px] sm:h-[220px] relative rounded-t-[24px] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {project.cover_image_url ? (
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="w-full h-full object-contain p-6"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-vodafone-red to-red-light" />
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/10 backdrop-blur-lg text-heading text-xs hover:bg-black/20 transition-all duration-200"
        >
          ✕
        </button>

        {/* Body */}
        <div className="p-5 sm:p-8">
          {/* Phase badge */}
          <span className="inline-block bg-red-bg text-vodafone-red px-3.5 py-1 rounded-full text-xs font-semibold mb-3">
            {project.current_phase}
          </span>

          {/* Title */}
          <h2 className="text-[28px] font-bold text-heading tracking-[-0.02em] mb-2">
            {project.title}
          </h2>

          {/* Description */}
          {project.description && (
            <p className="text-sm text-body leading-relaxed mb-6">
              {project.description}
            </p>
          )}

          {/* Metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 pb-7 border-b border-black/[0.05]">
            <div>
              <p className="text-[11px] text-muted font-medium uppercase tracking-[0.08em] mb-1">
                Verantwortlich
              </p>
              <div className="flex items-center gap-2">
                <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-vodafone-red to-red-light flex items-center justify-center text-[10px] text-white font-bold">
                  {project.responsible_initials}
                </div>
                <span className="text-sm text-heading font-medium">
                  {project.responsible_name}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-muted font-medium uppercase tracking-[0.08em] mb-1">
                Start
              </p>
              <p className="text-sm text-heading font-medium">
                {startDate ? formatDate(startDate) : "–"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted font-medium uppercase tracking-[0.08em] mb-1">
                Deadline
              </p>
              <p className="text-sm text-heading font-medium">
                {project.deadline ? formatDate(project.deadline) : "–"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted font-medium uppercase tracking-[0.08em] mb-1">
                Fortschritt
              </p>
              <p className="text-sm text-heading font-medium">{progress}%</p>
            </div>
          </div>

          {/* Timeline */}
          {project.phases.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-heading mb-4">Timeline</h3>
              <Timeline
                phases={project.phases}
                onMilestoneReordered={onRefetch}
                onAddMilestone={addMilestone}
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-black/[0.06]">
            <button
              onClick={onEdit}
              className="flex-1 bg-vodafone-red text-white py-3 rounded-xl text-sm font-bold hover:bg-red-dark transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 1.5l2.5 2.5L4.5 12H2v-2.5L10 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Bearbeiten
            </button>
            <button
              onClick={onDelete}
              className="px-6 bg-black/[0.04] text-body py-3 rounded-xl text-sm font-bold hover:text-vodafone-red hover:bg-red-bg transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M11 3.5l-.5 8a1 1 0 01-1 1h-5a1 1 0 01-1-1l-.5-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
