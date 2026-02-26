'use client'

export function ProductListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border overflow-hidden animate-pulse flex flex-col md:flex-row"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div
            className="w-full md:w-64 aspect-[4/5] md:aspect-square shrink-0"
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div className="p-6 flex-1 space-y-4">
            <div className="h-5 w-1/3 rounded" style={{ backgroundColor: 'var(--muted)' }} />
            <div className="h-6 w-2/3 rounded" style={{ backgroundColor: 'var(--muted)' }} />
            <div className="flex gap-4">
              <div className="h-4 w-20 rounded" style={{ backgroundColor: 'var(--muted)' }} />
              <div className="h-4 w-24 rounded" style={{ backgroundColor: 'var(--muted)' }} />
            </div>
            <div className="h-8 w-32 rounded mt-4" style={{ backgroundColor: 'var(--muted)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
