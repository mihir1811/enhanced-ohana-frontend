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
  CreditCard
} from 'lucide-react';
import Image from 'next/image';
import { WatchProduct } from '@/services/watch.service';
import WishlistButton from '@/components/shared/WishlistButton';
import { cartService } from '@/services/cartService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';

interface ExtendedWatchProduct extends WatchProduct {
  stonesOnDial?: number | null;
  bezelType?: string;
  bezelMaterial?: string;
  display: string;
  gender: string;
  collection?: string;
  certification?: string;
  modelYear?: number;
  wristSizeFit?: string | number;
  lugWidth?: number;
  condition: string;
  price: number | string;
  availabilityStatus?: boolean;
  warrantyCardIncluded: boolean;
  boxIncluded: boolean;
  papersIncluded: boolean;
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

  const specifications = [
    { label: 'Brand', value: watch.brand, icon: <Star className="w-5 h-5" /> },
    { label: 'Model', value: watch.model, icon: <WatchIcon className="w-5 h-5" /> },
    { label: 'Reference', value: watch.referenceNumber, icon: <FileText className="w-5 h-5" /> },
    { label: 'Movement', value: watch.movementType, icon: <Clock className="w-5 h-5" /> },
    { label: 'Case Size', value: watch.caseSize ? `${watch.caseSize}mm` : null, icon: <Maximize2 className="w-5 h-5" /> },
    { label: 'Case Material', value: watch.caseMaterial, icon: <Shield className="w-5 h-5" /> },
    { label: 'Case Shape', value: watch.caseShape, icon: <div className="w-5 h-5 border-2 rounded-sm" /> },
    { label: 'Dial Color', value: watch.dialColor, icon: <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: watch.dialColor?.toLowerCase() }} /> },
    { label: 'Strap Material', value: watch.strapMaterial, icon: <CreditCard className="w-5 h-5" /> },
    { label: 'Strap Color', value: watch.strapColor, icon: <div className="w-5 h-5 rounded-md border" style={{ backgroundColor: watch.strapColor?.toLowerCase() }} /> },
    { label: 'Clasp Type', value: watch.claspType, icon: <Shield className="w-5 h-5" /> },
    { label: 'Bezel Material', value: watch.bezelMaterial, icon: <Maximize2 className="w-5 h-5" /> },
    { label: 'Glass', value: watch.glass, icon: <Shield className="w-5 h-5" /> },
    { label: 'Condition', value: watch.condition, icon: <CheckCircle className="w-5 h-5" /> },
    { label: 'Year', value: watch.modelYear, icon: <Calendar className="w-5 h-5" /> },
    { label: 'Water Resistance', value: watch.waterResistance, icon: <div className="text-xs font-bold">H2O</div> },
    { label: 'Power Reserve', value: watch.powerReserve ? `${watch.powerReserve}h` : null, icon: <Clock className="w-5 h-5" /> },
  ].filter(s => s.value);

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
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              />
              <button className="p-3 rounded-full shadow-lg border backdrop-blur-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
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
                  style={{ borderColor: imgIdx === idx ? 'var(--primary)' : 'var(--border)' }}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {watch.videoURL && (
            <div className="rounded-3xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                Video Presentation
              </h3>
              <video src={watch.videoURL} controls className="w-full rounded-2xl" />
            </div>
          )}
        </div>

        {/* Right Side - Info */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm">{watch.brand}</h2>
            <h1 className="text-4xl font-black" style={{ color: 'var(--foreground)' }}>{watch.model}</h1>
            <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>{watch.referenceNumber}</p>
          </div>

          <div className="flex items-end gap-4">
            <div className="text-4xl font-black" style={{ color: 'var(--foreground)' }}>
              {formatPrice(watch.price)}
            </div>
            <div className="mb-1 text-sm font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
              Includes Free Shipping
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border flex items-center gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Box className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Box</p>
                <p className="font-bold">{watch.boxIncluded ? 'Original Box' : 'Not Included'}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl border flex items-center gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Papers</p>
                <p className="font-bold">{watch.papersIncluded ? 'Original Papers' : 'Not Included'}</p>
              </div>
            </div>
            {watch.warrantyCardIncluded && (
              <div className="p-4 rounded-2xl border flex items-center gap-4 col-span-2" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
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
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50 border border-gray-200 dark:border-gray-800"
            >
              <ShoppingCart className="w-5 h-5" />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button className="w-full py-4 border border-gray-200 dark:border-gray-800 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all" style={{ color: 'var(--foreground)' }}>
              <MessageCircle className="w-5 h-5" />
              Chat with Seller
            </button>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b pb-4" style={{ borderColor: 'var(--border)' }}>Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              {specifications.map((spec, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    {spec.icon}
                    <span className="text-sm font-medium">{spec.label}</span>
                  </div>
                  <span className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {watch.description && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">About This Timepiece</h3>
              <p className="leading-relaxed text-muted-foreground">{watch.description}</p>
            </div>
          )}

          <div className="p-6 rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Shield className="w-6 h-6" />
              <h4 className="font-bold uppercase tracking-wider">Authenticity Guaranteed</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every timepiece on Ohana is meticulously inspected by our team of expert watchmakers. 
              We guarantee 100% authenticity and provide a full mechanical warranty for your peace of mind.
            </p>
          </div>

          {watch.seller && (
            <div className="p-6 rounded-3xl border space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Sold & Shipped By</h4>
              <div className="flex items-center gap-4">
                {watch.seller.companyLogo ? (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border">
                    <Image src={watch.seller.companyLogo} alt={watch.seller.companyName} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {watch.seller.companyName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-lg">{watch.seller.companyName}</p>
                  <div className="flex items-center gap-1 text-xs text-green-600 font-bold">
                    <CheckCircle className="w-3 h-3" />
                    Verified Seller
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
