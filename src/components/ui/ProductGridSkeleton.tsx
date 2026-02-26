'use client'

interface ProductGridSkeletonProps {
  count?: number
  columns?: 2 | 3 | 4
}

export function ProductGridSkeleton({ count = 8, columns = 4 }: ProductGridSkeletonProps) {
  const gridClass = columns === 2
    ? 'grid-cols-1 md:grid-cols-2'
    : columns === 3
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  return (
    <div className={`grid ${gridClass} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border overflow-hidden animate-pulse transition-opacity"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div
            className="aspect-square w-full"
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 rounded" style={{ backgroundColor: 'var(--muted)' }} />
            <div className="h-3 w-1/2 rounded" style={{ backgroundColor: 'var(--muted)' }} />
            <div className="h-5 w-1/3 rounded" style={{ backgroundColor: 'var(--muted)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
