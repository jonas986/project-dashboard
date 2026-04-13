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
  phase: string;
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
  current_phase: string;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  phases: Phase[];
}

export type PhaseStatus = "completed" | "active" | "upcoming";
export type DeadlineStatus = "green" | "yellow" | "red";
