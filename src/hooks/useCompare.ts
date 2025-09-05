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
  CompareProduct
} from '@/features/compare/compareSlice'
import { Diamond } from '@/components/diamonds/DiamondResults'

export const useCompare = () => {
  const dispatch = useDispatch<AppDispatch>()
  const compareState = useSelector((state: RootState) => state.compare)

  const addProduct = useCallback((product: Diamond | any, type: 'diamond' | 'gemstone' | 'jewelry') => {
    const compareProduct: CompareProduct = {
      id: product.id,
      type,
      name: product.name || `${product.caratWeight || product.weight || ''}ct ${product.shape || product.cut || type}`,
      price: product.price,
      image: product.images?.[0] || product.image || 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg',
      data: product,
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
    return compareState.products.some(p => p.id === productId)
  }, [compareState.products])

  const canAddMore = useCallback(() => {
    return compareState.products.length < compareState.maxProducts
  }, [compareState.products.length, compareState.maxProducts])

  const getCompareCount = useCallback(() => {
    return compareState.products.length
  }, [compareState.products.length])

  const getProductsByType = useCallback((type: 'diamond' | 'gemstone' | 'jewelry') => {
    return compareState.products.filter(p => p.type === type)
  }, [compareState.products])

  return {
    // State
    products: compareState.products,
    isVisible: compareState.isVisible,
    maxProducts: compareState.maxProducts,
    
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
