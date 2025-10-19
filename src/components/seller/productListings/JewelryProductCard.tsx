import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { jewelryService } from '@/services/jewelryService';
import { auctionService } from '@/services/auctionService';
import { toast } from 'react-hot-toast';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical, Eye, Pencil, Trash2, Images, ChevronLeft, ChevronRight, Clock, Gavel } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { getCookie } from '@/lib/cookie-utils';

export interface JewelryProduct {
  id: string;
  name: string;
  skuCode?: string;
  category?: string;
  subcategory?: string;
  collection?: string;
  gender?: string;
  occasion?: string;
  metalType?: string;
  metalPurity?: string;
  metalWeight?: number;
  basePrice?: number;
  makingCharge?: number;
  tax?: number;
  totalPrice?: number;
  attributes?: {
    style?: string;
    length_cm?: number;
    chain_type?: string;
    clasp_type?: string;
    is_adjustable?: boolean;
    [key: string]: unknown;
  };
  description?: string;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  image5?: string | null;
  image6?: string | null;
  videoURL?: string;
  sellerId?: string;
  isOnAuction?: boolean;
  isSold?: boolean;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  stones?: unknown[];
  auctionStartTime?: string;
  auctionEndTime?: string;
  auctionId?: string;
  stockNumber?: number;
}

