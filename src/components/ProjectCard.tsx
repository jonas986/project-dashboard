import type { Project } from "@/lib/types";
import { calculateProgress } from "@/lib/progress";
import { formatRelativeTime } from "@/lib/time";
import { DeadlineIndicator } from "./DeadlineIndicator";
import { ProgressBar } from "./ProgressBar";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const progress = calculateProgress(project.phases);
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[20px] overflow-hidden shadow-card border border-black/[0.04] cursor-pointer transition-all duration-[250ms] ease-[cubic-bezier(.2,.8,.4,1)] hover:-translate-y-1.5 hover:shadow-card-hover"
    >
      <div
        className="h-[170px] bg-cover bg-center relative"
        style={{
          backgroundImage: project.cover_image_url
            ? `url(${project.cover_image_url})`
            : "linear-gradient(135deg, #E60000, #FF3333)",
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/15 to-transparent" />
        <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-sm text-vodafone-red px-3.5 py-1 rounded-full text-xs font-semibold shadow-sm">
          {project.current_phase}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-heading tracking-tight">
            {project.title}
          </h3>
          <DeadlineIndicator deadline={project.deadline} />
        </div>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-vodafone-red to-red-light flex items-center justify-center text-[11px] text-white font-bold shadow-sm shadow-vodafone-red/30">
            {project.responsible_initials}
          </div>
          <span className="text-[13px] text-body-light font-medium">
            {project.responsible_name}
          </span>
        </div>
        <ProgressBar percent={progress} />
        <p className="text-[11px] text-muted mt-3">
          {formatRelativeTime(project.updated_at)}
        </p>
      </div>
    </div>
  );
}
