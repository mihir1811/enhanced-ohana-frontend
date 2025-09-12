"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BullionItem, bullionService } from '../../../services/bullionService';

export default function BullionDetailsPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [bullion, setBullion] = useState<BullionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    bullionService.getSingleBullion(id)
      .then((response) => {
        setBullion(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching bullion:', error);
        setError('Failed to load bullion details');
        setBullion(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error || !bullion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🥇</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bullion Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The bullion you are looking for does not exist.'}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image section */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🥇
                    </div>
                  )}
                </div>
                
                {/* Additional images */}
                {bullion.images && bullion.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {bullion.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                        <img
                          src={image}
                          alt={`${bullion.name} ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Details section */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{bullion.name}</h1>
                  <div className="flex items-center gap-2 mt-2 text-lg text-gray-600">
                    <span className="capitalize">{bullion.type}</span>
                    <span>•</span>
                    <span className="capitalize">{bullion.metal}</span>
                    <span>•</span>
                    <span>{bullion.purity}</span>
                    <span>•</span>
                    <span>{bullion.weight} {bullion.weightUnit}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-gray-900">
                    ${bullion.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    ${bullion.pricePerOunce.toLocaleString()}/oz
                  </div>
                  {bullion.spotPrice > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      Spot: ${bullion.spotPrice.toLocaleString()} 
                      <span className="ml-1 text-amber-600 font-semibold">
                        (+${bullion.premium.toLocaleString()} premium)
                      </span>
                    </div>
                  )}
                </div>

                {/* Key details */}
                <div className="grid grid-cols-2 gap-4">
                  {bullion.mint && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Mint</span>
                      <div className="text-gray-900">{bullion.mint}</div>
                    </div>
                  )}
                  {bullion.year && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Year</span>
                      <div className="text-gray-900">{bullion.year}</div>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-500">Condition</span>
                    <div className="text-gray-900">{bullion.condition}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Stock</span>
                    <div className={`${bullion.inventory.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {bullion.inventory.quantity > 0 ? `${bullion.inventory.quantity} available` : 'Out of stock'}
                    </div>
                  </div>
                </div>

                {/* Seller info */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
                  <div className="flex items-center gap-3">
                    {bullion.seller.companyLogo ? (
                      <img src={bullion.seller.companyLogo} alt="" className="w-12 h-12 rounded-full" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold">
                        {bullion.seller.companyName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{bullion.seller.companyName}</div>
                      <div className="text-sm text-gray-600">{bullion.seller.location}</div>
                      {bullion.seller.verified && (
                        <div className="text-xs text-green-600">✓ Verified Seller</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
                    disabled={bullion.inventory.quantity === 0}
                  >
                    {bullion.inventory.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button className="px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            {bullion.description && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{bullion.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
