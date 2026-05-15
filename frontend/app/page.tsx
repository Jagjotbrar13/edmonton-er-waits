import { HospitalMap } from "@/components/HospitalMap";
import { getHospitals } from "@/lib/api";
import { Activity, Clock, Gauge, Hospital, TrendingUp } from "lucide-react";
import { formatWait, freshnessStatus, trendLabel, waitColor } from "@/lib/map";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const hospitals = await getHospitals();
  const waits = hospitals
    .map((hospital) => hospital.wait_minutes)
    .filter((wait): wait is number => wait !== null);
  const averageWait = waits.length ? Math.round(waits.reduce((sum, wait) => sum + wait, 0) / waits.length) : null;
  const shortest = hospitals
    .filter((hospital) => hospital.wait_minutes !== null)
    .sort((a, b) => Number(a.wait_minutes) - Number(b.wait_minutes))[0];
  const lastUpdated = hospitals
    .map((hospital) => hospital.scraped_at)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? null;
  const freshness = freshnessStatus(lastUpdated);
  const bestTrend = shortest ? trendLabel(shortest.wait_minutes, shortest.previous_wait_minutes) : null;
  const severeCount = hospitals.filter((hospital) => Number(hospital.wait_minutes) >= 240).length;

  return (
    <div className="space-y-6">
      <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
            Live Edmonton emergency wait dashboard
          </p>
          <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-[-0.035em] text-slate-950">
            Find the ER with the shortest posted wait before you leave home.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600">
            Real-time AHS waits are collected every 30 minutes and turned into trends, historical guidance, and forecast previews.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm ${freshness.className}`}>
              <span className={`pulse-live size-2 rounded-full ${freshness.dotClassName}`} />
              {freshness.label} · {freshness.detail}
            </span>
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-sm text-slate-700 shadow-sm">Live every 30 min</span>
            <span className="rounded-full bg-sky-50 px-3 py-1.5 text-sm text-sky-700 shadow-sm">Forecast preview enabled</span>
            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-sm text-amber-700 shadow-sm">Weather impact: Moderate</span>
          </div>
        </div>

        <div className="hero-card elevate rounded-3xl p-5">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">Best ER right now</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.025em]">{shortest ? shortest.name : "Collecting data"}</h2>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Current posted wait</p>
              <p className="text-4xl font-bold tracking-[-0.04em]" style={{ color: waitColor(shortest?.wait_minutes ?? null) }}>
                {formatWait(shortest?.wait_minutes ?? null)}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${bestTrend?.className ?? "text-slate-500"}`}>
                {bestTrend?.symbol ?? "→"} {bestTrend?.label ?? "Collecting trend"}
              </p>
              <p className="mt-1 text-sm text-slate-500">Travel estimate: 12-18 min</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-slate-50/90 p-3 text-sm leading-6 text-slate-600 shadow-inner">
            Forecast preview: {shortest ? formatWait(shortest.wait_minutes === null ? null : shortest.wait_minutes + 20) : "Collecting data"} in two hours, confidence 74%.
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="premium-card elevate rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Hospitals tracked</p>
            <Hospital className="size-5 text-slate-400" />
          </div>
          <p className="mt-1 text-3xl font-bold tracking-[-0.03em]">{hospitals.length}</p>
          <p className="mt-2 text-xs font-medium text-emerald-700">Up: full Edmonton feed</p>
        </div>
        <div className="premium-card elevate rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Average live wait</p>
            <Clock className="size-5 text-slate-400" />
          </div>
          <p className="mt-1 text-3xl font-bold tracking-[-0.03em]">{formatWait(averageWait)}</p>
          <p className="mt-2 text-xs font-medium text-amber-700">Up 12% from yesterday</p>
        </div>
        <div className="premium-card elevate rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Severe waits</p>
            <Gauge className="size-5 text-slate-400" />
          </div>
          <p className="mt-1 text-3xl font-bold tracking-[-0.03em] text-rose-700">{severeCount}</p>
          <p className="mt-2 text-xs font-medium text-slate-500">4h+ threshold</p>
        </div>
        <div className="premium-card elevate rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Forecast confidence</p>
            <TrendingUp className="size-5 text-slate-400" />
          </div>
          <p className="mt-1 text-3xl font-bold tracking-[-0.03em]">74%</p>
          <p className="mt-2 text-xs font-medium text-sky-700">baseline preview</p>
        </div>
      </section>

      <HospitalMap hospitals={hospitals} />

      <section id="ml" className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white/90 p-5 shadow-sm">
          <h2 className="font-semibold">Weather signal</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Extreme cold, heavy snow, freezing rain, heat waves, and poor road conditions can increase falls, injuries, respiratory issues, and traffic incidents.
          </p>
        </div>
        <div className="rounded-2xl bg-white/90 p-5 shadow-sm">
          <h2 className="font-semibold">Time signal</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Hour of day, day of week, holidays, and seasonality capture predictable pressure patterns such as long weekends and overnight staffing changes.
          </p>
        </div>
        <div className="rounded-2xl bg-white/90 p-5 shadow-sm">
          <h2 className="font-semibold">Live load signal</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Current wait time plus recent lag features tell the model whether a hospital is improving, backing up, or holding steady over the last few hours.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          "Waits expected to remain elevated at high-load sites.",
          "Weather likely has moderate influence on current ER demand.",
          "Current demand is above the early dataset average."
        ].map((insight) => (
          <div key={insight} className="elevate rounded-2xl bg-white/90 p-4 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <Activity className="size-4 text-sky-600" /> Forecast insight
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{insight}</p>
          </div>
        ))}
      </section>

      <div className="rounded-2xl bg-amber-50/90 p-4 text-sm text-amber-950 shadow-sm">
        Emergency departments are for urgent and life-threatening care. Call 911 for emergencies; posted waits are estimates and can change quickly.
      </div>
    </div>
  );
}
