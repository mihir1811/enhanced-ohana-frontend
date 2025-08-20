import React, { useState } from 'react';
import { jewelryService } from '@/services/jewelryService';
import { toast } from 'react-hot-toast';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical, Eye, Pencil, Trash2, Images, ChevronLeft, ChevronRight } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

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
    [key: string]: any;
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
  stones?: any[];
  auctionStartTime?: string;
  auctionEndTime?: string;
  stockNumber?: number;
}

interface Props {
  product: JewelryProduct;
  onQuickView?: (product: JewelryProduct) => void;
  onDelete?: (product: JewelryProduct) => void;
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

const JewelryProductCard: React.FC<Props> = ({ product, onQuickView, onDelete }) => {
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
        <img
          src={displayImages[imgIdx]}
          alt={product.name}
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
              {product.attributes?.style && (
                <span className="bg-green-50 text-green-700 rounded-full px-2 py-1 font-semibold">
                  {product.attributes.style}
                </span>
              )}
            </div>
            <img
              src={displayImages[imgIdx]}
              alt={product.name}
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
              <div><span className="text-gray-400 font-semibold">Sold:</span> <span className="font-bold text-gray-700">{product.isSold ? 'Yes' : 'No'}</span></div>
            </div>
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
          } catch (err: any) {
            toast.error(err.message || 'Failed to delete jewelry');
          }
        }}
        onNo={() => setShowDelete(false)}
      />
    </div>
  );
};

export default JewelryProductCard;
