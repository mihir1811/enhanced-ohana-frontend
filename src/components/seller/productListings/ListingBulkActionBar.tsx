'use client'

import { Download, Trash2 } from 'lucide-react'

interface ListingBulkActionBarProps {
  selectedCount: number
  onDelete: () => void
  onExport?: () => void
  onClear: () => void
  onSelectAll: () => void
  disableSelectAll?: boolean
}

export default function ListingBulkActionBar({
  selectedCount,
  onDelete,
  onExport,
  onClear,
  onSelectAll,
  disableSelectAll,
}: ListingBulkActionBarProps) {
  if (selectedCount <= 0) return null

  return (
    <div
      className="sticky bottom-4 z-20 mt-4 flex w-fit items-center gap-3 rounded-xl border px-3 py-2 text-sm shadow-sm"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
    >
      <span className="font-medium">{selectedCount} selected</span>
      <button type="button" onClick={onDelete} className="rounded-md px-2 py-1 text-sm cursor-pointer" style={{ color: 'var(--destructive)' }}>
        <span className="inline-flex items-center gap-1">
          <Trash2 className="h-4 w-4" />
          Delete
        </span>
      </button>
      <button
        type="button"
        onClick={onExport}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted cursor-pointer"
      >
        <Download className="h-4 w-4" />
        Export
      </button>
      <button type="button" onClick={onClear} className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted cursor-pointer">
        Clear
      </button>
      <button
        type="button"
        onClick={onSelectAll}
        disabled={disableSelectAll}
        className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        Select All
      </button>
    </div>
  )
}
