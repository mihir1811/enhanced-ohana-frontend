'use client'


import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLoading } from '@/hooks/useLoading'
import { PageLoader } from '@/components/seller/Loader'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import DiamondsListing from '@/components/seller/productListings/DiamondsListing'
import GemstonesListing from '@/components/seller/productListings/GemstonesListing'

export default function SellerProductsPage() {
  const { setPageLoading, isPageLoading } = useLoading()
  const router = useRouter()
  const isLoading = isPageLoading('products')

  useEffect(() => {
    setPageLoading('products', true)

    // Simulate loading products data
    const timer = setTimeout(() => {
      setPageLoading('products', false)
    }, 2000)

    return () => clearTimeout(timer)
  }, []) // Empty dependency array - only run once on mount


  // Get sellerType from redux state
  const sellerType = useSelector((state: RootState) => state.seller.profile?.sellerType)

  const handleAddProduct = () => {
    router.push('/seller/add-product')
  }

  console.log(sellerType, "Efwefwefwefwefawefwe")

  if (isLoading) {
    return <PageLoader />
  }
  function getListingComponent(sellerType?: string) {
    switch (sellerType) {
      case 'naturalDiamond':
        return <DiamondsListing />
      case 'gemstone':
        return <GemstonesListing />
      case 'jewelry':
        return <h1>jewelry list</h1>
      default:
        return (
          <div className="rounded-xl border p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Products Page</h3>
            <p className="text-base">No seller type found.</p>
          </div>
        )
    }
  }


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Title + Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Products
          </h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            Manage your product catalog and inventory.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handleAddProduct}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-sm 
               bg-primary text-primary-foreground hover:bg-primary/90 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>
      {isLoading ? (
        <PageLoader />
      ) : 1 > 0 ? (
        getListingComponent(sellerType)
      ) : (
        <div className="rounded-xl border p-8 text-center"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--card-foreground)' }}>
            No Products Found
          </h3>
          <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>
            You haven’t added any products yet. Click "Add New Product" to get started.
          </p>
        </div>
      )}
    </div>
  )
}
