import { useState } from 'react';

export interface GemstoneFilterValues {
  type: string[];
  variety: string[];
  color: string[];
  shape: string[];
  caratWeight: { min: number; max: number };
  priceRange: { min: number; max: number };
  origin: string[];
  treatment: string[];
  clarity: string[];
  cut: string[];
  certification: string[];
  reportNumber: string;
  searchTerm: string;
  enhancement: string[];
  transparency: string[];
  luster: string[];
  phenomena: string[];
  companyName: string;
  vendorLocation: string;
}

interface GemstoneFiltersProps {
  filters: GemstoneFilterValues;
  onFiltersChange: (filters: GemstoneFilterValues) => void;
  className?: string;
}

const GEMSTONE_TYPES = [
  'Ruby', 'Sapphire', 'Emerald', 'Spinel', 'Tourmaline', 'Garnet', 'Topaz', 'Aquamarine', 'Tanzanite', 'Opal', 'Peridot', 'Amethyst', 'Citrine', 'Morganite', 'Zircon', 'Alexandrite', 'Other'
];

const GEMSTONE_COLORS = [
  'Red', 'Pink', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Violet', 'Brown', 'Black', 'White', 'Colorless', 'Multi-color'
];

const GEMSTONE_SHAPES = [
  'Oval', 'Round', 'Cushion', 'Pear', 'Emerald', 'Marquise', 'Heart', 'Princess', 'Trillion', 'Octagon', 'Cabochon', 'Other'
];

const GEMSTONE_CLARITY = [
  'IF', 'VVS', 'VS', 'SI', 'I', 'Translucent', 'Opaque', 'Eye Clean', 'Included', 'Other'
];

const GEMSTONE_CUTS = [
  'Excellent', 'Very Good', 'Good', 'Fair', 'Poor', 'Cabochon', 'Step', 'Brilliant', 'Mixed', 'Rose', 'Other'
];

const GEMSTONE_TREATMENTS = [
  'None', 'Heated', 'Oiled', 'Irradiated', 'Diffused', 'Fracture Filled', 'Dyed', 'Bleached', 'Coated', 'Other'
];

const GEMSTONE_CERTIFICATIONS = [
  'GIA', 'IGI', 'Gübelin', 'SSEF', 'GRS', 'AGL', 'GIT', 'NGTC', 'Other'
];

const GEMSTONE_ENHANCEMENTS = [
  'None', 'Heat', 'Oil', 'Resin', 'Lead Glass', 'Surface Diffusion', 'Other'
];

const GEMSTONE_TRANSPARENCY = [
  'Transparent', 'Translucent', 'Opaque'
];

const GEMSTONE_LUSTER = [
  'Vitreous', 'Resinous', 'Greasy', 'Silky', 'Pearly', 'Adamantine', 'Dull', 'Other'
];

const GEMSTONE_PHENOMENA = [
  'Asterism', 'Chatoyancy', 'Color Change', 'Play-of-Color', 'Adularescence', 'Iridescence', 'Labradorescence', 'Other'
];

const GEMSTONE_ORIGINS = [
  'Burma', 'Sri Lanka', 'Madagascar', 'Mozambique', 'Colombia', 'Brazil', 'Thailand', 'Tanzania', 'Afghanistan', 'Pakistan', 'Zambia', 'Other'
];

