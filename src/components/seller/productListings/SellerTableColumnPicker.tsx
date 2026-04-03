'use client'

import { Columns3 } from 'lucide-react'
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
}

export function SellerTableColumnPicker({
  columns,
  visible,
  onToggle,
  title = 'Table columns',
}: SellerTableColumnPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="cursor-pointer relative px-3 py-2 rounded-md border flex items-center gap-2 text-sm font-medium shadow-sm hover:opacity-95 transition-colors duration-150"
          style={{
            backgroundColor: 'var(--muted)',
            color: 'var(--foreground)',
            borderColor: 'var(--border)',
          }}
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
