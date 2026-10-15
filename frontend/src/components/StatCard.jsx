export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  description,
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-violet-50 text-violet-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <article className="flex min-w-0 items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
          colors[color] || colors.blue
        }`}
      >
        <Icon size={23} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-500">{title}</p>
        <h3 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-slate-900">
          {value ?? 0}
        </h3>
        <p className="mt-1 text-[11px] text-slate-400">{description}</p>
      </div>
    </article>
  );
}
