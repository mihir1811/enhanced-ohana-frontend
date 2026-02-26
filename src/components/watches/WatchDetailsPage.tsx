'use client'

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Play,
  MessageCircle,
  Watch as WatchIcon,
  Clock,
  Shield,
  Star,
  Maximize2,
  Calendar,
  Box,
  FileText,
  CreditCard,
  Eye,
  Award
} from 'lucide-react';
import Image from 'next/image';
import { WatchProduct } from '@/services/watch.service';
import WishlistButton from '@/components/shared/WishlistButton';
import { cartService } from '@/services/cartService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { copyProductUrlToClipboard } from '@/lib/shareUtils';

type ExtendedWatchProduct = Omit<WatchProduct, 'stonesOnDial' | 'display' | 'gender' | 'wristSizeFit' | 'price' | 'image1' | 'image2' | 'image3' | 'image4' | 'image5' | 'image6' | 'videoURL'> & {
  stonesOnDial?: number | null;
  display?: string;
  gender?: string;
  wristSizeFit?: string | number;
  price: number | string;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  image5?: string | null;
  image6?: string | null;
  videoURL?: string | null;
  description?: string;
  seller?: {
    id: string;
    sellerType: string;
    companyName: string;
    companyLogo: string | null;
  };
}

interface WatchDetailsPageProps {
  watch: ExtendedWatchProduct | null;
}

