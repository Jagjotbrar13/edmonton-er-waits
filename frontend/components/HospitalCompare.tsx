import { Hospital } from "@/lib/api";
import { formatWait } from "@/lib/map";

export function HospitalCompare({ hospitals }: { hospitals: Hospital[] }) {
  return (
    <div className="divide-y divide-zinc-200 border border-zinc-200 bg-white">
      {hospitals.map((hospital, index) => (
        <div key={hospital.id} className="grid grid-cols-[48px_1fr_auto] items-center gap-4 p-4">
          <span className="text-sm text-zinc-500">{index + 1}</span>
          <span className="font-medium">{hospital.name}</span>
          <span>{formatWait(hospital.wait_minutes)}</span>
        </div>
      ))}
    </div>
  );
}
