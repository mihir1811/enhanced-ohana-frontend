import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

// CSS styles for custom range slider
const sliderStyles = `
  .slider-thumb::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #f59e0b;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    position: relative;
    z-index: 3;
  }
  
  .slider-thumb::-webkit-slider-thumb:hover {
    border-color: #d97706;
    transform: scale(1.1);
    transition: all 0.2s ease;
  }
  
  .slider-thumb::-moz-range-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #f59e0b;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  .slider-thumb::-moz-range-thumb:hover {
    border-color: #d97706;
    transform: scale(1.1);
  }
  
  .slider-thumb::-webkit-slider-track {
    background: transparent;
  }
  
  .slider-thumb::-moz-range-track {
    background: transparent;
    border: none;
  }

  .slider-thumb:focus {
    outline: none;
  }
  
  .slider-thumb:focus::-webkit-slider-thumb {
    ring: 2px solid #f59e0b;
    ring-opacity: 0.5;
  }
`;

// Gemstone icons mapping
const gemstoneIcons: { [key: string]: string } = {
  'Ruby': '💎',
  'Sapphire': '🔷',
  'Emerald': '💚',
  'Spinel': '✨',
  'Tourmaline': '🌈',
  'Garnet': '🔴',
  'Topaz': '🟡',
  'Aquamarine': '💙',
  'Tanzanite': '🟣',
  'Opal': '🌟',
  'Peridot': '🟢',
  'Amethyst': '🟣',
  'Citrine': '🟨',
  'Morganite': '🩷',
  'Zircon': '💎',
  'Alexandrite': '🔮',
  'Other': '⚪'
};

const gemstoneTypes = [
  'Ruby', 'Sapphire', 'Emerald', 'Spinel', 'Tourmaline', 'Garnet', 
  'Topaz', 'Aquamarine', 'Tanzanite', 'Opal', 'Peridot', 'Amethyst', 
  'Citrine', 'Morganite', 'Zircon', 'Alexandrite', 'Other'
];

// Filter Component
interface FilterConfig {
  key: string;
  label: React.ReactNode;
  type: 'checkbox' | 'radio' | 'slider';
  options?: string[] | { value: string; label: string }[];
  renderOption?: (option: string) => React.ReactNode;
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    showInputs?: boolean;
    inputSuffix?: string;
    formatter?: (value: number) => string;
    tooltipFormatter?: (value: number) => string;
    defaultValue?: [number, number];
    minLabel?: string;
    maxLabel?: string;
  };
}

// Type for filter values - can be array of strings, single string, or array of numbers
type FilterValue = string[] | string | [number, number];

// Type for the values object containing all filter values
type FilterValues = Record<string, FilterValue>;

interface AdvancedFilterComponentProps {
  filters: FilterConfig[];
  values: FilterValues;
  onChange: (key: string, value: FilterValue) => void;
  onReset: () => void;
}

// Collapsible section component
function FilterSection({ 
  title, 
  children, 
  defaultOpen = true 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean; 
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        className="w-full flex items-center justify-between py-3 text-left font-medium text-sm focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="dark:text-white">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
}

// Checkbox filter component
function CheckboxFilter({ 
  options, 
  value, 
  onChange, 
  renderOption 
}: { 
  options: string[] | { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  renderOption?: (option: string) => React.ReactNode;
}) {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter(v => v !== optionValue));
    }
  };

  return (
    <div className="space-y-2">
      {options.map((option) => {
        const optionValue = typeof option === 'string' ? option : option.value;
        const optionLabel = typeof option === 'string' ? option : option.label;
        
        return (
          <label key={optionValue} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(optionValue)}
              onChange={(e) => handleChange(optionValue, e.target.checked)}
              className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm dark:text-white">
              {renderOption ? renderOption(optionValue) : optionLabel}
            </span>
          </label>
        );
      })}
    </div>
  );
}

