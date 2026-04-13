import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectCardSkeleton } from "./ProjectCardSkeleton";
import { AddProjectCard } from "./AddProjectCard";

interface ProjectGridProps {
  projects: Project[];
  loading: boolean;
  onCardClick: (project: Project) => void;
  onAddClick: () => void;
}

export function ProjectGrid({
  projects,
  loading,
  onCardClick,
  onAddClick,
}: ProjectGridProps) {
  if (!loading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold text-heading mb-2">
          Noch keine Projekte
        </h2>
        <p className="text-sm text-muted mb-8">
          Erstelle dein erstes Projekt
        </p>
        <AddProjectCard onClick={onAddClick} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-6">
      {loading ? (
        <>
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </>
      ) : (
        <>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onCardClick(project)}
            />
          ))}
          <AddProjectCard onClick={onAddClick} />
        </>
      )}
    </div>
  );
}
