'use client'

export function OrdersSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tabs skeleton */}
      <div className="border-b animate-pulse" style={{ borderColor: 'var(--border)' }}>
        <div className="-mb-px flex space-x-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="py-2 px-1 flex items-center gap-2">
              <div className="h-4 w-20 rounded" style={{ backgroundColor: 'var(--muted)' }} />
              <div className="h-5 w-6 rounded-full" style={{ backgroundColor: 'var(--muted)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Order cards skeleton */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border p-6 animate-pulse"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="space-y-2">
                <div className="h-5 w-28 rounded" style={{ backgroundColor: 'var(--muted)' }} />
                <div className="h-4 w-40 rounded" style={{ backgroundColor: 'var(--muted)' }} />
              </div>
              <div className="h-8 w-24 rounded-full" style={{ backgroundColor: 'var(--muted)' }} />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-9 w-9 rounded-lg" style={{ backgroundColor: 'var(--muted)' }} />
              ))}
            </div>
          </div>
          <div className="space-y-4 mb-6">
            {[1, 2].map((j) => (
              <div key={j} className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg flex-shrink-0" style={{ backgroundColor: 'var(--muted)' }} />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded" style={{ backgroundColor: 'var(--muted)' }} />
                  <div className="h-4 w-1/4 rounded" style={{ backgroundColor: 'var(--muted)' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-6">
              <div className="space-y-1">
                <div className="h-3 w-10 rounded" style={{ backgroundColor: 'var(--muted)' }} />
                <div className="h-6 w-20 rounded" style={{ backgroundColor: 'var(--muted)' }} />
              </div>
              <div className="space-y-1">
                <div className="h-3 w-16 rounded" style={{ backgroundColor: 'var(--muted)' }} />
                <div className="h-4 w-28 rounded" style={{ backgroundColor: 'var(--muted)' }} />
              </div>
            </div>
            <div className="h-10 w-32 rounded-lg" style={{ backgroundColor: 'var(--muted)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
