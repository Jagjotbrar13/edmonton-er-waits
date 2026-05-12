"use client";

import { WaitHistoryPoint } from "@/lib/api";
import { formatWait } from "@/lib/map";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ChartPoint = {
  time: string;
  wait: number;
};

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function WaitChart({ history }: { history: WaitHistoryPoint[] }) {
  const data: ChartPoint[] = history
    .slice()
    .reverse()
    .map((point) => ({
      time: formatTime(point.scraped_at),
      wait: point.wait_minutes
    }));

  if (data.length < 2) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-500 shadow-sm">
        Run the scraper a few more times to draw the history chart.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="font-semibold">Historical wait trend</h2>
        <p className="text-sm text-slate-500">Latest {data.length} collected snapshots.</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatWait(Number(value))}
              tickLine={false}
              width={64}
            />
            <Tooltip
              formatter={(value) => [formatWait(Number(value)), "Wait"]}
              labelClassName="text-slate-600"
            />
            <Line type="monotone" dataKey="wait" stroke="#e11d48" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
