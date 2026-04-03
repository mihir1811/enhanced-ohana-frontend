import type { InquiryCategory } from './inquiryTypes'

function fmt(v: unknown): string {
  if (v === null || v === undefined) return ''
  if (typeof v === 'object' && v !== null && 'toString' in v) return String(v)
  return String(v)
}

/** One-line preview for list rows */
export function summarizeInquiryRow(category: InquiryCategory, row: Record<string, unknown>): string {
  switch (category) {
    case 'diamond':
      return [fmt(row.shape), row.caratMin != null && row.caratMax != null ? `${fmt(row.caratMin)}–${fmt(row.caratMax)} ct` : '']
        .filter(Boolean)
        .join(' · ')
    case 'gemstone':
      return [fmt(row.gemstoneType), fmt(row.shape)].filter(Boolean).join(' · ')
    case 'bullion':
      return [fmt(row.metalType), fmt(row.shapeFormat)].filter(Boolean).join(' · ')
    case 'watch':
      return [fmt(row.brand), fmt(row.model)].filter(Boolean).join(' · ')
    case 'jewelry':
      return [fmt(row.subCategory), fmt(row.metalType)].filter(Boolean).join(' · ')
    default:
      return ''
  }
}
