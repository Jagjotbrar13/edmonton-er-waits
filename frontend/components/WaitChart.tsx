"use client";

import type { WaitHistoryPoint } from "@/lib/types";
import { formatWait } from "@/lib/map";
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ChartPoint = {
  time: string;
  wait: number | null;
  forecast: number | null;
};

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function WaitChart({ history }: { history: WaitHistoryPoint[] }) {
  const historical: ChartPoint[] = history
    .slice()
    .reverse()
    .map((point) => ({
      time: formatTime(point.scraped_at),
      wait: point.wait_minutes,
      forecast: null
    }));
  const last = historical.at(-1);
  const previous = historical.at(-2);
  const slope = last?.wait !== null && previous?.wait !== null && last?.wait !== undefined && previous?.wait !== undefined
    ? Math.max(-45, Math.min(45, last.wait - previous.wait))
    : 0;
  const forecast: ChartPoint[] = last
    ? [
        { time: "+30m", wait: null, forecast: Math.max(0, Number(last.wait) + slope) },
        { time: "+1h", wait: null, forecast: Math.max(0, Number(last.wait) + slope * 2) },
        { time: "+2h", wait: null, forecast: Math.max(0, Number(last.wait) + slope * 4) }
      ]
    : [];
  const data = last ? [...historical.slice(0, -1), { ...last, forecast: last.wait }, ...forecast] : historical;

  if (data.length < 2) {
    return (
      <div className="flex h-72 items-center justify-center rounded-3xl bg-white text-sm text-slate-500 shadow-sm">
        Run the scraper a few more times to draw the history chart.
      </div>
    );
  }

  return (
    <div className="soft-panel rounded-3xl p-5">
      <div className="mb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold tracking-[-0.015em]">Historical wait trend + forecast preview</h2>
            <p className="text-sm text-slate-500">Solid line is collected history. Dashed line is a baseline forecast preview.</p>
          </div>
          <div className="hidden gap-3 text-xs text-slate-500 sm:flex">
            <span className="flex items-center gap-2"><span className="h-0.5 w-6 rounded bg-rose-600" /> History</span>
            <span className="flex items-center gap-2"><span className="h-0.5 w-6 rounded border-t-2 border-dashed border-sky-500" /> Forecast</span>
          </div>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
            <defs>
              <linearGradient id="waitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e8edf3" strokeDasharray="3 6" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(value) => formatWait(Number(value))}
              tickLine={false}
              axisLine={false}
              width={64}
            />
            <Tooltip
              formatter={(value, name) => [formatWait(Number(value)), name === "forecast" ? "Forecast" : "Wait"]}
              contentStyle={{ border: "none", borderRadius: 16, boxShadow: "0 18px 40px rgba(15,23,42,0.12)" }}
              labelClassName="text-slate-700"
            />
            <Area type="monotone" dataKey="wait" fill="url(#waitGradient)" stroke="none" isAnimationActive />
            <Line type="monotone" dataKey="wait" stroke="#e11d48" strokeWidth={3} dot={false} isAnimationActive />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#0284c7"
              strokeWidth={2.5}
              strokeDasharray="6 8"
              dot={false}
              isAnimationActive
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
