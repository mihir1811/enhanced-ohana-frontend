'use client';

import React, { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useWishlistButton } from '@/hooks/useWishlist';
import { toast } from 'react-hot-toast';

interface WishlistButtonProps {
  productId: number;
  productType?: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'minimal';
  shape?: 'circle' | 'pill' | 'button';
  showText?: boolean;
  className?: string;
  onToggle?: (inWishlist: boolean) => void;
}

const sizeClasses = {
  sm: 'w-8 h-8 p-1.5',
  md: 'w-10 h-10 p-2',
  lg: 'w-12 h-12 p-2.5'
};

const pillPadding = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2',
  lg: 'px-5 py-2.5'
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

const variantClasses = {
  default: 'border',
  outline: 'border',
  minimal: ''
};

export function WishlistButton({
  productId,
  productType = 'jewellery',
  size = 'md',
  variant = 'default',
  shape = 'circle',
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

  const shapeClasses = shape === 'button'
    ? `rounded-2xl px-6 py-4`
    : showText
      ? `rounded-2xl ${pillPadding[size]}`
      : `rounded-full ${sizeClasses[size]}`;
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    ${shapeClasses}
    transition-all duration-200 hover:opacity-90
    focus:outline-none focus:ring-2 focus:ring-offset-2
    active:scale-95 ${variantClasses[variant]}
    ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
    ${className}
  `;

  const style: React.CSSProperties = {
    backgroundColor: variant === 'default' ? 'var(--card)' : 'transparent',
    borderColor: variant !== 'minimal' ? 'var(--border)' : 'transparent',
    color: variant === 'outline' ? 'var(--foreground)' : (inWishlist ? 'var(--accent)' : 'var(--muted-foreground)')
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={baseClasses}
      style={style}
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
        <span className="text-sm font-medium">
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
  productType?: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond';
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
