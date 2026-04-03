'use client'

import { Columns3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type ColumnDef = { id: string; label: string }

type SellerTableColumnPickerProps = {
  columns: ColumnDef[]
  visible: Record<string, boolean>
  onToggle: (id: string, checked: boolean) => void
  /** Shown in the trigger and menu label */
  title?: string
  /** Compact trigger for use inside bordered toolbar groups */
  variant?: 'default' | 'toolbar'
}

export function SellerTableColumnPicker({
  columns,
  visible,
  onToggle,
  title = 'Table columns',
  variant = 'default',
}: SellerTableColumnPickerProps) {
  const toolbar = variant === 'toolbar'
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'relative flex cursor-pointer items-center gap-2 rounded-md text-sm font-medium transition-colors duration-150',
            toolbar
              ? 'h-9 border-0 bg-transparent px-2 shadow-none hover:bg-muted/70'
              : 'border px-3 py-2 font-medium shadow-sm hover:opacity-95',
          )}
          style={
            toolbar
              ? { color: 'var(--foreground)' }
              : {
                  backgroundColor: 'var(--muted)',
                  color: 'var(--foreground)',
                  borderColor: 'var(--border)',
                }
          }
          aria-label={title}
        >
          <Columns3 className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Columns</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-md border shadow-lg"
        style={{
          backgroundColor: 'var(--card)',
          color: 'var(--foreground)',
          borderColor: 'var(--border)',
        }}
      >
        <DropdownMenuLabel className="text-xs uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
          {title}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((c) => (
          <DropdownMenuCheckboxItem
            key={c.id}
            className="rounded-sm"
            checked={Boolean(visible[c.id])}
            onCheckedChange={(chk) => onToggle(c.id, chk === true)}
            onSelect={(e) => e.preventDefault()}
          >
            {c.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
