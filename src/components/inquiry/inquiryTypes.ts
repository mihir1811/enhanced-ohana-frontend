export type InquiryCategory = 'diamond' | 'gemstone' | 'bullion' | 'watch' | 'jewelry'

/** Backend route uses `jewellery-inquiry` */
export type InquiryApiKey = 'diamond' | 'gemstone' | 'bullion' | 'watch' | 'jewellery'

export function categoryToApiKey(category: InquiryCategory): InquiryApiKey {
  return category === 'jewelry' ? 'jewellery' : category
}

export function isInquiryCategory(s: string): s is InquiryCategory {
  return (
    s === 'diamond' ||
    s === 'gemstone' ||
    s === 'bullion' ||
    s === 'watch' ||
    s === 'jewelry'
  )
}

export const INQUIRY_OPTIONS: { value: InquiryCategory; label: string }[] = [
  { value: 'diamond', label: 'Diamond' },
  { value: 'gemstone', label: 'Gemstone' },
  { value: 'bullion', label: 'Bullion' },
  { value: 'watch', label: 'Watch' },
  { value: 'jewelry', label: 'Jewelry' },
]
