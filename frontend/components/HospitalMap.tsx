"use client";

import { Hospital } from "@/lib/api";
import { formatWait, waitColor } from "@/lib/map";

export function HospitalMap({ hospitals }: { hospitals: Hospital[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Current posted waits</h2>
          <p className="text-sm text-slate-500">Updated when the scraper stores a new AHS snapshot.</p>
        </div>
        <span className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600">Live data</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {hospitals.map((hospital) => (
          <a
            key={hospital.id}
            href={`/hospital/${hospital.id}`}
            className="group rounded-lg border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: waitColor(hospital.wait_minutes) }}
                  />
                  <h3 className="font-medium text-slate-950">{hospital.name}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {hospital.patients_waiting === null ? "Patient count unavailable" : `${hospital.patients_waiting} waiting`}
                </p>
              </div>
              <strong className="whitespace-nowrap text-xl">{formatWait(hospital.wait_minutes)}</strong>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
