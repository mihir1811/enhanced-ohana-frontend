import { CardLoader } from '@/components/seller/Loader'

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div 
            className="h-8 w-40 rounded animate-pulse"
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div 
            className="h-5 w-80 rounded animate-pulse"
            style={{ backgroundColor: 'var(--muted)' }}
          />
        </div>
        <div className="flex space-x-3">
          <div 
            className="h-10 w-24 rounded-lg animate-pulse"
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div 
            className="h-10 w-28 rounded-lg animate-pulse"
            style={{ backgroundColor: 'var(--muted)' }}
          />
        </div>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardLoader key={i} />
        ))}
      </div>

      {/* Content grid skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div 
            key={i}
            className="rounded-xl border p-6 animate-pulse"
            style={{ 
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div 
                className="h-6 w-32 rounded"
                style={{ backgroundColor: 'var(--muted)' }}
              />
              <div 
                className="h-4 w-16 rounded"
                style={{ backgroundColor: 'var(--muted)' }}
              />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between py-3">
                  <div className="flex-1 space-y-2">
                    <div 
                      className="h-4 w-24 rounded"
                      style={{ backgroundColor: 'var(--muted)' }}
                    />
                    <div 
                      className="h-3 w-40 rounded"
                      style={{ backgroundColor: 'var(--muted)' }}
                    />
                  </div>
                  <div 
                    className="h-4 w-16 rounded"
                    style={{ backgroundColor: 'var(--muted)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
