import { Coins, Crown, Gem, Sparkles, Watch, type LucideIcon } from 'lucide-react'
import type { InquiryCategory } from './inquiryTypes'

export const INQUIRY_CATEGORY_META: Record<
  InquiryCategory,
  { label: string; short: string; Icon: LucideIcon; selectedClass: string; idleClass: string }
> = {
  diamond: {
    label: 'Diamond',
    short: 'Diamonds',
    Icon: Gem,
    selectedClass:
      'border-sky-500/60 bg-sky-500/10 text-foreground shadow-sm ring-2 ring-sky-500/30',
    idleClass:
      'border-border bg-card/80 text-muted-foreground hover:border-sky-500/30 hover:bg-sky-500/5',
  },
  gemstone: {
    label: 'Gemstone',
    short: 'Gemstones',
    Icon: Sparkles,
    selectedClass:
      'border-violet-500/60 bg-violet-500/10 text-foreground shadow-sm ring-2 ring-violet-500/30',
    idleClass:
      'border-border bg-card/80 text-muted-foreground hover:border-violet-500/30 hover:bg-violet-500/5',
  },
  bullion: {
    label: 'Bullion',
    short: 'Bullion',
    Icon: Coins,
    selectedClass:
      'border-amber-500/60 bg-amber-500/10 text-foreground shadow-sm ring-2 ring-amber-500/30',
    idleClass:
      'border-border bg-card/80 text-muted-foreground hover:border-amber-500/30 hover:bg-amber-500/5',
  },
  watch: {
    label: 'Watch',
    short: 'Watches',
    Icon: Watch,
    selectedClass:
      'border-slate-500/60 bg-slate-500/10 text-foreground shadow-sm ring-2 ring-slate-500/30',
    idleClass:
      'border-border bg-card/80 text-muted-foreground hover:border-slate-500/30 hover:bg-slate-500/5',
  },
  jewelry: {
    label: 'Jewelry',
    short: 'Jewelry',
    Icon: Crown,
    selectedClass:
      'border-rose-500/60 bg-rose-500/10 text-foreground shadow-sm ring-2 ring-rose-500/30',
    idleClass:
      'border-border bg-card/80 text-muted-foreground hover:border-rose-500/30 hover:bg-rose-500/5',
  },
}