const WatchDetailsPage: React.FC<WatchDetailsPageProps> = ({ watch }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'seller'>('overview');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const router = useRouter();

  const { token, user } = useSelector((state: RootState) => state.auth);

  if (!watch) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-30">⌚</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Watch not found</h2>
          <p style={{ color: 'var(--muted-foreground)' }}>The requested timepiece could not be loaded.</p>
        </div>
      </div>
    );
  }

  const images = [
    watch.image1, 
    watch.image2, 
    watch.image3, 
    watch.image4, 
    watch.image5, 
    watch.image6
  ].filter(Boolean) as string[];
  const hasImages = images.length > 0;

  const handleAddToCart = async () => {
    if (!watch) return;
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await cartService.addToCart({
        productId: watch.id,
        productType: 'watch',
        quantity: 1
      }, token);
    } catch (error) {
      console.error('Failed to add watch to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

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
        <a href="/watches" className="hover:underline">Watches</a>
        <span>/</span>
        <span className="font-medium" style={{ color: 'var(--foreground)' }}>{watch.brand} {watch.model}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side - Gallery */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-3xl overflow-hidden group border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            {hasImages ? (
              <>
                <Image
                  src={images[imgIdx]}
                  alt={`${watch.brand} ${watch.model}`}
                  fill
                  className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx(idx => (idx - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all border backdrop-blur-sm"
                      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setImgIdx(idx => (idx + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all border backdrop-blur-sm"
                      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20">
                <WatchIcon size={120} />
              </div>
            )}
            
            <div className="absolute top-4 left-4 flex gap-2">
              <WishlistButton
                productId={watch.id}
                productType="watch"
                className="p-3 rounded-full shadow-lg border backdrop-blur-sm"
              />
              <button
                onClick={async () => {
                  const ok = await copyProductUrlToClipboard('watch', watch.id);
                  toast[ok ? 'success' : 'error'](ok ? 'Link copied to clipboard!' : 'Failed to copy link');
                }}
                className="p-3 rounded-full shadow-lg border backdrop-blur-sm"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImgIdx(idx)}
                  className="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all"
                  style={{ borderColor: imgIdx === idx ? 'var(--status-warning)' : 'var(--border)' }}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {watch.videoURL && (
            <div className="rounded-3xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Play className="w-5 h-5" style={{ color: 'var(--status-warning)' }} />
                Video Presentation
              </h3>
              <video src={watch.videoURL} controls className="w-full rounded-2xl" />
            </div>
          )}
        </div>

        {/* Right Side - Info */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="font-bold tracking-widest uppercase text-sm" style={{ color: 'var(--status-warning)' }}>{watch.brand}</h2>
            <h1 className="text-4xl font-black" style={{ color: 'var(--foreground)' }}>{watch.model}</h1>
            <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>{watch.referenceNumber}</p>
          </div>

          <div className="flex items-end gap-4">
            <div className="text-4xl font-black" style={{ color: 'var(--foreground)' }}>
              {formatPrice(watch.price)}
            </div>
            <div 
              className="mb-1 text-sm font-bold px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: 'color-mix(in srgb, var(--status-warning) 10%, transparent)', 
                color: 'var(--status-warning)' 
              }}
            >
              Includes Free Shipping
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border flex items-center gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div 
                className="p-3 rounded-xl"
                style={{ 
                  backgroundColor: 'color-mix(in srgb, var(--status-warning) 10%, transparent)', 
                  color: 'var(--status-warning)' 
                }}
              >
                <Box className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Box</p>
                <p className="font-bold">{watch.boxIncluded ? 'Original Box' : 'Not Included'}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl border flex items-center gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div 
                className="p-3 rounded-xl"
                style={{ 
                  backgroundColor: 'color-mix(in srgb, var(--status-warning) 10%, transparent)', 
                  color: 'var(--status-warning)' 
                }}
              >
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Papers</p>
                <p className="font-bold">{watch.papersIncluded ? 'Original Papers' : 'Not Included'}</p>
              </div>
            </div>
            {watch.warrantyCardIncluded && (
              <div className="p-4 rounded-2xl border flex items-center gap-4 col-span-2" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div 
                  className="p-3 rounded-xl"
                  style={{ 
                    backgroundColor: 'color-mix(in srgb, var(--status-warning) 10%, transparent)', 
                    color: 'var(--status-warning)' 
                  }}
                >
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Warranty</p>
                  <p className="font-bold">Original Warranty Card Included</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full py-4 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 active:scale-[0.98]"
              style={{ 
                background: 'linear-gradient(to right, var(--status-warning), color-mix(in srgb, var(--status-warning) 85%, black))'
              }}
            >
              <ShoppingCart className="w-5 h-5" />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button 
              className="w-full py-4 border rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all" 
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <MessageCircle className="w-5 h-5" />
              Chat with Seller
            </button>
          </div>

          <div 
            className="p-6 rounded-3xl border-2 border-dashed space-y-4"
            style={{ 
              borderColor: 'color-mix(in srgb, var(--status-warning) 30%, transparent)',
              backgroundColor: 'color-mix(in srgb, var(--status-warning) 5%, transparent)'
            }}
          >
            <div className="flex items-center gap-3" style={{ color: 'var(--status-warning)' }}>
              <Shield className="w-6 h-6" />
              <h4 className="font-bold uppercase tracking-wider">Authenticity Guaranteed</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every timepiece on Ohana is meticulously inspected by our team of expert watchmakers. 
              We guarantee 100% authenticity and provide a full mechanical warranty for your peace of mind.
            </p>
          </div>

        </div>
      </div>

      {/* Detailed Information Tabs - like Diamond, Jewelry, Bullion */}
      <div className="mt-12">
        <div className="border-b" style={{ borderColor: 'var(--border)' }}>
          <nav className="flex space-x-8">
            {[
              { id: 'overview' as const, label: 'Overview', icon: Eye },
              { id: 'specifications' as const, label: 'Specifications', icon: Award },
              ...(watch.seller ? [{ id: 'seller' as const, label: 'Seller Info', icon: Star }] : []),
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200`}
                style={activeTab === tab.id ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'transparent', color: 'var(--muted-foreground)' }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Watch Summary</h3>
                  <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    {[
                      { icon: '⌚', label: 'Brand', value: watch.brand },
                      { icon: '📋', label: 'Model', value: watch.model },
                      { icon: '🔢', label: 'Reference', value: watch.referenceNumber || watch.stockNumber },
                      { icon: '💰', label: 'Price', value: formatPrice(watch.price) },
                      { icon: '⏱️', label: 'Movement', value: watch.movementType },
                      { icon: '📐', label: 'Case Size', value: watch.caseSize ? `${watch.caseSize}mm` : null },
                      { icon: '🎨', label: 'Dial Color', value: watch.dialColor },
                      { icon: '📅', label: 'Year', value: watch.modelYear },
                      { icon: '✓', label: 'Condition', value: watch.condition },
                    ].filter(item => item.value).map(item => (
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
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Included Items</h3>
                  <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                      <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>Box</span>
                      <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{watch.boxIncluded ? 'Original Box' : 'Not Included'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                      <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>Papers</span>
                      <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{watch.papersIncluded ? 'Original Papers' : 'Not Included'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 last:border-0" style={{ borderColor: 'var(--border)' }}>
                      <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>Warranty Card</span>
                      <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{watch.warrantyCardIncluded ? 'Included' : 'Not Included'}</span>
                    </div>
                  </div>
                </div>
                {watch.description && (
                  <div>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>About This Timepiece</h3>
                    <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                      <p className="leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{watch.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Detailed Specifications</h3>
                
                {/* Case & Dial */}
                <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                    <Maximize2 className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                    Case & Dial
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Brand', value: watch.brand },
                      { label: 'Model', value: watch.model },
                      { label: 'Reference Number', value: watch.referenceNumber },
                      { label: 'Stock Number', value: watch.stockNumber },
                      { label: 'Case Size', value: watch.caseSize ? `${watch.caseSize}mm` : null },
                      { label: 'Case Material', value: watch.caseMaterial },
                      { label: 'Case Shape', value: watch.caseShape },
                      { label: 'Case Back', value: watch.caseBack },
                      { label: 'Crown Type', value: watch.crownType },
                      { label: 'Dial Color', value: watch.dialColor },
                      { label: 'Bezel Type', value: watch.bezelType },
                      { label: 'Bezel Material', value: watch.bezelMaterial },
                      { label: 'Glass', value: watch.glass },
                      { label: 'Stones on Dial', value: watch.stonesOnDial },
                    ].filter(s => s.value).map(spec => (
                      <div key={spec.label} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                        <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{spec.label}</span>
                        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{String(spec.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Movement */}
                <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                    <Clock className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                    Movement
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Movement Type', value: watch.movementType },
                      { label: 'Calibre', value: watch.calibre },
                      { label: 'Movement Details', value: watch.movementDetails },
                      { label: 'Power Reserve', value: watch.powerReserve ? `${watch.powerReserve} hours` : null },
                      { label: 'Display', value: watch.display },
                    ].filter(s => s.value).map(spec => (
                      <div key={spec.label} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                        <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{spec.label}</span>
                        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{String(spec.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strap & Clasp */}
                <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                    <CreditCard className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                    Strap & Clasp
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Strap Material', value: watch.strapMaterial },
                      { label: 'Strap Color', value: watch.strapColor },
                      { label: 'Clasp Type', value: watch.claspType },
                      { label: 'Clasp Material', value: watch.claspMaterial },
                      { label: 'Lug Width', value: watch.lugWidth ? `${watch.lugWidth}mm` : null },
                      { label: 'Wrist Size Fit', value: watch.wristSizeFit },
                    ].filter(s => s.value).map(spec => (
                      <div key={spec.label} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                        <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{spec.label}</span>
                        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{String(spec.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Features */}
                <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                    <Award className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                    Additional Features
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Water Resistance', value: watch.waterResistance },
                      { label: 'Complications', value: watch.complications },
                      { label: 'Features', value: watch.features },
                      { label: 'Gender', value: watch.gender },
                      { label: 'Collection', value: watch.collection },
                      { label: 'Model Year', value: watch.modelYear },
                      { label: 'Condition', value: watch.condition },
                      { label: 'Certification', value: watch.certification },
                    ].filter(s => s.value).map(spec => (
                      <div key={spec.label} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                        <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{spec.label}</span>
                        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{String(spec.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seller' && watch.seller && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Seller Information</h3>
              <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-4">
                  {watch.seller.companyLogo ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                      <Image src={watch.seller.companyLogo} alt={watch.seller.companyName} fill className="object-cover" />
                    </div>
                  ) : (
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl"
                      style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                    >
                      {watch.seller.companyName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{watch.seller.companyName}</h4>
                    <div className="flex items-center gap-1 mt-1 text-sm font-medium" style={{ color: 'var(--status-success)' }}>
                      <CheckCircle className="w-4 h-4" />
                      Verified Seller
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

export default WatchDetailsPage;
