import { DiamondFilterValues } from './DiamondFilters';
import { Diamond } from './DiamondResults';

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
    milkyness: [],
    matching: null,
    pricePerCarat: { min: 0, max: 10000 },
    availability: [],
    delivery: [],
    brilliance: [],
    fire: [],
    scintillation: [],
    grownMethod: [],
    searchTerm: '',
    reportNumber: '',
    stoneId: '',
  };
}

// Transform API diamond to UI Diamond type
export function transformApiDiamond(apiDiamond: any): Diamond {
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
    reportNumber: apiDiamond.certificateNumber,
    fluorescence: apiDiamond.fluorescence,
    polish: apiDiamond.polish,
    symmetry: apiDiamond.symmetry,
    measurements: { length, width, depth },
    tablePercent: Number(apiDiamond.table) || 0,
    depthPercent: Number(apiDiamond.depth) || 0,
    girdle: apiDiamond.gridleMin,
    culet: apiDiamond.culetSize,
    location: apiDiamond.origin,
    supplier: {
      name: apiDiamond.sellerSKU || 'Unknown',
      verified: true,
      rating: 0,
    },
    images: [
      apiDiamond.image1,
      apiDiamond.image2,
      apiDiamond.image3,
      apiDiamond.image4,
      apiDiamond.image5,
      apiDiamond.image6,
    ].filter(Boolean),
    video: apiDiamond.videoURL,
    availability: apiDiamond.isSold ? 'sold' : 'available',
    createdAt: apiDiamond.createdAt,
    updatedAt: apiDiamond.updatedAt,
  };
}
