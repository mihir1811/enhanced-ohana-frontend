import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { RootState, AppDispatch } from '@/store'
import { 
  fetchProducts,
  fetchProduct,
  searchProducts,
  fetchTrendingProducts,
  fetchFavoriteProducts,
  toggleFavorite,
  trackProductView,
  setFilters,
  clearFilters,
  clearCurrentProduct,
  clearSearchResults
} from '@/features/products/productSlice'
import { ProductFilters } from '@/services/products'

export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>()
  const productState = useSelector((state: RootState) => state.products)

  const loadProducts = useCallback((filters?: ProductFilters) => {
    dispatch(fetchProducts(filters))
  }, [dispatch])

  const loadProduct = useCallback((productId: string) => {
    dispatch(fetchProduct(productId))
  }, [dispatch])

  const searchProductsAction = useCallback((query: string, filters?: Omit<ProductFilters, 'search'>) => {
    dispatch(searchProducts({ query, filters }))
  }, [dispatch])

  const loadTrendingProducts = useCallback(() => {
    dispatch(fetchTrendingProducts())
  }, [dispatch])

  const loadFavoriteProducts = useCallback(() => {
    dispatch(fetchFavoriteProducts())
  }, [dispatch])

  const toggleProductFavorite = useCallback((productId: string, isFavorite: boolean) => {
    dispatch(toggleFavorite({ productId, isFavorite }))
  }, [dispatch])

  const trackView = useCallback((productId: string) => {
    dispatch(trackProductView(productId))
  }, [dispatch])

  const updateFilters = useCallback((filters: Partial<ProductFilters>) => {
    dispatch(setFilters(filters))
  }, [dispatch])

  const resetFilters = useCallback(() => {
    dispatch(clearFilters())
  }, [dispatch])

  const clearProduct = useCallback(() => {
    dispatch(clearCurrentProduct())
  }, [dispatch])

  const clearSearch = useCallback(() => {
    dispatch(clearSearchResults())
  }, [dispatch])

  // Auto-load products when filters change
  useEffect(() => {
    if (productState.filters) {
      loadProducts(productState.filters)
    }
  }, [productState.filters, loadProducts])

  return {
    // State
    products: productState.products,
    currentProduct: productState.currentProduct,
    favoriteProducts: productState.favoriteProducts,
    trendingProducts: productState.trendingProducts,
    searchResults: productState.searchResults,
    filters: productState.filters,
    loading: productState.loading,
    error: productState.error,
    pagination: productState.pagination,

    // Actions
    loadProducts,
    loadProduct,
    searchProducts: searchProductsAction,
    loadTrendingProducts,
    loadFavoriteProducts,
    toggleProductFavorite,
    trackView,
    updateFilters,
    resetFilters,
    clearProduct,
    clearSearch
  }
}

export default useProducts
