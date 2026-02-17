import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical, Eye, Pencil, Trash2, Images, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export interface DiamondProduct {
  id: number;
  name: string;
  price: string;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  image5?: string | null;
  image6?: string | null;
  stockNumber: number;
  color: string;
  clarity: string;
  cut: string;
  shape: string;
  isDeleted: boolean;
  updatedAt: string;
  sellerSKU: string;
  isOnAuction?: boolean;
  isSold?: boolean;
  auctionEndTime?: string;
}

interface Props {
  product: DiamondProduct;
  onQuickView?: (product: DiamondProduct) => void;
  onDelete?: (product: DiamondProduct) => void;
  isMelee?: boolean;
}

const getStatusTag = (isDeleted: boolean, stockNumber: number) => {
  if (isDeleted)
    return (
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        Deleted
      </span>
    );
  if (stockNumber <= 0)
    return (
      <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
        Out of Stock
      </span>
    );
  if (stockNumber < 10)
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

const DiamondProductCard: React.FC<Props> = ({ product, onQuickView, onDelete, isMelee = false }) => {
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
          <h3 className="font-bold text-lg line-clamp-2" style={{ color: 'var(--card-foreground)' }}>
            {product.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <span className="rounded-full px-2 py-1 font-semibold" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
            Diamond
          </span>
          <span className="rounded-full px-2 py-1 font-semibold" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
            {product.shape}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold" style={{ color: 'var(--primary)' }}>
            ${Number(product.price).toLocaleString()}
          </span>
        </div>
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
            <span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Clarity:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.clarity}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Cut:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.cut}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Shape:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.shape}</span>
          </div>
        </div>
        {/* Auction Timer */}
        {product.isOnAuction && product.auctionEndTime && (
          <CountdownTimer endTime={product.auctionEndTime} />
        )}
        <div className="flex items-center justify-between text-xs mt-auto" style={{ color: 'var(--muted-foreground)' }}>
          <div className="flex items-center gap-1">
            <span className="font-semibold">Updated:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>
              {new Date(product.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">Stock:</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.stockNumber}</span>
            {/* {product.isOnAuction && (
              <div className="ml-2 relative">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg border-2 border-white animate-pulse">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="drop-shadow-sm">
                    <g>
                      <rect x="8.5" y="2" width="3" height="10" rx="1.5" fill="white" />
                      <rect x="7.5" y="10" width="5" height="2" rx="1" fill="#fef3c7" stroke="white" strokeWidth="1" />
                      <rect x="6" y="13.5" width="8" height="2" rx="1" fill="#fef3c7" stroke="white" strokeWidth="1" />
                    </g>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
              </div>
            )} */}
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
            <h2 className="text-xl font-bold mb-2">{product.name}</h2>
            <div className="flex items-center gap-2 mb-2">
              {getStatusTag(product.isDeleted, product.stockNumber)}
              <span className="rounded-full px-2 py-1 text-xs font-semibold tracking-wide uppercase" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                {product.shape}
              </span>
            </div>
            <div className="relative w-full h-64 flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--muted)' }}>
              <img
                src={displayImages[imgIdx]}
                alt={product.name}
                className={`object-cover w-full h-full rounded-lg transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}
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
                      <Images className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="mb-4">
              <span className="text-2xl font-extrabold" style={{ color: 'var(--primary)' }}>${Number(product.price).toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
              <div><span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>SKU:</span> <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.sellerSKU}</span></div>
              <div><span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Stock #:</span> <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.stockNumber}</span></div>
              <div><span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Color:</span> <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.color}</span></div>
              <div><span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Clarity:</span> <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.clarity}</span></div>
              <div><span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Cut:</span> <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.cut}</span></div>
              <div><span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Shape:</span> <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.shape}</span></div>
              <div><span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Updated:</span> <span className="font-bold" style={{ color: 'var(--foreground)' }}>{new Date(product.updatedAt).toLocaleDateString()}</span></div>
              <div><span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Auction:</span> <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.isOnAuction ? 'Yes' : 'No'}</span></div>
              <div><span className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>Sold:</span> <span className="font-bold" style={{ color: 'var(--foreground)' }}>{product.isSold ? 'Yes' : 'No'}</span></div>
            </div>
            {/* Auction Timer */}
            {product.isOnAuction && product.auctionEndTime && (
              <CountdownTimer endTime={product.auctionEndTime} />
            )}
            {/* <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setShowQuickView(false)}
              >
                Close
              </button>
            </div> */}
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
            const token = typeof window !== 'undefined' ? (document.cookie.match(/token=([^;]+)/)?.[1] || '') : '';
            const service = await import('@/services/diamondService').then(m => m.diamondService);
            if (isMelee) {
              await service.deleteMeleeDiamond(product.id, token);
            } else {
              await service.deleteDiamond(product.id, token);
            }
            toast.success('Product deleted successfully!');
            if (onDelete) onDelete(product);
          } catch (err) {
            toast.error('Failed to delete product.');
          }
        }}
        onNo={() => setShowDelete(false)}
      />
    </div>
  );
};

export default DiamondProductCard;
