export function Sparkline({ values, color = "#e11d48" }: { values: number[]; color?: string }) {
  if (values.length < 2) {
    return <div className="h-8 rounded bg-slate-100" />;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 120;
      const y = 30 - ((value - min) / span) * 26;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg className="h-8 w-full overflow-visible" viewBox="0 0 120 32" preserveAspectRatio="none" aria-hidden="true">
      <polyline className="sparkline-path" points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


