export function InsightCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {["Busiest hour", "Busiest day", "Model MAE"].map((label) => (
        <div key={label} className="border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">{label}</p>
          <p className="mt-2 text-xl font-semibold">Collecting data</p>
        </div>
      ))}
    </div>
  );
}
