"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ProjectDetail } from "@/components/ProjectDetail";
import { ProjectForm } from "@/components/ProjectForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useProjects } from "@/hooks/useProjects";
import type { Project } from "@/lib/types";

export default function ProjectDeepLink() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { projects, loading, refetch } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | undefined>(
    undefined,
  );
  const [showForm, setShowForm] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!loading && projects.length > 0 && params.id) {
      const found = projects.find((p) => p.id === params.id);
      if (found) {
        setSelectedProject(found);
      }
    }
  }, [loading, projects, params.id]);

  function handleClose() {
    setSelectedProject(null);
    router.push("/");
  }

  function handleCardClick(project: Project) {
    setSelectedProject(project);
    window.history.pushState(null, "", `/project/${project.id}`);
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
          onDelete={() => {
            setDeletingProject(selectedProject);
            setSelectedProject(null);
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
            router.push("/");
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
