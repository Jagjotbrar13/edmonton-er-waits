import { BestTimeHeatmap } from "@/components/BestTimeHeatmap";
import { PredictionCard } from "@/components/PredictionCard";
import { WaitChart } from "@/components/WaitChart";
import { getBestTimeHeatmap, getHospital, getHospitalHistory } from "@/lib/api";
import { formatWait } from "@/lib/map";

export const dynamic = "force-dynamic";

export default async function HospitalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [hospital, history, heatmap] = await Promise.all([
    getHospital(id),
    getHospitalHistory(id),
    getBestTimeHeatmap(id)
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-rose-700">Hospital detail</p>
        <h1 className="mt-2 text-3xl font-semibold">{hospital.name}</h1>
        <p className="mt-2 text-slate-600">
          Current posted wait: <strong>{formatWait(hospital.wait_minutes)}</strong>
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <PredictionCard label="Predicted 2 hours from now" wait="Forecast preview" confidence="74%" />
        <PredictionCard label="Predicted 4 hours from now" wait="Forecast preview" confidence="68%" />
      </div>
      <WaitChart history={history} />
      <BestTimeHeatmap cells={heatmap} />
    </div>
  );
}
