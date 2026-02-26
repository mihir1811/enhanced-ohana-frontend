'use client';

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
  MessageSquare,
  Scale,
  Layers,
  Hexagon
} from 'lucide-react';
import Image from 'next/image';
import { BullionProduct } from '@/services/bullion.service';
import { WishlistButton } from '@/components/shared/WishlistButton';
import { cartService } from '@/services/cartService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { copyProductUrlToClipboard } from '@/lib/shareUtils';

interface BullionDetailsPageProps {
  bullion: BullionProduct | null;
}

const BullionDetailsPage: React.FC<BullionDetailsPageProps> = ({ bullion }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'seller'>('overview');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const router = useRouter();

  // Get authentication token from Redux store
  const { token, user } = useSelector((state: RootState) => state.auth);

  const handleAddToCart = async () => {
    if (!bullion) return;
    
    if (!token) {
      console.error('User not authenticated');
      router.push('/login');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await cartService.addToCart({
        productId: Number(bullion.id),
        productType: 'bullion', // Assuming 'bullion' is supported by backend cart service
        quantity: 1
      }, token);
      console.log('Bullion added to cart successfully');
      // You can add a toast notification here
    } catch (error) {
      console.error('Failed to add bullion to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleChatWithSeller = async () => {
    // Try to get seller ID from multiple possible locations
    // We prioritize seller.userId because the chat system works between Users (not Seller entities)
    const sellerId = bullion?.seller?.userId || bullion?.seller?.id || bullion?.sellerId;
    
    if (!sellerId) {
      console.warn('No seller information available', { 
        bullion: bullion,
        sellerId: bullion?.seller?.id,
        directSellerId: bullion?.sellerId
      });
      alert('Seller information is missing for this product.');
      return;
    }

    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }

    try {
      const productId = bullion.id;
      const productName = `${bullion.metalWeight} ${bullion.metalType?.name || ''} ${bullion.metalShape?.name || ''}`;
      
      // Navigate to main chat page with seller pre-selected
      const chatUrl = `/user/chat?sellerId=${sellerId}&productId=${productId}&productType=bullion&productName=${encodeURIComponent(productName)}`;
      console.log('Navigating to chat:', { sellerId, productId, productName, chatUrl });
      router.push(chatUrl);
    } catch (error) {
      console.error('Failed to initiate chat:', error);
      // Fallback
      const productId = bullion.id;
      const productName = `${bullion.metalWeight} ${bullion.metalType?.name || ''} ${bullion.metalShape?.name || ''}`;
      const chatUrl = `/user/chat?sellerId=${sellerId}&productId=${productId}&productType=bullion&productName=${encodeURIComponent(productName)}`;
      router.push(chatUrl);
    }
  };

  if (!bullion) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-30">🪙</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Bullion not found</h2>
          <p style={{ color: 'var(--muted-foreground)' }}>The requested bullion could not be loaded.</p>
        </div>
      </div>
    );
  }

  // Placeholder image since bullion might not have images array in the interface yet
  const images = ['https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg'];
  const hasImages = images.length > 0;

  const price = Number(bullion.price) || 0;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
        <a href="/bullions" className="hover:underline" style={{ color: 'var(--muted-foreground)' }}>Bullions</a>
        <span>/</span>
        <a href="#" className="hover:underline" style={{ color: 'var(--muted-foreground)' }}>{bullion.metalType?.name || 'Metal'}</a>
        <span>/</span>
        <span className="font-medium" style={{ color: 'var(--foreground)' }}>{bullion.stockNumber}</span>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Image Gallery */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden group border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <Image
              src={images[imgIdx]}
              alt={`${bullion.metalType?.name} ${bullion.metalShape?.name}`}
              width={600}
              height={600}
              className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
            />
            {/* Image overlay - Wishlist & Share (like watches) */}
            <div className="absolute top-4 left-4 flex gap-2">
              <WishlistButton
                productId={Number(bullion.id)}
                productType="jewellery"
                className="p-3 rounded-full shadow-lg border backdrop-blur-sm"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              />
              <button
                onClick={async () => {
                  const ok = await copyProductUrlToClipboard('bullion', bullion.id);
                  toast[ok ? 'success' : 'error'](ok ? 'Link copied to clipboard!' : 'Failed to copy link');
                }}
                className="p-3 rounded-full shadow-lg border backdrop-blur-sm"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {bullion.availability && (
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: 'color-mix(in srgb, #22c55e 15%, transparent)', 
                    color: '#16a34a' 
                  }}
                >
                  {bullion.availability}
                </span>
              )}
              {bullion.metalType && (
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: 'color-mix(in srgb, var(--status-warning) 15%, transparent)', 
                    color: 'var(--status-warning)' 
                  }}
                >
                  {bullion.metalType.name}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              {bullion.metalWeight} {bullion.metalType?.name} {bullion.metalShape?.name}
            </h1>
            
            <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <span>Stock #: {bullion.stockNumber}</span>
              {bullion.mintMark && (
                <>
                  <span>•</span>
                  <span>Mint: {bullion.mintMark}</span>
                </>
              )}
            </div>
          </div>

          {/* Price Section */}
          <div className="p-6 rounded-2xl border space-y-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
                ${price.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleChatWithSeller}
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold border-2 transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
              >
                <MessageSquare className="w-5 h-5" />
                Chat with Seller
              </button>
              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <ShoppingCart className="w-5 h-5" />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Scale className="w-6 h-6 mb-2" style={{ color: 'var(--status-warning)' }} />
              <div className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Weight</div>
              <div className="font-semibold" style={{ color: 'var(--foreground)' }}>{bullion.metalWeight}</div>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Layers className="w-6 h-6 mb-2 text-blue-500" />
              <div className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Purity</div>
              <div className="font-semibold" style={{ color: 'var(--foreground)' }}>{bullion.metalFineness?.name || 'N/A'}</div>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Hexagon className="w-6 h-6 mb-2 text-purple-500" />
              <div className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Shape</div>
              <div className="font-semibold" style={{ color: 'var(--foreground)' }}>{bullion.metalShape?.name || 'N/A'}</div>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Calendar className="w-6 h-6 mb-2 text-green-500" />
              <div className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Year</div>
              <div className="font-semibold" style={{ color: 'var(--foreground)' }}>{bullion.mintYear || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
          {(['overview', 'specifications', 'seller'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-8 py-4 text-sm font-medium border-b-2 transition-all"
              style={{ 
                borderColor: activeTab === tab ? 'var(--status-warning)' : 'transparent', 
                color: activeTab === tab ? 'var(--status-warning)' : 'var(--muted-foreground)' 
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 'overview' && (
            <div className="space-y-6" style={{ color: 'var(--foreground)' }}>
              <h3 className="text-xl font-semibold">Description</h3>
              <p className="leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                This {bullion.metalWeight} {bullion.metalType?.name} {bullion.metalShape?.name} 
                {bullion.mintMark ? ` from ${bullion.mintMark}` : ''} is a premium investment grade bullion.
                {bullion.design && ` Featuring the ${bullion.design} design.`}
                {bullion.condition && ` Condition: ${bullion.condition}.`}
              </p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {[
                { label: 'Stock Number', value: bullion.stockNumber },
                { label: 'Metal Type', value: bullion.metalType?.name },
                { label: 'Shape', value: bullion.metalShape?.name },
                { label: 'Weight', value: bullion.metalWeight },
                { label: 'Purity', value: bullion.metalFineness?.name },
                { label: 'Mint Mark', value: bullion.mintMark },
                { label: 'Mint Year', value: bullion.mintYear },
                { label: 'Condition', value: bullion.condition },
                { label: 'Dimensions', value: bullion.demention },
                { label: 'Certificate', value: bullion.certificateNumber },
                { label: 'Certification', value: bullion.certification },
              ].map((spec) => (
                spec.value && (
                  <div key={spec.label} className="flex justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <span style={{ color: 'var(--muted-foreground)' }}>{spec.label}</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>{spec.value}</span>
                  </div>
                )
              ))}
            </div>
          )}
          
          {activeTab === 'seller' && (
            <div className="space-y-6" style={{ color: 'var(--foreground)' }}>
              <h3 className="text-xl font-semibold">Seller Information</h3>
               {bullion.seller ? (
                  <div className="flex flex-col gap-2">
                    <p className="font-medium">{bullion.seller.companyName || bullion.seller.name}</p>
                    <p className="text-sm text-muted-foreground">Seller ID: {bullion.sellerId}</p>
                  </div>
               ) : (
                  <p className="text-muted-foreground">Seller information not available.</p>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BullionDetailsPage;
