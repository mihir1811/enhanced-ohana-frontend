'use client'

import React, { useState } from 'react';
import { 
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
  Play
} from 'lucide-react';
import { Diamond } from './DiamondResults';
import { WishlistButton } from '@/components/shared/WishlistButton';

interface DiamondDetailsPageProps {
  diamond: Diamond | null;
}

const DiamondDetailsPage: React.FC<DiamondDetailsPageProps> = ({ diamond }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'certification' | 'seller'>('overview');

  console.log(diamond, );

  if (!diamond) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-30">💎</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Diamond not found</h2>
          <p className="text-gray-600">The requested diamond could not be loaded.</p>
        </div>
      </div>
    );
  }

  // Collect all image fields from API if present
  const images = Array.isArray(diamond.images) && diamond.images.length > 0
    ? diamond.images
    : [diamond.image1, diamond.image2, diamond.image3, diamond.image4, diamond.image5, diamond.image6].filter(Boolean);
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

  const getCertificationGrade = () => {
    const hasColor = diamond.color && diamond.color !== 'N/A';
    const hasClarity = diamond.clarity && diamond.clarity !== 'N/A';
    const hasCut = diamond.cut && diamond.cut !== 'N/A';
    const hasCertificate = diamond.certificateNumber;
    
    const score = [hasColor, hasClarity, hasCut, hasCertificate].filter(Boolean).length;
  if (score >= 4) return { grade: 'Excellent', color: 'text-gray-800', bg: 'bg-gray-100' };
  if (score >= 3) return { grade: 'Very Good', color: 'text-gray-700', bg: 'bg-gray-100' };
  if (score >= 2) return { grade: 'Good', color: 'text-gray-600', bg: 'bg-gray-100' };
  return { grade: 'Fair', color: 'text-gray-500', bg: 'bg-gray-50' };
  };

  const certification = getCertificationGrade();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <a href="#" className="hover:text-gray-900">Diamonds</a>
        <span>/</span>
        <a href="#" className="hover:text-gray-900">{diamond.shape || 'Diamond'}</a>
        <span>/</span>
        <span className="text-gray-900 font-medium">{diamond.caratWeight}ct</span>
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
                  alt={`${diamond.shape} Diamond`}
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
                  <div className="text-8xl mb-4 opacity-30">💎</div>
                  <p className="text-gray-500 font-medium">No images available</p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute top-4 left-4 flex gap-2">
              <WishlistButton
                productId={typeof diamond?.id === 'string' ? parseInt(diamond.id) : (diamond?.id || 0)}
                productType="diamond"
                className="p-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-200"
              />
              <button className="p-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-200">
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {hasImages && images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
              {images.map((img, idx) => (
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
          {diamond.videoURL && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Play className="w-5 h-5 text-gray-700" />
                360° Video View
              </h3>
              <video 
                src={diamond.videoURL} 
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
                {diamond.seller && diamond.seller.companyName && (
                  <a
                    href={`/product/seller-info/${diamond.seller.id || diamond.sellerId}`}
                    className="text-blue-600 hover:underline text-lg font-semibold mb-1 block"
                  >
                    {diamond.seller.companyName}
                  </a>
                )}
                {/* Seller fallback if no companyName */}
                {!diamond.seller?.companyName && (
                  <a
                    href={`/seller/info/${diamond.sellerId}`}
                    className="text-blue-600 hover:underline text-lg font-semibold mb-1 block"
                  >
                    Seller #{diamond.sellerId}
                  </a>
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {diamond.name || `${diamond.caratWeight}ct ${diamond.shape}`}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Ref: <span className="font-mono font-medium text-gray-900">{diamond.certificateNumber || diamond.stockNumber || 'N/A'}</span></span>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${certification.bg} ${certification.color}`}>
                    <Star className="w-3 h-3" />
                    {certification.grade}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {diamond.price ? formatPrice(diamond.price) : 'POA'}
                </div>
                {diamond.discount && (
                  <div className="text-sm font-medium text-gray-700">
                    Save {diamond.discount}% off retail
                  </div>
                )}
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-800`}>
                <CheckCircle className="w-4 h-4 text-gray-500" />
                {diamond.isSold ? 'Sold' : 'Available'}
              </span>
              {diamond.isOnAuction && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  On Auction
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                <Shield className="w-4 h-4 text-gray-500" />
                Certified
              </span>
            </div>

            {/* Description */}
            {diamond.description && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed">{diamond.description}</p>
              </div>
            )}
          </div>

          {/* Key Features Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Show all main diamond fields as cards */}
            {[
              { label: 'Carat Weight', value: diamond.caratWeight, icon: '⚖️', color: 'from-blue-500 to-blue-600', description: 'Weight measurement' },
              { label: 'Color Grade', value: diamond.color, icon: '🎨', color: 'from-purple-500 to-purple-600', description: 'Color classification' },
              { label: 'Clarity', value: diamond.clarity, icon: '💎', color: 'from-emerald-500 to-emerald-600', description: 'Internal characteristics' },
              { label: 'Cut Quality', value: diamond.cut, icon: '✂️', color: 'from-amber-500 to-amber-600', description: 'Light performance' },
              { label: 'Origin', value: diamond.origin, icon: '📍', color: 'from-green-500 to-green-600', description: 'Origin of diamond' },
              { label: 'Shade', value: diamond.shade, icon: '🌈', color: 'from-yellow-500 to-yellow-600', description: 'Diamond shade' },
              { label: 'Fancy Color', value: diamond.fancyColor, icon: '🎨', color: 'from-pink-500 to-pink-600', description: 'Fancy color' },
              { label: 'Fancy Intensity', value: diamond.fancyIntencity, icon: '🔥', color: 'from-red-500 to-red-600', description: 'Fancy color intensity' },
              { label: 'Fancy Overtone', value: diamond.fancyOvertone, icon: '🌀', color: 'from-indigo-500 to-indigo-600', description: 'Fancy color overtone' },
              { label: 'Symmetry', value: diamond.symmetry, icon: '🔀', color: 'from-gray-500 to-gray-600', description: 'Symmetry' },
              { label: 'Polish', value: diamond.polish, icon: '✨', color: 'from-blue-400 to-blue-500', description: 'Polish' },
              { label: 'Fluorescence', value: diamond.fluorescence, icon: '💡', color: 'from-yellow-400 to-yellow-500', description: 'Fluorescence' },
              { label: 'Stone Type', value: diamond.stoneType, icon: '🪨', color: 'from-gray-400 to-gray-500', description: 'Stone type' },
              { label: 'Process', value: diamond.process, icon: '⚙️', color: 'from-gray-300 to-gray-400', description: 'Process' },
              { label: 'Treatment', value: diamond.treatment, icon: '🧪', color: 'from-green-300 to-green-400', description: 'Treatment' },
              { label: 'Inscription', value: diamond.inscription, icon: '🔏', color: 'from-gray-300 to-gray-400', description: 'Inscription' },
              { label: 'Certificate Number', value: diamond.certificateNumber, icon: '📄', color: 'from-blue-300 to-blue-400', description: 'Certificate number' },
              { label: 'Seller SKU', value: diamond.sellerSKU, icon: '🏷️', color: 'from-gray-200 to-gray-300', description: 'Seller SKU' },
              { label: 'Stock Number', value: diamond.stockNumber, icon: '🔢', color: 'from-gray-200 to-gray-300', description: 'Stock number' },
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
              <WishlistButton
                productId={typeof diamond?.id === 'string' ? parseInt(diamond.id) : (diamond?.id || 0)}
                productType="diamond"
                className="px-6 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold rounded-2xl transition-all duration-200"
              />
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
                  <h4 className="font-semibold text-blue-900 mb-1">Authentication Guarantee</h4>
                  <p className="text-sm text-blue-700">
                    This diamond comes with full certification and a 30-day return policy. 
                    Verified by independent gemological laboratories.
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
              { id: 'certification', label: 'Certification', icon: Shield },
              // { id: 'seller', label: 'Seller Info', icon: Star }
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Diamond Summary</h3>
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                    {[
                      { icon: '💎', label: 'Shape', value: diamond.shape },
                      { icon: '⚖️', label: 'Carat Weight', value: diamond.caratWeight },
                      { icon: '🎨', label: 'Color', value: diamond.color },
                      { icon: '🔍', label: 'Clarity', value: diamond.clarity },
                      { icon: '✂️', label: 'Cut', value: diamond.cut },
                      { icon: '📍', label: 'Origin', value: diamond.origin }
                    ].map(item => (
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

                {/* Investment Info */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Investment Details</h3>
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Current Price</span>
                      <span className="text-2xl font-bold text-gray-900">{diamond.price ? formatPrice(diamond.price) : 'POA'}</span>
                    </div>
                    {diamond.rap && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">RAP Price</span>
                        <span className="font-semibold text-gray-600">{
                          typeof diamond.rap === 'number'
                            ? `$${(diamond.rap as number).toLocaleString()}`
                            : (diamond.rap ? diamond.rap : 'N/A')
                        }</span>
                      </div>
                    )}
                    {diamond.discount && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Discount</span>
                        <span className="font-semibold text-green-600">{diamond.discount}% off</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>Market competitive pricing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Assessment */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Assessment</h3>
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                    {[
                      { label: 'Polish', value: diamond.polish, description: 'Surface finish quality' },
                      { label: 'Symmetry', value: diamond.symmetry, description: 'Facet alignment precision' },
                      { label: 'Fluorescence', value: diamond.fluorescence, description: 'UV light reaction' }
                    ].map(item => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">{item.label}</span>
                          <span className="font-semibold text-gray-900">{item.value || 'N/A'}</span>
                        </div>
                        <p className="text-xs text-gray-500">{item.description}</p>
                        {item.label !== 'Fluorescence' && (
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
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-white">S</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {diamond.sellerId ? `Seller #${diamond.sellerId}` : 'Verified Diamond Dealer'}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">4.9 (1,247 reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-lg font-bold text-gray-900">98%</div>
                        <div className="text-xs text-gray-600">Positive Rating</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">2.1K</div>
                        <div className="text-xs text-gray-600">Diamonds Sold</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">5 yrs</div>
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
                
                {/* Measurements */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Measurements & Proportions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Diameter', value: diamond.diameter },
                      { label: 'Measurement', value: diamond.measurement },
                      { label: 'Length/Width Ratio', value: diamond.ratio },
                      { label: 'Table %', value: diamond.table },
                      { label: 'Depth %', value: diamond.depth },
                      { label: 'Girdle', value: `${diamond.gridleMin || 'N/A'} - ${diamond.gridleMax || 'N/A'}` },
                      { label: 'Crown Height', value: diamond.crownHeight },
                      { label: 'Crown Angle', value: diamond.crownAngle },
                      { label: 'Pavilion Angle', value: diamond.pavilionAngle },
                      { label: 'Pavilion Depth', value: diamond.pavilionDepth },
                      { label: 'Culet Size', value: diamond.culetSize },
                      { label: 'Girdle %', value: diamond.gridlePercentage }
                    ].map(spec => (
                      <div key={spec.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600 font-medium">{spec.label}</span>
                        <span className="font-semibold text-gray-900">{spec.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fancy Color Details */}
                {(diamond.fancyColor || diamond.fancyIntencity || diamond.fancyOvertone) && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-purple-600" />
                      Fancy Color Details
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Fancy Color', value: diamond.fancyColor },
                        { label: 'Color Intensity', value: diamond.fancyIntencity },
                        { label: 'Color Overtone', value: diamond.fancyOvertone },
                        { label: 'Shade', value: diamond.shade }
                      ].map(item => (
                        <div key={item.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                          <span className="text-gray-600 font-medium">{item.label}</span>
                          <span className="font-semibold text-gray-900">{item.value || 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'certification' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Certification & Authentication</h3>
                
                {/* Certificate Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-blue-900 mb-2">Official Certification</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-blue-700">Certificate Number:</span>
                          <span className="font-mono font-bold text-blue-900 ml-2">{diamond.certificateNumber || 'N/A'}</span>
                        </div>
                        {diamond.certification && (
                          <div>
                            <span className="text-sm text-blue-700">Certifying Body:</span>
                            <span className="font-semibold text-blue-900 ml-2">
                              {typeof diamond.certification === 'string' && diamond.certification.startsWith('http') ? 'GIA/AGS' : diamond.certification}
                            </span>
                          </div>
                        )}
                        {diamond.inscription && (
                          <div>
                            <span className="text-sm text-blue-700">Inscription:</span>
                            <span className="font-mono text-blue-900 ml-2">{diamond.inscription}</span>
                          </div>
                        )}
                      </div>
                      
                      {diamond.certification && typeof diamond.certification === 'string' && diamond.certification.startsWith('http') && (
                        <a 
                          href={diamond.certification} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200"
                        >
                          <Download className="w-4 h-4" />
                          Download Certificate
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Treatment & Process */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Treatment & Processing</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Treatment', value: diamond.treatment || 'None' },
                      { label: 'Process', value: diamond.process || 'Natural' },
                      { label: 'Stone Type', value: diamond.stoneType || 'Natural Diamond' }
                    ].map(item => (
                      <div key={item.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600 font-medium">{item.label}</span>
                        <span className="font-semibold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seller' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Seller Information</h3>
              
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-6">
                  {diamond.seller && diamond.seller.companyLogo ? (
                    <img
                      src={diamond.seller.companyLogo}
                      alt={diamond.seller.companyName || 'Seller Logo'}
                      className="w-16 h-16 rounded-2xl object-cover border border-gray-200 bg-white"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-700">S</span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {diamond.seller && diamond.seller.companyName
                        ? diamond.seller.companyName
                        : diamond.sellerId
                        ? `Diamond Seller #${diamond.sellerId}`
                        : 'Premium Diamond Dealer'}
                    </h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gray-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.9 out of 5 (1,247 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-gray-100 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">2,187</div>
                    <div className="text-sm text-gray-600">Diamonds Sold</div>
                  </div>
                  <div className="text-center p-4 bg-gray-100 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">98.7%</div>
                    <div className="text-sm text-gray-600">Satisfaction Rate</div>
                  </div>
                  <div className="text-center p-4 bg-gray-100 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">5.2</div>
                    <div className="text-sm text-gray-600">Years Active</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <CheckCircle className="w-6 h-6 text-gray-500" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Verified Seller</h5>
                      <p className="text-sm text-gray-600">Identity and business credentials verified</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <Shield className="w-6 h-6 text-gray-500" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Buyer Protection</h5>
                      <p className="text-sm text-gray-600">30-day return policy and authenticity guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      {(diamond.createdAt || diamond.updatedAt) && (
        <div className="mt-12 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            Timeline
          </h3>
          <div className="space-y-3">
            {diamond.createdAt && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Listed on {new Date(diamond.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            )}
            {diamond.updatedAt && diamond.updatedAt !== diamond.createdAt && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Last updated {new Date(diamond.updatedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiamondDetailsPage;