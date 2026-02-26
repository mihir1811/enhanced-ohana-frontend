'use client'

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Share2, 
  Eye, 
  Shield, 
  Award,
  Star, 
  ChevronLeft, 
  ChevronRight,
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
import { toast } from 'react-hot-toast'
import { copyProductUrlToClipboard } from '@/lib/shareUtils'

interface MeleeDiamondDetailsPageProps {
  diamond: Diamond | null;
}

const MeleeDiamondDetailsPage: React.FC<MeleeDiamondDetailsPageProps> = ({ diamond }) => {
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
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await cartService.addToCart({
        productId: Number(diamond.id),
        productType: 'meleeDiamond',
        quantity: 1
      }, token);
      console.log('Melee diamond added to cart successfully');
    } catch (error) {
      console.error('Failed to add melee diamond to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleChatWithSeller = async () => {
    const sellerId = diamond?.seller?.userId || diamond?.seller?.id || diamond?.sellerId
    
    if (!sellerId) return;

    if (!user) {
      router.push('/login')
      return
    }

    const productId = diamond.id
    const productName = diamond.name || `Melee Diamond Parcel (${diamond.totalCaratWeight}ct)`
    const chatUrl = `/user/chat?sellerId=${sellerId}&productId=${productId}&productType=meleeDiamond&productName=${encodeURIComponent(productName)}`
    router.push(chatUrl)
  };

  if (!diamond) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-30">💎</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Melee Diamond not found</h2>
          <p style={{ color: 'var(--muted-foreground)' }}>The requested melee diamond parcel could not be loaded.</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
        <a 
          href={`/diamonds/${diamond.stoneType === 'labGrownDiamond' ? 'lab-grown' : 'natural'}/melee`} 
          className="hover:underline"
        >
          {diamond.stoneType === 'labGrownDiamond' ? 'Lab Grown' : 'Natural'} Melee Diamonds
        </a>
        <span>/</span>
        <a href="#" className="hover:underline">{diamond.shape || 'Parcel'}</a>
        <span>/</span>
        <span className="font-medium" style={{ color: 'var(--foreground)' }}>{diamond.totalCaratWeight}ct Total</span>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Image Gallery */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-3xl overflow-hidden group border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            {hasImages ? (
              <>
                <Image
                  src={images[imgIdx] || 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg'}
                  alt={`${diamond.shape} Melee Diamond`}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx(idx => (idx - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-200 border backdrop-blur-sm"
                      style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setImgIdx(idx => (idx + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-200 border backdrop-blur-sm"
                      style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
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
                productId={Number(diamond.id)}
                productType="meleeDiamond"
                className="p-3 rounded-full shadow-lg transition-all duration-200 border backdrop-blur-sm"
                style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
              />
              <button
                onClick={async () => {
                  const ok = await copyProductUrlToClipboard('meleeDiamond', diamond.id);
                  toast[ok ? 'success' : 'error'](ok ? 'Link copied to clipboard!' : 'Failed to copy link');
                }}
                className="p-3 rounded-full shadow-lg transition-all duration-200 border backdrop-blur-sm"
                style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                title="Share"
              >
                <Share2 className="w-5 h-5" />
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
                    src={img} 
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
                {diamond.seller?.companyName && (
                  <a href={`/product/seller-info/${diamond.seller.id}`} className="hover:underline text-lg font-semibold mb-1 block" style={{ color: 'var(--primary)' }}>
                    {diamond.seller.companyName}
                  </a>
                )}
                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                  {diamond.name || `${diamond.totalCaratWeight}ct ${diamond.shape} Melee Parcel`}
                </h1>
                <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <span>Stock #: <span className="font-mono font-medium" style={{ color: 'var(--foreground)' }}>{diamond.stockNumber || 'N/A'}</span></span>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                    <Star className="w-3 h-3" />
                    Melee Parcel
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                  {diamond.totalPrice ? formatPrice(diamond.totalPrice) : formatPrice(diamond.price)}
                </div>
                {diamond.pricePerCarat && (
                  <div className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    {formatPrice(diamond.pricePerCarat)} / Carat
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
                Certified Parcel
              </span>
            </div>

            {/* Description */}
            {diamond.description && (
              <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--card)' }}>
                <p className="leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{diamond.description}</p>
              </div>
            )}
          </div>

          {/* Key Melee Features Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Price card - always show first */}
            <div className="rounded-2xl border p-4 hover:shadow-md transition-shadow duration-200" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3" style={{ backgroundColor: 'color-mix(in srgb, var(--chart-1) 15%, transparent)' }}>💰</div>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Total Price</h3>
              <div className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>{diamond.totalPrice ? formatPrice(diamond.totalPrice) : formatPrice(diamond.price)}</div>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Final parcel price</p>
            </div>
            {[
              { label: 'Total Carat Weight', value: `${diamond.totalCaratWeight} ct`, icon: '⚖️', color: 'var(--chart-1)', description: 'Total parcel weight' },
              { label: 'Total Pieces', value: diamond.totalPcs, icon: '🔢', color: 'var(--chart-2)', description: 'Approximate piece count' },
              { label: 'Weight per Piece', value: diamond.caratWeightPerpcs ? `${diamond.caratWeightPerpcs} ct` : null, icon: '📦', color: 'var(--chart-3)', description: 'Average weight per stone' },
              { label: 'Shape', value: diamond.shape, icon: '💎', color: 'var(--chart-4)', description: 'Parcel diamond shape' },
              { label: 'Color Range', value: diamond.colorFrom && diamond.colorTo ? `${diamond.colorFrom} - ${diamond.colorTo}` : diamond.color, icon: '🎨', color: 'var(--chart-5)', description: 'Color classification range' },
              { label: 'Clarity Range', value: diamond.clarityMin && diamond.clarityMax ? `${diamond.clarityMin} - ${diamond.clarityMax}` : diamond.clarity, icon: '🔍', color: 'var(--chart-1)', description: 'Clarity classification range' },
              { label: 'Cut Range', value: diamond.cutFrom && diamond.cutTo ? `${diamond.cutFrom} - ${diamond.cutTo}` : diamond.cutFrom || diamond.cut, icon: '✂️', color: 'var(--chart-2)', description: 'Light performance range' },
              { label: 'Sieve Size', value: diamond.sieveSizeMin && diamond.sieveSizeMax ? `${diamond.sieveSizeMin} - ${diamond.sieveSizeMax}` : null, icon: '📏', color: 'var(--chart-3)', description: 'Sieve measurement range' },
            ].filter(f => f.value).map((feature, i) => (
              <div key={i} className="rounded-2xl border p-4 hover:shadow-md transition-shadow duration-200" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3`} style={{ backgroundColor: `color-mix(in srgb, ${feature.color} 15%, transparent)` }}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{feature.label}</h3>
                <div className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>{feature.value}</div>
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
                productId={Number(diamond.id)}
                productType="meleeDiamond"
                size="md"
                variant="outline"
                shape="button"
                showText={false}
                className="font-semibold"
              />
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
                    This melee parcel comes with full certification and a 30-day return policy. 
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
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Parcel Summary</h3>
                  <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    {[
                      { icon: '💎', label: 'Shape', value: diamond.shape },
                      { icon: '⚖️', label: 'Total Weight', value: `${diamond.totalCaratWeight} ct` },
                      { icon: '🎨', label: 'Color Range', value: diamond.colorFrom && diamond.colorTo ? `${diamond.colorFrom} - ${diamond.colorTo}` : diamond.color },
                      { icon: '🔍', label: 'Clarity Range', value: diamond.clarityMin && diamond.clarityMax ? `${diamond.clarityMin} - ${diamond.clarityMax}` : diamond.clarity },
                      { icon: '✂️', label: 'Cut Range', value: diamond.cutFrom && diamond.cutTo ? `${diamond.cutFrom} - ${diamond.cutTo}` : diamond.cutFrom },
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
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Pricing Details</h3>
                  <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>Total Price</span>
                      <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{diamond.totalPrice ? formatPrice(diamond.totalPrice) : formatPrice(diamond.price)}</span>
                    </div>
                    {diamond.pricePerCarat && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>Price Per Carat</span>
                        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{formatPrice(diamond.pricePerCarat)}</span>
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
                        <span>Bulk purchase pricing applied</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Assessment */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Quality Range</h3>
                  <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    {[
                      { label: 'Polish Range', value: diamond.polishFrom && diamond.polishTo ? `${diamond.polishFrom} - ${diamond.polishTo}` : diamond.polishFrom, description: 'Surface finish quality range' },
                      { label: 'Symmetry Range', value: diamond.symmetryFrom && diamond.symmetryTo ? `${diamond.symmetryFrom} - ${diamond.symmetryTo}` : diamond.symmetryFrom, description: 'Facet alignment precision range' },
                      { label: 'Fluorescence Range', value: diamond.fluoreScenceFrom && diamond.fluoreScenceTo ? `${diamond.fluoreScenceFrom} - ${diamond.fluoreScenceTo}` : diamond.fluoreScenceFrom, description: 'UV light reaction range' }
                    ].map(item => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{item.value || 'N/A'}</span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.description}</p>
                        {item.label !== 'Fluorescence Range' && (
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
                          {diamond.seller?.companyName || `Seller #${diamond.sellerId}`}
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
                        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Parcels Sold</div>
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
                
                <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                    <Award className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                    Parcel Measurements & Ranges
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Sieve Size Min', value: diamond.sieveSizeMin },
                      { label: 'Sieve Size Max', value: diamond.sieveSizeMax },
                      { label: 'Measurement Min', value: diamond.measurementMin },
                      { label: 'Measurement Max', value: diamond.measurementMax },
                      { label: 'Weight Per Piece', value: diamond.caratWeightPerpcs ? `${diamond.caratWeightPerpcs} ct` : null },
                      { label: 'Total Pieces', value: diamond.totalPcs },
                      { label: 'Shade Range', value: diamond.shadeFrom && diamond.shadeTo ? `${diamond.shadeFrom} - ${diamond.shadeTo}` : diamond.shadeFrom },
                      { label: 'Treatment', value: diamond.treatment },
                      { label: 'Stone Type', value: diamond.stoneType },
                      { label: 'Stock Number', value: diamond.stockNumber },
                    ].map(spec => (
                      <div key={spec.label} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                        <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{spec.label}</span>
                        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{spec.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'certification' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Certification & Authentication</h3>
                
                <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                      <Shield className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold mb-2" style={{ color: 'var(--foreground)' }}>Official Parcel Certification</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Certifying Body:</span>
                          <span className="font-semibold ml-2" style={{ color: 'var(--foreground)' }}>{diamond.certificateCompanyName || 'Verified Independent Lab'}</span>
                        </div>
                        {diamond.origin && (
                          <div>
                            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Origin:</span>
                            <span className="font-semibold ml-2" style={{ color: 'var(--foreground)' }}>{diamond.origin}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeleeDiamondDetailsPage;
