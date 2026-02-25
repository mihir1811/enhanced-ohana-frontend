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
import { ReusableTabs, TabItem } from '@/components/ui/ReusableTabs'

export default function SellerProductsPage() {
  const { setPageLoading, isPageLoading } = useLoading()
  const router = useRouter()
  const isLoading = isPageLoading('products')

  useEffect(() => {
    setPageLoading('products', true)
    const timer = setTimeout(() => setPageLoading('products', false), 400)
    return () => clearTimeout(timer)
  }, [setPageLoading])


  // Get sellerType from redux state
  const profile = useSelector((state: RootState) => state.seller.profile)
  const [activeTab, setActiveTab] = useState<string>('jewellery')

  // Type guard to check if profile is SellerData with sellerType
  const sellerType = profile && 'sellerType' in profile ? profile.sellerType : undefined
  const sellerId = profile?.id?.toString()

  const handleAddProduct = () => {
    router.push('/seller/add-product')
  }

  function getTabsForSellerType(sellerType?: string): TabItem[] {
    switch (sellerType) {
      case 'naturalDiamond':
        return [
          {
            id: 'single',
            label: 'Natural Diamonds',
            content: <DiamondsListing sellerId={sellerId} stoneType="naturalDiamond" />
          },
          {
            id: 'melee',
            label: 'Melee Diamonds',
            content: <MeleeDiamondsListing sellerId={sellerId} stoneType="naturalDiamond" />
          }
        ]
      
      case 'labGrownDiamond':
        return [
          {
            id: 'single',
            label: 'Lab Grown Diamonds',
            content: <DiamondsListing sellerId={sellerId} stoneType="labGrownDiamond" />
          },
          {
            id: 'melee',
            label: 'Melee Diamonds',
            content: <MeleeDiamondsListing sellerId={sellerId} stoneType="labGrownDiamond" />
          }
        ]
      
      case 'gemstone':
        return [
          {
            id: 'single',
            label: 'Single Gemstones',
            content: <GemstonesListing />
          },
          {
            id: 'melee',
            label: 'Melee Gemstones',
            content: <MeleeGemstonesListing />
          }
        ]
      
      case 'jewellery':
        return [
          {
            id: 'jewellery',
            label: 'Jewelry Products',
            content: <JewelryListing />
          },
          {
            id: 'watch',
            label: 'Watch Products',
            content: <WatchListing />
          }
        ]
      
      case 'bullion':
        return [
          {
            id: 'bullion',
            label: 'Bullion Products',
            content: <BullionListing />
          }
        ]
      
      case 'watch':
        return [
          {
            id: 'watch',
            label: 'Watch Products',
            content: <WatchListing />
          }
        ]
      
      default:
        return []
    }
  }


  const tabs = getTabsForSellerType(sellerType)

  // Set default active tab based on available tabs
  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(tab => tab.id === activeTab)) {
      setActiveTab(tabs[0].id)
    }
  }, [tabs, activeTab])

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
      ) : tabs.length > 0 ? (
        <ReusableTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="underline"
          size="md"
        />
      ) : (
        <div
          className="rounded-xl border p-8 text-center space-y-4"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--card-foreground)' }}>
            No Products Found
          </h3>
          <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>
            You haven&apos;t added any products yet. Click &ldquo;Add Product&rdquo; to create your first listing.
          </p>
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
      )}
    </div>
  )
}
