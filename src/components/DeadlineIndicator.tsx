import { getDeadlineStatus } from "@/lib/deadline";
import type { DeadlineStatus } from "@/lib/types";

const COLORS: Record<DeadlineStatus, string> = {
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  red: "bg-red-500",
};

interface DeadlineIndicatorProps {
  deadline: string | null;
}

export function DeadlineIndicator({ deadline }: DeadlineIndicatorProps) {
  const status = getDeadlineStatus(deadline);
  return (
    <div
      className={`w-2.5 h-2.5 rounded-full ${COLORS[status]}`}
      title={
        status === "green"
          ? "Im Zeitplan"
          : status === "yellow"
            ? "Bald fällig"
            : "Überfällig"
      }
    />
  );
}
