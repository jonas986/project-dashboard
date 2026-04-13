"use client";

import { useState, useRef, useEffect } from "react";
import type { Project, PhaseType, PhaseStatus } from "@/lib/types";
import { PHASE_ORDER, PHASE_LABELS } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useImageUpload } from "@/hooks/useImageUpload";

interface PhaseInput {
  phase: PhaseType;
  start_date: string;
  end_date: string;
  status: PhaseStatus;
}

interface ProjectFormProps {
  project?: Project;
  onClose: () => void;
  onSaved: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const INPUT_CLASS =
  "border border-gray-200 rounded-xl px-4 py-3 text-sm text-heading font-medium focus:outline-none focus:ring-2 focus:ring-vodafone-red/20 focus:border-vodafone-red";

const FILE_INPUT_CLASS =
  "text-sm text-body file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-bg file:text-vodafone-red hover:file:bg-red-bg-alt";

function buildDefaultPhases(project?: Project): PhaseInput[] {
  return PHASE_ORDER.map((phase) => {
    const existing = project?.phases.find((p) => p.phase === phase);
    return {
      phase,
      start_date: existing?.start_date ?? "",
      end_date: existing?.end_date ?? "",
      status: existing?.status ?? "upcoming",
    };
  });
}

export function ProjectForm({ project, onClose, onSaved }: ProjectFormProps) {
  const isEdit = !!project;
  const overlayRef = useRef<HTMLDivElement>(null);
  const { uploadImage, uploading } = useImageUpload();

  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [responsibleName, setResponsibleName] = useState(
    project?.responsible_name ?? "",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    project?.cover_image_url ?? null,
  );
  const [phases, setPhases] = useState<PhaseInput[]>(
    buildDefaultPhases(project),
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  }

  function updatePhase(
    index: number,
    field: keyof PhaseInput,
    value: string,
  ) {
    setPhases((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      let coverImageUrl = project?.cover_image_url ?? null;
      if (imageFile) {
        const uploaded = await uploadImage(imageFile);
        if (uploaded) {
          coverImageUrl = uploaded;
        }
      }

      const activePhase = phases.find((p) => p.status === "active");
      const currentPhase = activePhase?.phase ?? phases[0].phase;
      const deadline =
        phases.length > 0 ? phases[phases.length - 1].end_date || null : null;

      const projectData = {
        title,
        description,
        responsible_name: responsibleName,
        responsible_initials: getInitials(responsibleName),
        cover_image_url: coverImageUrl,
        current_phase: currentPhase,
        deadline,
      };

      let projectId: string;

      if (isEdit) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", project.id);
        if (error) throw error;
        projectId = project.id;

        const { error: deleteError } = await supabase
          .from("project_phases")
          .delete()
          .eq("project_id", project.id);
        if (deleteError) throw deleteError;
      } else {
        const { data, error } = await supabase
          .from("projects")
          .insert(projectData)
          .select("id")
          .single();
        if (error || !data) throw error ?? new Error("Failed to create project");
        projectId = data.id;
      }

      const phaseRows = phases.map((p, i) => ({
        project_id: projectId,
        phase: p.phase,
        start_date: p.start_date || null,
        end_date: p.end_date || null,
        status: p.status,
        sort_order: i,
      }));

      const { error: phaseError } = await supabase
        .from("project_phases")
        .insert(phaseRows);
      if (phaseError) throw phaseError;

      onSaved();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Fehler beim Speichern: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-overlay-in"
    >
      <div className="relative w-full max-w-[640px] mx-4 max-h-[90vh] overflow-y-auto bg-white rounded-[24px] shadow-modal animate-modal-in">
        <div className="p-8">
          <h2 className="text-[22px] font-extrabold text-heading tracking-tight mb-6">
            {isEdit ? "Projekt bearbeiten" : "Neues Projekt"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-heading uppercase tracking-wide">
                Titel
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Projekttitel eingeben"
                className={INPUT_CLASS}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-heading uppercase tracking-wide">
                Beschreibung
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kurze Beschreibung des Projekts"
                className={INPUT_CLASS + " resize-none"}
              />
            </div>

            {/* Responsible Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-heading uppercase tracking-wide">
                Verantwortlich
              </label>
              <input
                type="text"
                required
                value={responsibleName}
                onChange={(e) => setResponsibleName(e.target.value)}
                placeholder="Name der verantwortlichen Person"
                className={INPUT_CLASS}
              />
            </div>

            {/* Cover Image */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-heading uppercase tracking-wide">
                Titelbild
              </label>
              {imagePreview && (
                <div className="w-full h-[140px] rounded-xl overflow-hidden mb-1">
                  <img
                    src={imagePreview}
                    alt="Vorschau"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={FILE_INPUT_CLASS}
              />
            </div>

            {/* Phases */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-heading uppercase tracking-wide">
                Phasen
              </label>
              {phases.map((phase, index) => (
                <div
                  key={phase.phase}
                  className="grid grid-cols-[100px_1fr_1fr_1fr] gap-3 items-center"
                >
                  <span className="text-sm font-bold text-heading">
                    {PHASE_LABELS[phase.phase]}
                  </span>
                  <select
                    value={phase.status}
                    onChange={(e) =>
                      updatePhase(index, "status", e.target.value)
                    }
                    className={INPUT_CLASS}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                  <input
                    type="date"
                    value={phase.start_date}
                    onChange={(e) =>
                      updatePhase(index, "start_date", e.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                  <input
                    type="date"
                    value={phase.end_date}
                    onChange={(e) =>
                      updatePhase(index, "end_date", e.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-black/[0.06]">
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 bg-vodafone-red text-white py-3 rounded-xl text-sm font-bold hover:bg-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving || uploading
                  ? "Speichern..."
                  : isEdit
                    ? "Speichern"
                    : "Erstellen"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-black/[0.04] text-body py-3 rounded-xl text-sm font-bold hover:bg-black/[0.08] transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
