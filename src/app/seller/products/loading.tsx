import { TableLoader } from '@/components/seller/Loader'

export default function ProductsLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div 
            className="h-8 w-32 rounded animate-pulse"
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div 
            className="h-5 w-80 rounded animate-pulse"
            style={{ backgroundColor: 'var(--muted)' }}
          />
        </div>
        <div 
          className="h-10 w-32 rounded-lg animate-pulse"
          style={{ backgroundColor: 'var(--muted)' }}
        />
      </div>

      {/* Products table skeleton */}
      <TableLoader rows={8} />
    </div>
  )
}
