"use client";

import React, { useState, useEffect } from "react";
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
  Play,
  MessageSquare,
} from "lucide-react";
import { GemstonItem } from "@/services/gemstoneService";
import WishlistButton from "@/components/shared/WishlistButton";
import { cartService } from "@/services/cartService";
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useRouter } from 'next/navigation'

interface GemstoneDetailsPageProps {
  gemstone: GemstonItem | null;
}

const GemstoneDetailsPage: React.FC<GemstoneDetailsPageProps> = ({
  gemstone,
}) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "overview" | "specifications" | "certification"
  >("overview");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const router = useRouter();

  // Get authentication token from Redux store
  const { token, user } = useSelector((state: RootState) => state.auth);

  const handleAddToCart = async () => {
    if (!gemstone) return;
    
    if (!token) {
      console.error('User not authenticated');
      // You can add a toast notification or redirect to login here
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await cartService.addToCart({
        productId: Number(gemstone.id),
        productType: 'gemstone',
        quantity: 1
      }, token);
      console.log('Gemstone added to cart successfully');
      // You can add a toast notification here
    } catch (error) {
      console.error('Failed to add gemstone to cart:', error);
      // You can add error handling/toast here
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleChatWithSeller = () => {
    // Try to get seller ID from multiple possible locations
    const sellerId = gemstone?.seller?.id || gemstone?.sellerId
    
    if (!sellerId) {
      console.warn('No seller information available', { 
        gemstone: gemstone,
        sellerId: gemstone?.seller?.id,
        directSellerId: gemstone?.sellerId
      })
      return
    }

    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login')
      return
    }

    // Navigate to main chat page with seller pre-selected
    const productId = gemstone.id
    const productName = gemstone.name || `${gemstone.caratWeight}ct ${gemstone.shape} ${gemstone.gemType}`
    
    const chatUrl = `/user/chat?sellerId=${sellerId}&productId=${productId}&productType=gemstone&productName=${encodeURIComponent(productName)}`
    router.push(chatUrl)
  };

  if (!gemstone) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-30">💎</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Gemstone not found
          </h2>
          <p className="text-gray-600">
            The requested gemstone could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  // Collect all image fields from API if present
  const images = [
    gemstone.image1,
    gemstone.image2,
    gemstone.image3,
    gemstone.image4,
    gemstone.image5,
    gemstone.image6,
  ].filter((img): img is string => Boolean(img));
  const hasImages = images.length > 0;

  const formatPrice = (price: number | string | undefined) => {
    if (!price) return "Price on Request";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const getCertificationGrade = () => {
    const hasColor = gemstone.color && gemstone.color !== "N/A";
    const hasClarity = gemstone.clarity && gemstone.clarity !== "N/A";
    const hasCut = gemstone.cut && gemstone.cut !== "N/A";
    const hasCertificate = gemstone.certification;

    const score = [hasColor, hasClarity, hasCut, hasCertificate].filter(
      Boolean
    ).length;
    if (score >= 4)
      return {
        grade: "Excellent",
        color: "text-green-800",
        bg: "bg-green-100",
      };
    if (score >= 3)
      return { grade: "Very Good", color: "text-blue-700", bg: "bg-blue-100" };
    if (score >= 2)
      return { grade: "Good", color: "text-yellow-700", bg: "bg-yellow-100" };
    return { grade: "Fair", color: "text-gray-500", bg: "bg-gray-50" };
  };

  const certification = getCertificationGrade();

  const nextImage = () => {
    setImgIdx((idx) => (idx + 1) % images.length);
  };

  const prevImage = () => {
    setImgIdx((idx) => (idx - 1 + images.length) % images.length);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <a href="/gemstones" className="hover:text-gray-900">
          Gemstones
        </a>
        <span>/</span>
        <a href="#" className="hover:text-gray-900">
          {gemstone.gemType || "Gemstone"}
        </a>
        <span>/</span>
        <span className="text-gray-900 font-medium">
          {gemstone.caratWeight}ct
        </span>
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
                  alt={`${gemstone.gemType} Gemstone`}
                  className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                />

                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Image counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {imgIdx + 1} / {images.length}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Star className="w-20 h-20 mx-auto mb-4" />
                  <p className="text-lg">No Image Available</p>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setImgIdx(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    index === imgIdx
                      ? "border-amber-500 ring-2 ring-amber-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Product Details */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                {/* Seller Company Name */}
                {gemstone.seller?.companyName && (
                  <a
                    href={`/product/seller-info/${
                      gemstone.seller.id || gemstone.sellerId
                    }`}
                    className="text-blue-600 hover:underline text-lg font-semibold mb-1 block"
                  >
                    {gemstone.seller.companyName}
                  </a>
                )}
                <h1 className="text-3xl font-bold text-gray-900">
                  {gemstone.name}
                </h1>
                <p className="text-gray-600 mt-1">SKU: {gemstone.skuCode}</p>
              </div>
              <WishlistButton
                productId={Number(gemstone.id)}
                productType="gemstone"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${certification.bg} ${certification.color}`}
              >
                <Award className="w-4 h-4 mr-1" />
                {certification.grade}
              </div>

              {gemstone.isOnAuction && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <Zap className="w-4 h-4 mr-1" />
                  On Auction
                </div>
              )}
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatPrice(gemstone.totalPrice)}
              </div>
              <p className="text-gray-600 text-sm">
                Final price including all fees
              </p>
            </div>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Carat Weight</div>
              <div className="text-lg font-semibold">
                {gemstone.caratWeight || "N/A"}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Color</div>
              <div className="text-lg font-semibold">
                {gemstone.color || "N/A"}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Clarity</div>
              <div className="text-lg font-semibold">
                {gemstone.clarity || "N/A"}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Cut</div>
              <div className="text-lg font-semibold">
                {gemstone.cut || "N/A"}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
            </button>

            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={handleChatWithSeller}
                className="flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview" },
              { id: "specifications", label: "Specifications" },
              { id: "certification", label: "Certification" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Gemstone Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 font-medium">
                      {gemstone.gemType || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Shape:</span>
                    <span className="ml-2 font-medium">
                      {gemstone.shape || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Origin:</span>
                    <span className="ml-2 font-medium">
                      {gemstone.origin || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Treatment:</span>
                    <span className="ml-2 font-medium">
                      {gemstone.treatment || "None disclosed"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carat Weight:</span>
                    <span className="font-medium">
                      {gemstone.caratWeight || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-medium">
                      {gemstone.color || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Clarity:</span>
                    <span className="font-medium">
                      {gemstone.clarity || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cut:</span>
                    <span className="font-medium">{gemstone.cut || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shape:</span>
                    <span className="font-medium">
                      {gemstone.shape || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Treatment:</span>
                    <span className="font-medium">
                      {gemstone.treatment || "None"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "certification" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Certification Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  <span className="font-medium">Certification Status</span>
                </div>
                <p className="text-gray-600">
                  {gemstone.certification
                    ? `This gemstone is certified by ${gemstone.certification}`
                    : "Certification information not available"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GemstoneDetailsPage;
