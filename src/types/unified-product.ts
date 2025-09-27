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
  origin?: string;
  treatment?: string;
  
  // Audit fields
  createdAt?: string;
  updatedAt?: string;
}

// Extended interface for wishlist items
export interface WishlistUnifiedProduct extends UnifiedProduct {
  wishlistItemId: number;
}

// Transform functions for each product type
export function transformDiamondToUnified(diamond: any): UnifiedProduct {
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
    ].filter(Boolean),
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

export function transformJewelryToUnified(jewelry: any): UnifiedProduct {
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
    ].filter(Boolean),
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

export function transformGemstoneToUnified(gemstone: any): UnifiedProduct {
  return {
    id: gemstone.id,
    name: gemstone.name,
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
    ].filter(Boolean),
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
export function transformWishlistItemToUnified(item: any): UnifiedProduct | null {
  if (!item.product) return null;
  
  const product = item.product;
  
  // Determine product type based on available fields or category
  let productType: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond' = 'jewellery';
  
  if (product.productType === 'meleeDiamond' || (product.caratWeight && product.caratWeight < 0.2)) {
    productType = 'meleeDiamond';
  } else if (product.caratWeight && product.cut && product.clarity && !product.gemType) {
    productType = 'diamond';
  } else if (product.gemType || product.origin) {
    productType = 'gemstone';
  } else if (product.metalType || product.category) {
    productType = 'jewellery';
  }
  
  // Use appropriate transformer
  switch (productType) {
    case 'diamond':
      return transformDiamondToUnified(product);
    case 'meleeDiamond':
      return transformDiamondToUnified(product); // Melee diamonds use same structure as diamonds
    case 'gemstone':
      return transformGemstoneToUnified(product);
    case 'jewellery':
      return transformJewelryToUnified(product);
    default:
      return transformJewelryToUnified(product); // Default fallback
  }
}
