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
  onToggle,
  onDelete,
}: {
  milestone: Milestone;
  phaseStatus: PhaseStatus;
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: milestone.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="text-xs mt-1.5 font-semibold flex items-center gap-1.5 group"
    >
      {/* Drag handle */}
      <span
        {...attributes}
        {...listeners}
        className="text-muted/40 cursor-grab active:cursor-grabbing select-none"
      >
        ⠿
      </span>

      {/* Milestone text (clickable to toggle) */}
      {milestone.completed ? (
        <span
          className="text-vodafone-red cursor-pointer flex-1"
          onClick={() => onToggle(milestone.id, milestone.completed)}
        >
          ✓ {milestone.title}
        </span>
      ) : phaseStatus === "active" ? (
        <span
          className="text-vodafone-red cursor-pointer flex-1"
          onClick={() => onToggle(milestone.id, milestone.completed)}
        >
          → {milestone.title}
        </span>
      ) : (
        <span
          className="text-muted cursor-pointer flex-1"
          onClick={() => onToggle(milestone.id, milestone.completed)}
        >
          {milestone.title}
        </span>
      )}

      {/* Delete button */}
      <button
        type="button"
        onClick={() => onDelete(milestone.id)}
        className="sm:opacity-0 opacity-60 sm:group-hover:opacity-100 transition-opacity text-muted hover:text-vodafone-red text-[10px] w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-bg"
      >
        ✕
      </button>
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

  async function toggleMilestone(id: string, current: boolean) {
    await supabase
      .from("milestones")
      .update({ completed: !current })
      .eq("id", id);
    onReordered();
  }

  async function deleteMilestone(id: string) {
    await supabase.from("milestones").delete().eq("id", id);
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
            onToggle={toggleMilestone}
            onDelete={deleteMilestone}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
