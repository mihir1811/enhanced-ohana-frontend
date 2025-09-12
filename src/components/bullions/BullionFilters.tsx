"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface BullionFilterValues {
  type: string[]; // bar, coin, round, etc.
  metal: string[]; // gold, silver, platinum, etc.
  purity: string[]; // 999.9, 925, etc.
  weight: { min: number; max: number };
  weightUnit: string;
  priceRange: { min: number; max: number };
  mint: string[];
  yearRange: { min: number; max: number };
  country: string[];
  condition: string[];
  certification: string[];
  freeShipping: boolean;
  inStock: boolean;
  searchTerm: string;
  companyName: string;
}

interface BullionFiltersProps {
  filters: BullionFilterValues;
  onFiltersChange: (filters: BullionFilterValues) => void;
}

// Expanded filter section component
const Expand: React.FC<{ 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        className="flex items-center justify-between w-full py-3 text-left"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
};

const BullionFilters: React.FC<BullionFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  // Helper function to update specific filter
  const updateFilter = (key: keyof BullionFilterValues, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  // MultiSelectFilter component
  const MultiSelectFilter = ({ 
    options, 
    selectedValues, 
    onChange, 
    label
  }: { 
    options: { value: string; label: string }[]
    selectedValues: string[]
    onChange: (values: string[]) => void
    label: string
  }) => (
    <div className="space-y-3">
      {selectedValues.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
          <span className="text-sm font-medium text-amber-700">
            {selectedValues.length} selected
          </span>
          <button
            onClick={() => onChange([])}
            className="text-xs text-amber-600 underline hover:no-underline"
          >
            Clear all
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border transition-all ${
              selectedValues.includes(option.value) 
                ? 'border-amber-500 bg-amber-50' 
                : 'border-gray-200 bg-gray-50 hover:border-amber-300'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...selectedValues, option.value])
                } else {
                  onChange(selectedValues.filter(v => v !== option.value))
                }
              }}
              className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <span className={`text-sm ${
              selectedValues.includes(option.value) 
                ? 'text-amber-700 font-semibold' 
                : 'text-gray-700'
            }`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  // RangeFilter component
  const RangeFilter = ({ 
    min, 
    max, 
    onChange, 
    label, 
    unit,
    step,
    presets
  }: { 
    min: number
    max: number
    onChange: (min: number, max: number) => void
    label: string
    unit: string
    step: number
    presets: { label: string; min: number; max: number }[]
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700">Current Range:</span>
        <span className="text-xs font-bold text-amber-700">
          {min.toLocaleString()}{unit} - {max.toLocaleString()}{unit}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Min {unit}</label>
          <input
            type="number"
            value={min}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0, max)}
            step={step}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Max {unit}</label>
          <input
            type="number"
            value={max}
            onChange={(e) => onChange(min, parseFloat(e.target.value) || 0)}
            step={step}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>
      
      {presets && presets.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-medium text-gray-600">Quick Select:</span>
          <div className="flex flex-wrap gap-1">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => onChange(preset.min, preset.max)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-amber-100 border border-gray-300 hover:border-amber-300 rounded transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Bullions
        </label>
        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) => updateFilter('searchTerm', e.target.value)}
          placeholder="Search by name, mint, series..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      {/* Price Range */}
      <Expand title="Price Range" defaultOpen>
        <RangeFilter
          min={filters.priceRange.min}
          max={filters.priceRange.max}
          onChange={(min, max) => updateFilter('priceRange', { min, max })}
          label="Price"
          unit="$"
          step={10}
          presets={[
            { label: 'Under $100', min: 0, max: 100 },
            { label: '$100 - $500', min: 100, max: 500 },
            { label: '$500 - $1,000', min: 500, max: 1000 },
            { label: '$1,000 - $5,000', min: 1000, max: 5000 },
            { label: '$5,000+', min: 5000, max: 50000 },
          ]}
        />
      </Expand>

      {/* Metal Type */}
      <Expand title="Metal Type" defaultOpen>
        <MultiSelectFilter
          options={[
            { value: 'gold', label: 'Gold' },
            { value: 'silver', label: 'Silver' },
            { value: 'platinum', label: 'Platinum' },
            { value: 'palladium', label: 'Palladium' },
            { value: 'copper', label: 'Copper' },
            { value: 'rhodium', label: 'Rhodium' },
          ]}
          selectedValues={filters.metal}
          onChange={(values) => updateFilter('metal', values)}
          label="Select Metals"
        />
      </Expand>

      {/* Bullion Type */}
      <Expand title="Type" defaultOpen>
        <MultiSelectFilter
          options={[
            { value: 'bar', label: 'Bar' },
            { value: 'coin', label: 'Coin' },
            { value: 'round', label: 'Round' },
            { value: 'ingot', label: 'Ingot' },
            { value: 'wafer', label: 'Wafer' },
          ]}
          selectedValues={filters.type}
          onChange={(values) => updateFilter('type', values)}
          label="Select Types"
        />
      </Expand>

      {/* Weight Range */}
      <Expand title="Weight">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Weight Unit
            </label>
            <select
              value={filters.weightUnit}
              onChange={(e) => updateFilter('weightUnit', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="oz">Troy Ounces</option>
              <option value="g">Grams</option>
              <option value="kg">Kilograms</option>
              <option value="dwt">Pennyweight</option>
            </select>
          </div>
          <RangeFilter
            min={filters.weight.min}
            max={filters.weight.max}
            onChange={(min, max) => updateFilter('weight', { min, max })}
            label="Weight"
            unit={filters.weightUnit === 'oz' ? 'oz' : filters.weightUnit}
            step={filters.weightUnit === 'oz' ? 0.1 : 1}
            presets={
              filters.weightUnit === 'oz' 
                ? [
                    { label: '1/10 oz', min: 0.1, max: 0.1 },
                    { label: '1/4 oz', min: 0.25, max: 0.25 },
                    { label: '1/2 oz', min: 0.5, max: 0.5 },
                    { label: '1 oz', min: 1, max: 1 },
                    { label: '5+ oz', min: 5, max: 100 },
                  ]
                : [
                    { label: '1-10g', min: 1, max: 10 },
                    { label: '10-50g', min: 10, max: 50 },
                    { label: '50-100g', min: 50, max: 100 },
                    { label: '100g+', min: 100, max: 1000 },
                  ]
            }
          />
        </div>
      </Expand>

      {/* Purity */}
      <Expand title="Purity">
        <MultiSelectFilter
          options={[
            { value: '999.9', label: '.9999 Fine (99.99%)' },
            { value: '999.0', label: '.999 Fine (99.9%)' },
            { value: '958.3', label: '.9583 Fine (95.83%)' },
            { value: '925.0', label: '.925 Sterling (92.5%)' },
            { value: '900.0', label: '.900 Fine (90%)' },
            { value: '835.0', label: '.835 Fine (83.5%)' },
          ]}
          selectedValues={filters.purity}
          onChange={(values) => updateFilter('purity', values)}
          label="Select Purity Levels"
        />
      </Expand>

      {/* Mint/Manufacturer */}
      <Expand title="Mint / Manufacturer">
        <MultiSelectFilter
          options={[
            { value: 'royal-canadian-mint', label: 'Royal Canadian Mint' },
            { value: 'perth-mint', label: 'Perth Mint' },
            { value: 'us-mint', label: 'US Mint' },
            { value: 'royal-mint', label: 'Royal Mint' },
            { value: 'pamp', label: 'PAMP Suisse' },
            { value: 'sunshine', label: 'Sunshine Mint' },
            { value: 'engelhard', label: 'Engelhard' },
            { value: 'johnson-matthey', label: 'Johnson Matthey' },
            { value: 'apmex', label: 'APMEX' },
            { value: 'credit-suisse', label: 'Credit Suisse' },
          ]}
          selectedValues={filters.mint}
          onChange={(values) => updateFilter('mint', values)}
          label="Select Mints"
        />
      </Expand>

      {/* Year Range */}
      <Expand title="Year">
        <RangeFilter
          min={filters.yearRange.min}
          max={filters.yearRange.max}
          onChange={(min, max) => updateFilter('yearRange', { min, max })}
          label="Production Year"
          unit=""
          step={1}
          presets={[
            { label: '2024', min: 2024, max: 2024 },
            { label: '2023', min: 2023, max: 2023 },
            { label: '2020-2024', min: 2020, max: 2024 },
            { label: '2010-2019', min: 2010, max: 2019 },
            { label: 'Before 2010', min: 1900, max: 2009 },
          ]}
        />
      </Expand>

      {/* Country of Origin */}
      <Expand title="Country">
        <MultiSelectFilter
          options={[
            { value: 'canada', label: 'Canada' },
            { value: 'usa', label: 'United States' },
            { value: 'australia', label: 'Australia' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'switzerland', label: 'Switzerland' },
            { value: 'south-africa', label: 'South Africa' },
            { value: 'mexico', label: 'Mexico' },
            { value: 'china', label: 'China' },
            { value: 'austria', label: 'Austria' },
            { value: 'germany', label: 'Germany' },
          ]}
          selectedValues={filters.country}
          onChange={(values) => updateFilter('country', values)}
          label="Select Countries"
        />
      </Expand>

      {/* Condition */}
      <Expand title="Condition">
        <MultiSelectFilter
          options={[
            { value: 'BU', label: 'Brilliant Uncirculated (BU)' },
            { value: 'Proof', label: 'Proof' },
            { value: 'MS70', label: 'MS-70 Perfect' },
            { value: 'MS69', label: 'MS-69 Near Perfect' },
            { value: 'Uncirculated', label: 'Uncirculated' },
            { value: 'Circulated', label: 'Circulated' },
          ]}
          selectedValues={filters.condition}
          onChange={(values) => updateFilter('condition', values)}
          label="Select Conditions"
        />
      </Expand>

      {/* Certification */}
      <Expand title="Certification">
        <MultiSelectFilter
          options={[
            { value: 'NGC', label: 'NGC (Numismatic Guaranty Company)' },
            { value: 'PCGS', label: 'PCGS (Professional Coin Grading Service)' },
            { value: 'ANACS', label: 'ANACS' },
            { value: 'ICG', label: 'ICG (Independent Coin Graders)' },
            { value: 'PMG', label: 'PMG (Paper Money Guaranty)' },
            { value: 'Uncertified', label: 'Uncertified' },
          ]}
          selectedValues={filters.certification}
          onChange={(values) => updateFilter('certification', values)}
          label="Select Certifications"
        />
      </Expand>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seller Company
        </label>
        <input
          type="text"
          value={filters.companyName}
          onChange={(e) => updateFilter('companyName', e.target.value)}
          placeholder="Search by company name..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      {/* Additional Options */}
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="freeShipping"
            checked={filters.freeShipping}
            onChange={(e) => updateFilter('freeShipping', e.target.checked)}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
          />
          <label htmlFor="freeShipping" className="ml-2 text-sm text-gray-700">
            Free Shipping
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="inStock"
            checked={filters.inStock}
            onChange={(e) => updateFilter('inStock', e.target.checked)}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
          />
          <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
            In Stock Only
          </label>
        </div>
      </div>
    </div>
  );
};

export default BullionFilters;
