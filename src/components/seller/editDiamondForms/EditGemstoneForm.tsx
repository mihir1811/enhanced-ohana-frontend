import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { gemstoneService } from '@/services/gemstoneService';
import { getCookie } from '@/lib/cookie-utils';
import { certificateCompanies as certificateCompaniesIds } from '@/constants/diamondDropdowns';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// --- SearchableDropdown Component (Copied from AddDiamondForm for consistency) ---
interface Option {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  name,
  placeholder = "Select an option",
  required = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    if (disabled) return;
    onChange(option.value);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="relative cursor-pointer group"
        onClick={() => {
          if (disabled) return;
          setIsOpen(!isOpen);
          if (!isOpen && inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            className={`flex h-10 w-full rounded-xl border bg-background px-3 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent 
                       file:text-sm file:font-medium placeholder:text-muted-foreground 
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 
                       disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200
                       ${isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-input hover:border-primary/50'}`}
            placeholder={selectedOption ? selectedOption.label : placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required={required && !value}
            disabled={disabled}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-popover text-popover-foreground rounded-xl border shadow-xl animate-in fade-in zoom-in duration-200 origin-top">
          <div className="max-h-60 overflow-auto p-1 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center justify-between px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-colors
                             ${value === option.value 
                               ? 'bg-primary text-primary-foreground' 
                               : 'hover:bg-accent hover:text-accent-foreground'}`}
                  onClick={() => handleSelect(option)}
                >
                  <span className="font-medium">{option.label}</span>
                  {value === option.value && (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-center text-muted-foreground italic">
                No options found for &quot;{searchTerm}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Dropdown option arrays (copy from AddGemstoneForm) ---
const GEM_SUBTYPES = {
  ruby: ['Burmese', 'African', 'Thai', 'Other'],
  sapphire: ['Blue', 'Yellow', 'Pink', 'Padparadscha', 'Green', 'White', 'Other'],
  emerald: ['Colombian', 'Zambian', 'Brazilian', 'Other'],
  tanzanite: ['Blue', 'Violet', 'Other'],
  aquamarine: ['Santa Maria', 'Maxixe', 'Other'],
  amethyst: ['Siberian', 'Uruguayan', 'Other'],
  citrine: ['Lemon', 'Madeira', 'Other'],
  garnet: ['Almandine', 'Pyrope', 'Spessartine', 'Grossular', 'Andradite', 'Uvarovite', 'Other'],
  peridot: ['Olivine', 'Chrysolite', 'Other'],
  topaz: ['Imperial', 'Blue', 'White', 'Other'],
  tourmaline: ['Paraiba', 'Rubellite', 'Indicolite', 'Watermelon', 'Other'],
};

const QUALITY_GRADES = [
  { value: 'good', label: 'Good' },
  { value: 'very_good', label: 'Very Good' },
  { value: 'excellent', label: 'Excellent' },
];
const COMPOSITIONS = [
  { value: 'Single', label: 'Single' },
  { value: 'Doublet', label: 'Doublet' },
  { value: 'Triplet', label: 'Triplet' },
  { value: 'Composite', label: 'Composite' },
  { value: 'Other', label: 'Other' },
];
const SHAPES = [
  { value: 'good', label: 'Good' },
  { value: 'round', label: 'Round' },
  { value: 'oval', label: 'Oval' },
  { value: 'pear', label: 'Pear' },
  { value: 'marquise', label: 'Marquise' },
  { value: 'cushion', label: 'Cushion' },
  { value: 'princess', label: 'Princess' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'radiant', label: 'Radiant' },
  { value: 'heart', label: 'Heart' },
  { value: 'other', label: 'Other' },
];
const COLORS = [
  { value: 'good', label: 'Good' },
  { value: 'very_good', label: 'Very Good' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'other', label: 'Other' },
];
const CLARITIES = [
  { value: 'good', label: 'Good' },
  { value: 'A beautiful diamond', label: 'A beautiful diamond' },
  { value: 'IF', label: 'IF (Internally Flawless)' },
  { value: 'VVS1', label: 'VVS1' },
  { value: 'VVS2', label: 'VVS2' },
  { value: 'VS1', label: 'VS1' },
  { value: 'VS2', label: 'VS2' },
  { value: 'SI1', label: 'SI1' },
  { value: 'SI2', label: 'SI2' },
  { value: 'I1', label: 'I1' },
  { value: 'I2', label: 'I2' },
  { value: 'I3', label: 'I3' },
  { value: 'other', label: 'Other' },
];
const ORIGINS = [
  { value: 'Africa', label: 'Africa' },
  { value: 'India', label: 'India' },
  { value: 'Sri Lanka', label: 'Sri Lanka' },
  { value: 'Myanmar', label: 'Myanmar' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Madagascar', label: 'Madagascar' },
  { value: 'Thailand', label: 'Thailand' },
  { value: 'Tanzania', label: 'Tanzania' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Russia', label: 'Russia' },
  { value: 'Other', label: 'Other' },
];
const FLUORESCENCES = [
  { value: 'faint', label: 'Faint' },
  { value: 'none', label: 'None' },
  { value: 'medium', label: 'Medium' },
  { value: 'strong', label: 'Strong' },
  { value: 'very strong', label: 'Very Strong' },
  { value: 'other', label: 'Other' },
];
const TREATMENTS = [
  { value: 'None', label: 'None' },
  { value: 'Heat', label: 'Heat' },
  { value: 'Irradiation', label: 'Irradiation' },
  { value: 'Diffusion', label: 'Diffusion' },
  { value: 'Fracture Filling', label: 'Fracture Filling' },
  { value: 'Dyeing', label: 'Dyeing' },
  { value: 'Bleaching', label: 'Bleaching' },
  { value: 'Oiling', label: 'Oiling' },
  { value: 'Other', label: 'Other' },
];
const PROCESSES = [
  { value: 'Natural', label: 'Natural' },
  { value: 'Synthetic', label: 'Synthetic' },
  { value: 'Treated', label: 'Treated' },
  { value: 'Composite', label: 'Composite' },
  { value: 'Other', label: 'Other' },
];
const CUTS = [
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Very Good', label: 'Very Good' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
  { value: 'Other', label: 'Other' },
];

interface GemstoneData {
  id: string;
  gemsType: string;
  subType: string;
  stockNumber: string;
  quantity: string;
  description: string;
  videoURL: string;
  totalPrice: string;
  pricePerCarat?: string | number;
  carat: string;
  discount: string;
  qualityGrade: string;
  composition: string;
  shape: string;
  color: string;
  clarity: string;
  hardness: string;
  origin: string;
  fluoreScence: string;
  treatment: string;
  refrectiveIndex: string;
  birefringence: string;
  process: string;
  cut: string;
  dimension: string;
  spacificGravity: string;
  certificateCompanyName: string;
  certificateCompanyId?: number;
  certificateNumber: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
}

interface EditGemstoneFormProps {
  initialData: GemstoneData;
  onCancel?: () => void;
}

const EditGemstoneForm: React.FC<EditGemstoneFormProps> = ({ initialData, onCancel }) => {
  const [form, setForm] = useState<GemstoneData & { images: File[] }>(() => {
    let certId = initialData.certificateCompanyId;
    let certName = initialData.certificateCompanyName || '';

    // If we have ID but no name, try to find label
    if (certId && !certName) {
       const found = certificateCompaniesIds.find(c => c.value === String(certId));
       if (found) certName = found.label;
    }
    // If we have Name but no ID, try to find ID (reverse lookup)
    else if (!certId && certName) {
       const found = certificateCompaniesIds.find(c => c.label === certName);
       if (found) certId = Number(found.value);
    }

    return {
      ...initialData,
      totalPrice: initialData.totalPrice !== undefined ? String(initialData.totalPrice) : '',
      pricePerCarat: initialData.pricePerCarat !== undefined ? String(initialData.pricePerCarat) : '',
      certificateCompanyId: certId,
      certificateCompanyName: certName,
      certificateNumber: initialData.certificateNumber || '',
      images: [],
    };
  });
  const [loading, setLoading] = useState(false);
  const [selectedGemsType, setSelectedGemsType] = useState<string | undefined>(initialData?.gemsType);
  // Extract initial image URLs from initialData (image1-image6)
  const extractInitialImageUrls = (data: GemstoneData): string[] => {
    const urls: string[] = [];
    for (let i = 1; i <= 6; i++) {
      const key = `image${i}` as keyof GemstoneData;
      const imageUrl = data[key];
      if (imageUrl && typeof imageUrl === 'string') urls.push(imageUrl);
    }
    return urls;
  };
  const [imagePreviews, setImagePreviews] = useState<string[]>(extractInitialImageUrls(initialData));
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'gemsType') {
      setSelectedGemsType(e.target.value);
      setForm((f: typeof form) => ({ ...f, subType: '' }));
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    let arr = Array.from(files);
    // Combine existing previews and new files, up to 6
    let previews = [...imagePreviews];
    let images = [...form.images];
    // Remove placeholder empty slots if any
    previews = previews.filter(Boolean);
    images = images.filter(Boolean);
    // If total will exceed 6, trim new files
    if (previews.length + arr.length > 6) {
      arr = arr.slice(0, 6 - previews.length);
      toast.error('You can upload a maximum of 6 images.');
    }
    // Add new files to images and previews
    images = [...images, ...arr].slice(0, 6);
    previews = [...previews, ...arr.map((file: File) => URL.createObjectURL(file))].slice(0, 6);
    setForm({ ...form, images });
    setImagePreviews(previews);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const removeImage = (idx: number) => {
    // Remove from previews
    const newPreviews = [...imagePreviews];
    newPreviews.splice(idx, 1);
    setImagePreviews(newPreviews);
    // Remove from images if it's a File
    const newImages = [...form.images];
    if (newImages[idx]) newImages.splice(idx, 1);
    setForm({ ...form, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getCookie('token');
      if (!token) throw new Error('User not authenticated');
      const formData = new FormData();
      // For each image slot, set only one value (file or URL)
      for (let i = 0; i < 6; i++) {
        if (form.images[i]) {
          formData.append(`image${i + 1}`, form.images[i]);
        } else if (imagePreviews[i]) {
          formData.append(`image${i + 1}`, imagePreviews[i]);
        }
      }
      // Explicit mapping for known fields to match UpdateGemsStoneRequestDto
      if (form.gemsType) formData.append('gemsType', form.gemsType);
      if (form.subType) formData.append('subType', form.subType);
      if (form.composition) formData.append('composition', form.composition);
      if (form.qualityGrade) formData.append('qualityGrade', form.qualityGrade);
      if (form.quantity) formData.append('quantity', form.quantity);
      if (form.videoURL) formData.append('videoURL', form.videoURL);
      if (form.stockNumber) formData.append('stockNumber', form.stockNumber);
      if (form.description) formData.append('description', form.description);
      if (form.discount) formData.append('discount', form.discount);
      
      // Pricing mappings
      if (form.totalPrice) formData.append('totalPrice', form.totalPrice);
      if (form.pricePerCarat) formData.append('pricePerCarat', form.pricePerCarat);
      
      // Physical Properties
      if (form.carat) formData.append('carat', form.carat);
      if (form.shape) formData.append('shape', form.shape);
      if (form.color) formData.append('color', form.color);
      if (form.clarity) formData.append('clarity', form.clarity);
      if (form.hardness) formData.append('hardness', form.hardness);
      if (form.origin) formData.append('origin', form.origin);
      if (form.fluoreScence) formData.append('fluoreScence', form.fluoreScence);
      if (form.process) formData.append('process', form.process);
      if (form.cut) formData.append('cut', form.cut);
      if (form.dimension) formData.append('dimension', form.dimension);
      if (form.refrectiveIndex) formData.append('refrectiveIndex', form.refrectiveIndex);
      if (form.birefringence) formData.append('birefringence', form.birefringence);
      if (form.spacificGravity) formData.append('spacificGravity', form.spacificGravity);
      if (form.treatment) formData.append('treatment', form.treatment);
      
      // Certificate mapping
      if (form.certificateCompanyId) {
        const company = certificateCompaniesIds.find(c => c.value === String(form.certificateCompanyId));
        if (company) {
          formData.append('certificateCompanyName', company.label);
        }
      }
      if (form.certificateNumber) formData.append('certificateNumber', form.certificateNumber);
      const response = await gemstoneService.updateGemstone(form.id, formData, token);
      if (!response || response.success === false) {
        throw new Error(response?.message || 'Failed to update gemstone');
      }

      toast.success('Gemstone updated successfully!');
      if (onCancel) onCancel();
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to update gemstone');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full mx-auto p-6 bg-white rounded-2xl shadow flex flex-col gap-8" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-2">Edit Gemstone</h2>
      {/* Basic Information */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Stock Number *</label>
            <input name="stockNumber" value={form.stockNumber} onChange={handleInput} required className="input" placeholder="e.g. 12345" />
          </div>
          <div>
            <label className="block font-medium mb-1">Gem Type *</label>
            <select name="gemsType" value={form.gemsType} onChange={handleSelect} required className="input">
              <option value="">Select gem type</option>
              {Object.keys(GEM_SUBTYPES).map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Sub Type</label>
            <select name="subType" value={form.subType} onChange={handleSelect} className="input" disabled={!selectedGemsType}>
              <option value="">{selectedGemsType ? 'Select sub type' : 'Select gem type first'}</option>
              {selectedGemsType &&
                GEM_SUBTYPES[selectedGemsType as keyof typeof GEM_SUBTYPES]?.map((sub: string) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Quantity *</label>
            <input name="quantity" value={form.quantity} onChange={handleInput} required className="input" placeholder="e.g. 1" />
            <p className="text-[10px] text-muted-foreground mt-1">
              * Use 1 for Single Gemstone, {'>'}1 for Melee Parcels
            </p>
          </div>
        </div>
        <div className="mt-4">
          <label className="block font-medium mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleInput} rows={3} className="input" />
        </div>
      </section>

      {/* Media */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Product Images</label>
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="input"
              max={6}
              ref={fileInputRef}
              disabled={form.images.length >= 6}
            />
            {/* Image preview grid */}
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center relative group">
                    <Image
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow text-gray-700 hover:bg-red-500 hover:text-white transition"
                      title="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Video URL</label>
            <input name="videoURL" value={form.videoURL} onChange={handleInput} className="input" placeholder="e.g. https://youtu.be/abcd1234" />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-medium mb-1">Total Price *</label>
            <input name="totalPrice" value={form.totalPrice} onChange={handleInput} required className="input" placeholder="e.g. 1000" />
          </div>
          <div>
            <label className="block font-medium mb-1">Price Per Carat *</label>
            <input name="pricePerCarat" value={form.pricePerCarat} onChange={handleInput} required className="input" placeholder="e.g. 500" />
          </div>
          <div>
            <label className="block font-medium mb-1">Carat *</label>
            <input name="carat" value={form.carat} onChange={handleInput} required className="input" placeholder="e.g. 2.5" />
          </div>
          <div>
            <label className="block font-medium mb-1">Discount (%)</label>
            <input name="discount" value={form.discount} onChange={handleInput} className="input" placeholder="e.g. 10" />
          </div>
        </div>
      </section>

      {/* Gemstone Specifications */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Gemstone Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Quality Grade</label>
            <select name="qualityGrade" value={form.qualityGrade} onChange={handleSelect} className="input">
              <option value="">Select quality grade</option>
              {QUALITY_GRADES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Composition</label>
            <select name="composition" value={form.composition} onChange={handleSelect} className="input">
              <option value="">Select composition</option>
              {COMPOSITIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Shape *</label>
            <select name="shape" value={form.shape} onChange={handleSelect} required className="input">
              <option value="">Select shape</option>
              {SHAPES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Color</label>
            <select name="color" value={form.color} onChange={handleSelect} className="input">
              <option value="">Select color</option>
              {COLORS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Clarity</label>
            <select name="clarity" value={form.clarity} onChange={handleSelect} className="input">
              <option value="">Select clarity</option>
              {CLARITIES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Hardness</label>
            <input name="hardness" value={form.hardness} onChange={handleInput} className="input" placeholder="e.g. 9" />
          </div>
          <div>
            <label className="block font-medium mb-1">Origin *</label>
            <select name="origin" value={form.origin} onChange={handleSelect} required className="input">
              <option value="">Select origin</option>
              {ORIGINS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Fluorescence</label>
            <select name="fluoreScence" value={form.fluoreScence} onChange={handleSelect} className="input">
              <option value="">Select fluorescence</option>
              {FLUORESCENCES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Treatment</label>
            <select name="treatment" value={form.treatment} onChange={handleSelect} className="input">
              <option value="">Select treatment</option>
              {TREATMENTS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Refractive Index</label>
            <input name="refrectiveIndex" value={form.refrectiveIndex} onChange={handleInput} className="input" placeholder="e.g. 1.76" />
          </div>
          <div>
            <label className="block font-medium mb-1">Birefringence</label>
            <input name="birefringence" value={form.birefringence} onChange={handleInput} className="input" placeholder="e.g. 0.008" />
          </div>
          <div>
            <label className="block font-medium mb-1">Process</label>
            <select name="process" value={form.process} onChange={handleSelect} className="input">
              <option value="">Select process</option>
              {PROCESSES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Cut</label>
            <select name="cut" value={form.cut} onChange={handleSelect} className="input">
              <option value="">Select cut</option>
              {CUTS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Dimension *</label>
            <input name="dimension" value={form.dimension} onChange={handleInput} required className="input" placeholder="e.g. 7.2 x 5.1 x 3.2 mm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spacificGravity" className="font-medium">
              Specific Gravity
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="spacificGravity"
              name="spacificGravity"
              value={form.spacificGravity}
              onChange={handleInput}
              placeholder="e.g. 3.52"
              required
            />
          </div>
        </div>
      </section>

      {/* Certificate */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Certificate</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="certificateCompanyId" className="font-medium">
              Certificate Company
              <span className="text-destructive ml-1">*</span>
            </Label>
            <SearchableDropdown
              name="certificateCompanyId"
              options={certificateCompaniesIds}
              value={form.certificateCompanyId ? String(form.certificateCompanyId) : ''}
              onChange={(value) => {
                const selected = certificateCompaniesIds.find(c => c.value === value);
                setForm(prev => ({ 
                  ...prev, 
                  certificateCompanyId: Number(value),
                  certificateCompanyName: selected ? selected.label : ''
                }));
              }}
              placeholder="Select Certificate Company"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="certificateNumber" className="font-medium">
              Certificate Number
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="certificateNumber"
              name="certificateNumber"
              value={form.certificateNumber}
              onChange={handleInput}
              placeholder="e.g. GIA-12345678"
              required
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-4 mt-4">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Update Gemstone'}</button>
      </div>

      {/* Tailwind input/button styles */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .input:focus {
          outline: 2px solid #2563eb;
          border-color: #2563eb;
        }
        .btn-primary {
          background: #2563eb;
          color: #fff;
          padding: 0.5rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: background 0.2s;
        }
        .btn-primary:hover {
          background: #1d4ed8;
        }
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          padding: 0.5rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: 1px solid #e5e7eb;
          transition: background 0.2s;
        }
        .btn-secondary:hover {
          background: #e5e7eb;
        }
      `}</style>
    </form>
  );
};

export default EditGemstoneForm;
