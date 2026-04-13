"use client";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/lib/supabase";
import type { Milestone, PhaseStatus } from "@/lib/types";

interface MilestoneListProps {
  milestones: Milestone[];
  phaseStatus: PhaseStatus;
  onReordered: () => void;
}

function SortableMilestone({
  milestone,
  phaseStatus,
}: {
  milestone: Milestone;
  phaseStatus: PhaseStatus;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: milestone.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="text-xs mt-1.5 font-semibold cursor-grab active:cursor-grabbing flex items-center gap-1.5"
    >
      <span className="text-muted/40">⠿</span>
      {milestone.completed ? (
        <span className="text-vodafone-red">✓ {milestone.title}</span>
      ) : phaseStatus === "active" ? (
        <span className="text-vodafone-red">→ {milestone.title}</span>
      ) : (
        <span className="text-muted">{milestone.title}</span>
      )}
    </div>
  );
}

export function MilestoneList({
  milestones,
  phaseStatus,
  onReordered,
}: MilestoneListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = milestones.findIndex((m) => m.id === active.id);
    const newIndex = milestones.findIndex((m) => m.id === over.id);
    const reordered = [...milestones];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    for (let i = 0; i < reordered.length; i++) {
      await supabase
        .from("milestones")
        .update({ sort_order: i })
        .eq("id", reordered[i].id);
    }
    onReordered();
  }

  if (milestones.length === 0) return null;
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={milestones.map((m) => m.id)}
        strategy={verticalListSortingStrategy}
      >
        {milestones.map((milestone) => (
          <SortableMilestone
            key={milestone.id}
            milestone={milestone}
            phaseStatus={phaseStatus}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
