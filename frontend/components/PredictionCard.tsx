export function PredictionCard({ label, wait, confidence }: { label: string; wait: string; confidence?: string }) {
  return (
    <div className="premium-card elevate rounded-2xl p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-[-0.03em]">{wait}</p>
      <p className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
        Confidence: {confidence ?? "Building model"}
      </p>
    </div>
  );
}
