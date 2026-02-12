// ...existing imports...
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { gemstoneService } from '@/services/gemstoneService';
import { getCookie } from '@/lib/cookie-utils';

// ...existing constants (GEM_SUBTYPES, CERTIFICATE_COMPANIES, etc.) ...

import { auctionProductTypes } from '@/config/sellerConfigData';
import { certificateCompanies as certificateCompaniesIds } from '@/constants/diamondDropdowns';

// --- Dropdown option arrays (copy from AddGemstoneForm) ---
const GEM_SUBTYPES: Record<string, string[]> = {
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

interface GemstoneFormState {
  name: string;
  gemsType: string;
  subType: string;
  composition: string;
  qualityGrade: string;
  quantity: string;
  videoURL: string;
  stockNumber: string;
  description: string;
  discount: string;
  totalPrice: string;
  carat: string;
  shape: string;
  color: string;
  clarity: string;
  hardness: string;
  origin: string;
  fluoreScence: string;
  process: string;
  cut: string;
  dimension: string;
  refrectiveIndex: string;
  birefringence: string;
  spacificGravity: string;
  treatment: string;
  certificateCompanyId: string;
  certificateNumber: string;
  pricePerCarat: string;
  images: File[];
}

const initialForm: GemstoneFormState = {
  name: '',
  gemsType: '',
  subType: '',
  composition: '',
  qualityGrade: '',
  quantity: '',
  videoURL: '',
  stockNumber: '',
  description: '',
  discount: '',
  totalPrice: '',
  pricePerCarat: '',
  carat: '',
  shape: '',
  color: '',
  clarity: '',
  hardness: '',
  origin: '',
  fluoreScence: '',
  process: '',
  cut: '',
  dimension: '',
  refrectiveIndex: '',
  birefringence: '',
  spacificGravity: '',
  treatment: '',
  certificateCompanyId: '',
  certificateNumber: '',
  images: [],
};

function AddGemstoneForm({ onCancel }: { onCancel: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState<GemstoneFormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [selectedGemsType, setSelectedGemsType] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- Helper to pick random element ---
  const getRandomElement = <T extends { value: string }>(arr: T[]) => {
    return arr[Math.floor(Math.random() * arr.length)].value;
  };

  const fillRandomData = () => {
    const gemTypes = Object.keys(GEM_SUBTYPES);
    const randomGemType = gemTypes[Math.floor(Math.random() * gemTypes.length)];
    const subTypes = GEM_SUBTYPES[randomGemType] || [];
    const randomSubType = subTypes.length > 0 ? subTypes[Math.floor(Math.random() * subTypes.length)] : '';
    
    // Generate random numbers for numeric fields
    const randomPrice = Math.floor(Math.random() * 10000) + 500;
    const randomCarat = (Math.random() * 5 + 0.5).toFixed(2);
    const randomPricePerCarat = (randomPrice / parseFloat(randomCarat)).toFixed(2);

    const newData: GemstoneFormState = {
      name: `${randomGemType.charAt(0).toUpperCase() + randomGemType.slice(1)} Gemstone`,
      gemsType: randomGemType,
      subType: randomSubType,
      composition: getRandomElement(COMPOSITIONS),
      qualityGrade: getRandomElement(QUALITY_GRADES),
      quantity: Math.floor(Math.random() * 10 + 1).toString(),
      videoURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
      stockNumber: Math.floor(Math.random() * 100000 + 1000).toString(),
      description: 'This is a randomly generated gemstone description for testing purposes.',
      discount: Math.floor(Math.random() * 20).toString(),
      totalPrice: randomPrice.toString(),
      pricePerCarat: randomPricePerCarat,
      carat: randomCarat,
      shape: getRandomElement(SHAPES),
      color: getRandomElement(COLORS),
      clarity: getRandomElement(CLARITIES),
      hardness: (Math.random() * 10).toFixed(1),
      origin: getRandomElement(ORIGINS),
      fluoreScence: getRandomElement(FLUORESCENCES),
      process: getRandomElement(PROCESSES),
      cut: getRandomElement(CUTS),
      dimension: `${(Math.random() * 10).toFixed(2)} x ${(Math.random() * 10).toFixed(2)} x ${(Math.random() * 5).toFixed(2)} mm`,
      refrectiveIndex: (1.4 + Math.random() * 0.4).toFixed(3),
      birefringence: (0.001 + Math.random() * 0.05).toFixed(3),
      spacificGravity: (2.5 + Math.random() * 2).toFixed(2),
      treatment: getRandomElement(TREATMENTS),
      certificateCompanyId: certificateCompaniesIds.length > 0 
        ? certificateCompaniesIds[Math.floor(Math.random() * certificateCompaniesIds.length)].value 
        : '',
      certificateNumber: `CERT-${Math.floor(Math.random() * 1000000)}`,
      images: [], // Cannot randomly generate files
    };
    
    setForm(newData);
    // Also update selectedGemsType state for the subType dropdown
    setSelectedGemsType(randomGemType);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'gemsType') {
      setSelectedGemsType(e.target.value);
      setForm((f: GemstoneFormState) => ({ ...f, subType: '' }));
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    let arr = Array.from(files);
    if (form.images.length + arr.length > 6) {
      arr = arr.slice(0, 6 - form.images.length);
      toast.error('You can upload a maximum of 6 images.');
    }
    setForm({ ...form, images: [...form.images, ...arr].slice(0, 6) });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const removeImage = (idx: number) => {
    const newImages = [...form.images];
    newImages.splice(idx, 1);
    setForm({ ...form, images: newImages });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Explicit mapping to match CreateGemStoneDto
      if (form.name) formData.append('name', form.name);
      if (form.gemsType) formData.append('gemsType', form.gemsType);
      if (form.subType) formData.append('subType', form.subType);
      if (form.composition) formData.append('composition', form.composition);
      if (form.qualityGrade) formData.append('qualityGrade', form.qualityGrade);
      if (form.quantity) formData.append('quantity', form.quantity);
      
      // Images: image1 to image6
      form.images.forEach((img, idx) => {
        if (idx < 6) {
          formData.append(`image${idx + 1}`, img);
        }
      });
      
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
        const company = certificateCompaniesIds.find(c => c.value === form.certificateCompanyId);
        if (company) {
          formData.append('certificateCompanyName', company.label);
        }
      }
      if (form.certificateNumber) formData.append('certificateNumber', form.certificateNumber);

      const token = getCookie('token');
      if (!token) throw new Error('User not authenticated');
      const response = await gemstoneService.addGemstone(formData, token);
      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to add gemstone');
      }
      toast.success('Gemstone added successfully!');
      setForm(initialForm);
      router.push('/seller/products');
      if (onCancel) onCancel();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add gemstone';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full mx-auto p-6 bg-white rounded-2xl shadow flex flex-col gap-8" onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">Add Gemstone</h2>
        <button 
          type="button" 
          onClick={fillRandomData}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
        >
          Fill Random Data
        </button>
      </div>
      {/* Basic Information */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleInput} className="input" placeholder="e.g. Natural Ruby" />
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
              {selectedGemsType && GEM_SUBTYPES[selectedGemsType]?.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Stock Number *</label>
            <input name="stockNumber" value={form.stockNumber} onChange={handleInput} required className="input" placeholder="e.g. 12345" />
          </div>

          <div>
            <label className="block font-medium mb-1">Quantity *</label>
            <input name="quantity" value={form.quantity} onChange={handleInput} required className="input" placeholder="e.g. 1" />
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
            {form.images && form.images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {form.images.map((img: File, idx: number) => {
                  const url = URL.createObjectURL(img);
                  return (
                    <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center relative group">
                      <Image
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                        onLoad={() => URL.revokeObjectURL(url)}
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
                  );
                })}
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
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Total Price *</label>
            <input name="totalPrice" value={form.totalPrice} onChange={handleInput} required className="input" placeholder="e.g. 1000" />
          </div>
          <div>
            <label className="block font-medium mb-1">Price Per Carat *</label>
            <input name="pricePerCarat" value={form.pricePerCarat} onChange={handleInput} required className="input" placeholder="e.g. 400" />
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
          {/* Newly added fields for API compliance */}
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
          <div>
            <label className="block font-medium mb-1">Specific Gravity *</label>
            <input name="spacificGravity" value={form.spacificGravity} onChange={handleInput} required className="input" placeholder="e.g. 3.52" />
          </div>
        </div>
      </section>

      {/* Certificate */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Certificate</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Certificate Company</label>
            <select name="certificateCompanyId" value={form.certificateCompanyId} onChange={handleSelect} className="input">
              <option value="">Select certificate company</option>
              {certificateCompaniesIds.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Certificate Number</label>
            <input name="certificateNumber" value={form.certificateNumber} onChange={handleInput} className="input" placeholder="e.g. GIA-12345678" />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-4 mt-4">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Add Gemstone'}</button>
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
}

export default AddGemstoneForm;
