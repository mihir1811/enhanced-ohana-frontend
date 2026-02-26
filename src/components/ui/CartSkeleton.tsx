'use client'

export function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border p-6 animate-pulse"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-start space-x-4">
              <div
                className="w-20 h-20 rounded-lg flex-shrink-0"
                style={{ backgroundColor: 'var(--muted)' }}
              />
              <div className="flex-1 min-w-0 space-y-3">
                <div className="h-5 w-3/4 rounded" style={{ backgroundColor: 'var(--muted)' }} />
                <div className="h-4 w-1/2 rounded" style={{ backgroundColor: 'var(--muted)' }} />
                <div className="flex items-center space-x-4">
                  <div className="h-9 w-24 rounded" style={{ backgroundColor: 'var(--muted)' }} />
                  <div className="h-6 w-16 rounded ml-auto" style={{ backgroundColor: 'var(--muted)' }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-1">
        <div
          className="rounded-xl border p-6 sticky top-8 animate-pulse"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="h-6 w-32 rounded mb-6" style={{ backgroundColor: 'var(--muted)' }} />
          <div className="space-y-4 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-20 rounded" style={{ backgroundColor: 'var(--muted)' }} />
                <div className="h-4 w-16 rounded" style={{ backgroundColor: 'var(--muted)' }} />
              </div>
            ))}
          </div>
          <div className="h-12 w-full rounded-lg mb-4" style={{ backgroundColor: 'var(--muted)' }} />
          <div className="h-12 w-full rounded-lg" style={{ backgroundColor: 'var(--muted)' }} />
        </div>
      </div>
    </div>
  )
}
