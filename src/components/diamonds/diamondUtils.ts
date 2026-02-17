import { DiamondFilterValues } from './DiamondFilters';
import { Diamond } from './DiamondResults';

// Interface for API diamond data
export interface ApiDiamondData {
  id: string | number;
  sellerId?: string;
  stockNumber?: string | number;
  sellerSKU?: string;
  name?: string;
  description?: string;
  origin?: string;
  rap?: string | number;
  price?: string | number;
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
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  videoURL?: string;
  stoneType?: string;
  process?: string;
  certificateCompanyName?: string;
  isOnAuction?: boolean;
  isSold?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  auctionStartTime?: string | null;
  auctionEndTime?: string | null;
  colorFrom?: string;
  colorTo?: string;
  clarityMin?: string;
  clarityMax?: string;
  totalPcs?: string | number;
  caratWeightPerpcs?: string | number;
  totalCaratWeight?: string | number;
  pricePerCarat?: string | number;
  pricePerPcs?: string | number;
  totalPrice?: string | number;
  sieveSizeMin?: string | number;
  sieveSizeMax?: string | number;
  measurementMin?: string | number;
  measurementMax?: string | number;
  fluoreScenceFrom?: string;
  fluoreScenceTo?: string;
  shadeFrom?: string;
  shadeTo?: string;
  cutFrom?: string;
  cutTo?: string;
  symmetryFrom?: string;
  symmetryTo?: string;
  polishFrom?: string;
  polishTo?: string;
  fancyColorFrom?: string;
  fancyColorTo?: string;
  fancyIntencityFrom?: string;
  fancyIntencityTo?: string;
  seller?: {
    id: string | number;
    userId?: string;
    sellerType?: string;
    companyName?: string;
    companyLogo?: string;
  };
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
    fancyColor: [],
    fancyIntensity: [],
    fancyOvertone: [],
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
    sellerId: apiDiamond.sellerId,
    stockNumber: apiDiamond.stockNumber,
    sellerSKU: apiDiamond.sellerSKU,
    name: apiDiamond.name,
    description: apiDiamond.description,
    origin: apiDiamond.origin,
    rap: apiDiamond.rap,
    price: Number(apiDiamond.price) || 0,
    discount: apiDiamond.discount,
    caratWeight: Number(apiDiamond.caratWeight) || 0,
    cut: apiDiamond.cut,
    color: apiDiamond.color,
    shade: apiDiamond.shade,
    fancyColor: apiDiamond.fancyColor,
    fancyIntencity: apiDiamond.fancyIntencity,
    fancyOvertone: apiDiamond.fancyOvertone,
    shape: apiDiamond.shape,
    symmetry: apiDiamond.symmetry,
    diameter: apiDiamond.diameter,
    clarity: apiDiamond.clarity,
    fluorescence: apiDiamond.fluorescence,
    measurement: apiDiamond.measurement || `${length} x ${width} x ${depth}`,
    ratio: apiDiamond.ratio,
    table: Number(apiDiamond.table) || 0,
    depth: Number(apiDiamond.depth) || 0,
    gridleMin: apiDiamond.gridleMin,
    gridleMax: apiDiamond.gridleMax,
    gridlePercentage: apiDiamond.gridlePercentage,
    crownHeight: apiDiamond.crownHeight,
    crownAngle: apiDiamond.crownAngle,
    pavilionAngle: apiDiamond.pavilionAngle,
    pavilionDepth: apiDiamond.pavilionDepth,
    culetSize: apiDiamond.culetSize,
    polish: apiDiamond.polish,
    treatment: apiDiamond.treatment,
    inscription: apiDiamond.inscription,
    certification: apiDiamond.certification,
    certificateNumber: apiDiamond.certificateNumber,
    images: [
      apiDiamond.image1,
      apiDiamond.image2,
      apiDiamond.image3,
      apiDiamond.image4,
      apiDiamond.image5,
      apiDiamond.image6,
    ].filter((img): img is string => Boolean(img)),
    videoURL: apiDiamond.videoURL,
    stoneType: apiDiamond.stoneType,
    process: apiDiamond.process,
    certificateCompanyName: apiDiamond.certificateCompanyName,
    isOnAuction: apiDiamond.isOnAuction,
    isSold: apiDiamond.isSold,
    isDeleted: apiDiamond.isDeleted,
    createdAt: apiDiamond.createdAt || new Date().toISOString(),
    updatedAt: apiDiamond.updatedAt || new Date().toISOString(),
    auctionStartTime: apiDiamond.auctionStartTime,
    auctionEndTime: apiDiamond.auctionEndTime,
    // Melee specific fields
    colorFrom: apiDiamond.colorFrom,
    colorTo: apiDiamond.colorTo,
    clarityMin: apiDiamond.clarityMin,
    clarityMax: apiDiamond.clarityMax,
    totalPcs: apiDiamond.totalPcs,
    caratWeightPerpcs: apiDiamond.caratWeightPerpcs,
    totalCaratWeight: apiDiamond.totalCaratWeight,
    pricePerCarat: apiDiamond.pricePerCarat,
    pricePerPcs: apiDiamond.pricePerPcs,
    totalPrice: apiDiamond.totalPrice,
    sieveSizeMin: apiDiamond.sieveSizeMin,
    sieveSizeMax: apiDiamond.sieveSizeMax,
    measurementMin: apiDiamond.measurementMin,
    measurementMax: apiDiamond.measurementMax,
    fluoreScenceFrom: apiDiamond.fluoreScenceFrom,
    fluoreScenceTo: apiDiamond.fluoreScenceTo,
    shadeFrom: apiDiamond.shadeFrom,
    shadeTo: apiDiamond.shadeTo,
    cutFrom: apiDiamond.cutFrom,
    cutTo: apiDiamond.cutTo,
    symmetryFrom: apiDiamond.symmetryFrom,
    symmetryTo: apiDiamond.symmetryTo,
    polishFrom: apiDiamond.polishFrom,
    polishTo: apiDiamond.polishTo,
    fancyColorFrom: apiDiamond.fancyColorFrom,
    fancyColorTo: apiDiamond.fancyColorTo,
    fancyIntencityFrom: apiDiamond.fancyIntencityFrom,
    fancyIntencityTo: apiDiamond.fancyIntencityTo,
    seller: apiDiamond.seller
      ? {
          id: String(apiDiamond.seller.id),
          userId: apiDiamond.seller.userId,
          sellerType: apiDiamond.seller.sellerType,
          companyName: apiDiamond.seller.companyName,
          companyLogo: apiDiamond.seller.companyLogo,
        }
      : undefined,
  };
}
