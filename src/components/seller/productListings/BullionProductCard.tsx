import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical, Eye, Pencil, Trash2, Images, ChevronLeft, ChevronRight } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { BullionProduct } from "@/services/bullion.service";

interface Props {
  product: BullionProduct;
  onQuickView?: (product: BullionProduct) => void;
  onDelete?: (product: BullionProduct) => void;
}

const getStatusTag = (isDeleted: boolean, quantity: number) => {
  if (isDeleted)
    return (
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        Deleted
      </span>
    );
  if (quantity <= 0)
    return (
      <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
        Out of Stock
      </span>
    );
  if (quantity < 10)
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

const BullionProductCard: React.FC<Props> = ({ product, onQuickView, onDelete }) => {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Fallback if images logic differs, assuming similar to diamond for now
  // Bullion might not have multiple images in the interface I saw, but let's assume it might.
  // The service definition doesn't explicitly list images array, but let's check if it comes from backend.
  // If not, we'll use a placeholder.
  const images: string[] = []; 
  // TODO: Add images support to Bullion entity/service if needed.
  // For now, use placeholder.

  const displayImages =
    images.length > 0
      ? images
      : [
          "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=2048x2048&w=is&k=20&c=dFWJz1EFJt7Tq2lA-hgTpSW119YywTWtS4EwU3fpKrE=",
        ];

  // Helper for fade animation
  const handleImageChange = (newIdx: number) => {
    if (imgIdx === newIdx) return;
    setAnimating(true);
    setTimeout(() => {
      setImgIdx(newIdx);
      setAnimating(false);
    }, 200); // duration matches fade-out
  };

  return (
    <div className="relative rounded-2xl shadow-lg border hover:shadow-2xl transition-all flex flex-col overflow-hidden group" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
      {/* Dropdown at top right */}
      <div className="absolute top-3 right-3 z-10">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="cursor-pointer p-2 rounded-full border shadow hover:opacity-90"
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
                  router.push(`/seller/products/${product.id}/edit`);
                }}
                style={{ color: 'var(--foreground)' }}
              >
                <Pencil className="w-4 h-4" />
                Edit Product
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px my-1" style={{ backgroundColor: 'var(--border)' }} />
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 cursor-pointer text-red-600"
                onSelect={() => {
                  if (onDelete) onDelete(product);
                }}
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
        {getStatusTag(product.isActive === false, product.quantity)}
      </div>
      {/* Image */}
      <div className="relative w-full aspect-[4/3] flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
        <img
          src={displayImages[imgIdx]}
          alt={product.stockNumber}
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
          </>
        )}
      </div>
      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg line-clamp-2" style={{ color: 'var(--card-foreground)' }}>
            {product.metalType?.name || 'Bullion'} {product.metalWeight}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <span className="rounded-full px-2 py-1 font-semibold" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
            Bullion
          </span>
          <span className="rounded-full px-2 py-1 font-semibold" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
            {product.metalShape?.name}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold" style={{ color: 'var(--primary)' }}>
            ${Number(product.price).toLocaleString()}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mb-2">
          <div className="flex items-center gap-1">
            <span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Stock #:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.stockNumber}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Fineness:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.metalFineness?.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Weight:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.metalWeight}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Quantity:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.quantity}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs mt-auto" style={{ color: 'var(--muted-foreground)' }}>
          <div className="flex items-center gap-1">
            <span className="font-semibold">Updated:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>
              {new Date(product.updatedAt).toLocaleDateString()}
            </span>
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
            <h2 className="text-xl font-bold mb-2">{product.metalType?.name} {product.metalWeight}</h2>
            <div className="flex items-center gap-2 mb-2">
              {getStatusTag(product.isActive === false, product.quantity)}
              <span className="rounded-full px-2 py-1 text-xs font-semibold tracking-wide uppercase" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                {product.metalShape?.name}
              </span>
            </div>
            <div className="relative w-full h-64 flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--muted)' }}>
              <img
                src={displayImages[imgIdx]}
                alt={product.stockNumber}
                className={`object-cover w-full h-full rounded-lg transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}
                style={{ pointerEvents: 'none' }}
              />
            </div>
            {/* Quick View Details */}
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="text-gray-500 block">Price</span>
                    <span className="font-bold">${Number(product.price).toLocaleString()}</span>
                </div>
                <div>
                    <span className="text-gray-500 block">Weight</span>
                    <span className="font-bold">{product.metalWeight}</span>
                </div>
                <div>
                    <span className="text-gray-500 block">Fineness</span>
                    <span className="font-bold">{product.metalFineness?.name}</span>
                </div>
                <div>
                    <span className="text-gray-500 block">Mint Year</span>
                    <span className="font-bold">{product.mintYear || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                    <span className="text-gray-500 block">Condition</span>
                    <span className="font-bold">{product.condition || 'N/A'}</span>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BullionProductCard;