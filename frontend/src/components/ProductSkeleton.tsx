export function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: 'var(--c-border)' }}>
      <div className="skeleton aspect-square w-full" />
      <div className="flex flex-col gap-2 p-3">
        <div className="skeleton h-3 w-4/5 rounded-full" />
        <div className="skeleton h-3 w-2/3 rounded-full" />
        <div className="skeleton h-5 w-1/2 rounded-full" />
        <div className="skeleton h-3 w-2/5 rounded-full" />
        <div className="skeleton h-3 w-3/5 rounded-full" />
        <div className="skeleton mt-1 h-8 w-full rounded-md" />
      </div>
    </div>
  )
}
