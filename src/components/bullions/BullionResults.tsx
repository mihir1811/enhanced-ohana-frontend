"use client";

import React from 'react';
import { Grid3X3, List, Heart, Share2, Eye, MapPin, Shield, Truck } from 'lucide-react';
import { BullionItem } from '../../services/bullionService';
import { formatPrice, formatWeight, getBullionTypeIcon, getMetalIcon, calculatePremiumPercentage } from './bullionUtils';

export interface BullionResultsProps {
  bullions: BullionItem[];
  loading: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onBullionSelect: (bullion: BullionItem) => void;
  onAddToCart?: (bullion: BullionItem) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

const BullionCard: React.FC<{
  bullion: BullionItem;
  onSelect: () => void;
  onAddToCart?: () => void;
}> = ({ bullion, onSelect, onAddToCart }) => {
  const premiumPercentage = calculatePremiumPercentage(bullion.price, bullion.spotPrice);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Image */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {bullion.images && bullion.images.length > 0 ? (
            <img
              src={bullion.images[0]}
              alt={bullion.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder-bullion.png';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {getBullionTypeIcon(bullion.type)} {getMetalIcon(bullion.metal)}
            </div>
          )}
        </div>
        
        {/* Overlay actions */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors">
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Premium badge */}
        {premiumPercentage > 0 && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded">
            +{premiumPercentage.toFixed(1)}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and basic info */}
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-amber-600 transition-colors cursor-pointer" onClick={onSelect}>
            {bullion.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
            <span className="capitalize">{bullion.type}</span>
            <span>•</span>
            <span className="capitalize">{bullion.metal}</span>
            <span>•</span>
            <span>{bullion.purity}</span>
            <span>•</span>
            <span>{formatWeight(bullion.weight, bullion.weightUnit)}</span>
          </div>
        </div>

        {/* Mint and year */}
        {(bullion.mint || bullion.year) && (
          <div className="text-sm text-gray-600">
            {bullion.mint && <span>{bullion.mint}</span>}
            {bullion.mint && bullion.year && <span> • </span>}
            {bullion.year && <span>{bullion.year}</span>}
          </div>
        )}

        {/* Price info */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(bullion.price, bullion.currency)}
            </span>
            <span className="text-sm text-gray-600">
              {formatPrice(bullion.pricePerOunce, bullion.currency)}/oz
            </span>
          </div>
          
          {bullion.spotPrice > 0 && (
            <div className="text-xs text-gray-500">
              Spot: {formatPrice(bullion.spotPrice, bullion.currency)} 
              <span className="ml-1 text-amber-600 font-semibold">
                (+{formatPrice(bullion.premium, bullion.currency)})
              </span>
            </div>
          )}
        </div>

        {/* Seller info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {bullion.seller.companyLogo ? (
              <img src={bullion.seller.companyLogo} alt="" className="w-6 h-6 rounded-full" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                {bullion.seller.companyName.charAt(0)}
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">{bullion.seller.companyName}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {bullion.seller.verified && <Shield className="w-3 h-3 text-green-500" />}
                {bullion.seller.location && (
                  <>
                    <MapPin className="w-3 h-3" />
                    <span>{bullion.seller.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {bullion.views}
            </div>
          </div>
        </div>

        {/* Shipping and stock info */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-600">
            {bullion.shipping.free && (
              <div className="flex items-center gap-1 text-green-600">
                <Truck className="w-3 h-3" />
                <span>Free Shipping</span>
              </div>
            )}
            {bullion.shipping.insured && (
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Insured</span>
              </div>
            )}
          </div>
          
          <div className="text-xs">
            {bullion.inventory.quantity > 0 ? (
              <span className="text-green-600 font-medium">In Stock ({bullion.inventory.quantity})</span>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onAddToCart}
          className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const BullionListItem: React.FC<{
  bullion: BullionItem;
  onSelect: () => void;
  onAddToCart?: () => void;
}> = ({ bullion, onSelect, onAddToCart }) => {
  const premiumPercentage = calculatePremiumPercentage(bullion.price, bullion.spotPrice);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow p-4">
      <div className="flex gap-4">
        {/* Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
            {bullion.images && bullion.images.length > 0 ? (
              <img
                src={bullion.images[0]}
                alt={bullion.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-bullion.png';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                {getBullionTypeIcon(bullion.type)}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="font-semibold text-gray-900 hover:text-amber-600 transition-colors cursor-pointer line-clamp-1" onClick={onSelect}>
                {bullion.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <span className="capitalize">{bullion.type}</span>
                <span>•</span>
                <span className="capitalize">{bullion.metal}</span>
                <span>•</span>
                <span>{bullion.purity}</span>
                <span>•</span>
                <span>{formatWeight(bullion.weight, bullion.weightUnit)}</span>
                {bullion.mint && (
                  <>
                    <span>•</span>
                    <span>{bullion.mint}</span>
                  </>
                )}
              </div>
              
              {/* Seller */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-medium text-gray-900">{bullion.seller.companyName}</span>
                {bullion.seller.verified && <Shield className="w-3 h-3 text-green-500" />}
                {bullion.seller.location && (
                  <span className="text-xs text-gray-500">• {bullion.seller.location}</span>
                )}
              </div>
            </div>

            {/* Price and actions */}
            <div className="flex-shrink-0 text-right">
              <div className="text-xl font-bold text-gray-900">
                {formatPrice(bullion.price, bullion.currency)}
              </div>
              <div className="text-sm text-gray-600">
                {formatPrice(bullion.pricePerOunce, bullion.currency)}/oz
              </div>
              {premiumPercentage > 0 && (
                <div className="text-xs text-amber-600 font-semibold">
                  +{premiumPercentage.toFixed(1)}% premium
                </div>
              )}
              
              <div className="flex items-center gap-2 mt-3">
                <button className="p-1.5 text-gray-500 hover:text-amber-600 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-500 hover:text-amber-600 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onAddToCart}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BullionResults: React.FC<BullionResultsProps> = ({
  bullions,
  loading,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onBullionSelect,
  onAddToCart,
  viewMode = 'grid',
  onViewModeChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (bullions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🥇</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bullions Found</h3>
        <p className="text-gray-600">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Results header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600">
          Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount.toLocaleString()} bullions
        </div>
        
        {onViewModeChange && (
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Results grid/list */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bullions.map((bullion) => (
            <BullionCard
              key={bullion.id}
              bullion={bullion}
              onSelect={() => onBullionSelect(bullion)}
              onAddToCart={() => onAddToCart?.(bullion)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {bullions.map((bullion) => (
            <BullionListItem
              key={bullion.id}
              bullion={bullion}
              onSelect={() => onBullionSelect(bullion)}
              onAddToCart={() => onAddToCart?.(bullion)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {[...Array(Math.min(5, totalPages))].map((_, index) => {
            const page = Math.max(1, currentPage - 2) + index;
            if (page > totalPages) return null;
            
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 text-sm border rounded-lg ${
                  currentPage === page
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BullionResults;
