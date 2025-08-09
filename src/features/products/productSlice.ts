import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { productService, Product, ProductFilters } from '@/services/products'

interface ProductState {
  products: Product[]
  currentProduct: Product | null
  favoriteProducts: Product[]
  trendingProducts: Product[]
  searchResults: Product[]
  filters: ProductFilters
  loading: {
    products: boolean
    currentProduct: boolean
    favorites: boolean
    trending: boolean
    search: boolean
  }
  error: string | null
  pagination: {
    page: number
    totalPages: number
    total: number
    limit: number
  }
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  favoriteProducts: [],
  trendingProducts: [],
  searchResults: [],
  filters: {
    page: 1,
    limit: 20,
    sortBy: 'date',
    sortOrder: 'desc'
  },
  loading: {
    products: false,
    currentProduct: false,
    favorites: false,
    trending: false,
    search: false
  },
  error: null,
  pagination: {
    page: 1,
    totalPages: 0,
    total: 0,
    limit: 20
  }
}

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters?: ProductFilters) => {
    const response = await productService.getProducts(filters)
    return response
  }
)

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (productId: string) => {
    const response = await productService.getProduct(productId)
    return response
  }
)

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, filters }: { query: string; filters?: Omit<ProductFilters, 'search'> }) => {
    const response = await productService.searchProducts(query, filters)
    return response
  }
)

export const fetchTrendingProducts = createAsyncThunk(
  'products/fetchTrendingProducts',
  async () => {
    const response = await productService.getTrendingProducts()
    return response
  }
)

export const fetchFavoriteProducts = createAsyncThunk(
  'products/fetchFavoriteProducts',
  async () => {
    const response = await productService.getFavorites()
    return response
  }
)

export const toggleFavorite = createAsyncThunk(
  'products/toggleFavorite',
  async ({ productId, isFavorite }: { productId: string; isFavorite: boolean }) => {
    if (isFavorite) {
      await productService.removeFromFavorites(productId)
    } else {
      await productService.addToFavorites(productId)
    }
    return { productId, isFavorite: !isFavorite }
  }
)

export const trackProductView = createAsyncThunk(
  'products/trackView',
  async (productId: string) => {
    await productService.trackView(productId)
    return productId
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
    clearSearchResults: (state) => {
      state.searchResults = []
    },
    updateProductInList: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading.products = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading.products = false
        state.products = action.payload.data
        if (action.payload.meta?.pagination) {
          state.pagination = action.payload.meta.pagination
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading.products = false
        state.error = action.error.message || 'Failed to fetch products'
      })

    // Fetch Single Product
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading.currentProduct = true
        state.error = null
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading.currentProduct = false
        state.currentProduct = action.payload.data
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading.currentProduct = false
        state.error = action.error.message || 'Failed to fetch product'
      })

    // Search Products
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading.search = true
        state.error = null
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading.search = false
        state.searchResults = action.payload.data
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading.search = false
        state.error = action.error.message || 'Search failed'
      })

    // Fetch Trending Products
    builder
      .addCase(fetchTrendingProducts.pending, (state) => {
        state.loading.trending = true
      })
      .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
        state.loading.trending = false
        state.trendingProducts = action.payload.data
      })
      .addCase(fetchTrendingProducts.rejected, (state, action) => {
        state.loading.trending = false
        state.error = action.error.message || 'Failed to fetch trending products'
      })

    // Fetch Favorite Products
    builder
      .addCase(fetchFavoriteProducts.pending, (state) => {
        state.loading.favorites = true
      })
      .addCase(fetchFavoriteProducts.fulfilled, (state, action) => {
        state.loading.favorites = false
        state.favoriteProducts = action.payload.data
      })
      .addCase(fetchFavoriteProducts.rejected, (state, action) => {
        state.loading.favorites = false
        state.error = action.error.message || 'Failed to fetch favorites'
      })

    // Toggle Favorite
    builder
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { productId, isFavorite } = action.payload
        
        // Update in products list
        const productIndex = state.products.findIndex(p => p.id === productId)
        if (productIndex !== -1) {
          // Add/remove from favorites count (assuming this field exists)
          // state.products[productIndex].isFavorited = isFavorite
        }

        // Update current product if it's the same
        if (state.currentProduct?.id === productId) {
          // state.currentProduct.isFavorited = isFavorite
        }

        // Update favorites list
        if (isFavorite) {
          const product = state.products.find(p => p.id === productId) || 
                         state.currentProduct
          if (product && !state.favoriteProducts.find(p => p.id === productId)) {
            state.favoriteProducts.push(product)
          }
        } else {
          state.favoriteProducts = state.favoriteProducts.filter(p => p.id !== productId)
        }
      })
  }
})

export const { 
  setFilters, 
  clearFilters, 
  clearCurrentProduct, 
  clearSearchResults,
  updateProductInList 
} = productSlice.actions

export default productSlice.reducer
