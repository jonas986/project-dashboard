"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ProjectDetail } from "@/components/ProjectDetail";
import { useProjects } from "@/hooks/useProjects";
import type { Project } from "@/lib/types";

export default function ProjectDeepLink() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { projects, loading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  return (
    <main className="max-w-[1100px] mx-auto p-8">
      <Header projectCount={projects.length} onAddClick={() => {}} />
      <ProjectGrid
        projects={projects}
        loading={loading}
        onCardClick={handleCardClick}
        onAddClick={() => {}}
      />
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={handleClose}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      )}
    </main>
  );
}