export default function GemstoneFilters({ filters, onFiltersChange, className = '' }: GemstoneFiltersProps) {
  // For brevity, only a simple UI skeleton is provided. You can expand with grouped, collapsible cards as in DiamondFilters.
  return (
    <div className={`bg-white border-2 rounded-xl shadow-lg p-6 ${className}`}>
      <h2 className="font-bold text-xl mb-4">Gemstone Filters</h2>
      {/* Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Type</label>
        <select
          multiple
          value={filters.type}
          onChange={e => onFiltersChange({ ...filters, type: Array.from(e.target.selectedOptions, o => o.value) })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
        >
          {GEMSTONE_TYPES.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {/* Color */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Color</label>
        <select
          multiple
          value={filters.color}
          onChange={e => onFiltersChange({ ...filters, color: Array.from(e.target.selectedOptions, o => o.value) })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
        >
          {GEMSTONE_COLORS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {/* Shape */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Shape</label>
        <select
          multiple
          value={filters.shape}
          onChange={e => onFiltersChange({ ...filters, shape: Array.from(e.target.selectedOptions, o => o.value) })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
        >
          {GEMSTONE_SHAPES.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {/* Carat Weight */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Carat Weight</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.caratWeight.min}
            onChange={e => onFiltersChange({ ...filters, caratWeight: { ...filters.caratWeight, min: parseFloat(e.target.value) || 0 } })}
            className="w-1/2 px-4 py-2 border-2 rounded-lg text-sm"
            placeholder="Min"
          />
          <input
            type="number"
            value={filters.caratWeight.max}
            onChange={e => onFiltersChange({ ...filters, caratWeight: { ...filters.caratWeight, max: parseFloat(e.target.value) || 0 } })}
            className="w-1/2 px-4 py-2 border-2 rounded-lg text-sm"
            placeholder="Max"
          />
        </div>
      </div>
      {/* Price Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Price Range (USD)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.priceRange.min}
            onChange={e => onFiltersChange({ ...filters, priceRange: { ...filters.priceRange, min: parseFloat(e.target.value) || 0 } })}
            className="w-1/2 px-4 py-2 border-2 rounded-lg text-sm"
            placeholder="Min"
          />
          <input
            type="number"
            value={filters.priceRange.max}
            onChange={e => onFiltersChange({ ...filters, priceRange: { ...filters.priceRange, max: parseFloat(e.target.value) || 0 } })}
            className="w-1/2 px-4 py-2 border-2 rounded-lg text-sm"
            placeholder="Max"
          />
        </div>
      </div>
      {/* Origin */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Origin</label>
        <select
          multiple
          value={filters.origin}
          onChange={e => onFiltersChange({ ...filters, origin: Array.from(e.target.selectedOptions, o => o.value) })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
        >
          {GEMSTONE_ORIGINS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {/* Treatment */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Treatment</label>
        <select
          multiple
          value={filters.treatment}
          onChange={e => onFiltersChange({ ...filters, treatment: Array.from(e.target.selectedOptions, o => o.value) })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
        >
          {GEMSTONE_TREATMENTS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {/* Clarity */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Clarity</label>
        <select
          multiple
          value={filters.clarity}
          onChange={e => onFiltersChange({ ...filters, clarity: Array.from(e.target.selectedOptions, o => o.value) })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
        >
          {GEMSTONE_CLARITY.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {/* Cut */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Cut</label>
        <select
          multiple
          value={filters.cut}
          onChange={e => onFiltersChange({ ...filters, cut: Array.from(e.target.selectedOptions, o => o.value) })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
        >
          {GEMSTONE_CUTS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {/* Certification */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Certification</label>
        <select
          multiple
          value={filters.certification}
          onChange={e => onFiltersChange({ ...filters, certification: Array.from(e.target.selectedOptions, o => o.value) })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
        >
          {GEMSTONE_CERTIFICATIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {/* Enhancement */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Enhancement</label>
        <select
          multiple
          value={filters.enhancement}
          onChange={e => onFiltersChange({ ...filters, enhancement: Array.from(e.target.selectedOptions, o => o.value) })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
        >
          {GEMSTONE_ENHANCEMENTS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {/* Transparency */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Transparency</label>
        <select
          multiple
          value={filters.transparency}
          onChange={e => onFiltersChange({ ...filters, transparency: Array.from(e.target.selectedOptions, o => o.value) })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
        >
          {GEMSTONE_TRANSPARENCY.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {/* Luster */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Luster</label>
        <select
          multiple
          value={filters.luster}
          onChange={e => onFiltersChange({ ...filters, luster: Array.from(e.target.selectedOptions, o => o.value) })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
        >
          {GEMSTONE_LUSTER.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {/* Phenomena */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Phenomena</label>
        <select
          multiple
          value={filters.phenomena}
          onChange={e => onFiltersChange({ ...filters, phenomena: Array.from(e.target.selectedOptions, o => o.value) })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
        >
          {GEMSTONE_PHENOMENA.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {/* Company Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Company Name</label>
        <input
          type="text"
          value={filters.companyName}
          onChange={e => onFiltersChange({ ...filters, companyName: e.target.value })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
          placeholder="Enter company name"
        />
      </div>
      {/* Vendor Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Vendor Location</label>
        <input
          type="text"
          value={filters.vendorLocation}
          onChange={e => onFiltersChange({ ...filters, vendorLocation: e.target.value })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
          placeholder="Enter vendor location"
        />
      </div>
      {/* Report Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Report Number</label>
        <input
          type="text"
          value={filters.reportNumber}
          onChange={e => onFiltersChange({ ...filters, reportNumber: e.target.value })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
          placeholder="Enter report number"
        />
      </div>
      {/* Search Term */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Search</label>
        <input
          type="text"
          value={filters.searchTerm}
          onChange={e => onFiltersChange({ ...filters, searchTerm: e.target.value })}
          className="w-full px-4 py-2 border-2 rounded-lg text-sm"
          placeholder="Search gemstones..."
        />
      </div>
    </div>
  );
}
