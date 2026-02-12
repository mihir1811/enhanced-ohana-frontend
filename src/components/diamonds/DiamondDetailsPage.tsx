'use client'

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Share2, 
  Download, 
  Eye, 
  Award, 
  Shield, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  TrendingUp,
  CheckCircle,
  Play,
  MessageSquare
} from 'lucide-react';
import Image from 'next/image';
import { Diamond } from './DiamondResults';
import { WishlistButton } from '@/components/shared/WishlistButton';
import { cartService } from '@/services/cartService';
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useRouter } from 'next/navigation'

interface DiamondDetailsPageProps {
  diamond: Diamond | null;
}

const DiamondDetailsPage: React.FC<DiamondDetailsPageProps> = ({ diamond }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'certification' | 'seller'>('overview');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const router = useRouter();

  // Get authentication token from Redux store
  const { token, user } = useSelector((state: RootState) => state.auth);

  const handleAddToCart = async () => {
    if (!diamond) return;
    
    if (!token) {
      console.error('User not authenticated');
      // You can add a toast notification or redirect to login here
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await cartService.addToCart({
        productId: Number(diamond.id),
        productType: 'diamond',
        quantity: 1
      }, token);
      console.log('Diamond added to cart successfully');
      // You can add a toast notification here
    } catch (error) {
      console.error('Failed to add diamond to cart:', error);
      // You can add error handling/toast here
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleChatWithSeller = async () => {
    // Try to get seller ID from multiple possible locations
    // We prioritize seller.userId because the chat system works between Users (not Seller entities)
    const sellerId = diamond?.seller?.userId || diamond?.seller?.id || diamond?.sellerId
    
    if (!sellerId) {
      console.warn('No seller information available', { 
        diamond: diamond,
        sellerId: diamond?.seller?.id,
        directSellerId: diamond?.sellerId
      })
      return
    }

    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login')
      return
    }

    try {

      console.log(diamond.seller , "diamond.seller","Navigating to chat:", diamond)
      // Try to create or get existing chat with seller
      const productId = diamond.id
      const productName = diamond.name || `${diamond.caratWeight}ct ${diamond.shape} Diamond`
      
      // Navigate to main chat page with seller pre-selected
      const chatUrl = `/user/chat?sellerId=${sellerId}&productId=${productId}&productType=diamond&productName=${encodeURIComponent(productName)}`
      console.log('Navigating to chat:', "diamond user id" ,diamond.seller?.userId, { sellerId, productId, productName, chatUrl })
      router.push(chatUrl)
    } catch (error) {
      console.error('Failed to initiate chat:', error)
      // Still navigate to chat page, let it handle the error
      const productId = diamond.id
      const productName = diamond.name || `${diamond.caratWeight}ct ${diamond.shape} Diamond`
      const chatUrl = `/user/chat?sellerId=${sellerId}&productId=${productId}&productType=diamond&productName=${encodeURIComponent(productName)}`
      router.push(chatUrl)
    }
  };

  console.log('Diamond data for chat debug:', { 
    diamond, 
    sellerId: diamond?.seller?.id, 
    directSellerId: diamond?.sellerId,
    hasSeller: !!diamond?.seller,
    hasDirectSellerId: !!diamond?.sellerId
  });

  if (!diamond) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-30">💎</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Diamond not found</h2>
          <p style={{ color: 'var(--muted-foreground)' }}>The requested diamond could not be loaded.</p>
        </div>
      </div>
    );
  }

  // Collect all image fields from API if present
  const images = Array.isArray(diamond.images) && diamond.images.length > 0
    ? diamond.images
    : [diamond.image1, diamond.image2, diamond.image3, diamond.image4, diamond.image5, diamond.image6].filter(Boolean);
  const hasImages = images.length > 0;

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  const getCertificationGrade = () => {
    const hasColor = diamond.color && diamond.color !== 'N/A';
    const hasClarity = diamond.clarity && diamond.clarity !== 'N/A';
    const hasCut = diamond.cut && diamond.cut !== 'N/A';
    const hasCertificate = diamond.certificateNumber;
    
    const score = [hasColor, hasClarity, hasCut, hasCertificate].filter(Boolean).length;
  if (score >= 4) return { grade: 'Excellent', color: '', bg: '' };
  if (score >= 3) return { grade: 'Very Good', color: '', bg: '' };
  if (score >= 2) return { grade: 'Good', color: '', bg: '' };
  return { grade: 'Fair', color: '', bg: '' };
  };

  const certification = getCertificationGrade();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
        <a 
          href={`/diamonds/${diamond.stoneType === 'labGrownDiamond' ? 'lab-grown' : 'natural'}/single`} 
          className="hover:underline" 
          style={{ color: 'var(--muted-foreground)' }}
        >
          {diamond.stoneType === 'labGrownDiamond' ? 'Lab Grown' : 'Natural'} Diamonds
        </a>
        <span>/</span>
        <a href="#" className="hover:underline" style={{ color: 'var(--muted-foreground)' }}>{diamond.shape || 'Diamond'}</a>
        <span>/</span>
        <span className="font-medium" style={{ color: 'var(--foreground)' }}>{diamond.caratWeight}ct</span>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Image Gallery */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden group border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            {hasImages ? (
              <>
                <Image
                  src={images[imgIdx] || 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg'}
                  alt={`${diamond.shape} Diamond`}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx(idx => (idx - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-200 border backdrop-blur-sm"
                      style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    >
                      <ChevronLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
                    </button>
                    <button
                      onClick={() => setImgIdx(idx => (idx + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-200 border backdrop-blur-sm"
                      style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    >
                      <ChevronRight className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium border" style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                      {imgIdx + 1} / {images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4 opacity-30">💎</div>
                  <p className="font-medium" style={{ color: 'var(--muted-foreground)' }}>No images available</p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute top-4 left-4 flex gap-2">
              <WishlistButton
                productId={typeof diamond?.id === 'string' ? parseInt(diamond?.id) : (diamond?.id || 0)}
                productType="diamond"
                className="p-3 rounded-full shadow-lg transition-all duration-200 border backdrop-blur-sm"
                style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
              />
              <button className="p-3 rounded-full shadow-lg transition-all duration-200 border backdrop-blur-sm" style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                <Share2 className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
              </button>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {hasImages && images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImgIdx(idx)}
                  className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200"
                  style={{ borderColor: imgIdx === idx ? 'var(--foreground)' : 'var(--border)' }}
                >
                  <Image 
                    src={img || 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg'} 
                    alt={`View ${idx + 1}`} 
                    width={80}
                    height={80}
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          )}

          {/* Video Section */}
          {diamond.videoURL && (
            <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Play className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                360° Video View
              </h3>
              <video 
                src={diamond.videoURL} 
                controls 
                className="w-full rounded-xl"
                poster={hasImages ? images[0] : undefined}
              />
            </div>
          )}
        </div>

        {/* Right Side - Details */}
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Seller Company Name */}
                {diamond.seller && diamond.seller.companyName && (
                  <a
                    href={`/product/seller-info/${diamond.seller.id || diamond.sellerId}`}
                    className="hover:underline text-lg font-semibold mb-1 block"
                    style={{ color: 'var(--primary)' }}
                  >
                    {diamond.seller.companyName}
                  </a>
                )}
                {/* Seller fallback if no companyName */}
                {!diamond.seller?.companyName && (
                  <a
                    href={`/seller/info/${diamond.sellerId}`}
                    className="hover:underline text-lg font-semibold mb-1 block"
                    style={{ color: 'var(--primary)' }}
                  >
                    Seller #{diamond.sellerId}
                  </a>
                )}
                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                  {diamond.name || `${diamond.caratWeight}ct ${diamond.shape}`}
                </h1>
                <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <span>Ref: <span className="font-mono font-medium" style={{ color: 'var(--foreground)' }}>{diamond.certificateNumber || diamond.stockNumber || 'N/A'}</span></span>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                    <Star className="w-3 h-3" />
                    {certification.grade}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                  {diamond.price ? formatPrice(diamond.price) : 'POA'}
                </div>
                {diamond.discount && (
                  <div className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    Save {diamond.discount}% off retail
                  </div>
                )}
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border`} style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                <CheckCircle className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                {diamond.isSold ? 'Sold' : 'Available'}
              </span>
              {diamond.isOnAuction && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border" style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                  On Auction
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border" style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                <Shield className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                Certified
              </span>
            </div>

            {/* Description */}
            {diamond.description && (
              <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--card)' }}>
                <p className="leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{diamond.description}</p>
              </div>
            )}
          </div>

          {/* Key Features Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Show all main diamond fields as cards */}
            {[
              { label: 'Carat Weight', value: diamond.caratWeight, icon: '⚖️', color: 'from-blue-500 to-blue-600', description: 'Weight measurement' },
              { label: 'Color Grade', value: diamond.color, icon: '🎨', color: 'from-purple-500 to-purple-600', description: 'Color classification' },
              { label: 'Clarity', value: diamond.clarity, icon: '💎', color: 'from-emerald-500 to-emerald-600', description: 'Internal characteristics' },
              { label: 'Cut Quality', value: diamond.cut, icon: '✂️', color: 'from-amber-500 to-amber-600', description: 'Light performance' },
              { label: 'Origin', value: diamond.origin, icon: '📍', color: 'from-green-500 to-green-600', description: 'Origin of diamond' },
              { label: 'Shade', value: diamond.shade, icon: '🌈', color: 'from-yellow-500 to-yellow-600', description: 'Diamond shade' },
              { label: 'Fancy Color', value: diamond.fancyColor, icon: '🎨', color: 'from-pink-500 to-pink-600', description: 'Fancy color' },
              { label: 'Fancy Intensity', value: diamond.fancyIntencity, icon: '🔥', color: 'from-red-500 to-red-600', description: 'Fancy color intensity' },
              { label: 'Fancy Overtone', value: diamond.fancyOvertone, icon: '🌀', color: 'from-indigo-500 to-indigo-600', description: 'Fancy color overtone' },
              { label: 'Symmetry', value: diamond.symmetry, icon: '🔀', color: 'from-gray-500 to-gray-600', description: 'Symmetry' },
              { label: 'Polish', value: diamond.polish, icon: '✨', color: 'from-blue-400 to-blue-500', description: 'Polish' },
              { label: 'Fluorescence', value: diamond.fluorescence, icon: '💡', color: 'from-yellow-400 to-yellow-500', description: 'Fluorescence' },
              { label: 'Stone Type', value: diamond.stoneType, icon: '🪨', color: 'from-gray-400 to-gray-500', description: 'Stone type' },
              { label: 'Process', value: diamond.process, icon: '⚙️', color: 'from-gray-300 to-gray-400', description: 'Process' },
              { label: 'Treatment', value: diamond.treatment, icon: '🧪', color: 'from-green-300 to-green-400', description: 'Treatment' },
              { label: 'Inscription', value: diamond.inscription, icon: '🔏', color: 'from-gray-300 to-gray-400', description: 'Inscription' },
              { label: 'Certificate Number', value: diamond.certificateNumber, icon: '📄', color: 'from-blue-300 to-blue-400', description: 'Certificate number' },
              { label: 'Seller SKU', value: diamond.sellerSKU, icon: '🏷️', color: 'from-gray-200 to-gray-300', description: 'Seller SKU' },
              { label: 'Stock Number', value: diamond.stockNumber, icon: '🔢', color: 'from-gray-200 to-gray-300', description: 'Stock number' },
            ].filter(f => f.value).map(feature => (
              <div key={feature.label} className="rounded-2xl border p-4 hover:shadow-md transition-shadow duration-200" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-3`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{feature.label}</h3>
                <div className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>{feature.value || 'N/A'}</div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart || diamond.isSold}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                <ShoppingCart className="w-5 h-5" />
                {isAddingToCart ? 'Adding...' : diamond.isSold ? 'Sold Out' : 'Add to Cart'}
              </button>
              <WishlistButton
                productId={typeof diamond?.id === 'string' ? parseInt(diamond.id) : (diamond?.id || 0)}
                productType="diamond"
                size="md"
                variant="outline"
                shape="button"
                showText={false}
                className="font-semibold"
              />
              <button className="px-6 py-4 border-2 font-semibold rounded-2xl transition-all duration-200" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            
            {/* Chat with Seller Button */}
            {(diamond?.seller?.id || diamond?.sellerId) && (
              <button
                onClick={handleChatWithSeller}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 font-semibold rounded-2xl transition-all duration-200"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--primary)', color: 'var(--primary)' }}
              >
                <MessageSquare className="w-5 h-5" />
                Chat with Seller
              </button>
            )}
            
            <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <Shield className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Authentication Guarantee</h4>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    This diamond comes with full certification and a 30-day return policy. 
                    Verified by independent gemological laboratories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <div className="mt-12">
        {/* Tab Navigation */}
        <div className="border-b" style={{ borderColor: 'var(--border)' }}>
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'specifications', label: 'Specifications', icon: Award },
              { id: 'certification', label: 'Certification', icon: Shield },
              // { id: 'seller', label: 'Seller Info', icon: Star }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'specifications' | 'certification' | 'seller')}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200`}
                style={activeTab === tab.id ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'transparent', color: 'var(--muted-foreground)' }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Quick Stats */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Diamond Summary</h3>
                  <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    {[
                      { icon: '💎', label: 'Shape', value: diamond.shape },
                      { icon: '⚖️', label: 'Carat Weight', value: diamond.caratWeight },
                      { icon: '🎨', label: 'Color', value: diamond.color },
                      { icon: '🔍', label: 'Clarity', value: diamond.clarity },
                      { icon: '✂️', label: 'Cut', value: diamond.cut },
                      { icon: '📍', label: 'Origin', value: diamond.origin }
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{item.icon}</span>
                          <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                        </div>
                        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{item.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investment Info */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Investment Details</h3>
                  <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>Current Price</span>
                      <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{diamond.price ? formatPrice(diamond.price) : 'POA'}</span>
                    </div>
                    {diamond.rap && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>RAP Price</span>
                        <span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>{
                          typeof diamond.rap === 'number'
                            ? `$${(diamond.rap as number).toLocaleString()}`
                            : (diamond.rap ? diamond.rap : 'N/A')
                        }</span>
                      </div>
                    )}
                    {diamond.discount && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>Discount</span>
                        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{diamond.discount}% off</span>
                      </div>
                    )}
                    <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        <TrendingUp className="w-4 h-4" />
                        <span>Market competitive pricing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Assessment */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Quality Assessment</h3>
                  <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    {[
                      { label: 'Polish', value: diamond.polish, description: 'Surface finish quality' },
                      { label: 'Symmetry', value: diamond.symmetry, description: 'Facet alignment precision' },
                      { label: 'Fluorescence', value: diamond.fluorescence, description: 'UV light reaction' }
                    ].map(item => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{item.value || 'N/A'}</span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.description}</p>
                        {item.label !== 'Fluorescence' && (
                          <div className="border-b" style={{ borderColor: 'var(--border)' }}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seller Rating */}
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Seller Information</h3>
                  <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                        <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>S</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                          {diamond.sellerId ? `Seller #${diamond.sellerId}` : 'Verified Diamond Dealer'}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                          ))}
                          <span className="text-sm ml-2" style={{ color: 'var(--muted-foreground)' }}>4.9 (1,247 reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                      <div>
                        <div className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>98%</div>
                        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Positive Rating</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>2.1K</div>
                        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Diamonds Sold</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>5 yrs</div>
                        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Experience</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Detailed Specifications</h3>
                
                {/* Measurements */}
                <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                    <Award className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                    Measurements & Proportions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Diameter', value: diamond.diameter },
                      { label: 'Measurement', value: diamond.measurement },
                      { label: 'Length/Width Ratio', value: diamond.ratio },
                      { label: 'Table %', value: diamond.table },
                      { label: 'Depth %', value: diamond.depth },
                      { label: 'Girdle', value: `${diamond.gridleMin || 'N/A'} - ${diamond.gridleMax || 'N/A'}` },
                      { label: 'Crown Height', value: diamond.crownHeight },
                      { label: 'Crown Angle', value: diamond.crownAngle },
                      { label: 'Pavilion Angle', value: diamond.pavilionAngle },
                      { label: 'Pavilion Depth', value: diamond.pavilionDepth },
                      { label: 'Culet Size', value: diamond.culetSize },
                      { label: 'Girdle %', value: diamond.gridlePercentage }
                    ].map(spec => (
                      <div key={spec.label} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                        <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{spec.label}</span>
                        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{spec.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fancy Color Details */}
                {(diamond.fancyColor || diamond.fancyIntencity || diamond.fancyOvertone) && (
                  <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                      <Eye className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                      Fancy Color Details
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Fancy Color', value: diamond.fancyColor },
                        { label: 'Color Intensity', value: diamond.fancyIntencity },
                        { label: 'Color Overtone', value: diamond.fancyOvertone },
                        { label: 'Shade', value: diamond.shade }
                      ].map(item => (
                        <div key={item.label} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                          <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{item.value || 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'certification' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Certification & Authentication</h3>
                
                {/* Certificate Card */}
                <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                      <Shield className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold mb-2" style={{ color: 'var(--foreground)' }}>Official Certification</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Certificate Number:</span>
                          <span className="font-mono font-bold ml-2" style={{ color: 'var(--foreground)' }}>{diamond.certificateNumber || 'N/A'}</span>
                        </div>
                        {diamond.certification && (
                          <div>
                            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Certifying Body:</span>
                            <span className="font-semibold ml-2" style={{ color: 'var(--foreground)' }}>
                              {typeof diamond.certification === 'string' && diamond.certification.startsWith('http') ? 'GIA/AGS' : diamond.certification}
                            </span>
                          </div>
                        )}
                        {diamond.inscription && (
                          <div>
                            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Inscription:</span>
                            <span className="font-mono ml-2" style={{ color: 'var(--foreground)' }}>{diamond.inscription}</span>
                          </div>
                        )}
                      </div>
                      
                      {diamond.certification && typeof diamond.certification === 'string' && diamond.certification.startsWith('http') && (
                        <a 
                          href={diamond.certification} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 px-4 py-2 font-medium rounded-xl transition-colors duration-200"
                          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                        >
                          <Download className="w-4 h-4" />
                          Download Certificate
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Treatment & Process */}
                <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Treatment & Processing</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Treatment', value: diamond.treatment || 'None' },
                      { label: 'Process', value: diamond.process || 'Natural' },
                      { label: 'Stone Type', value: diamond.stoneType || 'Natural Diamond' }
                    ].map(item => (
                      <div key={item.label} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                        <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seller' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Seller Information</h3>
              
              <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-4 mb-6">
                  {diamond.seller && diamond.seller.companyLogo ? (
                    <Image
                      src={diamond.seller.companyLogo}
                      alt={diamond.seller.companyName || 'Seller Logo'}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-2xl object-cover border"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                      <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>S</span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                      {diamond.seller && diamond.seller.companyName
                        ? diamond.seller.companyName
                        : diamond.sellerId
                        ? `Diamond Seller #${diamond.sellerId}`
                        : 'Premium Diamond Dealer'}
                    </h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                      ))}
                      <span className="text-sm ml-2" style={{ color: 'var(--muted-foreground)' }}>4.9 out of 5 (1,247 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--card)' }}>
                    <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>2,187</div>
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Diamonds Sold</div>
                  </div>
                  <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--card)' }}>
                    <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>98.7%</div>
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Satisfaction Rate</div>
                  </div>
                  <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--card)' }}>
                    <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>5.2</div>
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Years Active</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <CheckCircle className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
                    <div>
                      <h5 className="font-semibold" style={{ color: 'var(--foreground)' }}>Verified Seller</h5>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Identity and business credentials verified</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <Shield className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
                    <div>
                      <h5 className="font-semibold" style={{ color: 'var(--foreground)' }}>Buyer Protection</h5>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>30-day return policy and authenticity guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      {(diamond.createdAt || diamond.updatedAt) && (
        <div className="mt-12 rounded-2xl p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <Calendar className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            Timeline
          </h3>
          <div className="space-y-3">
            {diamond.createdAt && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}></div>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Listed on {new Date(diamond.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            )}
            {diamond.updatedAt && diamond.updatedAt !== diamond.createdAt && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}></div>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Last updated {new Date(diamond.updatedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiamondDetailsPage;
