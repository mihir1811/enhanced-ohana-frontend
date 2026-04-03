/** Persisted table column visibility for seller product list views (table mode only). */

export const STORAGE_KEY_NATURAL_DIAMONDS = 'seller-natural-diamonds-table-columns-v1'
export const STORAGE_KEY_MELEE_DIAMONDS = 'seller-melee-diamonds-table-columns-v1'

export type NaturalDiamondColumnId =
  | 'image'
  | 'name'
  | 'price'
  | 'color'
  | 'clarity'
  | 'cut'
  | 'shape'
  | 'stock'
  | 'updated'

export type MeleeDiamondColumnId =
  | 'image'
  | 'name'
  | 'price'
  | 'color'
  | 'clarity'
  | 'cut'
  | 'totalPcs'
  | 'caratWeightPerpcs'
  | 'totalCaratWeight'
  | 'stock'
  | 'updated'

export const NATURAL_DIAMOND_COLUMNS: { id: NaturalDiamondColumnId; label: string }[] = [
  { id: 'image', label: 'Image' },
  { id: 'name', label: 'Name' },
  { id: 'price', label: 'Price' },
  { id: 'color', label: 'Color' },
  { id: 'clarity', label: 'Clarity' },
  { id: 'cut', label: 'Cut' },
  { id: 'shape', label: 'Shape' },
  { id: 'stock', label: 'Stock' },
  { id: 'updated', label: 'Updated' },
]

export const MELEE_DIAMOND_COLUMNS: { id: MeleeDiamondColumnId; label: string }[] = [
  { id: 'image', label: 'Image' },
  { id: 'name', label: 'Name' },
  { id: 'price', label: 'Price' },
  { id: 'color', label: 'Color' },
  { id: 'clarity', label: 'Clarity' },
  { id: 'cut', label: 'Cut' },
  { id: 'totalPcs', label: 'Total Pcs' },
  { id: 'caratWeightPerpcs', label: 'Carat/Pcs' },
  { id: 'totalCaratWeight', label: 'Total Carat' },
  { id: 'stock', label: 'In stock' },
  { id: 'updated', label: 'Updated' },
]

/** SSR-safe defaults; hydrate from localStorage in `useEffect` to avoid mismatch. */
export const DEFAULT_NATURAL_DIAMOND_VISIBILITY: Record<NaturalDiamondColumnId, boolean> = {
  image: true,
  name: true,
  price: true,
  color: true,
  clarity: true,
  cut: true,
  shape: true,
  stock: true,
  updated: false,
}

/** SSR-safe defaults for melee table columns. */
export const DEFAULT_MELEE_DIAMOND_VISIBILITY: Record<MeleeDiamondColumnId, boolean> = {
  image: true,
  name: true,
  price: true,
  color: true,
  clarity: true,
  cut: true,
  totalPcs: true,
  caratWeightPerpcs: true,
  totalCaratWeight: true,
  stock: true,
  updated: false,
}

const defaultNatural = (): Record<NaturalDiamondColumnId, boolean> => ({
  ...DEFAULT_NATURAL_DIAMOND_VISIBILITY,
})

const defaultMelee = (): Record<MeleeDiamondColumnId, boolean> => ({
  ...DEFAULT_MELEE_DIAMOND_VISIBILITY,
})

export function loadNaturalDiamondColumnVisibility(): Record<NaturalDiamondColumnId, boolean> {
  if (typeof window === 'undefined') return defaultNatural()
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NATURAL_DIAMONDS)
    if (!raw) return defaultNatural()
    const parsed = JSON.parse(raw) as Partial<Record<NaturalDiamondColumnId, boolean>>
    return { ...defaultNatural(), ...parsed }
  } catch {
    return defaultNatural()
  }
}

export function saveNaturalDiamondColumnVisibility(v: Record<NaturalDiamondColumnId, boolean>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY_NATURAL_DIAMONDS, JSON.stringify(v))
  } catch {
    /* ignore */
  }
}

export function loadMeleeDiamondColumnVisibility(): Record<MeleeDiamondColumnId, boolean> {
  if (typeof window === 'undefined') return defaultMelee()
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MELEE_DIAMONDS)
    if (!raw) return defaultMelee()
    const parsed = JSON.parse(raw) as Partial<Record<MeleeDiamondColumnId, boolean>>
    return { ...defaultMelee(), ...parsed }
  } catch {
    return defaultMelee()
  }
}

export function saveMeleeDiamondColumnVisibility(v: Record<MeleeDiamondColumnId, boolean>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY_MELEE_DIAMONDS, JSON.stringify(v))
  } catch {
    /* ignore */
  }
}
