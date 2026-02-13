'use client'


import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLoading } from '@/hooks/useLoading'
import { PageLoader } from '@/components/seller/Loader'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import DiamondsListing from '@/components/seller/productListings/DiamondsListing'
import MeleeDiamondsListing from '@/components/seller/productListings/MeleeDiamondsListing'
import GemstonesListing from '@/components/seller/productListings/GemstonesListing'
import MeleeGemstonesListing from '@/components/seller/productListings/MeleeGemstonesListing'
import JewelryListing from '@/components/seller/productListings/JewelryListing'
import BullionListing from '@/components/seller/productListings/BullionListing'
import WatchListing from '@/components/seller/productListings/WatchListing'

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
  }, [setPageLoading]) // Include setPageLoading in dependency array


  // Get sellerType from redux state
  const profile = useSelector((state: RootState) => state.seller.profile)
  const [activeTab, setActiveTab] = useState<'jewellery' | 'watch' | 'single' | 'melee'>('jewellery')

  // Type guard to check if profile is SellerData with sellerType
  const sellerType = profile && 'sellerType' in profile ? profile.sellerType : undefined
  const sellerId = profile?.id?.toString()

  const handleAddProduct = () => {
    router.push('/seller/add-product')
  }

  function getListingComponent(sellerType?: string) {
    switch (sellerType) {
      case 'naturalDiamond':
        return (
          <div className="space-y-6">
            <div className="flex gap-4 border-b">
              <button
                onClick={() => setActiveTab('single')}
                className={`pb-4 px-4 font-medium transition-all ${
                  (activeTab === 'single' || (activeTab !== 'melee' && activeTab !== 'single'))
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Natural Diamonds
              </button>
              <button
                onClick={() => setActiveTab('melee')}
                className={`pb-4 px-4 font-medium transition-all ${
                  activeTab === 'melee'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Melee Diamonds
              </button>
            </div>
            {activeTab === 'melee' ? (
              <MeleeDiamondsListing sellerId={sellerId} stoneType="naturalDiamond" />
            ) : (
              <DiamondsListing sellerId={sellerId} stoneType="naturalDiamond" />
            )}
          </div>
        )
      case 'labGrownDiamond':
        // For lab grown sellers, we default to single lab grown diamonds but allow switching to melee
        // We initialize activeTab to 'single' if it's currently 'jewellery' (default)
        return (
          <div className="space-y-6">
            <div className="flex gap-4 border-b">
              <button
                onClick={() => setActiveTab('single')}
                className={`pb-4 px-4 font-medium transition-all ${
                  (activeTab === 'single' || (activeTab !== 'melee' && activeTab !== 'single'))
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Lab Grown Diamonds
              </button>
              <button
                onClick={() => setActiveTab('melee')}
                className={`pb-4 px-4 font-medium transition-all ${
                  activeTab === 'melee'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Melee Diamonds
              </button>
            </div>
            {activeTab === 'melee' ? (
              <MeleeDiamondsListing sellerId={sellerId} stoneType="labGrownDiamond" />
            ) : (
              <DiamondsListing sellerId={sellerId} stoneType="labGrownDiamond" />
            )}
          </div>
        )
      case 'gemstone':
        return (
          <div className="space-y-6">
            <div className="flex gap-4 border-b">
              <button
                onClick={() => setActiveTab('single')}
                className={`pb-4 px-4 font-medium transition-all ${
                  (activeTab === 'single' || (activeTab !== 'melee' && activeTab !== 'single'))
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Single Gemstones
              </button>
              <button
                onClick={() => setActiveTab('melee')}
                className={`pb-4 px-4 font-medium transition-all ${
                  activeTab === 'melee'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Melee Gemstones
              </button>
            </div>
            {activeTab === 'melee' ? (
              <MeleeGemstonesListing />
            ) : (
              <GemstonesListing />
            )}
          </div>
        )
      case 'jewellery':
        return (
          <div className="space-y-6">
            <div className="flex gap-4 border-b">
              <button
                onClick={() => setActiveTab('jewellery')}
                className={`pb-4 px-4 font-medium transition-all ${
                  activeTab === 'jewellery'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Jewelry Products
              </button>
              <button
                onClick={() => setActiveTab('watch')}
                className={`pb-4 px-4 font-medium transition-all ${
                  activeTab === 'watch'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Watch Products
              </button>
            </div>
            {activeTab === 'jewellery' ? <JewelryListing /> : <WatchListing />}
          </div>
        )
      case 'bullion':
        return <BullionListing />
      case 'watch':
        return <WatchListing />
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
               bg-primary text-primary-foreground hover:bg-primary/90 transition cursor-pointer"
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
            You haven&apos;t added any products yet. Click &ldquo;Add New Product&rdquo; to get started.
          </p>
        </div>
      )}
    </div>
  )
}
