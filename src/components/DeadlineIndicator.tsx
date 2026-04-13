import { getDeadlineStatus } from "@/lib/deadline";
import type { DeadlineStatus } from "@/lib/types";

const COLORS: Record<DeadlineStatus, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
};
const PILL_COLORS: Record<DeadlineStatus, string> = {
  green: "bg-emerald-50 text-emerald-600 border-emerald-200",
  yellow: "bg-amber-50 text-amber-600 border-amber-200",
  red: "bg-red-50 text-red-600 border-red-200",
};
const LABELS: Record<DeadlineStatus, string> = {
  green: "Im Plan",
  yellow: "Bald fällig",
  red: "Überfällig",
};

interface DeadlineIndicatorProps { deadline: string | null; }

export function DeadlineIndicator({ deadline }: DeadlineIndicatorProps) {
  const status = getDeadlineStatus(deadline);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${PILL_COLORS[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${COLORS[status]}`} />
      {LABELS[status]}
    </span>
  );
}
