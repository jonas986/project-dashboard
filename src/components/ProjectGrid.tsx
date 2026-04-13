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
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
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
