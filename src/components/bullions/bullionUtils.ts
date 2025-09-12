import { BullionFilterValues } from './BullionFilters';

export const getDefaultBullionFilters = (): BullionFilterValues => {
  const baseFilters: BullionFilterValues = {
    type: [],
    metal: [],
    purity: [],
    weight: { min: 0.1, max: 100 },
    weightUnit: 'oz',
    priceRange: { min: 0, max: 50000 },
    mint: [],
    yearRange: { min: 1900, max: new Date().getFullYear() },
    country: [],
    condition: [],
    certification: [],
    freeShipping: false,
    inStock: false,
    searchTerm: '',
    companyName: '',
  };

  return baseFilters;
};

export const transformApiBullion = (apiBullion: any) => {
  // Transform API bullion data to match our component interface if needed
  return {
    id: apiBullion.id?.toString() || '',
    name: apiBullion.name || apiBullion.title || '',
    type: apiBullion.type || apiBullion.bullionType || 'bar',
    metal: apiBullion.metal || apiBullion.metalType || 'gold',
    purity: apiBullion.purity || apiBullion.fineness || '999.9',
    weight: apiBullion.weight || 0,
    weightUnit: apiBullion.weightUnit || apiBullion.unit || 'oz',
    dimensions: {
      length: apiBullion.dimensions?.length || apiBullion.length,
      width: apiBullion.dimensions?.width || apiBullion.width,
      thickness: apiBullion.dimensions?.thickness || apiBullion.thickness,
      diameter: apiBullion.dimensions?.diameter || apiBullion.diameter,
      unit: apiBullion.dimensions?.unit || 'mm',
    },
    mint: apiBullion.mint || apiBullion.manufacturer,
    year: apiBullion.year || apiBullion.mintYear,
    country: apiBullion.country || apiBullion.origin,
    series: apiBullion.series || apiBullion.collection,
    design: apiBullion.design || apiBullion.theme,
    condition: apiBullion.condition || apiBullion.grade || 'BU',
    certification: apiBullion.certification && {
      company: apiBullion.certification.company || apiBullion.certification.certifier || '',
      grade: apiBullion.certification.grade || apiBullion.certification.rating || '',
      certNumber: apiBullion.certification.certNumber || apiBullion.certification.number || '',
    },
    price: parseFloat(apiBullion.price?.toString() || '0'),
    premium: parseFloat(apiBullion.premium?.toString() || '0'),
    spotPrice: parseFloat(apiBullion.spotPrice?.toString() || '0'),
    pricePerOunce: parseFloat(apiBullion.pricePerOunce?.toString() || apiBullion.price?.toString() || '0'),
    currency: apiBullion.currency || 'USD',
    images: Array.isArray(apiBullion.images) ? apiBullion.images : 
           apiBullion.image ? [apiBullion.image] : [],
    description: apiBullion.description || apiBullion.shortDescription || '',
    seller: {
      id: apiBullion.seller?.id?.toString() || apiBullion.sellerId?.toString() || '',
      companyName: apiBullion.seller?.companyName || apiBullion.seller?.name || 'Unknown Seller',
      companyLogo: apiBullion.seller?.companyLogo || apiBullion.seller?.logo,
      rating: apiBullion.seller?.rating || 0,
      location: apiBullion.seller?.location || apiBullion.seller?.city || '',
      verified: apiBullion.seller?.verified || false,
    },
    inventory: {
      quantity: apiBullion.inventory?.quantity || apiBullion.quantity || 0,
      sku: apiBullion.inventory?.sku || apiBullion.sku || '',
      location: apiBullion.inventory?.location || apiBullion.location || '',
    },
    shipping: {
      free: apiBullion.shipping?.free || apiBullion.freeShipping || false,
      cost: apiBullion.shipping?.cost || apiBullion.shippingCost,
      insured: apiBullion.shipping?.insured || apiBullion.insuredShipping || false,
      signature: apiBullion.shipping?.signature || apiBullion.signatureRequired || false,
    },
    status: apiBullion.status || 'active',
    createdAt: apiBullion.createdAt || apiBullion.listedAt || new Date().toISOString(),
    updatedAt: apiBullion.updatedAt || apiBullion.modifiedAt || new Date().toISOString(),
    views: apiBullion.views || 0,
    favorites: apiBullion.favorites || apiBullion.wishlistCount || 0,
  };
};

export const formatWeight = (weight: number, unit: string) => {
  return `${weight} ${unit}`;
};

export const formatPrice = (price: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

export const calculatePremiumPercentage = (price: number, spotPrice: number) => {
  if (spotPrice === 0) return 0;
  return ((price - spotPrice) / spotPrice) * 100;
};

export const getBullionTypeIcon = (type: string) => {
  switch (type) {
    case 'bar': return '🟫';
    case 'coin': return '🪙';
    case 'round': return '⚪';
    case 'ingot': return '🟫';
    case 'wafer': return '🔶';
    default: return '💰';
  }
};

export const getMetalIcon = (metal: string) => {
  switch (metal) {
    case 'gold': return '🥇';
    case 'silver': return '🥈';
    case 'platinum': return '⚪';
    case 'palladium': return '⚫';
    case 'copper': return '🟤';
    case 'rhodium': return '⚪';
    default: return '💎';
  }
};
