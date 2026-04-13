"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Project, Phase, Milestone } from "@/lib/types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    const { data: projectRows } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: true });

    if (!projectRows) return;

    const { data: phaseRows } = await supabase
      .from("project_phases")
      .select("*")
      .order("sort_order", { ascending: true });

    const { data: milestoneRows } = await supabase
      .from("milestones")
      .select("*")
      .order("sort_order", { ascending: true });

    const phases = (phaseRows ?? []) as Phase[];
    const milestones = (milestoneRows ?? []) as Milestone[];

    const assembled: Project[] = projectRows.map((p) => ({
      ...p,
      phases: phases
        .filter((ph) => ph.project_id === p.id)
        .map((ph) => ({
          ...ph,
          milestones: milestones.filter((m) => m.phase_id === ph.id),
        })),
    }));

    setProjects(assembled);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();

    const channel = supabase
      .channel("realtime-projects")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => fetchProjects(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_phases" },
        () => fetchProjects(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "milestones" },
        () => fetchProjects(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProjects]);

  return { projects, loading, refetch: fetchProjects };
}
