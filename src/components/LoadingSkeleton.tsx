export function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
          <div className="mb-4 h-10 w-20 rounded-full bg-slate-800" />
          <div className="mb-2 h-6 w-32 rounded-full bg-slate-800" />
          <div className="h-4 w-24 rounded-full bg-slate-800" />
        </div>
      ))}
    </div>
  )
}
