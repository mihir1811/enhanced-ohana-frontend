'use client'

import React, { useState, useCallback } from 'react'
import Pagination from '../ui/Pagination';
import * as ShapeIcons from '@/../public/icons';
import Dialog from '../ui/Dialog';
import { ChevronLeft, ChevronRight, ShoppingCart, Share2, Download, Star, Award, Shield, Eye ,Grid, List, ArrowUpDown, ChevronDown, Filter as FilterIcon} from 'lucide-react'
import Image from 'next/image'
import CompareButton from '@/components/compare/CompareButton'
import WishlistButton from '@/components/shared/WishlistButton'

// Modern carousel and details for Quick View modal
interface QuickViewDiamondModalContentProps {
  diamond: Diamond;
}

function QuickViewDiamondModalContent(props: QuickViewDiamondModalContentProps) {
  const { diamond } = props;
  const [imgIdx, setImgIdx] = React.useState(0);
  const images = Array.isArray(diamond.images) && diamond.images.length > 0 ? diamond.images : [];
  const hasImages = images.length > 0;
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'certification'>('details');

  // Navigation functions
  const prevImg = useCallback(() => {
    setImgIdx(idx => (idx - 1 + images.length) % images.length);
  }, [images.length])
  
  const nextImg = useCallback(() => {
    setImgIdx(idx => (idx + 1) % images.length);
  }, [images.length])

  // Keyboard navigation
  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!hasImages || images.length < 2) return;
      if (e.key === 'ArrowLeft') prevImg();
      if (e.key === 'ArrowRight') nextImg();
    }
    
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [hasImages, images.length, prevImg, nextImg]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  const minSwipeDistance = 30;

  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (touchStart !== null && touchEnd !== null) {
      const distance = touchStart - touchEnd;
      if (distance > minSwipeDistance) nextImg();
      if (distance < -minSwipeDistance) prevImg();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {diamond.name || `${diamond.caratWeight}ct ${diamond.shape}` || 'Premium Diamond'}
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-600">
                Ref: <span className="font-mono font-medium">{diamond.certificateNumber || diamond.stockNumber || 'N/A'}</span>
              </span>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Certified</span>
              </div>
              <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                diamond.isSold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {diamond.isSold ? 'Sold' : 'Available'}
              </div>
            </div>
          </div>
          <div className="text-right min-w-[120px]">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {diamond.price ? formatPrice(diamond.price) : 'Price on Request'}
            </div>
            {diamond.discount && (
              <div className="text-xs sm:text-sm text-green-600 font-medium">
                Save {diamond.discount}% off market price
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Image Gallery */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6">
          <div className="space-y-4">
            {/* Main Image Display */}
            <div
              className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden group"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              tabIndex={0}
              aria-label="Diamond image carousel"
            >
              {hasImages ? (
                <>
                  <Image
                    src={images[imgIdx]}
                    alt={diamond.shape ? `${diamond.shape} diamond image ${imgIdx + 1}` : `Diamond image ${imgIdx + 1}`}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain p-6 transition-all duration-300"
                    draggable={false}
                  />
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg border border-white/50 transition-all duration-200 group-hover:opacity-100 opacity-0"
                        onClick={prevImg}
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg border border-white/50 transition-all duration-200 group-hover:opacity-100 opacity-0"
                        onClick={nextImg}
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {imgIdx + 1} / {images.length}
                    </div>
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

              {/* Action Buttons Overlay */}
              <div className="absolute top-4 left-4 flex gap-2">
                <WishlistButton
                  productId={Number(diamond.id)}
                  productType="diamond"
                  size="md"
                  variant="default"
                  className="shadow-lg"
                />
                <button className="p-2.5 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-200 group">
                  <Share2 className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {hasImages && images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImgIdx(idx)}
                    className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      imgIdx === idx 
                        ? 'border-gray-900 shadow-md' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Video Section */}
            {diamond.videoURL && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  360° Video View
                </h4>
                <video 
                  src={diamond.videoURL} 
                  controls 
                  className="w-full rounded-xl shadow-sm border border-gray-200"
                  poster={hasImages ? images[0] : undefined}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:border-l border-gray-200">
          {/* Tab Navigation */}
          <div className="flex flex-wrap space-x-0 sm:space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
            {[
              { id: 'details', label: 'Details', icon: Star },
              { id: 'specs', label: 'Specifications', icon: Award },
              { id: 'certification', label: 'Certification', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'details' | 'specs' | 'certification')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Key Features */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Key Features</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Carat Weight', value: diamond.caratWeight, color: 'bg-blue-50 text-blue-700', icon: '⚖️' },
                      { label: 'Color', value: diamond.color, color: 'bg-purple-50 text-purple-700', icon: '🎨' },
                      { label: 'Clarity', value: diamond.clarity, color: 'bg-green-50 text-green-700', icon: '💎' },
                      { label: 'Cut', value: diamond.cut, color: 'bg-amber-50 text-amber-700', icon: '✂️' },
                    ].map(item => (
                      <div key={item.label} className={`p-4 rounded-xl ${item.color} border border-opacity-20`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{item.icon}</span>
                          <span className="text-sm font-medium opacity-80">{item.label}</span>
                        </div>
                        <div className="text-lg font-bold">{item.value || 'N/A'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Shape', value: diamond.shape },
                      { label: 'Origin', value: diamond.origin },
                      { label: 'Polish', value: diamond.polish },
                      { label: 'Symmetry', value: diamond.symmetry },
                      { label: 'Fluorescence', value: diamond.fluorescence }
                    ].map(item => (
                      <div key={item.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600 font-medium">{item.label}</span>
                        <span className="text-gray-900 font-semibold">{item.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specs' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Measurements & Proportions</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { label: 'Diameter', value: diamond.diameter },
                      { label: 'Measurement', value: diamond.measurement },
                      { label: 'Ratio', value: diamond.ratio },
                      { label: 'Table %', value: diamond.table },
                      { label: 'Depth %', value: diamond.depth },
                      { label: 'Girdle Min', value: diamond.gridleMin },
                      { label: 'Girdle Max', value: diamond.gridleMax },
                      { label: 'Crown Height', value: diamond.crownHeight },
                      { label: 'Crown Angle', value: diamond.crownAngle },
                      { label: 'Pavilion Angle', value: diamond.pavilionAngle },
                      { label: 'Pavilion Depth', value: diamond.pavilionDepth },
                      { label: 'Culet Size', value: diamond.culetSize }
                    ].map(item => (
                      <div key={item.label} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600 font-medium">{item.label}</span>
                        <span className="text-gray-900 font-semibold">{item.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Fancy Color Details</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Fancy Color', value: diamond.fancyColor },
                      { label: 'Fancy Intensity', value: diamond.fancyIntencity },
                      { label: 'Fancy Overtone', value: diamond.fancyOvertone },
                      { label: 'Shade', value: diamond.shade }
                    ].map(item => (
                      <div key={item.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600 font-medium">{item.label}</span>
                        <span className="text-gray-900 font-semibold">{item.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Certification Tab */}
            {activeTab === 'certification' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Certification Details</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Certificate Information</h4>
                          <p className="text-sm text-gray-600">Official gemological certification</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Certificate #</span>
                          <span className="font-mono font-semibold text-gray-900">{diamond.certificateNumber || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Certification</span>
                          <div className="text-right">
                            {diamond.certification && typeof diamond.certification === 'string' && diamond.certification.startsWith('http') ? (
                              <a 
                                href={diamond.certification} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                              >
                                View Certificate
                                <Download className="w-4 h-4" />
                              </a>
                            ) : (
                              <span className="font-semibold text-gray-900">{diamond.certification || 'Available'}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Inscription</span>
                          <span className="font-mono text-sm text-gray-900">{diamond.inscription || 'None'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Additional Information</h4>
                      <div className="space-y-3">
                        {[
                          { label: 'Treatment', value: diamond.treatment },
                          { label: 'Process', value: diamond.process },
                          { label: 'Stone Type', value: diamond.stoneType },
                          { label: 'RAP', value: diamond.rap }
                        ].map(item => (
                          <div key={item.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="text-gray-600 font-medium">{item.label}</span>
                            <span className="text-gray-900 font-semibold">{item.value || 'N/A'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <WishlistButton
                productId={Number(diamond.id)}
                productType="diamond"
                size="lg"
                showText={true}
                className="border border-gray-300 hover:border-gray-400 font-semibold rounded-xl text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3"
              />
              <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold rounded-xl transition-all duration-200 text-sm sm:text-base">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Questions about this diamond? 
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium ml-1">Contact our experts</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface SellerInfo {
  id?: string;
  sellerType?: string;
  companyName?: string;
  companyLogo?: string;
}

export interface Diamond {
  id: string;
  sellerId?: string;
  stockNumber?: string | number;
  sellerSKU?: string;
  name?: string;
  description?: string;
  origin?: string;
  rap?: string | number;
  price: string | number;
  discount?: string | number;
  caratWeight?: string | number;
  cut?: string;
  color?: string;
  shade?: string;
  fancyColor?: string;
  fancyIntencity?: string;
  fancyOvertone?: string;
  shape?: string;
  symmetry?: string;
  diameter?: string | number;
  clarity?: string;
  fluorescence?: string;
  measurement?: string;
  ratio?: string;
  table?: string | number;
  depth?: string | number;
  gridleMin?: string | number;
  gridleMax?: string | number;
  gridlePercentage?: string | number;
  crownHeight?: string | number;
  crownAngle?: string | number;
  pavilionAngle?: string | number;
  pavilionDepth?: string | number;
  culetSize?: string | number;
  polish?: string;
  treatment?: string;
  inscription?: string;
  certification?: string;
  certificateNumber?: string | number;
  images: string[];
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  seller?: SellerInfo;
  videoURL?: string;
  stoneType?: string;
  process?: string;
  certificateCompanyId?: number;
  isOnAuction?: boolean;
  isSold?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  auctionStartTime?: string | null;
  auctionEndTime?: string | null;
}

interface DiamondResultsProps {
  diamonds: Diamond[]
  loading: boolean
  totalCount: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onDiamondSelect: (diamond: Diamond) => void
  onAddToCart: (diamondId: string) => void
  diamondType: 'natural-single' | 'natural-melee' | 'lab-grown-single' | 'lab-grown-melee'
  className?: string
}

type ViewMode = 'grid' | 'list'

export default function DiamondResults({
  diamonds,
  loading,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onDiamondSelect,
  onAddToCart,
  className = ''
}: DiamondResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [selectedShapes, setSelectedShapes] = useState<string[]>(['All'])
  const [quickViewDiamond, setQuickViewDiamond] = useState<Diamond | null>(null);


  // Map shape names to icon components (default fallback if not found)
  // Full list of 32 diamond shapes
  const DIAMOND_SHAPES = [
    "Round",
    "Pear",
    "Emerald",
    "Oval",
    "Heart",
    "Marquise",
    "Asscher",
    "Cushion",
    "Cushion modified",
    "Cushion brilliant",
    "Radiant",
    "Princess",
    "French",
    "Trilliant",
    "Euro cut",
    "Old Miner",
    "Briollette",
    "Rose cut",
    "Lozenge",
    "Baguette",
    "Tapered baguette",
    "Half-moon",
    "Flanders",
    "Trapezoid",
    "Bullet",
    "Kite",
    "Shield",
    "Star cut",
    "Pentagonal cut",
    "Hexagonal cut",
    "Octagonal cut",
    "Portugeese cut"
  ];

  // Map shape names to icon components (default fallback if not found)
  // Make shapeIconMap case-insensitive by using lowercase keys
  const shapeIconMap: Record<string, React.ComponentType<{ width?: number; height?: number }>> = {
    'round': ShapeIcons.RoundIcon,
    'pear': ShapeIcons.PearIcon,
    'emerald': ShapeIcons.EmeraldIcon,
    'oval': ShapeIcons.OvalIcon,
    'heart': ShapeIcons.HeartIcon,
    'marquise': ShapeIcons.MarquiseIcon,
    'asscher': ShapeIcons.AsscherIcon,
    'cushion': ShapeIcons.CushionIcon,
    'cushion modified': ShapeIcons.CushionModifiedIcon,
    'cushion brilliant': ShapeIcons.CushionBrilliantIcon,
    'radiant': ShapeIcons.RadiantIcon,
    'princess': ShapeIcons.PrincessIcon,
    'french': ShapeIcons.FrenchIcon,
    'trilliant': ShapeIcons.TrilliantIcon,
    'euro cut': ShapeIcons.EurocutIcon,
    'old miner': ShapeIcons.OldMinerIcon,
    'briollette': ShapeIcons.BriolletteIcon,
    'rose cut': ShapeIcons.RosecutIcon,
    'lozenge': ShapeIcons.LozengeIcon,
    'baguette': ShapeIcons.BaguetteIcon,
    'tapered baguette': ShapeIcons.TaperedBaguetteIcon,
    'half-moon': ShapeIcons.HalfmoonIcon,
    'flanders': ShapeIcons.FlandersIcon,
    'trapezoid': ShapeIcons.TrapezoidIcon,
    'bullet': ShapeIcons.BulletIcon,
    'kite': ShapeIcons.KiteIcon,
    'shield': ShapeIcons.ShieldIcon,
    'star cut': ShapeIcons.StarcutIcon,
    'pentagonal cut': ShapeIcons.PentagonalIcon,
    'hexagonal cut': ShapeIcons.HexagonalIcon,
    'octagonal cut': ShapeIcons.OctagonalIcon,
    'portugeese cut': ShapeIcons.PortugeeseIcon,
    // fallback
    'default': ShapeIcons.DefaultIcon
  };



  const shapeOptions = [
    { value: 'All', label: 'All', icon: <ShapeIcons.DefaultIcon width={20} height={20} /> },
    ...DIAMOND_SHAPES.map(shape => {
      const Icon = shapeIconMap[shape.toLowerCase()] || shapeIconMap['default'];
      return {
        value: shape,
        label: shape,
        icon: <Icon width={20} height={20} />
      };
    })
  ];


  // Helper to get shape icon component for a given shape (case-insensitive)
  const getShapeIcon = (shape: string) => {
    const Icon = shapeIconMap[shape?.toLowerCase?.()] || shapeIconMap['default'];
    return <Icon width={20} height={20} />;
  };

  const filteredDiamonds =
    selectedShapes.includes('All')
      ? diamonds
      : diamonds.filter(d =>
  d.shape && selectedShapes.some(sel => d.shape?.toLowerCase() === sel.toLowerCase())
      );

  const totalPages = Math.ceil(totalCount / pageSize)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  // Grid view: Professional diamond card inspired by industry standards
  const DiamondGridCard = ({ diamond }: { diamond: Diamond }) => {
    // Support both diamond.images and legacy image1-image6
    const diamondWithImages = diamond as Diamond & { 
      image1?: string; image2?: string; image3?: string; 
      image4?: string; image5?: string; image6?: string; 
    };
    const allImages = [
      ...(diamond.images || []),
      diamondWithImages.image1, diamondWithImages.image2, diamondWithImages.image3, 
      diamondWithImages.image4, diamondWithImages.image5, diamondWithImages.image6
    ].filter((img, i, arr) => img && typeof img === 'string' && img.trim() && arr.indexOf(img) === i);
    const [imgIdx, setImgIdx] = useState(0);
    const hasImages = allImages.length > 0;

    const prevImg = (e: React.MouseEvent) => {
      e.stopPropagation();
      setImgIdx(idx => (idx - 1 + allImages.length) % allImages.length);
    };
    const nextImg = (e: React.MouseEvent) => {
      e.stopPropagation();
      setImgIdx(idx => (idx + 1) % allImages.length);
    };

    return (
      <div
        className="relative rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
        onClick={() => onDiamondSelect(diamond)}
      >
        {/* Image with 360 viewer */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center overflow-hidden">
          {hasImages && allImages[imgIdx] ? (
            <>
              <Image
                src={allImages[imgIdx]!}
                alt={`${diamond.shape} Diamond`}
                width={400}
                height={400}
                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />

              {allImages.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-slate-600 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={prevImg}
                    tabIndex={-1}
                  >
                    <ChevronDown className="w-5 h-5 rotate-90 text-gray-700 dark:text-gray-300" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-slate-600 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={nextImg}
                    tabIndex={-1}
                  >
                    <ChevronDown className="w-5 h-5 -rotate-90 text-gray-700 dark:text-gray-300" />
                  </button>
                </>
              )}
            </>
          ) : (
            <span className="text-6xl opacity-30">💎</span>
          )}

          {/* Wishlist - Top Right */}
          <WishlistButton
            productId={Number(diamond.id)}
            productType="diamond"
            className="absolute top-3 right-3 z-20"
            size="md"
          />
        </div>

        {/* Card Content */}
        <div className="flex-1 flex flex-col p-4 bg-white dark:bg-slate-800">
          {/* Certification & Location */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              {diamond.certificateNumber || 'IGI'}
              {/* {console.log(certificateNumber)} */}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🇮🇳</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">INDIA</span>
            </div>
          </div>

          {/* Diamond Specifications Title */}
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 leading-snug">
            {diamond.shape?.toUpperCase()} {diamond.caratWeight}CT {diamond.color} {diamond.cut || 'II'} {diamond.clarity || 'VG'} {diamond.polish || 'VG'} {diamond.symmetry || 'VG'} {diamond.fluorescence?.toUpperCase() || 'FNT'}
          </h3>

          {/* Measurements */}
          <div className="text-xs text-gray-700 dark:text-gray-300 mb-1">
            <span className="font-semibold">M:</span> {diamond.measurement || `${(Number(diamond.caratWeight) * 3.5).toFixed(2)} • ${(Number(diamond.caratWeight) * 3.6).toFixed(2)} • ${(Number(diamond.caratWeight) * 2.2).toFixed(2)}`}
          </div>

          {/* Table, Depth, Ratio */}
          <div className="text-xs text-gray-700 dark:text-gray-300 mb-3">
            <span className="font-semibold">T:</span> {diamond.table || '56.00'} | <span className="font-semibold">D:</span> {diamond.depth || '62.40'} | <span className="font-semibold">R:</span> {diamond.ratio || '0.99'}
          </div>

          {/* Badges Row */}
          <div className="flex gap-2 mb-3 flex-wrap">
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              YES EYE CLEAN
            </span>
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {diamond.fluorescence || 'NONE'}
            </span>
          </div>

          {/* Delivery & Returns */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-slate-700 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Standard Delivery 7-8 days</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Non Returnable</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // List view: horizontal card (with compare & quick view)
  const DiamondListCard = ({ diamond }: { diamond: Diamond }) => (
    <div
      className="relative border rounded-lg bg-white dark:bg-zinc-900 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row overflow-hidden min-h-[8rem]"
      style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
      onClick={() => onDiamondSelect && onDiamondSelect(diamond)}
    >
      {/* Left: Image & Favorite */}
      <div className="relative w-full sm:w-40 min-w-0 sm:min-w-40 h-40 sm:h-40 bg-gray-50 dark:bg-zinc-800 overflow-hidden flex items-stretch">
        {diamond.images && diamond.images.length > 0 && diamond.images[0] ? (
          <Image
            src={diamond.images[0]}
            alt={`${diamond.shape} Diamond`}
            width={320}
            height={320}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            style={{ display: 'block' }}
          />
        ) : (
          <span className="text-4xl flex items-center justify-center w-full h-full" style={{ color: 'var(--muted-foreground)' }}>💎</span>
        )}
        {/* Favorite Button */}
        <WishlistButton
          productId={Number(diamond.id)}
          productType="diamond"
          className="absolute top-2 right-2 z-10"
          size="md"
        />
        {/* Availability Badge */}
        <span className="absolute bottom-2 left-2 px-2 py-0.5 text-xs font-semibold rounded bg-white/90 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-700" style={{ color: 'var(--primary)' }}>
          {diamond.isSold ? 'Sold' : 'Available'}
        </span>
      </div>
      {/* Right: Details */}
      <div className="flex-1 flex flex-col justify-between p-4 gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
          <h3 className="font-semibold text-base sm:text-lg truncate" style={{ color: 'var(--foreground)' }}>
            {diamond.caratWeight}ct {diamond.shape}
          </h3>
          <span className="text-base sm:text-lg font-bold" style={{ color: 'var(--primary)' }}>
            {formatPrice(typeof diamond.price === 'string' ? parseFloat(diamond.price) : diamond.price)}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mb-1">
          <span>Ref: <span className="font-mono text-gray-700 dark:text-zinc-200">{diamond.certificateNumber || 'N/A'}</span></span>
          <span>Color: <span className="font-medium text-gray-700 dark:text-zinc-200">{diamond.color}</span></span>
          <span>Clarity: <span className="font-medium text-gray-700 dark:text-zinc-200">{diamond.clarity}</span></span>
          <span className="flex items-center gap-1">Shape: <span className="inline-block align-middle w-5 h-5">{diamond.shape ? getShapeIcon(diamond.shape) : null}</span> <span className="font-medium text-gray-700 dark:text-zinc-200">{diamond.shape || 'N/A'}</span></span>
          <span>Carat: <span className="font-medium text-gray-700 dark:text-zinc-200">{diamond.caratWeight}</span></span>
        </div>
        <div className="flex items-center justify-between border-t pt-2 mt-2 gap-2" style={{ borderColor: 'var(--border)' }}>
          <span className="text-xs text-gray-400 dark:text-zinc-500">
            {diamond.sellerId ? `Seller #${diamond.sellerId}` : 'Unknown Seller'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={e => { e.stopPropagation(); onAddToCart(diamond.id); }}
              className="px-3 py-1 rounded-md font-medium text-xs bg-gray-900 text-white dark:bg-zinc-700 dark:text-white hover:bg-gray-700 dark:hover:bg-zinc-600 transition-colors"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4 inline mr-1" />Add to Cart
            </button>
            <button
              className="text-xs px-3 py-1 rounded-md font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              onClick={e => e.stopPropagation()}
            >
              View Details
            </button>
            {/* Compare & Quick View (now inline, minimalist) */}
            <CompareButton
              product={diamond}
              productType="diamond"
              size="sm"
            />
            <button
              className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              title="Quick View"
              onClick={e => { e.stopPropagation(); setQuickViewDiamond(diamond); }}
            >
              <Eye className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )


  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Results Header - Desktop/Tablet */}
      <div className="hidden sm:flex items-center justify-between p-4 border rounded-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            {totalCount.toLocaleString()} Diamonds Found
          </h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Sort, Filter, and View Toggle - Desktop (Mobile Style) */}
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              aria-label="Sort"
            >
              <ArrowUpDown className="w-4 h-4 text-gray-700" />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
              onClick={() => {
                const evt = new CustomEvent('openDiamondFilters');
                window.dispatchEvent(evt);
              }}
              aria-label="Open filters"
            >
              <FilterIcon className="w-4 h-4 text-gray-700" />
            </button>
            <div className="flex items-center bg-white shadow border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header - Mobile */}
      {/* Results Header - Mobile (Modern, Minimal, Floating) */}
      <div className="sm:hidden flex items-center justify-between w-full pt-2">
        <div className="flex gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            aria-label="Sort"
          >
            <ArrowUpDown className="w-4 h-4 text-gray-700" />
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
            onClick={() => {
              const evt = new CustomEvent('openDiamondFilters');
              window.dispatchEvent(evt);
            }}
            aria-label="Open filters"
          >
            <FilterIcon className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        <div className="flex items-center bg-white shadow border border-gray-200 rounded-lg gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
            aria-label="Grid view"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Diamond Shape Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-muted-foreground/30">
        {shapeOptions.map(opt => {
          const isSelected = selectedShapes.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => {
                if (opt.value === 'All') {
                  setSelectedShapes(['All']);
                } else {
                  setSelectedShapes(prev => {
                    let next;
                    if (prev.includes(opt.value)) {
                      next = prev.filter(s => s !== opt.value);
                    } else {
                      next = prev.filter(s => s !== 'All').concat(opt.value);
                    }
                    return next.length === 0 ? ['All'] : next;
                  });
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border hover:bg-muted'}`}
              style={isSelected ? { background: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { background: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
              type="button"
            >
              <span className="text-lg">{opt.icon}</span>
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Results Grid/List */}
      {filteredDiamonds.length === 0 ? (
        <div className="text-center py-12 border rounded-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="text-6xl mb-4">💎</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
            No diamonds found
          </h3>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Try adjusting your filters to see more results
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDiamonds.map((diamond) => (
                <DiamondGridCard key={diamond.id} diamond={diamond} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDiamonds.map((diamond) => (
                <DiamondListCard key={diamond.id} diamond={diamond} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      {/* Quick View Modal */}
      <Dialog
        open={!!quickViewDiamond}
        onOpenChange={open => setQuickViewDiamond(open ? quickViewDiamond : null)}
        showClose
        className=" w-full max-w-5xl"
        title={quickViewDiamond ? (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <span className="font-bold text-xl md:text-2xl text-zinc-900 dark:text-white">
              {quickViewDiamond.name || `${quickViewDiamond.shape} ${quickViewDiamond.caratWeight || ''}ct`}
            </span>
            <span className="text-lg md:text-2xl font-bold text-primary">
              {quickViewDiamond && (typeof quickViewDiamond.price === 'string' ? `$${parseFloat(quickViewDiamond.price).toLocaleString()}` : `$${quickViewDiamond.price?.toLocaleString?.()}`)}
            </span>
          </div>
        ) : ''}
        description={quickViewDiamond?.description}
      >
        {quickViewDiamond && (
          <QuickViewDiamondModalContent diamond={quickViewDiamond} />
        )}
      </Dialog>
    </div>
  )
}
