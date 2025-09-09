'use client';

import React from 'react';
import { Heart, ShoppingCart, Eye, Share2, Trash2 } from 'lucide-react';
import { UnifiedProduct } from '@/types/unified-product';
import WishlistButton from '@/components/shared/WishlistButton';

interface WishlistProductCardProps {
  product: UnifiedProduct;
  viewMode: 'grid' | 'list';
  onRemove: () => void;
  onAddToCart: () => void;
  onView: () => void;
  onShare: () => void;
}

const WishlistProductCard: React.FC<WishlistProductCardProps> = ({
  product,
  viewMode,
  onRemove,
  onAddToCart,
  onView,
  onShare,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getProductIcon = (productType: string) => {
    switch (productType) {
      case 'diamond': return '💎';
      case 'gemstone': return '💍';
      case 'jewellery': return '✨';
      default: return '✨';
    }
  };

  const getProductTypeColor = (productType: string) => {
    switch (productType) {
      case 'diamond': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'gemstone': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'jewellery': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getProductSpecifications = () => {
    const specs: { label: string; value: string | number | undefined }[] = [];
    
    if (product.productType === 'diamond') {
      specs.push(
        { label: 'Carat', value: product.caratWeight },
        { label: 'Color', value: product.color },
        { label: 'Clarity', value: product.clarity },
        { label: 'Cut', value: product.cut },
        { label: 'Shape', value: product.shape }
      );
    } else if (product.productType === 'gemstone') {
      specs.push(
        { label: 'Type', value: product.gemType },
        { label: 'Carat', value: product.caratWeight },
        { label: 'Color', value: product.color },
        { label: 'Origin', value: product.origin },
        { label: 'Shape', value: product.shape }
      );
    } else if (product.productType === 'jewellery') {
      specs.push(
        { label: 'Category', value: product.category },
        { label: 'Metal', value: product.metalType },
        { label: 'Purity', value: product.metalPurity },
        { label: 'Subcategory', value: product.subcategory }
      );
    }
    
    return specs.filter(spec => spec.value);
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 hover:shadow-lg ${
        viewMode === 'list' ? 'flex items-center space-x-6 p-6' : 'p-6'
      }`}
      style={{ 
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Product Image */}
      <div 
        className={`${viewMode === 'list' ? 'w-24 h-24' : 'w-full h-48'} rounded-lg flex items-center justify-center flex-shrink-0 ${viewMode === 'grid' ? 'mb-4' : ''}`}
        style={{ backgroundColor: 'var(--muted)' }}
      >
        {product.mainImage ? (
          <img
            src={product.mainImage}
            alt={product.name || `${product.productType} product`}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${product.mainImage ? 'hidden' : ''} text-center`}>
          <span className={viewMode === 'list' ? 'text-4xl' : 'text-6xl'}>
            {getProductIcon(product.productType)}
          </span>
        </div>
      </div>

      <div className="flex-1">
        {/* Product Info */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 
              className={`font-semibold ${viewMode === 'list' ? 'text-lg' : 'text-xl'} line-clamp-2`}
              style={{ color: 'var(--card-foreground)' }}
            >
              {product.name || `${product.productType.charAt(0).toUpperCase() + product.productType.slice(1)} #${product.id}`}
            </h3>
            <WishlistButton
              productId={Number(product.id)}
              productType={product.productType}
              size="sm"
              className="flex-shrink-0"
            />
          </div>
          
          {/* Product Type Badge */}
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${getProductTypeColor(product.productType)}`}>
            {product.productType.charAt(0).toUpperCase() + product.productType.slice(1)}
          </span>

          {/* Seller ID */}
          {/* {product.sellerId && (
            <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
              Seller: {product.sellerId}
            </p>
          )} */}
          
          {/* Product Specifications */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {getProductSpecifications().slice(0, 4).map((spec, index) => (
              <div key={index} className="flex flex-col">
                <span style={{ color: 'var(--muted-foreground)' }} className="text-xs">
                  {spec.label}
                </span>
                <span style={{ color: 'var(--foreground)' }} className="font-medium">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl font-bold" style={{ color: 'var(--card-foreground)' }}>
              {formatPrice(product.price)}
            </span>
            {product.basePrice && product.totalPrice && product.basePrice < product.totalPrice && (
              <span className="text-sm line-through" style={{ color: 'var(--muted-foreground)' }}>
                {formatPrice(product.basePrice)}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {product.isOnAuction && (
              <span 
                className="px-2 py-1 text-xs rounded-full font-medium"
                style={{ 
                  backgroundColor: 'var(--chart-2)',
                  color: 'var(--primary-foreground)'
                }}
              >
                On Auction
              </span>
            )}
            
            {product.isSold && (
              <span 
                className="px-2 py-1 text-xs rounded-full font-medium"
                style={{ 
                  backgroundColor: 'var(--destructive)',
                  color: 'var(--destructive-foreground)'
                }}
              >
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={`flex items-center space-x-3 ${viewMode === 'list' ? '' : 'flex-col space-y-3 space-x-0'}`}>
          <button
            onClick={onAddToCart}
            disabled={product.isSold === true}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              viewMode === 'list' ? 'flex-1' : 'w-full'
            }`}
            style={{ 
              backgroundColor: product.isSold !== true ? 'var(--primary)' : 'var(--muted)',
              color: product.isSold !== true ? 'var(--primary-foreground)' : 'var(--muted-foreground)'
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{product.isSold !== true ? 'Add to Cart' : 'Sold Out'}</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={onView}
              className="p-2 rounded-lg transition-colors border hover:bg-opacity-10 hover:bg-gray-500"
              style={{ 
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={onShare}
              className="p-2 rounded-lg transition-colors border hover:bg-opacity-10 hover:bg-gray-500"
              style={{ 
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onRemove}
              className="p-2 rounded-lg transition-colors border text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Remove from Wishlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistProductCard;
