// Base product search interfaces
export interface BaseProductSearch {
  category: string
  priceRange: { min: number; max: number }
  certification: string[]
  location: string[]
}

// Diamond Search Interface
export interface DiamondSearchForm extends BaseProductSearch {
  diamondType: 'natural' | 'lab-grown'
  category: 'single' | 'melee'
  shape: string[]
  caratWeight: { min: number; max: number }
  color: string[]
  clarity: string[]
  cut: string[]
  fluorescence: string[]
  grownMethod: string[]
  
  // Advanced filters
  polish: string[]
  symmetry: string[]
  tablePercent: { min: number; max: number }
  depthPercent: { min: number; max: number }
  girdle: string[]
  culet: string[]
  pricePerCarat: { min: number; max: number }
  measurements: {
    length: { min: number; max: number }
    width: { min: number; max: number }
    depth: { min: number; max: number }
  }
}

// Gemstone Search Interface
export interface GemstoneSearchForm extends BaseProductSearch {
  gemType: string[]
  category: 'single' | 'melee'
  shape: string[]
  caratWeight: { min: number; max: number }
  color: string[]
  clarity: string[]
  cut: string[]
  origin: string[]
  treatment: string[]
  enhancement: string[]
  
  // Advanced filters
  measurements: {
    length: { min: number; max: number }
    width: { min: number; max: number }
    depth: { min: number; max: number }
  }
}

// Jewelry Search Interface
export interface JewelrySearchForm extends BaseProductSearch {
  jewelryType: 'rings' | 'necklaces' | 'chains' | 'earrings' | 'watches' | 'bracelets' | 'accessories'
  category: 'engagement' | 'wedding' | 'fashion' | 'luxury'
  metal: string[]
  style: string[]
  setting: string[]
  gemstone: string[]
  brand: string[]
  size: string[]
  
  // Specific filters
  ringSize: { min: number; max: number }
  chainLength: { min: number; max: number }
  weight: { min: number; max: number }
}

// Product Configuration
export interface ProductConfig {
  name: string
  icon: string
  categories: string[]
  filters: FilterConfig[]
  priceRanges: {
    [category: string]: { min: number; max: number }
  }
}

export interface FilterConfig {
  key: string
  label: string
  type: 'select' | 'multiselect' | 'range' | 'toggle'
  options?: string[]
  min?: number
  max?: number
  step?: number
  advanced?: boolean
}
