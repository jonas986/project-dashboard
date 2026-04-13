export interface Milestone {
  id: string;
  phase_id: string;
  title: string;
  completed: boolean;
  sort_order: number;
}

export interface Phase {
  id: string;
  project_id: string;
  phase: PhaseType;
  start_date: string;
  end_date: string;
  status: PhaseStatus;
  sort_order: number;
  milestones: Milestone[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  responsible_name: string;
  responsible_initials: string;
  cover_image_url: string | null;
  current_phase: PhaseType;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  phases: Phase[];
}

export type PhaseType = "planung" | "research" | "analyse" | "abschluss";
export type PhaseStatus = "completed" | "active" | "upcoming";
export type DeadlineStatus = "green" | "yellow" | "red";

export const PHASE_ORDER: PhaseType[] = [
  "planung",
  "research",
  "analyse",
  "abschluss",
];
export const PHASE_LABELS: Record<PhaseType, string> = {
  planung: "Planung",
  research: "Research",
  analyse: "Analyse",
  abschluss: "Abschluss",
};
