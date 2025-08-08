import { TableLoader } from '@/components/seller/Loader'

export default function OrdersLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div 
            className="h-8 w-24 rounded animate-pulse"
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div 
            className="h-5 w-72 rounded animate-pulse"
            style={{ backgroundColor: 'var(--muted)' }}
          />
        </div>
        <div className="flex space-x-3">
          <div 
            className="h-10 w-28 rounded-lg animate-pulse"
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div 
            className="h-10 w-24 rounded-lg animate-pulse"
            style={{ backgroundColor: 'var(--muted)' }}
          />
        </div>
      </div>

      {/* Orders table skeleton */}
      <TableLoader rows={6} />
    </div>
  )
}
