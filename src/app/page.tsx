"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { ProjectGrid } from "@/components/ProjectGrid";
import { useProjects } from "@/hooks/useProjects";
import type { Project } from "@/lib/types";

export default function Home() {
  const { projects, loading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <main className="max-w-[1100px] mx-auto p-8">
      <Header projectCount={projects.length} onAddClick={() => {}} />
      <ProjectGrid
        projects={projects}
        loading={loading}
        onCardClick={setSelectedProject}
        onAddClick={() => {}}
      />
    </main>
  );
}
