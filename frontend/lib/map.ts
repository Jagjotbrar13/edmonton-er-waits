export type WaitTone = "slate" | "green" | "yellow" | "orange" | "red";

export function waitColor(waitMinutes: number | null): string {
  if (waitMinutes === null) return "#64748b";
  if (waitMinutes < 60) return "#16a34a";
  if (waitMinutes < 120) return "#ca8a04";
  if (waitMinutes < 240) return "#ea580c";
  return "#dc2626";
}

export function waitTone(waitMinutes: number | null): WaitTone {
  if (waitMinutes === null) return "slate";
  if (waitMinutes < 60) return "green";
  if (waitMinutes < 120) return "yellow";
  if (waitMinutes < 240) return "orange";
  return "red";
}

export function formatWait(waitMinutes: number | null): string {
  if (waitMinutes === null) return "No live data";
  const hours = Math.floor(waitMinutes / 60);
  const minutes = waitMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return `${hours}h ${minutes}m`;
}

export function freshnessStatus(value: string | null): {
  label: string;
  detail: string;
  className: string;
  dotClassName: string;
} {
  if (!value) {
    return {
      label: "No live update yet",
      detail: "Waiting for first scrape",
      className: "bg-slate-100 text-slate-700",
      dotClassName: "bg-slate-400"
    };
  }

  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  const nextUpdate = Math.max(0, 30 - (minutes % 30));
  if (minutes <= 35) {
    return {
      label: formatRelativeUpdate(minutes),
      detail: `Next update in ${nextUpdate} min`,
      className: "bg-emerald-50 text-emerald-700",
      dotClassName: "bg-emerald-500"
    };
  }
  return {
    label: `Data is ${minutes} min old`,
    detail: "Using latest cached snapshot",
    className: "bg-rose-50 text-rose-700",
    dotClassName: "bg-rose-500"
  };
}

function formatRelativeUpdate(minutes: number): string {
  if (minutes < 1) return "Updated just now";
  if (minutes === 1) return "Updated 1 minute ago";
  if (minutes < 60) return `Updated ${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  return hours === 1 ? "Updated 1 hour ago" : `Updated ${hours} hours ago`;
}

export function trendLabel(current: number | null, previous?: number | null): { label: string; symbol: string; className: string } {
  if (current === null || previous === null || previous === undefined) {
    return { label: "Collecting trend", symbol: "→", className: "text-slate-500" };
  }
  const delta = current - previous;
  if (Math.abs(delta) < 15) {
    return { label: "Stable", symbol: "→", className: "text-slate-500" };
  }
  if (delta > 0) {
    return { label: "Worsening", symbol: "↑", className: "text-rose-700" };
  }
  return { label: "Improving", symbol: "↓", className: "text-emerald-700" };
}
