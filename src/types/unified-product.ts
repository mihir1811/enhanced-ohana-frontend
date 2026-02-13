import { generateGemstoneName } from "@/utils/gemstoneUtils";

export interface UnifiedProduct {
  // Base properties that all products should have
  id: string | number;
  name?: string;
  description?: string;
  price: number;
  sellerId?: string;
  images: string[];
  
  // Product type specific
  productType: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond';
  
  // Common display properties
  mainImage?: string;
  category?: string;
  subcategory?: string;
  isOnAuction?: boolean;
  isSold?: boolean;
  
  // Diamond specific (optional)
  caratWeight?: number;
  color?: string;
  clarity?: string;
  cut?: string;
  shape?: string;
  certification?: string;
  
  // Jewelry specific (optional)
  metalType?: string;
  metalPurity?: string;
  totalPrice?: number;
  basePrice?: number;
  
  // Gemstone specific (optional)
  gemType?: string;
  subType?: string;
  quantity?: string | number;
  process?: string;
  origin?: string;
  treatment?: string;
  
  // Audit fields
  createdAt?: string;
  updatedAt?: string;
}

// Raw product interfaces for transform functions
export interface RawDiamond {
  id: string | number;
  name?: string;
  description?: string;
  price: string | number;
  sellerId?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  isOnAuction?: boolean;
  isSold?: boolean;
  caratWeight: string | number;
  color?: string;
  clarity?: string;
  cut?: string;
  shape?: string;
  certification?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RawJewelry {
  id: string | number;
  name?: string;
  description?: string;
  totalPrice?: string | number;
  basePrice?: string | number;
  sellerId?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  category?: string;
  subcategory?: string;
  isOnAuction?: boolean;
  isSold?: boolean;
  metalType?: string;
  metalPurity?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RawGemstone {
  id: string | number;
  name?: string;
  description?: string;
  price: string | number;
  sellerId?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  isOnAuction?: boolean;
  isSold?: boolean;
  caratWeight?: string | number;
  color?: string;
  clarity?: string;
  shape?: string;
  gemType?: string;
  subType?: string;
  quantity?: string | number;
  process?: string;
  origin?: string;
  treatment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RawWishlistItem {
  product?: RawDiamond | RawJewelry | RawGemstone | {
    id: string | number;
    name?: string;
    description?: string;
    price?: string | number;
    sellerId?: string;
    productType?: string;
    caratWeight?: string | number;
    cut?: string;
    clarity?: string;
    gemType?: string;
    origin?: string;
    metalType?: string;
    category?: string;
    [key: string]: unknown;
  };
}

// Extended interface for wishlist items
export interface WishlistUnifiedProduct extends UnifiedProduct {
  wishlistItemId: number;
}

// Transform functions for each product type
export function transformDiamondToUnified(diamond: RawDiamond): UnifiedProduct {
  return {
    id: diamond.id,
    name: diamond.name,
    description: diamond.description,
    price: Number(diamond.price) || 0,
    sellerId: diamond.sellerId,
    images: [
      diamond.image1,
      diamond.image2,
      diamond.image3,
      diamond.image4,
      diamond.image5,
      diamond.image6
    ].filter((img): img is string => Boolean(img)),
    productType: 'diamond',
    mainImage: diamond.image1,
    isOnAuction: diamond.isOnAuction,
    isSold: diamond.isSold,
    caratWeight: Number(diamond.caratWeight),
    color: diamond.color,
    clarity: diamond.clarity,
    cut: diamond.cut,
    shape: diamond.shape,
    certification: diamond.certification,
    createdAt: diamond.createdAt,
    updatedAt: diamond.updatedAt
  };
}

export function transformJewelryToUnified(jewelry: RawJewelry): UnifiedProduct {
  return {
    id: jewelry.id,
    name: jewelry.name,
    description: jewelry.description,
    price: Number(jewelry.totalPrice) || Number(jewelry.basePrice) || 0,
    sellerId: jewelry.sellerId,
    images: [
      jewelry.image1,
      jewelry.image2,
      jewelry.image3,
      jewelry.image4,
      jewelry.image5,
      jewelry.image6
    ].filter((img): img is string => Boolean(img)),
    productType: 'jewellery',
    mainImage: jewelry.image1,
    category: jewelry.category,
    subcategory: jewelry.subcategory,
    isOnAuction: jewelry.isOnAuction,
    isSold: jewelry.isSold,
    metalType: jewelry.metalType,
    metalPurity: jewelry.metalPurity,
    totalPrice: Number(jewelry.totalPrice),
    basePrice: Number(jewelry.basePrice),
    createdAt: jewelry.createdAt,
    updatedAt: jewelry.updatedAt
  };
}

export function transformGemstoneToUnified(gemstone: RawGemstone): UnifiedProduct {
  return {
    id: gemstone.id,
    name: generateGemstoneName({
      process: gemstone.process,
      color: gemstone.color,
      shape: gemstone.shape,
      gemsType: gemstone.gemType,
      subType: gemstone.subType,
      carat: gemstone.caratWeight,
      quantity: gemstone.quantity,
      clarity: gemstone.clarity
    }) || gemstone.name,
    description: gemstone.description,
    price: Number(gemstone.price) || 0,
    sellerId: gemstone.sellerId,
    images: [
      gemstone.image1,
      gemstone.image2,
      gemstone.image3,
      gemstone.image4,
      gemstone.image5,
      gemstone.image6
    ].filter((img): img is string => Boolean(img)),
    productType: 'gemstone',
    mainImage: gemstone.image1,
    isOnAuction: gemstone.isOnAuction,
    isSold: gemstone.isSold,
    caratWeight: Number(gemstone.caratWeight),
    color: gemstone.color,
    clarity: gemstone.clarity,
    shape: gemstone.shape,
    gemType: gemstone.gemType,
    origin: gemstone.origin,
    treatment: gemstone.treatment,
    createdAt: gemstone.createdAt,
    updatedAt: gemstone.updatedAt
  };
}

// Transform wishlist item to unified format
export function transformWishlistItemToUnified(item: RawWishlistItem): UnifiedProduct | null {
  if (!item.product) return null;
  
  const product = item.product;
  
  // Type guards to check if product has specific properties
  const hasCaratWeight = 'caratWeight' in product && product.caratWeight !== undefined;
  const hasCut = 'cut' in product && product.cut !== undefined;
  const hasClarity = 'clarity' in product && product.clarity !== undefined;
  const hasGemType = 'gemType' in product && product.gemType !== undefined;
  const hasOrigin = 'origin' in product && product.origin !== undefined;
  const hasMetalType = 'metalType' in product && product.metalType !== undefined;
  const hasCategory = 'category' in product && product.category !== undefined;
  const hasProductType = 'productType' in product && product.productType !== undefined;
  
  // Determine product type based on available fields or category
  let productType: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond' = 'jewellery';
  
  if (hasProductType && product.productType === 'meleeDiamond' || (hasCaratWeight && Number(product.caratWeight) < 0.2)) {
    productType = 'meleeDiamond';
  } else if (hasCaratWeight && hasCut && hasClarity && !hasGemType) {
    productType = 'diamond';
  } else if (hasGemType || hasOrigin) {
    productType = 'gemstone';
  } else if (hasMetalType || hasCategory) {
    productType = 'jewellery';
  }
  
  // Use appropriate transformer with type casting based on determined type
  try {
    switch (productType) {
      case 'diamond':
      case 'meleeDiamond':
        return transformDiamondToUnified(product as RawDiamond);
      case 'gemstone':
        return transformGemstoneToUnified(product as RawGemstone);
      case 'jewellery':
      default:
        return transformJewelryToUnified(product as RawJewelry);
    }
  } catch (error) {
    // Fallback: try to create a basic unified product
    const fallbackPrice = 'price' in product ? Number(product.price) || 0 : 
                          'totalPrice' in product ? Number(product.totalPrice) || 0 :
                          'basePrice' in product ? Number(product.basePrice) || 0 : 0;
    
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: fallbackPrice,
      sellerId: product.sellerId,
      images: [],
      productType: 'jewellery'
    };
  }
}
