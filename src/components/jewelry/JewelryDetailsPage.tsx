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
  Plus,
  Minus,
  Check,
  MessageSquare
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { WishlistButton } from '@/components/shared/WishlistButton';
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { cartService } from '@/services/cartService';

interface StoneDetails {
  stoneType?: string;
  stoneCaratWeight?: number;
  stoneColor?: string;
  stoneClarity?: string;
  stoneCut?: string;
  stoneShape?: string;
  stonePrice?: number;
  type?: string;
  carat?: number;
  color?: string;
  clarity?: string;
  cut?: string;
  shape?: string;
  [key: string]: unknown;
}

interface JewelryAttributes {
  [key: string]: unknown;
}

// Minimalistic Image Gallery Component
interface ImageGalleryProps {
  images: (string | null | undefined)[]
  alt: string
}

function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showZoom, setShowZoom] = useState(false)

  // Filter out null and undefined images
  const validImages = images.filter((img): img is string => img !== null && img !== undefined && img !== '')

  if (validImages.length === 0) {
    return (
      <div className="aspect-square rounded-3xl flex items-center justify-center border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
        <div className="text-center" style={{ color: 'var(--muted-foreground)' }}>
          <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
            <Star className="w-8 h-8" style={{ color: 'var(--muted-foreground)' }} />
          </div>
          <p className="text-sm">No Image</p>
        </div>
      </div>
    )
  }

  return (
    <div className="lg:flex lg:gap-4 lg:items-start space-y-4 lg:space-y-0">
      {validImages.length > 1 && (
        <div className="hidden lg:flex lg:flex-col lg:gap-2 lg:w-20">
          {validImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300`}
              style={currentImageIndex === index ? { borderColor: 'var(--primary)' } : { borderColor: 'var(--border)' }}
            >
              <Image src={img} alt={`View ${index + 1}`} width={56} height={56} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Display */}
      <div className="relative rounded-3xl overflow-hidden border group" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="aspect-square relative">
          <Image
            src={validImages[currentImageIndex]}
            alt={alt}
            width={400}
            height={400}
            className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 hover:scale-105"
            onClick={() => setShowZoom(true)}
          />

          {/* Minimal Navigation */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full shadow-sm border flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <ChevronLeft className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % validImages.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full shadow-sm border flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <ChevronRight className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
              </button>
            </>
          )}

          {/* Zoom Indicator */}
          <div className="absolute bottom-6 right-6 w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ backgroundColor: 'var(--card)' }}>
            <Eye className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
          </div>
        </div>
      </div>

      {/* Thumbnail Gallery (mobile) */}
      {validImages.length > 1 && (
        <div className="flex justify-center gap-2 lg:hidden">
          {validImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300`}
              style={currentImageIndex === index ? { borderColor: 'var(--primary)' } : { borderColor: 'var(--border)' }}
            >
              <Image src={img} alt={`View ${index + 1}`} width={64} height={64} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Minimal Zoom Modal */}
      {showZoom && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background)' }} onClick={() => setShowZoom(false)}>
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={validImages[currentImageIndex]}
              alt={alt}
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain rounded-2xl"
            />
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full shadow-sm flex items-center justify-center text-lg font-light transition-colors"
              style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Extended jewelry type for this component that includes all possible properties
export interface JewelryDetailsItem {
  id: number | string;
  name?: string;
  description?: string;
  basePrice?: number;
  makingCharge?: number;
  tax?: number;
  totalPrice?: number;
  stonePrice?: number;
  metalType?: string;
  metalPurity?: string;
  metalWeight?: number;
  grossWeight?: number;
  totalWeight?: number;
  size?: string;
  category?: string;
  subcategory?: string;
  collection?: string;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  image5?: string | null;
  image6?: string | null;
  sellerId?: string;
  user_id?: string;
  seller?: {
    id: string;
    userId?: string;
    companyName?: string;
    companyLogo?: string;
  };
  attributes?: JewelryAttributes;
  stones?: StoneDetails[];
  [key: string]: unknown; // Allow additional properties
}

interface JewelryDetailsPageProps {
  jewelry: JewelryDetailsItem | null;
}

const JewelryDetailsPage: React.FC<JewelryDetailsPageProps> = ({ jewelry }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('details');
  const [collapsedSections, setCollapsedSections] = useState({
    overview: false,
    specifications: false,
    priceBreakdown: false,
    metalDetails: false,
    stoneDetails: false,
    stones: {} as Record<number, boolean>
  });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const router = useRouter();

  // Get authentication token and user from Redux store
  const { token, user } = useSelector((state: RootState) => state.auth);

  const handleAddToCart = async () => {
    if (!jewelry) return;
    
    if (!token) {
      console.error('User not authenticated');
      // You can add a toast notification or redirect to login here
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await cartService.addToCart({
        productId: Number(jewelry.id),
        productType: 'jewellery',
        quantity: quantity
      }, token);
      console.log('Jewelry added to cart successfully');
      // You can add a toast notification here
    } catch (error) {
      console.error('Failed to add jewelry to cart:', error);
      // You can add error handling/toast here
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleChatWithSeller = () => {
    // Try to get seller ID from multiple possible locations
    // We prioritize seller.userId because the chat system works between Users (not Seller entities)
    const sellerId = jewelry?.seller?.userId || jewelry?.user_id || jewelry?.seller?.id || jewelry?.sellerId
    
    if (!sellerId) {
      console.warn('No seller information available', { 
        jewelry: jewelry,
        userId: jewelry?.user_id,
        sellerId: jewelry?.seller?.id,
        directSellerId: jewelry?.sellerId
      })
      return
    }

    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login')
      return
    }
    
    // Navigate to chat with product context
    const chatUrl = `/user/chat?sellerId=${sellerId}&productId=${jewelry.id}&productType=jewelry&productName=${encodeURIComponent(jewelry.name || 'Jewelry')}`
    console.log('Navigating to jewelry chat:', { sellerId, productId: jewelry.id, productName: jewelry.name, chatUrl })
    router.push(chatUrl)
  };

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--muted)' }}>
            <Star className="w-12 h-12" style={{ color: 'var(--muted-foreground)' }} />
          </div>
          <h2 className="text-2xl font-light mb-4" style={{ color: 'var(--foreground)' }}>Jewelry not found</h2>
          <p className="mb-8 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>The jewelry piece you&apos;re looking for is not available.</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-colors font-medium hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Minimal Navigation */}
      <nav className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center text-xs sm:text-sm" style={{ color: 'var(--muted-foreground)' }}>
            <button onClick={() => router.back()} className="transition-colors hover:opacity-90">
              Home
            </button>
            <span className="mx-2 sm:mx-3">/</span>
            <button onClick={() => router.back()} className="transition-colors hover:opacity-90">
              {jewelry.category || 'Jewelry'}
            </button>
            <span className="mx-2 sm:mx-3">/</span>
            <span className="truncate" style={{ color: 'var(--foreground)' }}>{jewelry.name}</span>
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
                    className="hover:underline text-lg font-semibold mb-1 block"
                    style={{ color: 'var(--primary)' }}
                  >
                    {jewelry.seller.companyName}
                  </a>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light leading-tight" style={{ color: 'var(--foreground)' }}>
                {jewelry.name || 'Elegant Jewelry Piece'}
              </h1>

              <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Style: <span className="font-medium" style={{ color: 'var(--foreground)' }}>{String(jewelry.skuCode) || 'N/A'}</span>
              </div>
            </div>

            <div className="lg:sticky lg:top-8 rounded-2xl border p-5 sm:p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-light" style={{ color: 'var(--foreground)' }}>
                  {jewelry.totalPrice ? formatPrice(jewelry.totalPrice) : 'Price on request'}
                </div>
                <div className="text-xs sm:text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Including all taxes and charges
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Quantity</span>
                  <div className="flex items-center border rounded-full" style={{ borderColor: 'var(--border)' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 rounded-l-full transition-colors hover:opacity-80"
                    >
                      <Minus className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 rounded-r-full transition-colors hover:opacity-80"
                    >
                      <Plus className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full py-4 rounded-full font-medium disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 touch-target hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>

                  <div className="flex gap-3">
                    <WishlistButton
                      productId={typeof jewelry?.id === 'string' ? parseInt(jewelry.id) : (jewelry?.id || 0)}
                      productType="jewellery"
                      showText
                      variant="outline"
                      shape="pill"
                      className="flex-1"
                    />
                    <button 
                      onClick={handleChatWithSeller}
                      className="flex-1 border rounded-full py-3 font-medium transition-colors flex items-center justify-center gap-2 touch-target hover:opacity-90"
                      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat
                    </button>
                    <button className="flex-1 border rounded-full py-3 font-medium transition-colors flex items-center justify-center gap-2 touch-target hover:opacity-90" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            {(jewelry.metalType || jewelry.metalPurity || jewelry.metalWeight || jewelry.collection) && (
              <div className="space-y-3 pb-6 sm:pb-8 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Details</h3>
                <div className="space-y-2 text-sm">
                  {jewelry.metalType && (
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--muted-foreground)' }}>Metal</span>
                      <span className="capitalize" style={{ color: 'var(--foreground)' }}>{jewelry.metalType.replace('-', ' ')}</span>
                    </div>
                  )}
                  {jewelry.metalPurity && (
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--muted-foreground)' }}>Purity</span>
                      <span style={{ color: 'var(--foreground)' }}>{jewelry.metalPurity}</span>
                    </div>
                  )}
                  {jewelry.metalWeight && (
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--muted-foreground)' }}>Weight</span>
                      <span style={{ color: 'var(--foreground)' }}>{jewelry.metalWeight}g</span>
                    </div>
                  )}
                  {jewelry.collection && (
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--muted-foreground)' }}>Collection</span>
                      <span style={{ color: 'var(--foreground)' }}>{jewelry.collection}</span>
                    </div>
                  )}
                </div>
              </div>
            )}



            {/* Trust Indicators - Minimal */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="text-center space-y-2">
                <Truck className="w-5 h-5 mx-auto" style={{ color: 'var(--muted-foreground)' }} />
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Free shipping</div>
              </div>
              <div className="text-center space-y-2">
                <RefreshCw className="w-5 h-5 mx-auto" style={{ color: 'var(--muted-foreground)' }} />
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Easy returns</div>
              </div>
              <div className="text-center space-y-2">
                <Shield className="w-5 h-5 mx-auto" style={{ color: 'var(--muted-foreground)' }} />
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Authentic</div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Information Tabs */}
        <div className="mt-16 sm:mt-24 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
            {[
              { id: 'details', label: 'Details' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'care', label: 'Care' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-w-0 flex-shrink-0`}
                style={selectedTab === tab.id ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'transparent', color: 'var(--muted-foreground)' }}
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
                    <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--foreground)' }}>About this piece</h3>
                    <p className="leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{jewelry.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>Material</h4>
                    <div className="space-y-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {jewelry.metalType && <div>Type: {jewelry.metalType.replace('-', ' ')}</div>}
                      {jewelry.metalPurity && <div>Purity: {jewelry.metalPurity}</div>}
                      {jewelry.metalWeight && <div>Weight: {jewelry.metalWeight}g</div>}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>Style</h4>
                    <div className="space-y-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {jewelry.category && <div>Category: {jewelry.category}</div>}
                      {jewelry.collection && <div>Collection: {jewelry.collection}</div>}
                      {jewelry.gender ? <div>Gender: {String(jewelry.gender)}</div> : null}
                      {jewelry.occasion ? <div>Occasion: {String(jewelry.occasion)}</div> : null}
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
                  <div className="rounded-2xl p-4 sm:p-6" style={{ backgroundColor: 'var(--muted)' }}>
                    <h3 className="text-lg font-semibold mb-4 sm:mb-6" style={{ color: 'var(--foreground)' }}>Product Summary</h3>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        { label: 'Style No.', value: jewelry.skuCode },
                        { label: 'Ring Size', value: jewelry.size || '12 (16.5 mm)' },
                        { label: 'Metal Weight', value: jewelry.metalWeight ? `${jewelry.metalWeight}g` : null },
                        { label: 'Gross Weight', value: jewelry.grossWeight || jewelry.totalWeight ? `${jewelry.grossWeight || jewelry.totalWeight}g` : null },
                      ].filter(item => item.value).map(item => (
                        <div key={item.label} className="flex justify-between items-center py-2">
                          <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{String(item.value)}</span>
                        </div>
                      ))}
                    </div>

                    {jewelry.metalWeight && (
                      <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          *Difference in gold weight may occur & will apply on final price.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Help Section */}
                  <div className="rounded-2xl p-4 sm:p-6 text-center border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <h4 className="text-base font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                      Need help to find the best jewellery for you?
                    </h4>
                    <p className="text-sm mb-4 sm:mb-6" style={{ color: 'var(--muted-foreground)' }}>We are available for your assistance</p>

                    <div className="flex justify-center gap-6 sm:gap-8">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: 'var(--muted)' }}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Speak with Experts</span>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: 'var(--muted)' }}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Chat with Experts</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Price Breakdown & Details */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Price Breakdown Card */}
                  <div className="border rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <button
                      onClick={() => toggleSection('priceBreakdown')}
                      className="w-full flex items-center justify-between p-4 sm:p-6 transition-colors touch-target hover:opacity-90"
                    >
                      <h3 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--foreground)' }}>PRICE BREAKUP</h3>
                      {collapsedSections.priceBreakdown ? (
                        <ChevronDown className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                      ) : (
                        <ChevronUp className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                      )}
                    </button>

                    {!collapsedSections.priceBreakdown && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div className="space-y-3 sm:space-y-4 mt-4">
                          {jewelry.basePrice && (
                            <div className="flex justify-between items-center py-3">
                              <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>Metal</span>
                              <span className="font-semibold text-right" style={{ color: 'var(--foreground)' }}>{formatPrice(jewelry.basePrice)}</span>
                            </div>
                          )}

                          {jewelry.stonePrice && (
                            <div className="flex justify-between items-center py-3">
                              <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>Diamond</span>
                              <div className="text-right">
                                <span className="line-through text-sm mr-2" style={{ color: 'var(--muted-foreground)' }}>₹67,930</span>
                                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{formatPrice(jewelry.stonePrice)}</span>
                              </div>
                            </div>
                          )}

                          {jewelry.makingCharge && (
                            <div className="flex justify-between items-center py-3">
                              <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>Making Charges</span>
                              <div className="text-right">
                                <span className="line-through text-sm mr-2" style={{ color: 'var(--muted-foreground)' }}>₹12,700</span>
                                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{formatPrice(jewelry.makingCharge)}</span>
                              </div>
                            </div>
                          )}

                          {jewelry.tax && (
                            <div className="flex justify-between items-center py-3">
                              <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>GST(3%)</span>
                              <div className="text-right">
                                <span className="line-through text-sm mr-2" style={{ color: 'var(--muted-foreground)' }}>₹3,657</span>
                                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                                  {formatPrice(((jewelry.basePrice || 0) + (jewelry.makingCharge || 0) + (jewelry.stonePrice || 0)) * (jewelry.tax / 100))}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="border-t mt-4 sm:mt-6 pt-4" style={{ borderColor: 'var(--border)' }}>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-base sm:text-lg" style={{ color: 'var(--foreground)' }}>Grand Total</span>
                            <div className="text-right">
                              <div className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                                {jewelry.totalPrice ? formatPrice(jewelry.totalPrice) : '₹1,04,816'}
                              </div>
                              <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>(MRP Incl. of all taxes)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metal Details Card */}
                  <div className="border rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <button
                      onClick={() => toggleSection('metalDetails')}
                      className="w-full flex items-center justify-between p-4 sm:p-6 transition-colors touch-target hover:opacity-90"
                    >
                      <h3 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--foreground)' }}>METAL DETAILS</h3>
                      {collapsedSections.metalDetails ? (
                        <ChevronDown className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                      ) : (
                        <ChevronUp className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                      )}
                    </button>

                    {!collapsedSections.metalDetails && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div className="space-y-3 mt-4">
                          {[
                            { label: 'Metal Type', value: jewelry.metalType },
                            { label: 'Metal Purity', value: jewelry.metalPurity },
                            { label: 'Metal Weight', value: jewelry.metalWeight ? `${jewelry.metalWeight}g` : null }
                          ].filter(item => item.value).map(item => (
                            <div key={item.label} className="flex justify-between items-center py-2">
                              <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                              <span className="font-semibold capitalize" style={{ color: 'var(--foreground)' }}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Diamond/Stone Details Card */}
                  {jewelry.stones && jewelry.stones.length > 0 && (
                    <div className="border rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                      <button
                        onClick={() => toggleSection('stoneDetails')}
                        className="w-full flex items-center justify-between p-4 sm:p-6 transition-colors touch-target hover:opacity-90"
                      >
                        <h3 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--foreground)' }}>DIAMOND DETAILS</h3>
                        {collapsedSections.stoneDetails ? (
                          <ChevronDown className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                        ) : (
                          <ChevronUp className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                        )}
                      </button>

                      {!collapsedSections.stoneDetails && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t" style={{ borderColor: 'var(--border)' }}>
                          <div className="space-y-3 sm:space-y-4 mt-4">
                            {jewelry.stones.map((stone: StoneDetails, index: number) => (
                              <div key={index} className="space-y-3">
                                <h4 className="font-semibold" style={{ color: 'var(--foreground)' }}>Stone {index + 1}</h4>
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
                                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                                      <span className="font-medium text-sm capitalize" style={{ color: 'var(--foreground)' }}>{item.value}</span>
                                    </div>
                                  ))}
                                </div>
                                {index < (jewelry.stones?.length || 0) - 1 && (
                                  <hr style={{ borderColor: 'var(--border)' }} />
                                )}
                              </div>
                            ))}

                            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
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
                  <h3 className="text-base sm:text-lg font-medium mb-4" style={{ color: 'var(--foreground)' }}>Care Instructions</h3>
                  <div className="space-y-3 sm:space-y-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
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

                <div className="rounded-2xl p-4 sm:p-6" style={{ backgroundColor: 'var(--muted)' }}>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Professional Service</h4>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    For deep cleaning and maintenance, visit our store or contact customer service
                    to schedule professional jewelry cleaning and inspection.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t px-4 py-3 flex items-center justify-between gap-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div>
            <div className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
              {jewelry.totalPrice ? formatPrice(jewelry.totalPrice) : 'Price on request'}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Incl. taxes</div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="flex-1 py-3 rounded-full font-medium disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 touch-target hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <ShoppingCart className="w-4 h-4" />
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JewelryDetailsPage;
