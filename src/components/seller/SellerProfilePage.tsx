"use client";

import React, { useEffect, useState } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  Calendar, 
  Shield, 
  Star, 
  CheckCircle, 
  AlertCircle,
  Globe,
  Award,
  TrendingUp,
  Users,
  Package,
  Gem,
  Diamond,
  Crown
} from "lucide-react";
import { diamondService } from "@/services/diamondService";
import { useSellerProducts, SellerType } from "@/hooks/useSellerProducts";

export const SellerTypes = SellerType;

type SellerType = keyof typeof SellerTypes;

interface SellerProfilePageProps {
  sellerId: string;
}

const getProductTypeConfig = (sellerType: string) => {
  switch (sellerType) {
    case SellerType.naturalDiamond:
      return {
        primaryType: 'diamonds',
        primaryLabel: 'Natural Diamonds',
        primaryIcon: Diamond,
        primaryEmoji: '💎',
        specialistLabel: 'Natural Diamond Specialist',
        color: 'blue'
      };
    case SellerType.labGrownDiamond:
      return {
        primaryType: 'diamonds',
        primaryLabel: 'Lab-Grown Diamonds',
        primaryIcon: Diamond,
        primaryEmoji: '💎',
        specialistLabel: 'Lab-Grown Diamond Specialist',
        color: 'green'
      };
    case SellerType.jewellery:
      return {
        primaryType: 'jewelry',
        primaryLabel: 'Jewelry',
        primaryIcon: Crown,
        primaryEmoji: '💍',
        specialistLabel: 'Jewelry Specialist',
        color: 'purple'
      };
    case SellerType.gemstone:
      return {
        primaryType: 'gemstones',
        primaryLabel: 'Gemstones',
        primaryIcon: Gem,
        primaryEmoji: '💎',
        specialistLabel: 'Gemstone Specialist',
        color: 'emerald'
      };
    default:
      return {
        primaryType: 'all',
        primaryLabel: 'All Products',
        primaryIcon: Package,
        primaryEmoji: '💎',
        specialistLabel: 'Multi-Category Seller',
        color: 'gray'
      };
  }
};

const getProductRoute = (product: any, productType: string) => {
  if (product.shape || productType === 'diamonds') return `/diamonds/${product.id}`;
  if (productType === 'jewelry' || product.jewelryType) return `/product/jewelry/${product.id}`;
  if (productType === 'gemstones' || product.gemstoneType) return `/gemstones/${product.id}`;
  return `/products/${product.id}`;
};

const getProductIcon = (product: any, productType: string) => {
  if (product.shape || productType === 'diamonds') return '💎';
  if (productType === 'jewelry' || product.jewelryType) return '💍';
  if (productType === 'gemstones' || product.gemstoneType) return '🔮';
  return '📦';
};

const getProductSpecs = (product: any, productType: string) => {
  if (product.shape || productType === 'diamonds') {
    return [
      { label: 'Color', value: product.color },
      { label: 'Clarity', value: product.clarity },
      { label: 'Cut', value: product.cut }
    ];
  }
  if (productType === 'jewelry' || product.category) {
    return [
      { label: 'Metal', value: product.metalType?.replace('-', ' ') || 'N/A' },
      { label: 'Purity', value: product.metalPurity || 'N/A' },
      { label: 'Category', value: product.category || 'N/A' }
    ];
  }
  if (productType === 'gemstones' || product.gemstoneType) {
    return [
      { label: 'Type', value: product.gemstoneType },
      { label: 'Origin', value: product.origin },
      { label: 'Treatment', value: product.treatment }
    ];
  }
  return [];
};

