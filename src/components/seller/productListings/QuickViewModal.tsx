import React, { useEffect } from "react";
import Image from 'next/image';
import { Pencil } from "lucide-react";

// Product interface for type safety
interface Product {
  id: string;
  name: string;
  images?: string[];
  [key: string]: unknown;
}

interface QuickViewModalProps {
  open: boolean;
  onClose: () => void;
  product: any;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ open, onClose, product }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  // Handle both Jewelry and Watch products
  const name = product.name || `${product.brand} ${product.model}`.trim();
  const price = product.totalPrice || product.price || 0;
  const description = product.description || product.movement || "No description available.";
  const stockNumber = product.stockNumber || "N/A";
  
  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
    product.image5,
    product.image6
  ].filter(Boolean);

  const mainImage = images[0] || "/placeholder.jpg";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all border border-gray-100"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="flex flex-col md:flex-row h-[90vh] md:h-[80vh]">
          {/* Left: Images */}
          <div className="w-full md:w-1/2 bg-gray-50 flex flex-col p-6 border-b md:border-b-0 md:border-r border-gray-100 overflow-y-auto">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 mb-6">
              <Image
                src={mainImage}
                alt={name}
                fill
                className="object-contain"
              />
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm hover:border-primary transition-colors cursor-pointer">
                    <Image
                      src={img}
                      alt={`${name} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-1/2 p-8 flex flex-col gap-6 overflow-y-auto bg-white">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  {product.brand ? 'Watch' : 'Jewelry'}
                </span>
                {product.condition && (
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                    {product.condition}
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">{name}</h2>
              <p className="text-2xl font-bold text-primary">
                ${Number(price).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase font-semibold">Stock Number</p>
                <p className="text-sm font-medium text-gray-700">{stockNumber}</p>
              </div>
              {product.skuCode && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase font-semibold">SKU Code</p>
                  <p className="text-sm font-medium text-gray-700">{product.skuCode}</p>
                </div>
              )}
              {product.caseMaterial && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Case Material</p>
                  <p className="text-sm font-medium text-gray-700">{product.caseMaterial}</p>
                </div>
              )}
              {product.movement && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Movement</p>
                  <p className="text-sm font-medium text-gray-700">{product.movement}</p>
                </div>
              )}
              {product.metalType && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Metal Type</p>
                  <p className="text-sm font-medium text-gray-700">{product.metalType}</p>
                </div>
              )}
              {product.metalPurity && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Metal Purity</p>
                  <p className="text-sm font-medium text-gray-700">{product.metalPurity}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Product Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="mt-auto pt-6 flex gap-4">
              <button 
                onClick={() => window.location.href = `/seller/products/${product.id}/edit`}
                className="flex-1 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
              >
                <Pencil className="w-4 h-4" />
                Edit Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
