'use client'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Loader({ size = 'md', className = '' }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${className}`} 
         style={{ 
           borderColor: 'var(--muted-foreground)',
           borderTopColor: 'transparent'
         }}
    />
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-4">
        <Loader size="lg" />
        <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
          Loading...
        </p>
      </div>
    </div>
  )
}

export function CardLoader() {
  return (
    <div 
      className="rounded-xl border p-6 animate-pulse"
      style={{ 
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div 
          className="h-4 w-24 rounded"
          style={{ backgroundColor: 'var(--muted)' }}
        />
        <div 
          className="h-6 w-6 rounded"
          style={{ backgroundColor: 'var(--muted)' }}
        />
      </div>
      <div 
        className="h-8 w-20 rounded mb-2"
        style={{ backgroundColor: 'var(--muted)' }}
      />
      <div 
        className="h-4 w-16 rounded"
        style={{ backgroundColor: 'var(--muted)' }}
      />
    </div>
  )
}

export function TableLoader({ rows = 5 }: { rows?: number }) {
  return (
    <div 
      className="rounded-xl border overflow-hidden"
      style={{ 
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex space-x-4">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="h-4 rounded flex-1"
              style={{ backgroundColor: 'var(--muted)' }}
            />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b last:border-b-0 animate-pulse" style={{ borderColor: 'var(--border)' }}>
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((j) => (
              <div 
                key={j}
                className="h-4 rounded flex-1"
                style={{ backgroundColor: 'var(--muted)' }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
