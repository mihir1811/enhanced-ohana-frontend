'use client';

import React, { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useWishlistButton } from '@/hooks/useWishlist';
import { toast } from 'react-hot-toast';

interface WishlistButtonProps {
  productId: number;
  productType?: 'diamond' | 'gemstone' | 'jewellery';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'minimal';
  showText?: boolean;
  className?: string;
  onToggle?: (inWishlist: boolean) => void;
}

const sizeClasses = {
  sm: 'w-8 h-8 p-1.5',
  md: 'w-10 h-10 p-2',
  lg: 'w-12 h-12 p-2.5'
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

const variantClasses = {
  default: 'bg-white hover:bg-gray-50 border border-gray-300',
  outline: 'bg-transparent hover:bg-gray-50 border border-gray-300',
  minimal: 'bg-transparent hover:bg-gray-100/50'
};

export function WishlistButton({
  productId,
  productType = 'jewellery',
  size = 'md',
  variant = 'default',
  showText = false,
  className = '',
  onToggle
}: WishlistButtonProps) {
  const { inWishlist, loading, toggleWishlist } = useWishlistButton(productId, productType);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsAnimating(true);
      const success = await toggleWishlist();
      
      if (success) {
        if (!inWishlist) {
          toast.success('Added to wishlist!', {
            duration: 2000,
            position: 'top-center',
          });
        } else {
          toast.success('Removed from wishlist', {
            duration: 2000,
            position: 'top-center',
          });
        }
        onToggle?.(!inWishlist);
      } else {
        toast.error('Failed to update wishlist');
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsAnimating(false);
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-full transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    active:scale-95
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}
    ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
    ${className}
  `;

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={baseClasses}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {loading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <Heart 
          className={`
            ${iconSizes[size]} 
            transition-all duration-200
            ${inWishlist ? 'fill-current' : ''}
            ${isAnimating ? 'scale-110' : 'scale-100'}
          `}
        />
      )}
      
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {inWishlist ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}

// Compact version for product cards
export function WishlistIcon({ 
  productId, 
  productType = 'jewellery',
  className = '' 
}: {
  productId: number;
  productType?: 'diamond' | 'gemstone' | 'jewellery';
  className?: string;
}) {
  return (
    <WishlistButton
      productId={productId}
      productType={productType}
      size="sm"
      variant="minimal"
      className={className}
    />
  );
}

export default WishlistButton;
