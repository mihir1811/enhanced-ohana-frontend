"use client"

import React from 'react'
import { Grid, List } from 'lucide-react'

export type ViewMode = 'grid' | 'table'

interface ViewToggleProps {
  value: ViewMode
  onChange: (value: ViewMode) => void
  /** Optional accent color for active state (e.g. var(--card-diamond-icon-text)) */
  accentColor?: string
      /** Show text labels (Grid / List) */
  showLabels?: boolean
  /** Size variant */
  size?: 'sm' | 'md'
}

export function ViewToggle({
  value,
  onChange,
  accentColor = 'var(--primary)',
  showLabels = false,
  size = 'md',
}: ViewToggleProps) {
  const isGrid = value === 'grid'
  const isTable = value === 'table'

  return (
    <div
      className="relative flex rounded-xl p-1 border shadow-sm"
      style={{
        backgroundColor: 'var(--muted)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Sliding background pill */}
      <div
        className="absolute top-1 bottom-1 rounded-lg transition-all duration-200 ease-out"
        style={{
          left: isGrid ? 4 : 'calc(50% + 2px)',
          width: 'calc(50% - 6px)',
          backgroundColor: 'var(--card)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      />
      <button
        type="button"
        onClick={() => onChange('grid')}
        className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg cursor-pointer transition-all duration-150 ${
          size === 'sm' ? 'px-2.5 py-1.5 text-sm' : 'px-4 py-2'
        } ${isGrid ? 'font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
        style={isGrid ? { color: accentColor } : undefined}
      >
        <Grid className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        {showLabels && <span>Grid</span>}
      </button>
      <button
        type="button"
        onClick={() => onChange('table')}
        className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg cursor-pointer transition-all duration-150 ${
          size === 'sm' ? 'px-2.5 py-1.5 text-sm' : 'px-4 py-2'
        } ${isTable ? 'font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
        style={isTable ? { color: accentColor } : undefined}
      >
        <List className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        {showLabels && <span>List</span>}
      </button>
    </div>
  )
}