// Radio filter component
function RadioFilter({ 
  options, 
  value, 
  onChange 
}: { 
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="radio-filter"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="border-gray-300 text-amber-600 focus:ring-amber-500"
          />
          <span className="text-sm dark:text-white">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

// Slider filter component
function SliderFilter({ 
  config, 
  value, 
  onChange 
}: { 
  config: FilterConfig['sliderConfig'];
  value: [number, number];
  onChange: (value: [number, number]) => void;
}) {
  if (!config) return null;

  const [minValue, maxValue] = value;

  const handleMinChange = (newMin: number) => {
    const clampedMin = Math.max(config.min, Math.min(newMin, maxValue));
    onChange([clampedMin, maxValue]);
  };

  const handleMaxChange = (newMax: number) => {
    const clampedMax = Math.min(config.max, Math.max(newMax, minValue));
    onChange([minValue, clampedMax]);
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    if (config.inputSuffix === '$') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    return config.formatter ? config.formatter(value) : `${value}${config.inputSuffix || ''}`;
  };

  const parseCurrencyInput = (inputValue: string) => {
    // Remove currency symbols and commas for parsing
    const numericValue = inputValue.replace(/[$,]/g, '');
    return parseFloat(numericValue) || 0;
  };

  // Calculate percentages for visual representation
  const minPercent = ((minValue - config.min) / (config.max - config.min)) * 100;
  const maxPercent = ((maxValue - config.min) / (config.max - config.min)) * 100;

  return (
    <div className="space-y-4">
      {/* Input fields */}
      {config.showInputs && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
              {config.inputSuffix === '$' ? 'Minimum Price' : `Min ${config.inputSuffix ? `(${config.inputSuffix})` : ''}`}
            </label>
            <div className="relative">
              <input
                type="text"
                value={config.inputSuffix === '$' ? `$${minValue.toLocaleString()}` : minValue.toString()}
                onChange={(e) => {
                  const value = config.inputSuffix === '$' ? 
                    parseCurrencyInput(e.target.value) : 
                    parseFloat(e.target.value) || config.min;
                  handleMinChange(value);
                }}
                onBlur={(e) => {
                  // Ensure valid formatting on blur
                  const value = config.inputSuffix === '$' ? 
                    parseCurrencyInput(e.target.value) : 
                    parseFloat(e.target.value) || config.min;
                  handleMinChange(Math.max(config.min, Math.min(value, config.max)));
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                         transition-all duration-200"
                placeholder={config.inputSuffix === '$' ? '$0' : `${config.min}`}
              />
              {config.inputSuffix && config.inputSuffix !== '$' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">
                  {config.inputSuffix}
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
              {config.inputSuffix === '$' ? 'Maximum Price' : `Max ${config.inputSuffix ? `(${config.inputSuffix})` : ''}`}
            </label>
            <div className="relative">
              <input
                type="text"
                value={config.inputSuffix === '$' ? `$${maxValue.toLocaleString()}` : maxValue.toString()}
                onChange={(e) => {
                  const value = config.inputSuffix === '$' ? 
                    parseCurrencyInput(e.target.value) : 
                    parseFloat(e.target.value) || config.max;
                  handleMaxChange(value);
                }}
                onBlur={(e) => {
                  // Ensure valid formatting on blur
                  const value = config.inputSuffix === '$' ? 
                    parseCurrencyInput(e.target.value) : 
                    parseFloat(e.target.value) || config.max;
                  handleMaxChange(Math.max(config.min, Math.min(value, config.max)));
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                         transition-all duration-200"
                placeholder={config.inputSuffix === '$' ? `$${config.max.toLocaleString()}` : `${config.max}`}
              />
              {config.inputSuffix && config.inputSuffix !== '$' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">
                  {config.inputSuffix}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Custom dual-range slider */}
      <div className="px-1 py-4">
        <div className="relative h-2">
          {/* Background track */}
          <div className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          
          {/* Active range track */}
          <div 
            className="absolute h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`
            }}
          ></div>
          
          {/* Min range input */}
          <input
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={minValue}
            onChange={(e) => handleMinChange(parseFloat(e.target.value))}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
            style={{ zIndex: 1 }}
          />
          
          {/* Max range input */}
          <input
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={maxValue}
            onChange={(e) => handleMaxChange(parseFloat(e.target.value))}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
            style={{ zIndex: 2 }}
          />
          
          {/* Min thumb */}
          <div 
            className="absolute w-5 h-5 bg-white border-2 border-amber-500 rounded-full shadow-lg cursor-pointer
                     transform -translate-x-1/2 -translate-y-1/2 top-1/2
                     hover:border-amber-600 transition-colors duration-200"
            style={{ left: `${minPercent}%`, zIndex: 3 }}
          ></div>
          
          {/* Max thumb */}
          <div 
            className="absolute w-5 h-5 bg-white border-2 border-amber-500 rounded-full shadow-lg cursor-pointer
                     transform -translate-x-1/2 -translate-y-1/2 top-1/2
                     hover:border-amber-600 transition-colors duration-200"
            style={{ left: `${maxPercent}%`, zIndex: 3 }}
          ></div>
        </div>
        
        {/* Range labels */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-3 px-1">
          <span className="font-medium">
            {formatCurrency(minValue)}
          </span>
          <span className="font-medium">
            {formatCurrency(maxValue)}
          </span>
        </div>
        
        {/* Min/Max range indicators */}
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
          <span>{config.minLabel || formatCurrency(config.min)}</span>
          <span>{config.maxLabel || formatCurrency(config.max)}</span>
        </div>
      </div>
    </div>
  );
}

const AdvancedFilterComponent: React.FC<AdvancedFilterComponentProps> = ({
  filters,
  values,
  onChange,
  onReset
}) => {
  return (
    <>
      {/* Inject slider styles */}
      <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />
      
      <div className="space-y-1">
        {/* Reset button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-xs text-amber-600 hover:text-amber-700 hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>

        {filters.map((filter) => (
          <FilterSection key={filter.key} title={filter.label as string}>
            {filter.type === 'checkbox' && filter.options && (
              <CheckboxFilter
                options={filter.options}
                value={(values[filter.key] as string[]) || []}
                onChange={(value) => onChange(filter.key, value)}
                renderOption={filter.renderOption}
              />
            )}
            
            {filter.type === 'radio' && filter.options && (
              <RadioFilter
                options={filter.options as { value: string; label: string }[]}
                value={(values[filter.key] as string) || ''}
                onChange={(value) => onChange(filter.key, value)}
              />
            )}
            
            {filter.type === 'slider' && filter.sliderConfig && (
              <SliderFilter
                config={filter.sliderConfig}
                value={(values[filter.key] as [number, number]) || filter.sliderConfig.defaultValue || [filter.sliderConfig.min, filter.sliderConfig.max]}
                onChange={(value) => onChange(filter.key, value)}
              />
            )}
          </FilterSection>
        ))}
      </div>
    </>
  );
};

export default AdvancedFilterComponent;
export { gemstoneTypes, gemstoneIcons };
export type { FilterConfig, FilterValue, FilterValues };
