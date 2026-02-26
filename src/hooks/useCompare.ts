import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { RootState, AppDispatch } from '@/store'
import {
  addToCompare,
  removeFromCompare,
  clearCompare,
  toggleCompareVisibility,
  setCompareVisibility,
  reorderCompareProducts,
  CompareProduct,
  COMPARE_MAX_PRODUCTS
} from '@/features/compare/compareSlice'
import { Diamond } from '@/components/diamonds/DiamondResults'

// Remove local interfaces since we'll use a flexible type
// Union type for all product types that can be compared  
type ComparableProduct = Diamond | Record<string, unknown>;

export const useCompare = () => {
  const dispatch = useDispatch<AppDispatch>()
  const compareState = useSelector((state: RootState) => state.compare)
  const products = compareState?.products || []
  // Always use COMPARE_MAX_PRODUCTS (ignore any stale persisted maxProducts)
  const maxProducts = COMPARE_MAX_PRODUCTS
  const isVisible = compareState?.isVisible || false

  const addProduct = useCallback((product: ComparableProduct, type: 'diamond' | 'gemstone' | 'jewelry' | 'watch') => {
    const typedProduct = product as Record<string, unknown>;
    const compareProduct: CompareProduct = {
      id: typedProduct.id as string,
      type,
      name:
        (typedProduct.name as string) ||
        (
          ((typedProduct.brand as string) || '') +
          (typedProduct.model ? ` ${String(typedProduct.model)}` : '')
        ).trim() ||
        `${typedProduct.caratWeight || typedProduct.weight || ''}ct ${typedProduct.shape || typedProduct.cut || type}`,
      price: typedProduct.price as number | string,
      image: (typedProduct.images as string[])?.[0] || (typedProduct.image1 as string) || 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg',
      data: product as unknown as Diamond | { id: string; name: string; [key: string]: unknown },
      addedAt: Date.now()
    }
    
    dispatch(addToCompare(compareProduct))
  }, [dispatch])

  const removeProduct = useCallback((productId: string) => {
    dispatch(removeFromCompare(productId))
  }, [dispatch])

  const clearAll = useCallback(() => {
    dispatch(clearCompare())
  }, [dispatch])

  const toggleVisibility = useCallback(() => {
    dispatch(toggleCompareVisibility())
  }, [dispatch])

  const setVisibility = useCallback((visible: boolean) => {
    dispatch(setCompareVisibility(visible))
  }, [dispatch])

  const reorderProducts = useCallback((products: CompareProduct[]) => {
    dispatch(reorderCompareProducts(products))
  }, [dispatch])

  const isProductInCompare = useCallback((productId: string) => {
    return products.some(p => p.id === productId)
  }, [products])

  const canAddMore = useCallback(() => {
    return products.length < maxProducts
  }, [products.length, maxProducts])

  const getCompareCount = useCallback(() => {
    return products.length
  }, [products.length])

  const getProductsByType = useCallback((type: 'diamond' | 'gemstone' | 'jewelry' | 'watch') => {
    return products.filter(p => p.type === type)
  }, [products])

  return {
    // State
    products,
    isVisible,
    maxProducts,
    
    // Actions
    addProduct,
    removeProduct,
    clearAll,
    toggleVisibility,
    setVisibility,
    reorderProducts,
    
    // Helpers
    isProductInCompare,
    canAddMore,
    getCompareCount,
    getProductsByType
  }
}

export default useCompare
