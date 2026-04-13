"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ProjectDetail } from "@/components/ProjectDetail";
import { ProjectForm } from "@/components/ProjectForm";
import { useProjects } from "@/hooks/useProjects";
import type { Project } from "@/lib/types";

export default function Home() {
  const { projects, loading, refetch } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | undefined>(
    undefined,
  );
  const [showForm, setShowForm] = useState(false);

  function handleCardClick(project: Project) {
    setSelectedProject(project);
    window.history.pushState(null, "", `/project/${project.id}`);
  }

  function handleClose() {
    setSelectedProject(null);
    window.history.pushState(null, "", "/");
  }

  function handleAdd() {
    setEditingProject(undefined);
    setShowForm(true);
  }

  function handleEdit() {
    if (selectedProject) {
      setEditingProject(selectedProject);
      setSelectedProject(null);
      setShowForm(true);
    }
  }

  function handleFormSaved() {
    setShowForm(false);
    setEditingProject(undefined);
    refetch();
  }

  return (
    <main className="max-w-[1100px] mx-auto p-8">
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
          onDelete={() => {}}
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
