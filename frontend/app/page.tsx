import { HospitalMap } from "@/components/HospitalMap";
import { getHospitals } from "@/lib/api";
import { formatWait } from "@/lib/map";

export default async function HomePage() {
  const hospitals = await getHospitals();
  const waits = hospitals
    .map((hospital) => hospital.wait_minutes)
    .filter((wait): wait is number => wait !== null);
  const averageWait = waits.length ? Math.round(waits.reduce((sum, wait) => sum + wait, 0) / waits.length) : null;
  const shortest = hospitals
    .filter((hospital) => hospital.wait_minutes !== null)
    .sort((a, b) => Number(a.wait_minutes) - Number(b.wait_minutes))[0];

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-rose-700">Live Edmonton emergency wait dashboard</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-slate-950">
            Find the ER with the shortest posted wait before you leave home.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Current AHS wait times are being collected into a historical dataset. Predictions, trends, and best-time guidance become stronger as snapshots accumulate.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Hospitals tracked</p>
            <p className="mt-1 text-3xl font-semibold">{hospitals.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Average live wait</p>
            <p className="mt-1 text-3xl font-semibold">{formatWait(averageWait)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Shortest posted wait</p>
            <p className="mt-1 text-lg font-semibold">{shortest ? shortest.name : "Collecting data"}</p>
            <p className="text-sm text-slate-500">{shortest ? formatWait(shortest.wait_minutes) : ""}</p>
          </div>
        </div>
      </section>

      <HospitalMap hospitals={hospitals} />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Weather signal</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Extreme cold, heavy snow, freezing rain, heat waves, and poor road conditions can increase falls, injuries, respiratory issues, and traffic incidents.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Time signal</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Hour of day, day of week, holidays, and seasonality capture predictable pressure patterns such as long weekends and overnight staffing changes.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Live load signal</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Current wait time plus recent lag features tell the model whether a hospital is improving, backing up, or holding steady over the last few hours.
          </p>
        </div>
      </section>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        Emergency departments are for urgent and life-threatening care. Call 911 for emergencies; posted waits are estimates and can change quickly.
      </div>
    </div>
  );
}
