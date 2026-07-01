const legend = [
  { label: 'Low', color: 'bg-emerald-500' },
  { label: 'Medium', color: 'bg-amber-500' },
  { label: 'High', color: 'bg-orange-500' },
  { label: 'Critical', color: 'bg-rose-500' },
]

export function MapLegend() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[24px] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 backdrop-blur-xl">
      {legend.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
