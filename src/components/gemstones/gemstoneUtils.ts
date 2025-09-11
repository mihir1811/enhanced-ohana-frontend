import { GemstoneFilterValues } from './GemstoneFilters';

export const getDefaultGemstoneFilters = (gemstoneType: 'single' | 'melee'): GemstoneFilterValues => {
  const baseFilters: GemstoneFilterValues = {
    gemType: [],
    variety: [],
    color: [],
    shape: [],
    caratWeight: { min: 0.1, max: 50 },
    priceRange: { min: 0, max: 100000 },
    origin: [],
    treatment: [],
    clarity: [],
    cut: [],
    certification: [],
    reportNumber: '',
    searchTerm: '',
    enhancement: [],
    transparency: [],
    luster: [],
    phenomena: [],
    companyName: '',
    // vendorLocation: ''
  };

  // Adjust filters based on gemstone type
  if (gemstoneType === 'melee') {
    // For melee gemstones, typically smaller carat weights
    baseFilters.caratWeight = { min: 0.01, max: 5 };
  } else if (gemstoneType === 'single') {
    // For single gemstones, typically larger carat weights
    baseFilters.caratWeight = { min: 0.5, max: 50 };
  }

  return baseFilters;
};

export const transformApiGemstone = (apiGemstone: any) => {
  // Transform API gemstone data to match our component interface if needed
  return {
    ...apiGemstone,
    // Add any transformations needed
  };
};
