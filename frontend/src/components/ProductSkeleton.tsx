export function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="h-72 w-full rounded-[1.5rem] bg-slate-700/40" />
      <div className="mt-6 space-y-4">
        <div className="h-6 w-3/4 rounded-full bg-slate-700/40" />
        <div className="h-4 w-full rounded-full bg-slate-700/40" />
        <div className="h-4 w-5/6 rounded-full bg-slate-700/40" />
        <div className="flex items-center justify-between gap-4">
          <div className="h-10 w-24 rounded-full bg-slate-700/40" />
          <div className="h-10 w-28 rounded-full bg-slate-700/40" />
        </div>
      </div>
    </div>
  )
}
