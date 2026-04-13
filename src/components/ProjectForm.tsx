"use client";

import { useState, useRef, useEffect } from "react";
import type { Project, PhaseStatus } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useImageUpload } from "@/hooks/useImageUpload";

interface PhaseInput {
  name: string;
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
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase().padEnd(2, "X");
}

const INPUT_CLASS =
  "border border-black/[0.08] rounded-xl px-4 py-3 text-sm text-heading font-medium bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-vodafone-red/15 focus:border-vodafone-red/40 transition-all duration-200 placeholder:text-muted/60";

const FILE_INPUT_CLASS =
  "text-sm text-body file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-bg file:text-vodafone-red hover:file:bg-red-bg-alt";

function buildDefaultPhases(project?: Project): PhaseInput[] {
  if (project?.phases.length) {
    return [...project.phases]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => ({
        name: p.phase,
        start_date: p.start_date ?? "",
        end_date: p.end_date ?? "",
        status: p.status,
      }));
  }
  return [];
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
  const [error, setError] = useState<string | null>(null);

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
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function addPhase() {
    setPhases((prev) => [
      ...prev,
      { name: "", start_date: "", end_date: "", status: "upcoming" },
    ]);
  }

  function removePhase(index: number) {
    setPhases((prev) => prev.filter((_, i) => i !== index));
  }

  function updatePhase(index: number, field: keyof PhaseInput, value: string) {
    setPhases((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
      const currentPhase = activePhase?.name || phases[0]?.name || "";
      const validPhases = phases.filter((p) => p.name.trim());
      const deadline =
        validPhases.length > 0
          ? validPhases[validPhases.length - 1].end_date || null
          : null;

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
        if (error || !data)
          throw error ?? new Error("Failed to create project");
        projectId = data.id;
      }

      const phaseRows = validPhases
        .filter((p) => p.start_date && p.end_date)
        .map((p, i) => ({
          project_id: projectId,
          phase: p.name.trim(),
          start_date: p.start_date,
          end_date: p.end_date,
          status: p.status,
          sort_order: i + 1,
        }));

      if (phaseRows.length > 0) {
        const { error: phaseError } = await supabase
          .from("project_phases")
          .insert(phaseRows);
        if (phaseError) throw phaseError;
      }

      onSaved();
    } catch (err: unknown) {
      const supaErr = err as {
        message?: string;
        details?: string;
        code?: string;
      };
      const message =
        supaErr?.message || supaErr?.details || JSON.stringify(err);
      setError(`Fehler beim Speichern: ${message}`);
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
            {error && (
              <div className="bg-red-bg border border-vodafone-red/20 text-vodafone-red text-sm font-medium px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-heading uppercase tracking-[0.08em]">
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
              <label className="text-xs font-semibold text-heading uppercase tracking-[0.08em]">
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
              <label className="text-xs font-semibold text-heading uppercase tracking-[0.08em]">
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
              <label className="text-xs font-semibold text-heading uppercase tracking-[0.08em]">
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
              <label className="text-xs font-semibold text-heading uppercase tracking-[0.08em]">
                Phasen
              </label>

              {phases.map((phase, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-3 bg-black/[0.02] border border-black/[0.04] rounded-xl relative"
                >
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removePhase(index)}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full text-muted hover:text-vodafone-red hover:bg-red-bg transition-colors text-xs"
                  >
                    ✕
                  </button>

                  {/* Phase name */}
                  <input
                    type="text"
                    value={phase.name}
                    onChange={(e) => updatePhase(index, "name", e.target.value)}
                    placeholder="Name der Phase (z.B. Planung, Research, Analyse...)"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-heading font-semibold focus:outline-none focus:ring-2 focus:ring-vodafone-red/20 focus:border-vodafone-red"
                  />

                  {/* Status + Dates row */}
                  <div className="grid grid-cols-3 gap-2">
                    <p className="text-[10px] text-muted font-medium">Status</p>
                    <p className="text-[10px] text-muted font-medium">Start</p>
                    <p className="text-[10px] text-muted font-medium">Ende</p>
                    <select
                      value={phase.status}
                      onChange={(e) =>
                        updatePhase(index, "status", e.target.value)
                      }
                      className="text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-vodafone-red/20"
                    >
                      <option value="upcoming">Bevorstehend</option>
                      <option value="active">Aktiv</option>
                      <option value="completed">Abgeschlossen</option>
                    </select>
                    <input
                      type="date"
                      value={phase.start_date}
                      onChange={(e) =>
                        updatePhase(index, "start_date", e.target.value)
                      }
                      className="text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-vodafone-red/20"
                    />
                    <input
                      type="date"
                      value={phase.end_date}
                      onChange={(e) =>
                        updatePhase(index, "end_date", e.target.value)
                      }
                      className="text-xs border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-vodafone-red/20"
                    />
                  </div>
                </div>
              ))}

              {/* Add Phase Button */}
              <button
                type="button"
                onClick={addPhase}
                className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-muted hover:text-vodafone-red hover:border-vodafone-red transition-colors"
              >
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">
                  +
                </span>
                Phase hinzufügen
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 sticky bottom-0 bg-white pt-4 pb-2 -mx-8 px-8 border-t border-black/[0.06]">
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
