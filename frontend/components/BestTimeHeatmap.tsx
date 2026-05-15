import { Fragment } from "react";

import type { BestTimeCell } from "@/lib/types";
import { formatWait } from "@/lib/map";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = [0, 4, 8, 12, 16, 20];

function cellClass(wait: number | null): string {
  if (wait === null) return "bg-slate-100 text-slate-400";
  if (wait < 60) return "bg-emerald-100 text-emerald-900";
  if (wait < 120) return "bg-yellow-100 text-yellow-900";
  if (wait < 240) return "bg-orange-100 text-orange-950";
  return "bg-rose-100 text-rose-950";
}

function sourceLabel(source?: BestTimeCell["source"]): string {
  if (source === "exact") return "Exact bucket average";
  if (source === "hour_fallback") return "Estimated from this hour across collected days";
  if (source === "overall_fallback") return "Estimated from hospital average";
  if (source === "no_data") return "No samples collected for this day yet";
  return "No samples yet";
}

export function BestTimeHeatmap({ cells }: { cells: BestTimeCell[] }) {
  const byBucket = new Map(cells.map((cell) => [`${cell.day_index}-${cell.hour_bucket}`, cell]));

  return (
    <div className="soft-panel rounded-3xl p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold tracking-[-0.015em]">Best Time To Go</h2>
          <p className="mt-1 text-sm text-slate-500">Based on average waits collected for each 4-hour bucket.</p>
        </div>
        <div className="hidden gap-2 text-xs text-slate-500 sm:flex">
          <span className="rounded-full bg-emerald-100 px-2.5 py-1">under 1h</span>
          <span className="rounded-full bg-yellow-100 px-2.5 py-1">1-2h</span>
          <span className="rounded-full bg-orange-100 px-2.5 py-1">2-4h</span>
          <span className="rounded-full bg-rose-100 px-2.5 py-1">4h+</span>
        </div>
      </div>
      <div className="grid grid-cols-[64px_repeat(6,1fr)] gap-2 text-sm">
        <span />
        {hours.map((hour) => (
          <span key={hour} className="text-slate-500">{hour}:00</span>
        ))}
        {days.map((day) => (
          <Fragment key={day}>
            <span className="flex h-10 items-center text-slate-500">{day}</span>
            {hours.map((hour) => {
              const cell = byBucket.get(`${days.indexOf(day)}-${hour}`);
              const wait = cell?.average_wait ?? null;
              return (
                <span
                  key={`${day}-${hour}`}
                  className={`flex h-10 items-center justify-center rounded-lg text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-md ${cellClass(wait)} ${
                    cell?.source && cell.source !== "exact" ? "opacity-75" : ""
                  }`}
                  title={cell ? `${formatWait(wait)} from ${cell.samples} samples. ${sourceLabel(cell.source)}.` : "No samples yet"}
                >
                  {wait === null ? "-" : formatWait(wait)}
                </span>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
