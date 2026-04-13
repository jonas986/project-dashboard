"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface ConfirmDialogProps {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
  onDeleted: () => void;
}

export function ConfirmDialog({
  projectId,
  projectTitle,
  onClose,
  onDeleted,
}: ConfirmDialogProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await supabase.from("projects").delete().eq("id", projectId);
    setDeleting(false);
    onDeleted();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-8 animate-overlay-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] max-w-[400px] w-full shadow-modal animate-modal-in p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-full bg-red-bg flex items-center justify-center mx-auto mb-4 text-2xl">
          🗑️
        </div>
        <h3 className="text-lg font-bold text-heading mb-2">
          Projekt löschen?
        </h3>
        <p className="text-sm text-body mb-6">
          &ldquo;{projectTitle}&rdquo; wird unwiderruflich gelöscht.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-vodafone-red text-white px-6 py-2.5 rounded-full text-sm font-bold hover:-translate-y-0.5 transition-all shadow-md disabled:opacity-50"
          >
            {deleting ? "Löschen..." : "Ja, löschen"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