interface Props {
  product: JewelryProduct;
  onQuickView?: (product: JewelryProduct) => void;
  onDelete?: (product: JewelryProduct) => void;
  onUpdateProduct?: (product: JewelryProduct) => void;
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
      <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2">
        <div className="flex items-center gap-2 text-red-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Auction Ended</span>
        </div>
      </div>
    );
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 2;
  
  return (
    <div className={`${isUrgent ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'} border rounded-lg px-3 py-2 mt-2`}>
      <div className={`flex items-center justify-between ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isUrgent ? "Ending Soon!" : "Auction Ends"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm font-bold">
          {timeLeft.days > 0 && (
            <span>{timeLeft.days}d</span>
          )}
          <span>{timeLeft.hours.toString().padStart(2, '0')}:</span>
          <span>{timeLeft.minutes.toString().padStart(2, '0')}:</span>
          <span className={isUrgent ? 'animate-pulse' : ''}>
            {timeLeft.seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function JewelryProductCard({ product, onQuickView, onDelete, onUpdateProduct }: Props) {
  const [showDelete, setShowDelete] = useState(false);
  const [showEndAuction, setShowEndAuction] = useState(false);
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

  const handleImageChange = (newIdx: number) => {
    if (imgIdx === newIdx) return;
    setAnimating(true);
    setTimeout(() => {
      setImgIdx(newIdx);
      setAnimating(false);
    }, 200);
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg border hover:shadow-2xl transition-all flex flex-col overflow-hidden group">
      {/* Dropdown at top right */}
      <div className="absolute top-3 right-3 z-10">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-100 shadow"
              aria-label="More actions"
              onClick={e => e.stopPropagation()}
            >
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white rounded-lg shadow-xl border border-gray-100 py-1 px-0 min-w-[170px] z-50"
              sideOffset={8}
              align="end"
            >
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                onSelect={() => {
                  setShowQuickView(true);
                  if (onQuickView) onQuickView(product);
                }}
              >
                <Eye className="w-4 h-4" />
                Quick View
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                onSelect={() => {
                  window.location.href = `/seller/products/${product.id}/edit`;
                }}
              >
                <Pencil className="w-4 h-4" />
                Edit Product
              </DropdownMenu.Item>
              {product.isOnAuction && (
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 cursor-pointer text-orange-600"
                  onSelect={() => setShowEndAuction(true)}
                >
                  <Gavel className="w-4 h-4" />
                  End Auction
                </DropdownMenu.Item>
              )}
              <DropdownMenu.Separator className="h-px bg-gray-100 my-1" />
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
      <div className="relative w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
        <Image
          src={displayImages[imgIdx]}
          alt={product.name}
          width={400}
          height={300}
          className={`object-cover w-full h-full rounded-t-2xl transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}
          style={{ pointerEvents: 'none' }}
        />
        {displayImages.length > 1 && (
          <>
            {/* Prev Arrow */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow flex items-center justify-center z-10"
              onClick={e => {
                e.stopPropagation();
                handleImageChange(imgIdx === 0 ? displayImages.length - 1 : imgIdx - 1);
              }}
              aria-label="Previous image"
              type="button"
            >
              <ChevronLeft className="w-5 h-5 text-blue-600" />
            </button>
            {/* Next Arrow */}
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow flex items-center justify-center z-10"
              onClick={e => {
                e.stopPropagation();
                handleImageChange(imgIdx === displayImages.length - 1 ? 0 : imgIdx + 1);
              }}
              aria-label="Next image"
              type="button"
            >
              <ChevronRight className="w-5 h-5 text-blue-600" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {displayImages.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    imgIdx === idx ? "bg-blue-600" : "bg-gray-300"
                  } border border-white`}
                  onClick={e => {
                    e.stopPropagation();
                    handleImageChange(idx);
                  }}
                  aria-label={`Show image ${idx + 1}`}
                />
              ))}
            </div>
            {/* Carousel icon at bottom right */}
            <div className="absolute bottom-3 right-3 bg-white/80 rounded-full p-1 shadow flex items-center justify-center">
              <span title="Carousel available">
                <Images className="w-5 h-5 text-blue-600" />
              </span>
            </div>
          </>
        )}
      </div>
      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
            {product.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="bg-gray-100 rounded-full px-2 py-1 font-semibold">
            Jewelry
          </span>
          <span className="bg-blue-50 text-blue-700 rounded-full px-2 py-1 font-semibold">
            {product.category}
          </span>
          {/* {product.isOnAuction && (
            <span className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200 rounded-full px-2 py-1 font-semibold animate-pulse">
              🔥 Auction
            </span>
          )} */}
          {product.attributes?.style && (
            <span className="bg-green-50 text-green-700 rounded-full px-2 py-1 font-semibold">
              {product.attributes.style}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-blue-600">
            ${product.totalPrice?.toLocaleString() || product.basePrice?.toLocaleString() || '-'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mb-2">
          <div className="flex items-center gap-1">
            <span className="text-gray-400 font-semibold">SKU:</span>
            <span className="font-bold text-gray-700">{product.skuCode}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400 font-semibold">Stock #:</span>
            <span className="font-bold text-gray-700">{product.stockNumber}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400 font-semibold">Metal:</span>
            <span className="font-bold text-gray-700">{product.metalType}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400 font-semibold">Purity:</span>
            <span className="font-bold text-gray-700">{product.metalPurity}</span>
          </div>
        </div>
        {/* Auction Timer */}
        {product.isOnAuction && product.auctionEndTime && (
          <CountdownTimer endTime={product.auctionEndTime} />
        )}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <div className="flex items-center gap-1">
            <span className="font-semibold">Updated:</span>
            <span className="font-bold text-gray-700">
              {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : '-'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">Stock:</span>
            <span className="font-bold text-gray-700">{product.stockNumber}</span>
          </div>
        </div>
      </div>
      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
              onClick={() => setShowQuickView(false)}
              aria-label="Close"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-2">{product.name}</h2>
            <div className="flex items-center gap-2 mb-2">
              {getStatusTag(product.isDeleted, product.stockNumber)}
              <span className="bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs font-semibold tracking-wide uppercase">
                {product.category}
              </span>
              {product.isOnAuction && (
                <span className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200 rounded-full px-2 py-1 text-xs font-semibold animate-pulse">
                  🔥 Auction
                </span>
              )}
              {product.attributes?.style && (
                <span className="bg-green-50 text-green-700 rounded-full px-2 py-1 font-semibold">
                  {product.attributes.style}
                </span>
              )}
            </div>
            <Image
              src={displayImages[imgIdx]}
              alt={product.name}
              width={512}
              height={256}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <div className="mb-4">
              <span className="text-2xl font-extrabold text-blue-600">${product.totalPrice?.toLocaleString() || product.basePrice?.toLocaleString() || '-'}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
              <div><span className="text-gray-400 font-semibold">SKU:</span> <span className="font-bold text-gray-700">{product.skuCode}</span></div>
              <div><span className="text-gray-400 font-semibold">Stock #:</span> <span className="font-bold text-gray-700">{product.stockNumber}</span></div>
              <div><span className="text-gray-400 font-semibold">Metal:</span> <span className="font-bold text-gray-700">{product.metalType}</span></div>
              <div><span className="text-gray-400 font-semibold">Purity:</span> <span className="font-bold text-gray-700">{product.metalPurity}</span></div>
              <div><span className="text-gray-400 font-semibold">Updated:</span> <span className="font-bold text-gray-700">{product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : '-'}</span></div>
              <div><span className="text-gray-400 font-semibold">Auction:</span> <span className="font-bold text-gray-700">{product.isOnAuction ? 'Yes' : 'No'}</span></div>
            </div>
            {/* Auction Timer */}
            {product.isOnAuction && product.auctionEndTime && (
              <div className="mb-4">
                <CountdownTimer endTime={product.auctionEndTime} />
              </div>
            )}
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setShowQuickView(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* End Auction Confirm Modal */}
      <ConfirmModal 
        open={showEndAuction}
        onOpenChange={setShowEndAuction}
        title="End Auction Early?"
        description="Are you sure you want to end this auction early? This action cannot be undone."
        onYes={async () => {
          setShowEndAuction(false);
          try {
            // Get Bearer token
            const token =  getCookie('token') || '';
            if (!token) throw new Error('User not authenticated');
            
            // Call end auction API using auction service
            const auctionIdToUse = product.auctionId || product.id;
            const response = await auctionService.endAuction(auctionIdToUse, token);
            
            if (!response || response.success === false) {
              throw new Error(response?.message || 'Failed to end auction');
            }
            
            toast.success('Auction ended successfully!');
            // Update local state to reflect ended auction
            onUpdateProduct?.({ ...product, isOnAuction: false });
          } catch (error: unknown) {
            console.error('End auction error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to end auction';
            toast.error(errorMessage);
          }
        }}
        onNo={() => setShowEndAuction(false)}
      />
      
      {/* Delete Confirm Modal */}
      <ConfirmModal 
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Are you sure you want to delete this product?"
        description="This action cannot be undone."
        onYes={async () => {
          setShowDelete(false);
          try {
            // Get Bearer token
            let token = '';
            if (typeof window !== 'undefined') {
              token = localStorage.getItem('token') || '';
              if (!token && document.cookie) {
                const match = document.cookie.match(/token=([^;]+)/);
                if (match) token = match[1];
              }
            }
            if (!token) throw new Error('User not authenticated');
            // Call delete API
            const res = await jewelryService.deleteJewelry(product.id, token);
            if (!res || res.success === false) {
              throw new Error(res?.message || 'Failed to delete jewelry');
            }
            toast.success('Jewelry deleted successfully!');
            if (onDelete) onDelete(product);
          } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete jewelry';
            toast.error(errorMessage);
          }
        }}
        onNo={() => setShowDelete(false)}
      />
    </div>
  );
};
