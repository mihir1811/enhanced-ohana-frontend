'use client'

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 animate-pulse">
      <div className="space-y-4">
        <div
          className="aspect-square rounded-3xl"
          style={{ backgroundColor: 'var(--muted)' }}
        />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-20 h-20 rounded-xl"
              style={{ backgroundColor: 'var(--muted)' }}
            />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-6 w-1/4 rounded" style={{ backgroundColor: 'var(--muted)' }} />
        <div className="h-10 w-3/4 rounded" style={{ backgroundColor: 'var(--muted)' }} />
        <div className="h-8 w-1/3 rounded" style={{ backgroundColor: 'var(--muted)' }} />
        <div className="space-y-4 pt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-24 rounded" style={{ backgroundColor: 'var(--muted)' }} />
              <div className="h-4 w-20 rounded" style={{ backgroundColor: 'var(--muted)' }} />
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-4">
          <div className="h-12 flex-1 rounded-xl" style={{ backgroundColor: 'var(--muted)' }} />
          <div className="h-12 w-24 rounded-xl" style={{ backgroundColor: 'var(--muted)' }} />
        </div>
      </div>
    </div>
  )
}
