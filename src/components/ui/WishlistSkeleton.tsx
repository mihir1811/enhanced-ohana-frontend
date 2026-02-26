'use client'

export function WishlistSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="rounded-xl border p-6 animate-pulse"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-lg flex-shrink-0" style={{ backgroundColor: 'var(--muted)' }} />
            <div className="flex-1 min-w-0 space-y-3">
              <div className="h-5 w-3/4 rounded" style={{ backgroundColor: 'var(--muted)' }} />
              <div className="h-4 w-1/2 rounded" style={{ backgroundColor: 'var(--muted)' }} />
              <div className="flex gap-2">
                <div className="h-4 w-16 rounded" style={{ backgroundColor: 'var(--muted)' }} />
                <div className="h-4 w-16 rounded" style={{ backgroundColor: 'var(--muted)' }} />
              </div>
              <div className="h-8 w-20 rounded mt-4" style={{ backgroundColor: 'var(--muted)' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