export default function SellerProfilePage({ sellerId }: SellerProfilePageProps) {
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Use custom hook for seller products
  const { products, loading: productsLoading, error: productsError, fetchProducts, refreshProducts } = useSellerProducts(sellerId);

  useEffect(() => {
    if (!sellerId) return;
    
    const fetchSellerInfo = async () => {
      setLoading(true);
      try {
        // Fetch seller info
        const sellerRes = await diamondService.getSellerInfo(sellerId);
        const sellerData = sellerRes?.data || null;
        setSeller(sellerData);
        
        // Fetch products using the custom hook with seller type
        await fetchProducts(sellerId, sellerData?.sellerType);
      } catch (error) {
        console.error('Error fetching seller data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerInfo();
  }, [sellerId, fetchProducts]);

  // Get current products based on seller type (no tabs needed)
  const getCurrentProducts = () => {
    if (!seller?.sellerType) return products.all || [];
    
    switch (seller.sellerType) {
      case SellerType.naturalDiamond:
      case SellerType.labGrownDiamond:
        return products.diamonds || [];
      case SellerType.jewellery:
        return products.jewelry || [];
      case SellerType.gemstone:
        return products.gemstones || [];
      default:
        return products.all || [];
    }
  };

  const currentProducts = getCurrentProducts();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const config = seller ? getProductTypeConfig(seller.sellerType) : getProductTypeConfig('');
  const colorClasses: { [key: string]: string } = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    emerald: 'bg-emerald-100 text-emerald-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading seller information...</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Seller Not Found</h2>
          <p className="text-gray-600">The requested seller information could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Cover Background */}
        <div className={`h-32 bg-gradient-to-r from-${config.color}-500 via-${config.color}-600 to-${config.color}-700`}></div>
        
        {/* Profile Info */}
        <div className="relative px-8 pb-8">
          {/* Company Logo */}
          <div className="flex items-end gap-6 -mt-16">
            <div className="relative">
              {seller.companyLogo ? (
                <img
                  src={seller.companyLogo}
                  alt={seller.companyName || "Company Logo"}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                  <Building className="w-12 h-12 text-gray-400" />
                </div>
              )}
              {/* Verification Badge */}
              <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${
                seller.isVerified ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                {seller.isVerified ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-white" />
                )}
              </div>
            </div>
            
            {/* Company Details */}
            <div className="flex-1 mt-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {seller.companyName || `Seller #${seller.id?.slice(0, 8)}`}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                  seller.isVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Shield className="w-4 h-4" />
                  {seller.isVerified ? 'Verified Seller' : 'Unverified'}
                </div>
                
                {seller.sellerType && (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${colorClasses[config.color]}`}>
                    <config.primaryIcon className="w-4 h-4" />
                    {config.specialistLabel}
                  </div>
                )}
                
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold bg-amber-100 text-amber-800">
                  <Star className="w-4 h-4 fill-current" />
                  <span>4.8 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Contact & Address */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              Contact Information
            </h2>
            <div className="space-y-4">
              {seller.email && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-semibold text-gray-900">{seller.email}</p>
                  </div>
                </div>
              )}
              
              {seller.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-semibold text-gray-900">{seller.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Business Address
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="space-y-2">
                  {seller.addressLine1 && (
                    <p className="text-gray-900 font-medium">{seller.addressLine1}</p>
                  )}
                  {seller.addressLine2 && (
                    <p className="text-gray-700">{seller.addressLine2}</p>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>{seller.city}</span>
                    {seller.state && <span>• {seller.state}</span>}
                    {seller.zipCode && <span>• {seller.zipCode}</span>}
                  </div>
                  {seller.country && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span>{seller.country}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-600" />
              Business Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {seller.panCard && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">PAN Card</p>
                  <p className="font-semibold text-gray-900">{seller.panCard}</p>
                </div>
              )}
              
              {seller.gstNumber && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">GST Number</p>
                  <p className="font-semibold text-gray-900">{seller.gstNumber}</p>
                </div>
              )}

              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-semibold text-gray-900">{formatDate(seller.createdAt)}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-semibold text-gray-900">{formatDate(seller.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Statistics */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <config.primaryIcon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-700">{config.primaryLabel}</span>
                </div>
                <span className="font-bold text-blue-600">{currentProducts.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-gray-700">Average Rating</span>
                </div>
                <span className="font-bold text-amber-600">4.8/5</span>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Verification</span>
                <span className={`font-semibold ${seller.isVerified ? 'text-green-600' : 'text-gray-500'}`}>
                  {seller.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Account Status</span>
                <span className={`font-semibold ${seller.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                  {seller.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Seller Type</span>
                <span className="font-semibold text-blue-600 capitalize">
                  {config.specialistLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h3>
            <div className="space-y-3">
              {seller.email && (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
              )}
              
              {seller.phone && (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition-colors">
                  <Phone className="w-4 h-4" />
                  Call Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      {(products.all?.length > 0 || productsLoading) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              Products by {seller?.companyName || 'This Seller'}
              {seller?.sellerType && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({config.specialistLabel})
                </span>
              )}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {currentProducts.length} {config.primaryLabel.toLowerCase()}
              </span>
              {seller?.sellerType && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorClasses[config.color]}`}>
                  {seller.sellerType}
                </span>
              )}
              <button
                onClick={refreshProducts}
                disabled={productsLoading}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Package className={`w-4 h-4 ${productsLoading ? 'animate-spin' : ''}`} />
                {productsLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Product Type Info - No tabs needed, just show seller's product type */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm">
              Showing {currentProducts.length} {config.primaryLabel.toLowerCase()} products
            </p>
          </div>

          {productsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : productsError ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h3>
                <p className="text-gray-600 mb-4">{productsError}</p>
                <button
                  onClick={refreshProducts}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product: any, index: number) => {
                  // Determine product type based on seller type and product attributes
                  const productType = seller?.sellerType === SellerType.naturalDiamond || seller?.sellerType === SellerType.labGrownDiamond
                    ? 'diamonds'
                    : seller?.sellerType === SellerType.jewellery
                    ? 'jewelry'
                    : seller?.sellerType === SellerType.gemstone
                    ? 'gemstones'
                    : (product.shape ? 'diamonds' : product.jewelryType ? 'jewelry' : 'gemstones');
                  
                  const specs = getProductSpecs(product, productType);
                  
                  return (
                    <div
                      key={product.id || index}
                      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => window.location.href = getProductRoute(product, productType)}
                    >
                      {/* Product Image */}
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                        {product.image1 || product.images?.[0] ? (
                          <img
                            src={product.image1 || product.images?.[0]}
                            alt={product.name || `${productType} product`}
                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-6xl opacity-30">
                              {getProductIcon(product, productType)}
                            </div>
                          </div>
                        )}
                        
                        {/* Product Type Badge */}
                        <div className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded-full ${
                          productType === 'diamonds' ? 'bg-blue-500' :
                          productType === 'jewelry' ? 'bg-purple-500' :
                          productType === 'gemstones' ? 'bg-emerald-500' : 'bg-gray-500'
                        }`}>
                          {productType.toUpperCase()}
                        </div>
                        
                        {/* Status Badge */}
                        {product.isSold && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            SOLD
                          </div>
                        )}
                        
                        {product.isOnAuction && (
                          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            AUCTION
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {product.name || 
                             (product.shape ? `${product.caratWeight}ct ${product.shape}` : 'Product')}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {product.shape ? `${product.shape} • ${product.caratWeight}ct` :
                             product.category || product.jewelryType || product.gemstoneType || productType}
                          </p>
                        </div>

                        {/* Key Specs */}
                        {specs.length > 0 && (
                          <div className={`grid gap-2 text-xs ${specs.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                            {specs.slice(0, 3).map((spec, idx) => (
                              <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
                                <p className="text-gray-600">{spec.label}</p>
                                <p className="font-semibold text-gray-900">{spec.value || 'N/A'}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Price */}
                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Price</span>
                            <span className="text-lg font-bold text-gray-900">
                              {product.price 
                                ? new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                  }).format(Number(product.price))
                                : 'POA'
                              }
                            </span>
                          </div>
                          {product.discount && (
                            <p className="text-xs text-green-600 font-medium">
                              {product.discount}% off retail
                            </p>
                          )}
                        </div>

                        {/* Action Button */}
                        <button 
                          className="w-full py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors duration-200 text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = getProductRoute(product, productType);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Show message if no products */}
              {currentProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
                  <p className="text-gray-600">
                    This seller hasn't listed any {config.primaryLabel.toLowerCase()} yet.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
