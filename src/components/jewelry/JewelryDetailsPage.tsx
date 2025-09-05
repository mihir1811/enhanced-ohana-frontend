'use client'

import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingCart, 
  Share2, 
  Download, 
  Eye, 
  Award, 
  Shield, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  MapPin,
  Zap,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Camera,
  Play,
  Crown,
  Gem
} from 'lucide-react';

interface JewelryDetailsPageProps {
  jewelry: any | null;
}

const JewelryDetailsPage: React.FC<JewelryDetailsPageProps> = ({ jewelry }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'stones' | 'seller'>('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);

  console.log(jewelry);

  if (!jewelry) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-30">💍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Jewelry not found</h2>
          <p className="text-gray-600">The requested jewelry piece could not be loaded.</p>
        </div>
      </div>
    );
  }

  // Collect all image fields from API if present
  const images = Array.isArray(jewelry.images) && jewelry.images.length > 0
    ? jewelry.images
    : [jewelry.image1, jewelry.image2, jewelry.image3, jewelry.image4, jewelry.image5, jewelry.image6].filter(Boolean);
  const hasImages = images.length > 0;

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  const getQualityGrade = () => {
    const hasMetalType = jewelry.metalType && jewelry.metalType !== 'N/A';
    const hasMetalPurity = jewelry.metalPurity && jewelry.metalPurity !== 'N/A';
    const hasStones = jewelry.stones && jewelry.stones.length > 0;
    const hasCategory = jewelry.category;
    
    const score = [hasMetalType, hasMetalPurity, hasStones, hasCategory].filter(Boolean).length;
    if (score >= 4) return { grade: 'Excellent', color: 'text-gray-800', bg: 'bg-gray-100' };
    if (score >= 3) return { grade: 'Very Good', color: 'text-gray-700', bg: 'bg-gray-100' };
    if (score >= 2) return { grade: 'Good', color: 'text-gray-600', bg: 'bg-gray-100' };
    return { grade: 'Fair', color: 'text-gray-500', bg: 'bg-gray-50' };
  };

  const quality = getQualityGrade();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <a href="#" className="hover:text-gray-900">Jewelry</a>
        <span>/</span>
        <a href="#" className="hover:text-gray-900">{jewelry.category || 'Jewelry'}</a>
        <span>/</span>
        <span className="text-gray-900 font-medium">{jewelry.name || 'Product'}</span>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Image Gallery */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden group border border-gray-200">
            {hasImages ? (
              <>
                <img
                  src={images[imgIdx]}
                  alt={jewelry.name || 'Jewelry'}
                  className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx(idx => (idx - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => setImgIdx(idx => (idx + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-200"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {imgIdx + 1} / {images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4 opacity-30">💍</div>
                  <p className="text-gray-500 font-medium">No images available</p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute top-4 left-4 flex gap-2">
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="p-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-200"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'text-gray-800' : 'text-gray-700'}`} />
              </button>
              <button className="p-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-200">
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {hasImages && images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setImgIdx(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    imgIdx === idx ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Video Section */}
          {jewelry.videoURL && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Play className="w-5 h-5 text-gray-700" />
                360° Video View
              </h3>
              <video 
                src={jewelry.videoURL} 
                controls 
                className="w-full rounded-xl"
                poster={hasImages ? images[0] : undefined}
              />
            </div>
          )}
        </div>

        {/* Right Side - Details */}
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Seller Company Name */}
                {jewelry.seller && jewelry.seller.companyName && (
                  <a
                    href={`/product/seller-info/${jewelry.seller.id || jewelry.sellerId}`}
                    className="text-blue-600 hover:underline text-lg font-semibold mb-1 block"
                  >
                    {jewelry.seller.companyName}
                  </a>
                )}
                {/* Seller fallback if no companyName */}
                {!jewelry.seller?.companyName && (
                  <a
                    href={`/seller/info/${jewelry.sellerId}`}
                    className="text-blue-600 hover:underline text-lg font-semibold mb-1 block"
                  >
                    Seller #{jewelry.sellerId}
                  </a>
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {jewelry.name || 'Jewelry Piece'}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>SKU: <span className="font-mono font-medium text-gray-900">{jewelry.skuCode || jewelry.sku || 'N/A'}</span></span>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${quality.bg} ${quality.color}`}>
                    <Star className="w-3 h-3" />
                    {quality.grade}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {jewelry.totalPrice ? formatPrice(jewelry.totalPrice) : (jewelry.basePrice ? formatPrice(jewelry.basePrice) : 'POA')}
                </div>
                {jewelry.basePrice && jewelry.totalPrice && jewelry.basePrice !== jewelry.totalPrice && (
                  <div className="text-sm text-gray-600 line-through mb-1">
                    Base: {formatPrice(jewelry.basePrice)}
                  </div>
                )}
                {jewelry.makingCharge && (
                  <div className="text-sm font-medium text-gray-700">
                    Making Charge: {formatPrice(jewelry.makingCharge)}
                  </div>
                )}
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-800`}>
                <CheckCircle className="w-4 h-4 text-gray-500" />
                {jewelry.isSold ? 'Sold' : 'Available'}
              </span>
              {jewelry.isOnAuction && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  On Auction
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                <Crown className="w-4 h-4 text-gray-500" />
                Jewelry
              </span>
            </div>

            {/* Description */}
            {jewelry.description && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed">{jewelry.description}</p>
              </div>
            )}
          </div>

          {/* Key Features Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Show all main jewelry fields as cards */}
            {[
              { label: 'Category', value: jewelry.category, icon: '💍', color: 'from-purple-500 to-purple-600', description: 'Jewelry category' },
              { label: 'Subcategory', value: jewelry.subcategory, icon: '📿', color: 'from-rose-500 to-rose-600', description: 'Specific type' },
              { label: 'Metal Type', value: jewelry.metalType?.replace('-', ' '), icon: '🔗', color: 'from-blue-500 to-blue-600', description: 'Metal composition' },
              { label: 'Metal Purity', value: jewelry.metalPurity, icon: '⚡', color: 'from-yellow-500 to-yellow-600', description: 'Metal purity grade' },
              { label: 'Metal Weight', value: jewelry.metalWeight ? `${jewelry.metalWeight}g` : null, icon: '⚖️', color: 'from-green-500 to-green-600', description: 'Metal weight' },
              { label: 'Collection', value: jewelry.collection, icon: '�', color: 'from-indigo-500 to-indigo-600', description: 'Collection name' },
              { label: 'Gender', value: jewelry.gender, icon: '👤', color: 'from-pink-500 to-pink-600', description: 'Target gender' },
              { label: 'Occasion', value: jewelry.occasion, icon: '🎉', color: 'from-emerald-500 to-emerald-600', description: 'Suitable occasion' },
            ].filter(f => f.value).map(feature => (
              <div key={feature.label} className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-3`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.label}</h3>
                <div className="text-xl font-bold text-gray-900 mb-1">{feature.value || 'N/A'}</div>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`px-6 py-4 border-2 font-semibold rounded-2xl transition-all duration-200 ${
                  isWishlisted 
                    ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button className="px-6 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold rounded-2xl transition-all duration-200">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">Authenticity Guarantee</h4>
                  <p className="text-sm text-blue-700">
                    This jewelry piece comes with full authenticity certification and a 30-day return policy. 
                    Quality assured by our expert jewelers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <div className="mt-12">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'specifications', label: 'Specifications', icon: Award },
              { id: 'stones', label: 'Stones & Details', icon: Gem },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Quick Stats */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Jewelry Summary</h3>
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                    {[
                      { icon: '💍', label: 'Category', value: jewelry.category },
                      { icon: '�', label: 'Subcategory', value: jewelry.subcategory },
                      { icon: '�🔗', label: 'Metal Type', value: jewelry.metalType?.replace('-', ' ') },
                      { icon: '⚡', label: 'Metal Purity', value: jewelry.metalPurity },
                      { icon: '⚖️', label: 'Metal Weight', value: jewelry.metalWeight ? `${jewelry.metalWeight}g` : null },
                      { icon: '�', label: 'Collection', value: jewelry.collection },
                      { icon: '👤', label: 'Gender', value: jewelry.gender },
                      { icon: '🎉', label: 'Occasion', value: jewelry.occasion }
                    ].filter(item => item.value).map(item => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{item.icon}</span>
                          <span className="font-medium text-gray-700">{item.label}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{item.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                  <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Pricing Breakdown</h3>
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Base Price</span>
                      <span className="text-xl font-bold text-gray-900">{jewelry.basePrice ? formatPrice(jewelry.basePrice) : 'N/A'}</span>
                    </div>
                    {jewelry.makingCharge && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Making Charge</span>
                        <span className="font-semibold text-gray-600">{formatPrice(jewelry.makingCharge)}</span>
                      </div>
                    )}
                    {jewelry.tax && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Tax</span>
                        <span className="font-semibold text-gray-600">{jewelry.tax}%</span>
                      </div>
                    )}
                    {jewelry.totalPrice && (
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="font-medium text-gray-700">Total Price</span>
                        <span className="text-xl font-bold text-green-600">{formatPrice(jewelry.totalPrice)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>Transparent pricing breakdown</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Assessment */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quality & Craftsmanship</h3>
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                    {[
                      { label: 'Metal Quality', value: jewelry.metalPurity || 'N/A', description: 'Metal purity and quality' },
                      { label: 'Weight', value: jewelry.metalWeight ? `${jewelry.metalWeight}g` : 'N/A', description: 'Metal weight specification' },
                      { label: 'Collection', value: jewelry.collection || 'N/A', description: 'Jewelry collection series' }
                    ].map(item => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">{item.label}</span>
                          <span className="font-semibold text-gray-900">{item.value}</span>
                        </div>
                        <p className="text-xs text-gray-500">{item.description}</p>
                        {item.label !== 'Collection' && (
                          <div className="border-b border-gray-100"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seller Rating */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Seller Information</h3>
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-white">J</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {jewelry.sellerId ? `Seller #${jewelry.sellerId}` : 'Verified Jewelry Dealer'}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">4.8 (892 reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-lg font-bold text-gray-900">97%</div>
                        <div className="text-xs text-gray-600">Positive Rating</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">1.5K</div>
                        <div className="text-xs text-gray-600">Jewelry Sold</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">7 yrs</div>
                        <div className="text-xs text-gray-600">Experience</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Specifications</h3>
                
                {/* Material Details */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-purple-600" />
                    Material & Construction
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Metal Type', value: jewelry.metalType?.replace('-', ' ') },
                      { label: 'Metal Purity', value: jewelry.metalPurity },
                      { label: 'Metal Weight', value: jewelry.metalWeight ? `${jewelry.metalWeight}g` : null },
                      { label: 'Category', value: jewelry.category },
                      { label: 'Subcategory', value: jewelry.subcategory },
                      { label: 'Collection', value: jewelry.collection },
                      { label: 'Gender', value: jewelry.gender },
                      { label: 'Occasion', value: jewelry.occasion },
                      { label: 'SKU Code', value: jewelry.skuCode },
                    ].filter(item => item.value).map(item => (
                      <div key={item.label} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{item.label}</span>
                        <span className="text-gray-900 font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attributes */}
                {jewelry.attributes && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      Design Attributes
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(jewelry.attributes).filter(([_, value]) => value).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-gray-900 font-semibold">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stones' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Design Attributes & Style Details</h3>
                
                {jewelry.attributes && Object.keys(jewelry.attributes).length > 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Gem className="w-5 h-5 text-emerald-600" />
                      Style & Design Features
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(jewelry.attributes).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Style Summary */}
                    <div className="mt-6 bg-blue-50 rounded-2xl border border-blue-200 p-6">
                      <h4 className="font-semibold text-blue-900 mb-2">Design Summary</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-900">{jewelry.attributes.style || 'Classic'}</div>
                          <div className="text-xs text-blue-700">Style</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-900">
                            {jewelry.attributes.length_cm ? `${jewelry.attributes.length_cm}cm` : 'Standard'}
                          </div>
                          <div className="text-xs text-blue-700">Length</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-900">
                            {jewelry.attributes.chain_type || 'N/A'}
                          </div>
                          <div className="text-xs text-blue-700">Chain Type</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-900">
                            {jewelry.attributes.is_adjustable ? 'Yes' : 'No'}
                          </div>
                          <div className="text-xs text-blue-700">Adjustable</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <Gem className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Design Attributes Available</h3>
                    <p className="text-gray-600">Style and design information is not available for this jewelry piece.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JewelryDetailsPage;
