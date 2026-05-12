export function PredictionCard({ label, wait }: { label: string; wait: string }) {
  return (
    <div className="border border-zinc-200 bg-white p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{wait}</p>
    </div>
  );
}
