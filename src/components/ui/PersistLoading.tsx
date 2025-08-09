// Loading component for Redux Persist
export function PersistLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center">
        {/* Loading spinner */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Loading Ohana
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Restoring your session...
        </p>
      </div>
    </div>
  )
}
