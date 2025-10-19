import { useState, useCallback } from 'react';
import { diamondService } from '@/services/diamondService';

// Define product interfaces
interface Diamond {
  id: string | number;
  name?: string;
  price: number | string;
  shape?: string;
  color?: string;
  clarity?: string;
  carat?: number;
  cut?: string;
  [key: string]: unknown;
}

interface Jewelry {
  id: string | number;
  name?: string;
  price?: number | string;
  category?: string;
  metalType?: string;
  totalPrice?: number;
  [key: string]: unknown;
}

interface Gemstone {
  id: string | number;
  name?: string;
  price?: number | string;
  weight?: number;
  color?: string;
  clarity?: string;
  origin?: string;
  [key: string]: unknown;
}

export const SellerType = {
  naturalDiamond: 'naturalDiamond',
  labGrownDiamond: 'labGrownDiamond',
  jewellery: 'jewellery',
  gemstone: 'gemstone'
} as const;

type SellerTypeValue = typeof SellerType[keyof typeof SellerType];

interface SellerProducts {
  diamonds: Diamond[];
  jewelry: Jewelry[];
  gemstones: Gemstone[];
  all: (Diamond | Jewelry | Gemstone)[];
}

interface UseSellerProductsReturn {
  products: SellerProducts;
  loading: boolean;
  error: string | null;
  fetchProducts: (sellerId: string, sellerType?: SellerTypeValue) => Promise<void>;
  refreshProducts: () => void;
}

export const useSellerProducts = (sellerId?: string): UseSellerProductsReturn => {
  const [products, setProducts] = useState<SellerProducts>({
    diamonds: [],
    jewelry: [],
    gemstones: [],
    all: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSellerId, setCurrentSellerId] = useState<string | undefined>(sellerId);
  const [currentSellerType, setCurrentSellerType] = useState<SellerTypeValue | undefined>();

  const fetchProducts = useCallback(async (sellerIdToFetch: string, sellerType?: SellerTypeValue) => {
    if (!sellerIdToFetch) return;
    
    setLoading(true);
    setError(null);
    setCurrentSellerId(sellerIdToFetch);
    setCurrentSellerType(sellerType);
    
    try {
      let diamonds: Diamond[] = [];
      let jewelry: Jewelry[] = [];
      let gemstones: Gemstone[] = [];

      if (sellerType) {
        // Make only ONE API call based on seller type
        switch (sellerType) {
          case SellerType.naturalDiamond:
          case SellerType.labGrownDiamond:
            // For diamond sellers, only call diamonds API
            const diamondsRes = await diamondService.getDiamondsBySeller(sellerIdToFetch);
            diamonds = diamondsRes?.data || [];
            console.log(`Fetched ${diamonds.length} diamonds for ${sellerType} seller`);
            break;
            
          case SellerType.jewellery:
            // For jewelry sellers, only call jewelry API
            const jewelryRes = await diamondService.getJewelryBySeller(sellerIdToFetch);
            // API returns an array directly (JewelryData[]), so use response.data or default to empty array
            jewelry = jewelryRes?.data || [];
            console.log(`Fetched ${jewelry.length} jewelry items for jewelry seller`);
            break;
            
          case SellerType.gemstone:
            // For gemstone sellers, only call gemstones API
            const gemstonesRes = await diamondService.getGemstonesBySeller(sellerIdToFetch);
            gemstones = gemstonesRes?.data || [];
            console.log(`Fetched ${gemstones.length} gemstones for gemstone seller`);
            break;
            
          default:
            // If seller type is unknown/invalid, don't make any calls
            console.warn(`Unknown seller type: ${sellerType}, no products fetched`);
        }
      } else {
        // If no seller type provided, don't make any calls
        console.warn('No seller type provided, no products fetched');
      }
      
      // Combine all products for 'all' tab (will be same as the specific type for single seller type)
      const allProducts = [...diamonds, ...jewelry, ...gemstones];
      
      setProducts({
        diamonds,
        jewelry,
        gemstones,
        all: allProducts
      });
      
      console.log(`Final products for seller type ${sellerType}:`, {
        diamonds: diamonds.length,
        jewelry: jewelry.length,
        gemstones: gemstones.length,
        total: allProducts.length
      });
      
    } catch (error) {
      console.error('Error fetching seller products:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
      setProducts({ diamonds: [], jewelry: [], gemstones: [], all: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProducts = useCallback(() => {
    if (currentSellerId) {
      fetchProducts(currentSellerId, currentSellerType);
    }
  }, [currentSellerId, currentSellerType, fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    refreshProducts
  };
};
