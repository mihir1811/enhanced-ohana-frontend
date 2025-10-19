'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { auctionService } from '@/services/auctionService';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Shield,
  Gavel,
  Timer
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';

// Interfaces (reusing from main page)
interface Seller {
  id: string;
  companyName: string;
  companyLogo?: string;
  city: string;
  state: string;
  country: string;
  sellerType: string;
  isVerified: boolean;
}

interface GemsProduct {
  id: number;
  name: string;
  gemsType: string;
  subType: string;
  composition: string;
  qualityGrade: string;
  quantity: number;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  price: number;
  carat: number;
  shape: string;
  color: string;
  clarity: string;
  origin: string;
  cut: string;
  dimension: string;
  treatment: string;
  description?: string;
}

interface JewelryProduct {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  collection: string;
  gender: string;
  occasion: string;
  metalType: string;
  metalPurity: string;
  metalWeight: number;
  basePrice: number;
  makingCharge: number;
  tax: number;
  totalPrice: number;
  attributes: Record<string, unknown>;
  description: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
}

interface Bid {
  id: number;
  amount: number;
  userId: string;
  createdAt: string;
}

interface AuctionItem {
  id: number;
  productType: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond';
  productId: number;
  sellerId: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  isSold: false;
  bids: Bid[];
  seller: Seller;
  product: GemsProduct | JewelryProduct;
}

// Countdown Timer Component
const CountdownTimer: React.FC<{ endTime: string }> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.isExpired) {
    return (
      <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-center">
        <Timer className="w-5 h-5 inline mr-2" />
        Auction Ended
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <div className="text-center">
        <div className="text-sm text-blue-600 font-medium mb-2">Time Remaining</div>
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="text-xl font-bold text-slate-900">{timeLeft.days}</div>
            <div className="text-xs text-slate-600">Days</div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="text-xl font-bold text-slate-900">{timeLeft.hours}</div>
            <div className="text-xs text-slate-600">Hours</div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="text-xl font-bold text-slate-900">{timeLeft.minutes}</div>
            <div className="text-xs text-slate-600">Minutes</div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="text-xl font-bold text-slate-900">{timeLeft.seconds}</div>
            <div className="text-xs text-slate-600">Seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Image Gallery Component
const ImageGallery: React.FC<{ product: GemsProduct | JewelryProduct }> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  
  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
    product.image5,
    product.image6
  ].filter(Boolean) as string[];

  if (images.length === 0) {
    return (
      <div className="bg-slate-100 rounded-lg aspect-square flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="text-6xl mb-4">💎</div>
          <div>No Images Available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
        <Image
          src={images[selectedImage]}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                selectedImage === index 
                  ? 'border-blue-500' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Image
                src={image}
                alt={`${product.name} ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Bidding Component
const BiddingSection: React.FC<{ 
  auction: AuctionItem, 
  currentBid: number | null 
}> = ({ auction, currentBid }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [bidding, setBidding] = useState(false);

  const startingPrice = 'totalPrice' in auction.product 
    ? auction.product.totalPrice 
    : auction.product.price;

  const minBid = currentBid ? currentBid + 100 : startingPrice + 100;

  const handleBid = async () => {
    // Implement bid logic here
    setBidding(true);
    // Add API call
    setTimeout(() => setBidding(false), 1000);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-900">
            {currentBid ? 'Current Bid' : 'Starting Price'}
          </h3>
          {currentBid && (
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">Live Auction</span>
            </div>
          )}
        </div>
        
        <div className="text-3xl font-bold text-slate-900 mb-2">
          ${(currentBid || startingPrice).toLocaleString()}
        </div>
        
        {auction.bids.length > 0 && (
          <div className="text-sm text-slate-600">
            {auction.bids.length} bid{auction.bids.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {auction.isActive && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Bid (Minimum: ${minBid.toLocaleString()})
            </label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Enter bid amount`}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={handleBid}
            disabled={bidding || !bidAmount || parseInt(bidAmount) < minBid}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Gavel className="w-5 h-5" />
            {bidding ? 'Placing Bid...' : 'Place Bid'}
          </button>
        </div>
      )}

      {!auction.isActive && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-red-800 font-medium">Auction Ended</div>
          {auction.isSold && (
            <div className="text-sm text-red-600 mt-1">This item has been sold</div>
          )}
        </div>
      )}
    </div>
  );
};

export default function AuctionDetailsPage() {
  const params = useParams();
  const auctionId = params.id as string;
  
  const [auction, setAuction] = useState<AuctionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await auctionService.getAuctionById<AuctionItem>(auctionId);
        
        if (response?.data) {
          setAuction(response.data);
        } else {
          setError('Auction not found');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load auction details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (auctionId) {
      fetchAuctionDetails();
    }
  }, [auctionId]);

  if (loading) {
    return (
      <>
        <NavigationUser />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <div className="text-slate-600">Loading auction details...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !auction) {
    return (
      <>
        <NavigationUser />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Auction Not Found</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <Link 
              href="/auctions" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Auctions
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const currentBid = auction.bids.length > 0 ? Math.max(...auction.bids.map(bid => bid.amount)) : null;
  const isGemstone = auction.productType === 'gemstone';
  const isJewelry = auction.productType === 'jewellery';

  return (
    <>
      <NavigationUser />
      
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/auctions"
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {auction.product.name}
                </h1>
                <div className="text-sm text-slate-600">
                  Auction #{auction.id} • {auction.seller.companyName}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Heart className="w-5 h-5 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div>
              <ImageGallery product={auction.product} />
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Timer */}
              <CountdownTimer endTime={auction.endTime} />

              {/* Bidding Section */}
              <BiddingSection auction={auction} currentBid={currentBid} />

              {/* Product Details */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Details</h3>
                
                {isGemstone && 'gemsType' in auction.product && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-600">Gemstone Type</div>
                        <div className="font-medium">{auction.product.gemsType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Sub Type</div>
                        <div className="font-medium">{auction.product.subType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Shape</div>
                        <div className="font-medium">{auction.product.shape}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Carat Weight</div>
                        <div className="font-medium">{auction.product.carat} ct</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Color</div>
                        <div className="font-medium">{auction.product.color}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Clarity</div>
                        <div className="font-medium">{auction.product.clarity}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Origin</div>
                        <div className="font-medium">{auction.product.origin}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Cut</div>
                        <div className="font-medium">{auction.product.cut}</div>
                      </div>
                    </div>
                  </div>
                )}

                {isJewelry && 'category' in auction.product && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-600">Category</div>
                        <div className="font-medium">{auction.product.category}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Metal Type</div>
                        <div className="font-medium">{auction.product.metalType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Metal Purity</div>
                        <div className="font-medium">{auction.product.metalPurity}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Metal Weight</div>
                        <div className="font-medium">{auction.product.metalWeight}g</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Collection</div>
                        <div className="font-medium">{auction.product.collection}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Occasion</div>
                        <div className="font-medium">{auction.product.occasion}</div>
                      </div>
                    </div>
                  </div>
                )}

                {auction.product.description && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="text-sm text-slate-600 mb-2">Description</div>
                    <div className="text-slate-900">{auction.product.description}</div>
                  </div>
                )}
              </div>

              {/* Seller Information */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Seller Information</h3>
                
                <div className="flex items-center gap-4">
                  {auction.seller.companyLogo && (
                    <Image
                      src={auction.seller.companyLogo}
                      alt={auction.seller.companyName}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium text-slate-900 flex items-center gap-2">
                      {auction.seller.companyName}
                      {auction.seller.isVerified && (
                        <Shield className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {auction.seller.city}, {auction.seller.state}, {auction.seller.country}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
