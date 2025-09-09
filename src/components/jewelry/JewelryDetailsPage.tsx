'use client'

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Share2, 
  Eye, 
  Shield, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Truck,
  RefreshCw,
  Award,
  Info,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WishlistButton } from '@/components/shared/WishlistButton';

// Minimalistic Image Gallery Component
interface ImageGalleryProps {
  images: (string | null | undefined)[]
  alt: string
  className?: string
}

function ImageGallery({ images, alt, className = "" }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showZoom, setShowZoom] = useState(false)

  // Filter out null and undefined images
  const validImages = images.filter((img): img is string => img !== null && img !== undefined && img !== '')

  if (validImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-50 rounded-3xl flex items-center justify-center border border-gray-100">
        <div className="text-center text-gray-400">
          <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <Star className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-sm">No Image</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image Display - Minimal Design */}
      <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 group">
        <div className="aspect-square relative">
          <img
            src={validImages[currentImageIndex]}
            alt={alt}
            className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 hover:scale-105"
            onClick={() => setShowZoom(true)}
          />

          {/* Minimal Navigation */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % validImages.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
            </>
          )}

          {/* Minimal Zoom Indicator */}
          <div className="absolute bottom-6 right-6 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Eye className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Minimal Thumbnail Gallery */}
      {validImages.length > 1 && (
        <div className="flex justify-center gap-2">
          {validImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === index
                  ? 'border-gray-900'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Minimal Zoom Modal */}
      {showZoom && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setShowZoom(false)}>
          <div className="relative max-w-4xl max-h-full">
            <img
              src={validImages[currentImageIndex]}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-2xl"
            />
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-lg font-light hover:bg-gray-50 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface JewelryDetailsPageProps {
  jewelry: any | null;
}

const JewelryDetailsPage: React.FC<JewelryDetailsPageProps> = ({ jewelry }) => {
  const [selectedTab, setSelectedTab] = useState('details');
  const [quantity, setQuantity] = useState(1);
  const [collapsedSections, setCollapsedSections] = useState({
    technicalSpecs: false,
    priceBreakdown: false,
    stoneDetails: false,
    metalDetails: false,
    stones: {} as Record<number, boolean>
  });
  const router = useRouter();

  const toggleSection = (section: string, stoneIndex?: number) => {
    setCollapsedSections(prev => {
      if (section === 'stones' && stoneIndex !== undefined) {
        return {
          ...prev,
          stones: {
            ...prev.stones,
            [stoneIndex]: !prev.stones[stoneIndex]
          }
        };
      }
      return {
        ...prev,
        [section]: !prev[section as keyof typeof prev]
      };
    });
  };

  if (!jewelry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">Jewelry not found</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">The jewelry piece you're looking for is not available.</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `₹${numPrice.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <button onClick={() => router.back()} className="hover:text-gray-900 transition-colors">
              Home
            </button>
            <span className="mx-2 sm:mx-3">/</span>
            <button onClick={() => router.back()} className="hover:text-gray-900 transition-colors">
              {jewelry.category || 'Jewelry'}
            </button>
            <span className="mx-2 sm:mx-3">/</span>
            <span className="text-gray-900 truncate">{jewelry.name}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery - Left Side */}
          <div className="lg:sticky lg:top-8">
            <ImageGallery
              images={[jewelry.image1, jewelry.image2, jewelry.image3, jewelry.image4, jewelry.image5, jewelry.image6]}
              alt={jewelry.name || 'Jewelry'}
            />
          </div>

          {/* Product Information - Right Side */}
          <div className="space-y-6 sm:space-y-8">
            {/* Product Header */}
            <div className="space-y-3 sm:space-y-4">
              {/* Seller Name */}
              <div>
               {jewelry.seller && jewelry.seller.companyName && (
                  <a
                    href={`/product/seller-info/${jewelry.seller.id || jewelry.sellerId}`}
                    className="text-blue-600 hover:underline text-lg font-semibold mb-1 block"
                  >
                    {jewelry.seller.companyName}
                  </a>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 leading-tight">
                {jewelry.name || 'Elegant Jewelry Piece'}
              </h1>

              <div className="text-sm text-gray-500">
                Style: <span className="text-gray-900 font-medium">{jewelry.skuCode || 'N/A'}</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl font-light text-gray-900">
                {jewelry.totalPrice ? formatPrice(jewelry.totalPrice) : 'Price on request'}
              </div>
              <div className="text-sm text-gray-500">
                Including all taxes and charges
              </div>
            </div>

            {/* Key Features - Minimal List */}
            {(jewelry.metalType || jewelry.metalPurity || jewelry.metalWeight || jewelry.collection) && (
              <div className="space-y-3 pb-6 sm:pb-8 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900">Details</h3>
                <div className="space-y-2 text-sm">
                  {jewelry.metalType && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Metal</span>
                      <span className="text-gray-900 capitalize">{jewelry.metalType.replace('-', ' ')}</span>
                    </div>
                  )}
                  {jewelry.metalPurity && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Purity</span>
                      <span className="text-gray-900">{jewelry.metalPurity}</span>
                    </div>
                  )}
                  {jewelry.metalWeight && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Weight</span>
                      <span className="text-gray-900">{jewelry.metalWeight}g</span>
                    </div>
                  )}
                  {jewelry.collection && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Collection</span>
                      <span className="text-gray-900">{jewelry.collection}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quantity Selector - Minimal */}
            <div className="space-y-4 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-900">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 rounded-l-full transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-50 rounded-r-full transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons - Minimal */}
            <div className="space-y-4">
              <button className="w-full bg-gray-900 text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 touch-target">
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>

              <div className="flex gap-3">
                <WishlistButton
                  productId={typeof jewelry?.id === 'string' ? parseInt(jewelry.id) : (jewelry?.id || 0)}
                  productType="jewellery"
                  showText
                  className="flex-1 border border-gray-200 rounded-full py-3 font-medium transition-colors flex items-center justify-center gap-2 touch-target hover:bg-gray-50"
                />
                <button className="flex-1 border border-gray-200 rounded-full py-3 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 touch-target">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Trust Indicators - Minimal */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-gray-100">
              <div className="text-center space-y-2">
                <Truck className="w-5 h-5 text-gray-600 mx-auto" />
                <div className="text-xs text-gray-500">Free shipping</div>
              </div>
              <div className="text-center space-y-2">
                <RefreshCw className="w-5 h-5 text-gray-600 mx-auto" />
                <div className="text-xs text-gray-500">Easy returns</div>
              </div>
              <div className="text-center space-y-2">
                <Shield className="w-5 h-5 text-gray-600 mx-auto" />
                <div className="text-xs text-gray-500">Authentic</div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Information Tabs */}
        <div className="mt-16 sm:mt-24 border-t border-gray-100">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {[
              { id: 'details', label: 'Details' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'care', label: 'Care' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-w-0 flex-shrink-0 ${selectedTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content - Minimal Design */}
          <div className="py-4 sm:py-6">
            {selectedTab === 'details' && (
              <div className="max-w-2xl space-y-6">
                {jewelry.description && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">About this piece</h3>
                    <p className="text-gray-600 leading-relaxed">{jewelry.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Material</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      {jewelry.metalType && <div>Type: {jewelry.metalType.replace('-', ' ')}</div>}
                      {jewelry.metalPurity && <div>Purity: {jewelry.metalPurity}</div>}
                      {jewelry.metalWeight && <div>Weight: {jewelry.metalWeight}g</div>}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Style</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      {jewelry.category && <div>Category: {jewelry.category}</div>}
                      {jewelry.collection && <div>Collection: {jewelry.collection}</div>}
                      {jewelry.gender && <div>Gender: {jewelry.gender}</div>}
                      {jewelry.occasion && <div>Occasion: {jewelry.occasion}</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'specifications' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                {/* Left Column - Product Summary */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Product Summary Card */}
                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Product Summary</h3>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        { label: 'Style No.', value: jewelry.skuCode },
                        { label: 'Ring Size', value: jewelry.size || '12 (16.5 mm)' },
                        { label: 'Metal Weight', value: jewelry.metalWeight ? `${jewelry.metalWeight}g` : null },
                        { label: 'Gross Weight', value: jewelry.grossWeight || jewelry.totalWeight ? `${jewelry.grossWeight || jewelry.totalWeight}g` : null },
                      ].filter(item => item.value).map(item => (
                        <div key={item.label} className="flex justify-between items-center py-2">
                          <span className="text-gray-600 font-medium">{item.label}</span>
                          <span className="text-gray-900 font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {jewelry.metalWeight && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          *Difference in gold weight may occur & will apply on final price.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Help Section */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 text-center">
                    <h4 className="text-base font-semibold text-gray-900 mb-3">
                      Need help to find the best jewellery for you?
                    </h4>
                    <p className="text-sm text-gray-500 mb-4 sm:mb-6">We are available for your assistance</p>

                    <div className="flex justify-center gap-6 sm:gap-8">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Speak with Experts</span>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Chat with Experts</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Price Breakdown & Details */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Price Breakdown Card */}
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('priceBreakdown')}
                      className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors touch-target"
                    >
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">PRICE BREAKUP</h3>
                      {collapsedSections.priceBreakdown ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    {!collapsedSections.priceBreakdown && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
                        <div className="space-y-3 sm:space-y-4 mt-4">
                          {jewelry.basePrice && (
                            <div className="flex justify-between items-center py-3">
                              <span className="text-gray-600 font-medium">Metal</span>
                              <span className="text-gray-900 font-semibold text-right">{formatPrice(jewelry.basePrice)}</span>
                            </div>
                          )}

                          {jewelry.stonePrice && (
                            <div className="flex justify-between items-center py-3">
                              <span className="text-gray-600 font-medium">Diamond</span>
                              <div className="text-right">
                                <span className="text-gray-400 line-through text-sm mr-2">₹67,930</span>
                                <span className="text-gray-900 font-semibold">{formatPrice(jewelry.stonePrice)}</span>
                              </div>
                            </div>
                          )}

                          {jewelry.makingCharge && (
                            <div className="flex justify-between items-center py-3">
                              <span className="text-gray-600 font-medium">Making Charges</span>
                              <div className="text-right">
                                <span className="text-gray-400 line-through text-sm mr-2">₹12,700</span>
                                <span className="text-gray-900 font-semibold">{formatPrice(jewelry.makingCharge)}</span>
                              </div>
                            </div>
                          )}

                          {jewelry.tax && (
                            <div className="flex justify-between items-center py-3">
                              <span className="text-gray-600 font-medium">GST(3%)</span>
                              <div className="text-right">
                                <span className="text-gray-400 line-through text-sm mr-2">₹3,657</span>
                                <span className="text-gray-900 font-semibold">
                                  {formatPrice(((jewelry.basePrice || 0) + (jewelry.makingCharge || 0) + (jewelry.stonePrice || 0)) * (jewelry.tax / 100))}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="border-t border-gray-200 mt-4 sm:mt-6 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-900 font-bold text-base sm:text-lg">Grand Total</span>
                            <div className="text-right">
                              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                                {jewelry.totalPrice ? formatPrice(jewelry.totalPrice) : '₹1,04,816'}
                              </div>
                              <div className="text-sm text-gray-500">(MRP Incl. of all taxes)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metal Details Card */}
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('metalDetails')}
                      className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors touch-target"
                    >
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">METAL DETAILS</h3>
                      {collapsedSections.metalDetails ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    {!collapsedSections.metalDetails && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
                        <div className="space-y-3 mt-4">
                          {[
                            { label: 'Metal Type', value: jewelry.metalType },
                            { label: 'Metal Purity', value: jewelry.metalPurity },
                            { label: 'Metal Weight', value: jewelry.metalWeight ? `${jewelry.metalWeight}g` : null }
                          ].filter(item => item.value).map(item => (
                            <div key={item.label} className="flex justify-between items-center py-2">
                              <span className="text-gray-600 font-medium">{item.label}</span>
                              <span className="text-gray-900 font-semibold capitalize">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Diamond/Stone Details Card */}
                  {jewelry.stones && jewelry.stones.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => toggleSection('stoneDetails')}
                        className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors touch-target"
                      >
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">DIAMOND DETAILS</h3>
                        {collapsedSections.stoneDetails ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        )}
                      </button>

                      {!collapsedSections.stoneDetails && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
                          <div className="space-y-3 sm:space-y-4 mt-4">
                            {jewelry.stones.map((stone: any, index: number) => (
                              <div key={index} className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Stone {index + 1}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                  {[
                                    { label: 'Type', value: stone.type },
                                    { label: 'Shape', value: stone.shape },
                                    { label: 'Carat', value: stone.carat ? `${stone.carat}ct` : null },
                                    { label: 'Color', value: stone.color },
                                    { label: 'Clarity', value: stone.clarity },
                                    { label: 'Cut', value: stone.cut }
                                  ].filter(item => item.value).map(item => (
                                    <div key={item.label} className="flex justify-between py-1">
                                      <span className="text-gray-600 text-sm">{item.label}</span>
                                      <span className="text-gray-900 font-medium text-sm capitalize">{item.value}</span>
                                    </div>
                                  ))}
                                </div>
                                {index < jewelry.stones.length - 1 && (
                                  <hr className="border-gray-100" />
                                )}
                              </div>
                            ))}

                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <p className="text-xs text-gray-500">
                                *A differential amount will be applicable with difference in weight if any.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === 'care' && (
              <div className="max-w-2xl space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Care Instructions</h3>
                  <div className="space-y-3 sm:space-y-4 text-sm text-gray-600">
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Store in a soft cloth pouch or jewelry box to prevent scratches</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Clean with a soft, dry cloth after each wear</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Avoid contact with perfumes, lotions, and cleaning agents</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Remove before swimming, exercising, or showering</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Professional Service</h4>
                  <p className="text-sm text-gray-600">
                    For deep cleaning and maintenance, visit our store or contact customer service
                    to schedule professional jewelry cleaning and inspection.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelryDetailsPage;
