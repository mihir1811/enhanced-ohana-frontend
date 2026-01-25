import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { toast } from "react-hot-toast";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical, Eye, Pencil, Trash2, Images, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { gemstoneService } from '@/services/gemstoneService';
import { getCookie } from '@/lib/cookie-utils';

const CountdownTimer: React.FC<{ endTime: string }> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endTime) - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return null;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [endTime]);

  if (!timeLeft) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-3 mt-3 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-red-700">
          <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-center">
            <div className="text-sm font-bold">Auction Ended</div>
            <div className="text-xs opacity-75">This auction has concluded</div>
          </div>
        </div>
      </div>
    );
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 2;
  const bgGradient = isUrgent 
    ? "bg-gradient-to-br from-orange-50 via-red-50 to-pink-50" 
    : "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50";
  const borderColor = isUrgent ? "border-red-300" : "border-amber-300";
  const textColor = isUrgent ? "text-red-700" : "text-amber-700";
  const iconBg = isUrgent ? "bg-red-100" : "bg-amber-100";
  const iconColor = isUrgent ? "text-red-600" : "text-amber-600";

  return (
    <div className={`${bgGradient} border-2 ${borderColor} rounded-xl p-3 mt-3 shadow-lg transition-all duration-300 hover:shadow-xl`}>
      <div className={`flex items-center gap-2 ${textColor} mb-3`}>
        <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center animate-pulse`}>
          <Clock className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div>
          <div className="text-sm font-bold">
            {isUrgent ? "🔥 Ending Soon!" : "⏰ Auction Ends In:"}
          </div>
          <div className="text-xs opacity-75">Live countdown</div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-2 py-2 text-center shadow-sm border border-white/50 hover:bg-white/90 transition-colors">
          <div className={`text-lg font-bold ${isUrgent ? 'text-red-600' : 'text-amber-600'} leading-none`}>
            {timeLeft.days.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] font-medium text-gray-600 mt-0.5">DAYS</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-2 py-2 text-center shadow-sm border border-white/50 hover:bg-white/90 transition-colors">
          <div className={`text-lg font-bold ${isUrgent ? 'text-red-600' : 'text-amber-600'} leading-none`}>
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] font-medium text-gray-600 mt-0.5">HRS</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-2 py-2 text-center shadow-sm border border-white/50 hover:bg-white/90 transition-colors">
          <div className={`text-lg font-bold ${isUrgent ? 'text-red-600' : 'text-amber-600'} leading-none`}>
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] font-medium text-gray-600 mt-0.5">MIN</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-2 py-2 text-center shadow-sm border border-white/50 hover:bg-white/90 transition-colors">
          <div className={`text-lg font-bold ${isUrgent ? 'text-red-600 animate-pulse' : 'text-amber-600'} leading-none`}>
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] font-medium text-gray-600 mt-0.5">SEC</div>
        </div>
      </div>
      
      {isUrgent && (
        <div className="mt-2 text-center">
          <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium animate-bounce">
            ⚡ Hurry! Auction ending soon
          </div>
        </div>
      )}
    </div>
  );
};

export interface GemstoneProduct {
  id: string | number;
  gemsType: string;
  subType?: string;
  name?: string; // Optional since API might not return it
  price?: number; // Kept for backward compatibility
  totalPrice?: string | number;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  image5?: string | null;
  image6?: string | null;
  stockNumber?: number;
  color?: string;
  shape?: string;
  isDeleted?: boolean;
  updatedAt?: string;
  sellerSKU?: string;
  isSold?: boolean;
  isOnAuction?: boolean;
  auctionEndTime?: string;
  // Add other fields from API if needed for display
  composition?: string;
  qualityGrade?: string;
  quantity?: number;
  videoURL?: string;
  description?: string | null;
  discount?: string;
  pricePerCarat?: string;
  carat?: number;
  clarity?: string;
  hardness?: number;
  origin?: string;
  fluoreScence?: string;
  process?: string;
  cut?: string;
  dimension?: string;
  refrectiveIndex?: string;
  birefringence?: string;
  spacificGravity?: string;
  treatment?: string;
  certificateCompanyName?: string;
  certificateNumber?: string;
  sellerId?: string;
  createdAt?: string;
  auctionStartTime?: string | null;
}

interface Props {
  product: GemstoneProduct;
  onQuickView?: (product: GemstoneProduct) => void;
  onDelete?: (product: GemstoneProduct) => void;
}

const getStatusTag = (isDeleted?: boolean, stockNumber?: number) => {
  if (isDeleted)
    return (
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        Deleted
      </span>
    );
  if (stockNumber !== undefined && stockNumber <= 0)
    return (
      <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
        Out of Stock
      </span>
    );
  if (stockNumber !== undefined && stockNumber < 10)
    return (
      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
        Low Stock
      </span>
    );
  return (
    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
      In Stock
    </span>
  );
};

const GemstoneProductCard: React.FC<Props> = ({ product, onQuickView, onDelete }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
    product.image5,
    product.image6,
  ].filter(Boolean) as string[];

  const displayImages =
    images.length > 0
      ? images
      : [
          "https://media.istockphoto.com/id/1493089752/vector/box-and-package-icon-concept.jpg",
        ];

  // Construct display name if name is missing
  const displayName = product.name || `${product.subType || ''} ${product.gemsType}`.trim() || 'Unnamed Gemstone';
  
  // Handle price display (prefer totalPrice, fallback to price)
  const displayPrice = product.totalPrice 
    ? Number(product.totalPrice) 
    : product.price;

  const handleImageChange = (newIdx: number) => {
    if (imgIdx === newIdx) return;
    setAnimating(true);
    setTimeout(() => {
      setImgIdx(newIdx);
      setAnimating(false);
    }, 200);
  };

  return (
    <div className="relative rounded-2xl shadow-lg border hover:shadow-2xl transition-all flex flex-col overflow-hidden group" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
      {/* Dropdown at top right */}
      <div className="absolute top-3 right-3 z-10">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="p-2 rounded-full border shadow hover:opacity-90"
              aria-label="More actions"
              onClick={e => e.stopPropagation()}
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="rounded-lg shadow-xl border py-1 px-0 min-w-[170px] z-50"
              sideOffset={8}
              align="end"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors"
                onSelect={() => {
                  setShowQuickView(true);
                  if (onQuickView) onQuickView(product);
                }}
                style={{ color: 'var(--foreground)' }}
              >
                <Eye className="w-4 h-4" />
                Quick View
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors"
                onSelect={() => {
                  window.location.href = `/seller/products/${product.id}/edit`;
                }}
                style={{ color: 'var(--foreground)' }}
              >
                <Pencil className="w-4 h-4" />
                Edit Product
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px my-1" style={{ backgroundColor: 'var(--border)' }} />
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 cursor-pointer text-red-600"
                onSelect={() => setShowDelete(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete Product
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      {/* Status tag */}
      <div className="absolute top-3 left-3 z-10">
        {getStatusTag(product.isDeleted, product.stockNumber)}
      </div>
      {/* Image */}
      <div className="relative w-full aspect-[4/3] flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
        <Image
          src={displayImages[imgIdx]}
          alt={displayName}
          width={400}
          height={300}
          className={`object-cover w-full h-full rounded-t-2xl transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}
          style={{ pointerEvents: 'none' }}
        />
        {displayImages.length > 1 && (
          <>
            {/* Prev Arrow */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-1 shadow flex items-center justify-center z-10"
              onClick={e => {
                e.stopPropagation();
                handleImageChange(imgIdx === 0 ? displayImages.length - 1 : imgIdx - 1);
              }}
              aria-label="Previous image"
              type="button"
            >
              <ChevronLeft className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            </button>
            {/* Next Arrow */}
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 shadow flex items-center justify-center z-10"
              onClick={e => {
                e.stopPropagation();
                handleImageChange(imgIdx === displayImages.length - 1 ? 0 : imgIdx + 1);
              }}
              aria-label="Next image"
              type="button"
            >
              <ChevronRight className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {displayImages.map((_, idx) => (
                <button
                  key={idx}
                  className="w-2 h-2 rounded-full border"
                  style={{ backgroundColor: imgIdx === idx ? 'var(--primary)' : 'var(--border)', borderColor: 'var(--border)' }}
                  onClick={e => {
                    e.stopPropagation();
                    handleImageChange(idx);
                  }}
                  aria-label={`Show image ${idx + 1}`}
                />
              ))}
            </div>
            {/* Carousel icon at bottom right */}
            <div className="absolute bottom-3 right-3 rounded-full p-1 shadow flex items-center justify-center" style={{ backgroundColor: 'var(--card)' }}>
              <span title="Carousel available">
                <Images className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </span>
            </div>
          </>
        )}
      </div>
      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg line-clamp-2 capitalize" style={{ color: 'var(--card-foreground)' }}>
            {displayName}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <span className="rounded-full px-2 py-1 font-semibold capitalize" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
            {product.gemsType}
          </span>
          {product.isOnAuction && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full px-2 py-1 font-semibold animate-pulse">
              🔥 Live Auction
            </span>
          )}
          <span className="rounded-full px-2 py-1 font-semibold" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
            {product.shape}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold" style={{ color: 'var(--primary)' }}>
            ${displayPrice?.toLocaleString() || '-'}
          </span>
        </div>
        
        {/* Auction Timer */}
        {product.isOnAuction && product.auctionEndTime && (
          <CountdownTimer endTime={product.auctionEndTime} />
        )}
        
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mb-2">
          <div className="flex items-center gap-1">
            <span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>SKU:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.sellerSKU}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Stock #:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.stockNumber}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Color:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.color}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Shape:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.shape}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs mt-auto" style={{ color: 'var(--muted-foreground)' }}>
          <div className="flex items-center gap-1">
            <span className="font-semibold">Updated:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>
              {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : '-'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">Stock:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.stockNumber}</span>
          </div>
        </div>
      </div>
      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-xl shadow-xl max-w-lg w-full p-6 relative" style={{ backgroundColor: 'var(--card)' }}>
            <button
              className="absolute top-2 right-2 hover:opacity-80"
              onClick={() => setShowQuickView(false)}
              aria-label="Close"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-2 capitalize">{displayName}</h2>
            <div className="flex items-center gap-2 mb-2">
              {getStatusTag(product.isDeleted, product.stockNumber)}
              <span className="rounded-full px-2 py-1 text-xs font-semibold tracking-wide uppercase" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                {product.shape}
              </span>
            </div>
            <Image
              src={displayImages[imgIdx]}
              alt={product.name || `${product.subType || ''} ${product.gemsType}`}
              width={400}
              height={256}
              className="w-full h-64 object-cover rounded-lg mb-4"
              style={{ backgroundColor: 'var(--muted)' }}
            />
            <div className="mb-4">
              <span className="text-2xl font-extrabold" style={{ color: 'var(--primary)' }}>${product.price?.toLocaleString() || '-'}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
              <div><span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>SKU:</span> <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.sellerSKU}</span></div>
              <div><span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Stock #:</span> <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.stockNumber}</span></div>
              <div><span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Color:</span> <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.color}</span></div>
              <div><span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Shape:</span> <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.shape}</span></div>
              <div><span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Updated:</span> <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : '-'}</span></div>
              <div><span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Sold:</span> <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.isSold ? 'Yes' : 'No'}</span></div>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                onClick={() => setShowQuickView(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Are you sure you want to delete this product?"
        description="This action cannot be undone."
        onYes={async () => {
          setShowDelete(false);
          try {
            const token = getCookie('token');
            if (!token) throw new Error('User not authenticated');
            const res = await gemstoneService.deleteGemstone(product.id, token);
            if (!res || res.success === false) {
              throw new Error(res?.message || 'Failed to delete gemstone');
            }
            toast.success('Product deleted successfully!');
            if (onDelete) onDelete(product);
          } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete product.';
            toast.error(errorMessage);
          }
        }}
        onNo={() => setShowDelete(false)}
      />
    </div>
  );
};

export default GemstoneProductCard;
