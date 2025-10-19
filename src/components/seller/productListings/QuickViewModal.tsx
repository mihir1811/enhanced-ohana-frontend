import React, { useEffect } from "react";
import Image from 'next/image';

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
  product: Product;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex flex-row h-[80vh]">
          {/* Left: Carousel */}
          <div className="w-2/5 bg-white flex flex-col items-center p-8 border-r border-gray-200">
            {/* Your custom carousel here */}
            {/* Example: */}
            <div className="w-full flex flex-col items-center">
              {/* Replace with your carousel component */}
              <Image
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
                width={320}
                height={320}
                className="object-cover rounded-xl shadow-lg mb-4"
                style={{ background: "#f3f4f6" }}
              />
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 justify-center mb-4">
                  {product.images.slice(1).map((img: string, idx: number) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={`Image ${idx + 2}`}
                      width={60}
                      height={60}
                      className="object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              )}
              {/* Status badge */}
              {/* ... */}
            </div>
          </div>
          {/* Right: Info, scrollable */}
          <div className="w-3/5 p-8 flex flex-col gap-6 overflow-y-auto max-h-[80vh]">
            {/* Product details, add as many as you want */}
            <h2 className="text-3xl font-bold">{product.name}</h2>
            {/* ...rest of your details, collapsibles, etc... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
