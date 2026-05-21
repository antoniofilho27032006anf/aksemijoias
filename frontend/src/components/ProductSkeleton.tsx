export function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(120,60,220,0.15)] bg-[#0a0618]">
      <div className="skeleton h-44 w-full sm:h-52" />
      <div className="p-4 space-y-3 sm:p-5">
        <div className="skeleton h-4 w-3/4 rounded-full" />
        <div className="skeleton h-3 w-full rounded-full" />
        <div className="skeleton h-3 w-4/5 rounded-full" />
        <div className="pt-1">
          <div className="skeleton h-6 w-28 rounded-full" />
        </div>
        <div className="flex flex-col gap-2 pt-1">
          <div className="skeleton h-10 w-full rounded-xl" />
          <div className="skeleton h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
