"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ProjectDetail } from "@/components/ProjectDetail";
import { ProjectForm } from "@/components/ProjectForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useProjects } from "@/hooks/useProjects";
import type { Project } from "@/lib/types";

export default function Home() {
  const { projects, loading, refetch } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | undefined>(
    undefined,
  );
  const [showForm, setShowForm] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // Always derive from live data
  const selectedProject = selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId) ?? null
    : null;

  function handleCardClick(project: Project) {
    setSelectedProjectId(project.id);
    window.history.pushState(null, "", `/project/${project.id}`);
  }

  function handleClose() {
    setSelectedProjectId(null);
    window.history.pushState(null, "", "/");
  }

  function handleAdd() {
    setEditingProject(undefined);
    setShowForm(true);
  }

  function handleEdit() {
    if (selectedProject) {
      setEditingProject(selectedProject);
      setSelectedProjectId(null);
      setShowForm(true);
    }
  }

  function handleFormSaved() {
    setShowForm(false);
    setEditingProject(undefined);
    refetch();
  }

  return (
    <main className="max-w-[1100px] mx-auto p-4 sm:p-6 lg:p-8">
      <Header projectCount={projects.length} onAddClick={handleAdd} />
      <ProjectGrid
        projects={projects}
        loading={loading}
        onCardClick={handleCardClick}
        onAddClick={handleAdd}
      />
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={handleClose}
          onEdit={handleEdit}
          onDelete={() => {
            setDeletingProject(selectedProject);
            setSelectedProjectId(null);
          }}
          onRefetch={refetch}
        />
      )}
      {deletingProject && (
        <ConfirmDialog
          projectId={deletingProject.id}
          projectTitle={deletingProject.title}
          onClose={() => setDeletingProject(null)}
          onDeleted={() => {
            setDeletingProject(null);
            window.history.pushState(null, "", "/");
            refetch();
          }}
        />
      )}
      {showForm && (
        <ProjectForm
          project={editingProject}
          onClose={() => setShowForm(false)}
          onSaved={handleFormSaved}
        />
      )}
    </main>
  );
}
