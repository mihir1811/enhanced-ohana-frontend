"use client"
import React from 'react'

type ViewMode = 'grid' | 'list'

interface ViewToggleProps {
  value: ViewMode
  onChange: (next: ViewMode) => void
  className?: string
}

const ViewToggle: React.FC<ViewToggleProps> = ({ value, onChange, className }) => {
  const isGrid = value === 'grid'
  return (
    <div
      className={`relative flex items-center rounded-xl border p-1 select-none shadow-sm overflow-hidden ${className ?? ''}`}
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
      role="tablist"
      aria-label="View mode"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'End') {
          onChange('grid')
        } else if (e.key === 'ArrowLeft' || e.key === 'Home') {
          onChange('list')
        } else if (e.key === ' ' || e.key === 'Enter') {
          onChange(value === 'grid' ? 'list' : 'grid')
        }
      }}
      tabIndex={0}
    >
      <div
        className="absolute inset-y-1 transition-all duration-300 ease-out rounded-lg"
        style={{
          left: isGrid ? 'calc(50% + 2px)' : '2px',
          right: isGrid ? '2px' : 'calc(50% + 2px)',
          backgroundColor: 'color-mix(in srgb, var(--accent) 16%, var(--card))',
          border: '1px solid var(--border)'
        }}
        aria-hidden
      />
      <button
        type="button"
        onClick={() => onChange('list')}
        className={`relative z-10 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors w-1/2 cursor-pointer ${
          value === 'list' ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
        } active:scale-[0.98]`}
        aria-selected={value === 'list'}
        role="tab"
        aria-label="List view"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" />
        </svg>
        <span className="text-sm font-medium">List</span>
      </button>
      <button
        type="button"
        onClick={() => onChange('grid')}
        className={`relative z-10 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors w-1/2 cursor-pointer ${
          value === 'grid' ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
        } active:scale-[0.98]`}
        aria-selected={value === 'grid'}
        role="tab"
        aria-label="Grid view"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="7" height="7" rx="1" />
          <rect x="13" y="4" width="7" height="7" rx="1" />
          <rect x="4" y="13" width="7" height="7" rx="1" />
          <rect x="13" y="13" width="7" height="7" rx="1" />
        </svg>
        <span className="text-sm font-medium">Grid</span>
      </button>
    </div>
  )
}

export default ViewToggle

