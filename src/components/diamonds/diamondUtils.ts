import { DiamondFilterValues } from './DiamondFilters';
import { Diamond } from './DiamondResults';

// Interface for API diamond data
interface ApiDiamondData {
  id: string | number;
  shape?: string;
  caratWeight?: string | number;
  color?: string;
  clarity?: string;
  cut?: string;
  price?: string | number;
  certification?: string;
  certificateNumber?: string | number;
  fluorescence?: string;
  polish?: string;
  symmetry?: string;
  measurement?: string;
  table?: string | number;
  depth?: string | number;
  gridleMin?: string | number;
  culetSize?: string | number;
  origin?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  videoURL?: string;
  isSold?: boolean;
  createdAt?: string;
  updatedAt?: string;
  seller?: {
    id: string | number;
    sellerType?: string;
    companyName?: string;
    companyLogo?: string;
  };
  sellerId?: string;
  sellerSKU?: string;
  stockNumber?: string | number;
}

// Default filter values for each diamond type
export function getDefaultDiamondFilters(diamondType: 'natural-single' | 'natural-melee' | 'lab-grown-single' | 'lab-grown-melee'): DiamondFilterValues {
  return {
    shape: [],
    caratWeight: { min: diamondType.includes('melee') ? 0.001 : 0.30, max: diamondType.includes('melee') ? 0.30 : 10 },
    color: [],
    clarity: [],
    cut: [],
    priceRange: { min: 0, max: 100000 },
    certification: [],
    fluorescence: [],
    polish: [],
    symmetry: [],
    location: [],
    measurements: {
      length: { min: 0, max: 20 },
      width: { min: 0, max: 20 },
      depth: { min: 0, max: 15 },
    },
    tablePercent: { min: 50, max: 70 },
    depthPercent: { min: 55, max: 75 },
    girdle: [],
    culet: [],
    origin: [],
    treatment: [],
    pricePerCarat: { min: 0, max: 10000 },
  };
}

// Transform API diamond to UI Diamond type
export function transformApiDiamond(apiDiamond: ApiDiamondData): Diamond {
  let length = 0, width = 0, depth = 0;
  if (typeof apiDiamond.measurement === 'string') {
    const parts = apiDiamond.measurement.split(/x|X|\*/).map(Number);
    if (parts.length === 3) [length, width, depth] = parts;
  }
  return {
    id: String(apiDiamond.id),
    shape: apiDiamond.shape,
    caratWeight: Number(apiDiamond.caratWeight),
    color: apiDiamond.color,
    clarity: apiDiamond.clarity,
    cut: apiDiamond.cut,
    price: Number(apiDiamond.price),
    certification: apiDiamond.certification,
    // reportNumber: apiDiamond.certificateNumber,
    fluorescence: apiDiamond.fluorescence,
    polish: apiDiamond.polish,
    symmetry: apiDiamond.symmetry,
    measurement: `${length} x ${width} x ${depth}`,
    table: Number(apiDiamond.table) || 0,
    depth: Number(apiDiamond.depth) || 0,
    gridleMin: apiDiamond.gridleMin,
    culetSize: apiDiamond.culetSize,
    origin: apiDiamond.origin,
    images: [
      apiDiamond.image1,
      apiDiamond.image2,
      apiDiamond.image3,
      apiDiamond.image4,
      apiDiamond.image5,
      apiDiamond.image6,
    ].filter((img): img is string => Boolean(img)),
    videoURL: apiDiamond.videoURL,
    isSold: apiDiamond.isSold,
    createdAt: apiDiamond.createdAt || new Date().toISOString(),
    updatedAt: apiDiamond.updatedAt || new Date().toISOString(),
    // Add all seller fields for UI
    seller: apiDiamond.seller
      ? {
          id: String(apiDiamond.seller.id),
          sellerType: apiDiamond.seller.sellerType,
          companyName: apiDiamond.seller.companyName,
          companyLogo: apiDiamond.seller.companyLogo,
        }
      : undefined,
    sellerId: apiDiamond.sellerId,
    sellerSKU: apiDiamond.sellerSKU,
    stockNumber: apiDiamond.stockNumber,
  };
}
