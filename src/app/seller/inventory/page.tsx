export default function SellerInventoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            Inventory
          </h1>
          <p 
            className="mt-2 text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Manage your stock levels and product availability.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="px-4 py-2 rounded-lg font-medium transition-colors border"
            style={{ 
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              backgroundColor: 'transparent'
            }}
          >
            Import Stock
          </button>
          <button 
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)'
            }}
          >
            Update Stock
          </button>
        </div>
      </div>

      <div 
        className="rounded-xl border p-8 text-center"
        style={{ 
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)'
        }}
      >
        <h3 
          className="text-xl font-semibold mb-2"
          style={{ color: 'var(--card-foreground)' }}
        >
          Inventory Management
        </h3>
        <p 
          className="text-base"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Stock tracking, low inventory alerts, and inventory management tools will be available here.
        </p>
      </div>
    </div>
  )
}
