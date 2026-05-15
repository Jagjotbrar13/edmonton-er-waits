"use client";

import type { Hospital } from "@/lib/types";
import { Sparkline } from "@/components/Sparkline";
import { formatWait, trendLabel, waitColor, waitTone } from "@/lib/map";
import type { WaitTone } from "@/lib/map";

const toneClasses: Record<WaitTone, string> = {
  slate: "border-l-slate-400",
  green: "border-l-emerald-500",
  yellow: "border-l-yellow-500",
  orange: "border-l-orange-500",
  red: "border-l-rose-600"
};

export function HospitalMap({ hospitals }: { hospitals: Hospital[] }) {
  return (
    <section className="soft-panel rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Current posted waits</h2>
          <p className="text-sm text-slate-500">Updated when the scraper stores a new AHS snapshot.</p>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 shadow-sm">
          <span className="pulse-live size-2 rounded-full bg-emerald-500" />
          LIVE
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {hospitals.map((hospital) => {
          const trend = trendLabel(hospital.wait_minutes, hospital.previous_wait_minutes);
          const tone = waitTone(hospital.wait_minutes);

          return (
            <a
              key={hospital.id}
              href={`/hospital/${hospital.id}`}
              className={`group rounded-2xl border-l-4 bg-white/92 p-3.5 shadow-[0_8px_22px_rgba(15,23,42,0.055)] transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_rgba(15,23,42,0.105)] ${toneClasses[tone]}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="size-3 rounded-full"
                      style={{ backgroundColor: waitColor(hospital.wait_minutes) }}
                    />
                    <h3 className="font-semibold text-slate-950">{hospital.name}</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">AHS posted wait estimate</p>
                </div>
                <div className="text-right">
                  <strong className="whitespace-nowrap text-3xl font-bold tracking-[-0.035em]">{formatWait(hospital.wait_minutes)}</strong>
                  <p className={`mt-1 text-sm font-semibold ${trend.className}`}>{trend.symbol} {trend.label}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <Sparkline values={hospital.recent_waits ?? []} color={waitColor(hospital.wait_minutes)} />
                </div>
                <p className="whitespace-nowrap text-xs text-slate-400">
                  12-point trend
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
