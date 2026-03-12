export function StatCard({
  label,
  value,
  hint
}: Readonly<{
  label: string;
  value: string;
  hint: string;
}>) {
  return (
    <article className="metric-card">
      <span className="eyebrow">{label}</span>
      <div className="metric-value">{value}</div>
      <p className="muted">{hint}</p>
    </article>
  );
}

