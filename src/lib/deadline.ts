import type { DeadlineStatus } from "./types";

export function getDeadlineStatus(deadline: string | null): DeadlineStatus {
  if (!deadline) return "green";

  const now = new Date();
  const deadlineDate = new Date(deadline + "T23:59:59");
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "red";
  if (diffDays <= 7) return "yellow";
  return "green";
}
