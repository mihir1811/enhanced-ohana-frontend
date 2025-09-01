import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Diamond } from '@/components/diamonds/DiamondResults'

export interface CompareProduct {
  id: string
  type: 'diamond' | 'gemstone' | 'jewelry'
  name: string
  price: number | string
  image: string
  data: Diamond | any // Will expand for other product types
  addedAt: number
}

export interface CompareState {
  products: CompareProduct[]
  maxProducts: number
  isVisible: boolean
}

const initialState: CompareState = {
  products: [],
  maxProducts: 6,
  isVisible: false
}

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action: PayloadAction<CompareProduct>) => {
      const { id, type } = action.payload
      
      // Check if product already exists
      const existingIndex = state.products.findIndex(p => p.id === id)
      if (existingIndex !== -1) {
        return // Product already in compare
      }
      
      // Check if we're at the maximum limit
      if (state.products.length >= state.maxProducts) {
        // Remove the oldest product (first in array)
        state.products.shift()
      }
      
      // Add new product
      state.products.push({
        ...action.payload,
        addedAt: Date.now()
      })
      
      // Make compare bar visible if not already
      if (state.products.length > 0) {
        state.isVisible = true
      }
    },
    
    removeFromCompare: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload)
      
      // Hide compare bar if no products
      if (state.products.length === 0) {
        state.isVisible = false
      }
    },
    
    clearCompare: (state) => {
      state.products = []
      state.isVisible = false
    },
    
    toggleCompareVisibility: (state) => {
      state.isVisible = !state.isVisible
    },
    
    setCompareVisibility: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload
    },
    
    reorderCompareProducts: (state, action: PayloadAction<CompareProduct[]>) => {
      state.products = action.payload
    }
  }
})

export const {
  addToCompare,
  removeFromCompare,
  clearCompare,
  toggleCompareVisibility,
  setCompareVisibility,
  reorderCompareProducts
} = compareSlice.actions

export default compareSlice.reducer
