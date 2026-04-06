'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
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
  const shouldReduceMotion = useReducedMotion()
  const isLoading = isPageLoading('products')
  const easeOut = [0.22, 1, 0.36, 1] as const
  const enter = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: easeOut },
      }

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
        // Render watch listing directly (no tabs UI)
        return []
      
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
    <motion.div className="space-y-2" {...enter}>
      <motion.div className="flex items-center justify-between gap-2" {...enter}>
        {/* Title + Description */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Products
          </h1>
          <p className="mt-0.5 hidden text-xs text-muted-foreground md:block">
            Manage your product catalog and inventory.
          </p>
        </div>

        {/* Button */}
        <motion.button
          onClick={handleAddProduct}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium shadow-sm text-sm
               bg-primary text-primary-foreground hover:bg-primary/90 transition cursor-pointer"
          whileHover={!shouldReduceMotion ? { y: -1, scale: 1.01 } : undefined}
          whileTap={!shouldReduceMotion ? { scale: 0.99 } : undefined}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </motion.button>
      </motion.div>
      {isLoading ? (
        <motion.div {...enter}><PageLoader /></motion.div>
      ) : sellerType === 'watch' ? (
        <motion.div {...enter}><WatchListing /></motion.div>
      ) : tabs.length > 0 ? (
        <motion.div {...enter}>
          <ReusableTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="underline"
            size="md"
          />
        </motion.div>
      ) : (
        <motion.div
          className="rounded-xl border p-8 text-center space-y-4"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          {...enter}
        >
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--card-foreground)' }}>
            No Products Found
          </h3>
          <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>
            You haven&apos;t added any products yet. Click &ldquo;Add Product&rdquo; to create your first listing.
          </p>
          <motion.button
            onClick={handleAddProduct}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-sm 
                 bg-primary text-primary-foreground hover:bg-primary/90 transition cursor-pointer"
            whileHover={!shouldReduceMotion ? { y: -1, scale: 1.01 } : undefined}
            whileTap={!shouldReduceMotion ? { scale: 0.99 } : undefined}
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
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}
