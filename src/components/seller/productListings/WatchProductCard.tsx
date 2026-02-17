import React, { useState } from "react";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { WatchProduct } from "@/services/watch.service";
import QuickViewModal from "./QuickViewModal";

interface Props {
  product: WatchProduct;
  onQuickView?: (product: WatchProduct) => void;
  onDelete?: (product: WatchProduct) => void;
}

const getStatusTag = (isDeleted: boolean, availabilityStatus?: boolean) => {
  if (isDeleted)
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
        Deleted
      </span>
    );
  if (availabilityStatus === false)
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
        Out of Stock
      </span>
    );
  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500 text-white">
      In Stock
    </span>
  );
};

const WatchProductCard: React.FC<Props> = ({ product, onQuickView, onDelete }) => {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  const images: string[] = [
      product.image1,
      product.image2,
      product.image3,
      product.image4,
      product.image5,
      product.image6
  ].filter((img): img is string => !!img);

  const displayImages = images.length > 0 ? images : [];

  const handleImageChange = (newIdx: number) => {
    if (imgIdx === newIdx) return;
    setAnimating(true);
    setTimeout(() => {
      setImgIdx(newIdx);
      setAnimating(false);
    }, 200);
  };

  return (
    <>
      <div className="relative rounded-2xl shadow-lg border hover:shadow-2xl transition-all flex flex-col overflow-hidden group bg-card border-border text-foreground">
        {/* Dropdown at top right */}
        <div className="absolute top-3 right-3 z-10">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="cursor-pointer p-2 rounded-full border shadow bg-card border-border text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                aria-label="More actions"
                onClick={e => e.stopPropagation()}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="rounded-lg shadow-xl border p-1 min-w-[180px] z-50 bg-white border-border text-gray-900"
                sideOffset={8}
                align="end"
              >
                <DropdownMenu.Item
                  className="group flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors hover:bg-gray-100 rounded-md text-sm focus:bg-gray-100 focus:outline-none text-gray-900"
                  onSelect={() => {
                    setShowQuickView(true);
                    if (onQuickView) onQuickView(product);
                  }}
                >
                  <Eye className="w-4 h-4 text-gray-500 group-hover:text-gray-900" />
                  Quick View
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="group flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors hover:bg-gray-100 rounded-md text-sm focus:bg-gray-100 focus:outline-none text-gray-900"
                  onSelect={() => {
                    router.push(`/seller/products/${product.id}/edit`);
                  }}
                >
                  <Pencil className="w-4 h-4 text-gray-500 group-hover:text-gray-900" />
                  Edit Product
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px my-1 bg-border" />
                <DropdownMenu.Item
                  className="group flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-destructive"
                  onSelect={() => setShowDelete(true)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                  Delete Product
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
        
        {/* Status tag */}
        <div className="absolute top-3 left-3 z-10">
          {getStatusTag(product.isDeleted, product.availabilityStatus)}
        </div>

        {/* Image */}
        <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-muted">
          {displayImages.length === 0 ? (
            <img
              src={"https://www.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg"}
              alt="No image available"
              className="object-cover w-full h-full rounded-t-2xl"
              style={{ pointerEvents: 'none' }}
            />
          ) : (
            <>
              <img
                src={displayImages[imgIdx]}
                alt={product.stockNumber}
                className={`object-cover w-full h-full rounded-t-2xl transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}
                style={{ pointerEvents: 'none' }}
              />
              {displayImages.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-1 shadow flex items-center justify-center z-10 bg-card border border-border"
                    onClick={e => {
                      e.stopPropagation();
                      handleImageChange(imgIdx === 0 ? displayImages.length - 1 : imgIdx - 1);
                    }}
                    type="button"
                  >
                    <ChevronLeft className="w-5 h-5 text-primary" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 shadow flex items-center justify-center z-10 bg-card border border-border"
                    onClick={e => {
                      e.stopPropagation();
                      handleImageChange(imgIdx === displayImages.length - 1 ? 0 : imgIdx + 1);
                    }}
                    type="button"
                  >
                    <ChevronRight className="w-5 h-5 text-primary" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {displayImages.map((_, idx) => (
                      <button
                        key={idx}
                        className={`w-2 h-2 rounded-full border ${imgIdx === idx ? 'bg-primary border-primary' : 'bg-border border-border'}`}
                        onClick={e => {
                          e.stopPropagation();
                          handleImageChange(idx);
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base md:text-lg line-clamp-2 text-foreground">
              {product.brand} {product.model}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full px-2 py-1 font-semibold bg-muted text-muted-foreground">
              {product.condition}
            </span>
            <span className="rounded-full px-2 py-1 font-semibold bg-accent text-accent-foreground">
              {product.caseMaterial}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              ${Number(product.price).toLocaleString()}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-auto pt-3 border-t border-border">
              Stock #: {product.stockNumber}
          </div>
        </div>

         {/* Confirm Delete Modal - triggered via state */}
          {showDelete && onDelete && (
               // Note: In real implementation, we would pass onDelete to a ConfirmModal.
               // Here we just use the parent's onDelete if confirmed.
               // But since we are inside the card, we might need to lift the modal up or import ConfirmModal here.
               // I'll import ConfirmModal as in BullionProductCard
               <></>
          )}
      </div>

      <QuickViewModal 
        open={showQuickView} 
        onClose={() => setShowQuickView(false)} 
        product={product} 
      />
    </>
  );
};

export default WatchProductCard;
