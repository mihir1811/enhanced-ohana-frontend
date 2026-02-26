"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
import { generateGemstoneName } from "@/utils/gemstoneUtils";
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

  const handleChatWithSeller = async () => {
    console.log('🔍 [GemstoneChat] Starting chat with seller process...')
    console.log('🔍 [GemstoneChat] Gemstone data:', {
      gemstone,
      sellerId: gemstone?.seller?.id,
      directSellerId: gemstone?.sellerId,
      hasSellerObject: !!gemstone?.seller,
      sellerObject: gemstone?.seller
    })
    
    // Try to get seller ID from multiple possible locations
    // We prioritize seller.userId because the chat system works between Users (not Seller entities)
    const sellerId = gemstone?.seller?.userId || gemstone?.seller?.id || gemstone?.sellerId
    
    console.log('🔍 [GemstoneChat] Resolved seller ID:', sellerId)
    
    if (!sellerId) {
      console.error('❌ [GemstoneChat] No seller information available', { 
        gemstone: gemstone,
        sellerId: gemstone?.seller?.id,
        directSellerId: gemstone?.sellerId
      })
      alert('No seller information available for this gemstone.')
      return
    }

    if (!user) {
      console.log('⚠️ [GemstoneChat] User not logged in, redirecting to login')
      router.push('/login')
      return
    }

    console.log('✅ [GemstoneChat] User authenticated:', user.id)

    try {
      // Navigate to main chat page with seller pre-selected
      const productId = gemstone.id
      const productName = generateGemstoneName({
        process: gemstone.process,
        color: gemstone.color,
        shape: gemstone.shape,
        gemsType: gemstone.gemType,
        subType: gemstone.subType,
        carat: gemstone.caratWeight,
        quantity: gemstone.quantity
      }) || gemstone.name || `${gemstone.caratWeight}ct ${gemstone.shape} ${gemstone.gemType}`
      
      const chatUrl = `/user/chat?sellerId=${sellerId}&productId=${productId}&productType=gemstone&productName=${encodeURIComponent(productName)}`
      console.log('🚀 [GemstoneChat] Navigating to chat:', { 
        sellerId, 
        productId, 
        productName, 
        chatUrl,
        encodedProductName: encodeURIComponent(productName)
      })
      
      router.push(chatUrl)
    } catch (error) {
      console.error('❌ [GemstoneChat] Failed to initiate gemstone chat:', error)
      // Still navigate to chat page, let it handle the error
      const productId = gemstone.id
      const productName = generateGemstoneName({
        process: gemstone.process,
        color: gemstone.color,
        shape: gemstone.shape,
        gemsType: gemstone.gemType,
        subType: gemstone.subType,
        carat: gemstone.caratWeight,
        quantity: gemstone.quantity
      }) || gemstone.name || `${gemstone.caratWeight}ct ${gemstone.shape} ${gemstone.gemType}`
      const chatUrl = `/user/chat?sellerId=${sellerId}&productId=${productId}&productType=gemstone&productName=${encodeURIComponent(productName)}`
      console.log('🔄 [GemstoneChat] Fallback navigation:', chatUrl)
      router.push(chatUrl)
    }
  };

  console.log('Gemstone data for chat debug:', { 
    gemstone, 
    sellerId: gemstone?.seller?.id, 
    directSellerId: gemstone?.sellerId,
    hasSeller: !!gemstone?.seller,
    hasDirectSellerId: !!gemstone?.sellerId
  });

  if (!gemstone) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-30">💎</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Gemstone not found
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>
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
    if (score >= 4) return { grade: "Excellent", color: "", bg: "" };
    if (score >= 3) return { grade: "Very Good", color: "", bg: "" };
    if (score >= 2) return { grade: "Good", color: "", bg: "" };
    return { grade: "Fair", color: "", bg: "" };
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
      <nav className="flex items-center space-x-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
        <a href="/gemstones" className="hover:underline" style={{ color: 'var(--muted-foreground)' }}>
          Gemstones
        </a>
        <span>/</span>
        <a href="#" className="hover:underline" style={{ color: 'var(--muted-foreground)' }}>
          {gemstone.gemType || "Gemstone"}
        </a>
        <span>/</span>
        <span className="font-medium" style={{ color: 'var(--foreground)' }}>
          {gemstone.caratWeight}ct
        </span>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Image Gallery */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden group border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            {hasImages ? (
              <>
                <Image
                  src={images[imgIdx]}
                  alt={`${gemstone.gemType} Gemstone`}
                  width={800}
                  height={600}
                  className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                />

                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 border backdrop-blur-sm"
                      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                    >
                      <ChevronLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 border backdrop-blur-sm"
                      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                    >
                      <ChevronRight className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
                    </button>
                  </>
                )}

                {/* Image counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-sm font-medium border" style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                    {imgIdx + 1} / {images.length}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Star className="w-20 h-20 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                  <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>No Image Available</p>
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
                  className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all"
                  style={{ borderColor: index === imgIdx ? 'var(--primary)' : 'var(--border)' }}
                >
                  <Image
                    src={img}
                    alt={`View ${index + 1}`}
                    width={120}
                    height={120}
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
                    className="hover:underline text-lg font-semibold mb-1 block"
                    style={{ color: 'var(--primary)' }}
                  >
                    {gemstone.seller.companyName}
                  </a>
                )}
                <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {generateGemstoneName({
                    process: gemstone.process,
                    color: gemstone.color,
                    shape: gemstone.shape,
                    gemsType: gemstone.gemType,
                    subType: gemstone.subType,
                    carat: gemstone.caratWeight,
                    quantity: gemstone.quantity
                  }) || gemstone.name}
                </h1>
                <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>SKU: {gemstone.skuCode}</p>
              </div>
              <WishlistButton
                productId={Number(gemstone.id)}
                productType="gemstone"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border" style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                <Award className="w-4 h-4 mr-1" style={{ color: 'var(--muted-foreground)' }} />
                {certification.grade}
              </div>

              {gemstone.isOnAuction && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border" style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                  <Zap className="w-4 h-4 mr-1" style={{ color: 'var(--muted-foreground)' }} />
                  On Auction
                </div>
              )}
            </div>

            {/* Price */}
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Total Price</div>
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                {formatPrice(gemstone.totalPrice)}
              </div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Final price including all fees
              </p>
            </div>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Total Price</div>
              <div className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                {formatPrice(gemstone.totalPrice)}
              </div>
            </div>
            <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Carat Weight</div>
              <div className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                {gemstone.caratWeight || "N/A"}
              </div>
            </div>
            <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Color</div>
              <div className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                {gemstone.color || "N/A"}
              </div>
            </div>
            <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Clarity</div>
              <div className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                {gemstone.clarity || "N/A"}
              </div>
            </div>
            <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Cut</div>
              <div className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                {gemstone.cut || "N/A"}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
            </button>

            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={handleChatWithSeller}
                className="flex items-center justify-center space-x-2 py-3 rounded-xl border transition-colors"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-3 rounded-xl border transition-colors" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-3 rounded-xl border transition-colors" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <Download className="w-4 h-4" />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        {/* Tab Navigation */}
        <div className="border-b" style={{ borderColor: 'var(--border)' }}>
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview" },
              { id: "specifications", label: "Specifications" },
              { id: "certification", label: "Certification" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "overview" | "specifications" | "certification")}
                className={`py-4 text-sm font-medium border-b-2 transition-colors`}
                style={activeTab === tab.id ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'transparent', color: 'var(--muted-foreground)' }}
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
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Gemstone Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span style={{ color: 'var(--muted-foreground)' }}>Total Price:</span>
                    <span className="ml-2 font-medium" style={{ color: 'var(--foreground)' }}>
                      {formatPrice(gemstone.totalPrice)}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted-foreground)' }}>Type:</span>
                    <span className="ml-2 font-medium" style={{ color: 'var(--foreground)' }}>
                      {gemstone.gemType || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted-foreground)' }}>Shape:</span>
                    <span className="ml-2 font-medium" style={{ color: 'var(--foreground)' }}>
                      {gemstone.shape || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted-foreground)' }}>Origin:</span>
                    <span className="ml-2 font-medium" style={{ color: 'var(--foreground)' }}>
                      {gemstone.origin || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted-foreground)' }}>Treatment:</span>
                    <span className="ml-2 font-medium" style={{ color: 'var(--foreground)' }}>
                      {gemstone.treatment || "None disclosed"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Total Price:</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                      {formatPrice(gemstone.totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Carat Weight:</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                      {gemstone.caratWeight || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Color:</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                      {gemstone.color || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Clarity:</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                      {gemstone.clarity || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Cut:</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>{gemstone.cut || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Shape:</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                      {gemstone.shape || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Treatment:</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                      {gemstone.treatment || "None"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "certification" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                Certification Information
              </h3>
              <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>Certification Status</span>
                </div>
                <p style={{ color: 'var(--muted-foreground)' }}>
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
