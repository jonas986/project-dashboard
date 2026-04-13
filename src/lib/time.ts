export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Gerade eben";
  if (diffMinutes === 1) return "Vor 1 Minute";
  if (diffMinutes < 60) return `Vor ${diffMinutes} Minuten`;
  if (diffHours === 1) return "Vor 1 Stunde";
  if (diffHours < 24) return `Vor ${diffHours} Stunden`;
  if (diffDays === 1) return "Vor 1 Tag";
  if (diffDays < 7) return `Vor ${diffDays} Tagen`;

  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
