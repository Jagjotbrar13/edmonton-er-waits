export function waitColor(waitMinutes: number | null): string {
  if (waitMinutes === null) return "#71717a";
  if (waitMinutes < 60) return "#16a34a";
  if (waitMinutes < 120) return "#ca8a04";
  if (waitMinutes < 240) return "#ea580c";
  return "#dc2626";
}

export function formatWait(waitMinutes: number | null): string {
  if (waitMinutes === null) return "No live data";
  const hours = Math.floor(waitMinutes / 60);
  const minutes = waitMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return `${hours}h ${minutes}m`;
}
