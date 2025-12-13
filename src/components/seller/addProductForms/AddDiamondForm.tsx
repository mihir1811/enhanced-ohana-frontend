
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { diamondService } from '@/services/diamondService';
import { getCookie } from '@/lib/cookie-utils';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Gem, Layers } from 'lucide-react';

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
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  name,
  placeholder = "Select an option",
  required = false
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
    onChange(option.value);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="relative cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <input
          ref={inputRef}
          type="text"
          className={`flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm
                     ring-offset-background file:border-0 file:bg-transparent 
                     file:text-sm file:font-medium placeholder:text-muted-foreground 
                     focus-visible:outline-none focus-visible:ring-2 
                     focus-visible:ring-ring focus-visible:ring-offset-2
                     disabled:cursor-not-allowed disabled:opacity-50
                     transition-all duration-200 ease-in-out
                     hover:border-primary/50
                     ${isOpen ? 'ring-2 ring-ring ring-offset-2 border-primary' : ''}
                     backdrop-blur-sm`}
          placeholder={placeholder}
          value={isOpen ? searchTerm : selectedOption?.label || ""}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onClick={(e) => e.stopPropagation()}
          onFocus={() => setIsOpen(true)}
          required={required}
          name={name}
        />
        {/* <div className={`absolute left-3 top-1/2 -translate-y-1/2 
                      transition-colors duration-200 
                      ${isOpen ? 'text-primary' : 'text-muted-foreground'}`}>
          {icon}
        </div> */}
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 
                      transition-all duration-200 ease-in-out 
                      ${isOpen ? 'text-primary' : 'text-muted-foreground'}`}>
          <svg className={`w-4 h-4 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 rounded-md border bg-white bg-card text-card-foreground 
                       shadow-lg ring-1 ring-black/5 outline-none animate-in fade-in-0 zoom-in-95 
                       max-h-60 overflow-auto backdrop-blur-sm">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                className={`relative flex w-full cursor-pointer select-none items-center px-3 py-2 text-sm outline-none
                          transition-all duration-200 ease-in-out gap-2
                          hover:bg-accent hover:text-accent-foreground group
                          ${option.value === value ? 'bg-accent/90 text-accent-foreground font-medium' : ''}
                          ${index === 0 ? 'rounded-t-[5px]' : ''}
                          ${index === filteredOptions.length - 1 ? 'rounded-b-[5px]' : ''}`}
                onClick={() => handleSelect(option)}
              >
                <span className={`flex-1 truncate ${option.value === value ? 'font-medium' : ''}`}>
                  {option.label}
                </span>
                {option.value === value && (
                  <svg className="w-4 h-4 text-primary shrink-0 opacity-100 group-hover:text-white transition-colors duration-200"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              No matching options
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Import dropdown options from config
import {
  diamondColors,
  fancyColors,
  fancyIntensities,
  fancyOvertones,
  cutGrades,
  clarities,
  shades,
  shapes,
  fluorescences,
  processes,
  treatments,
} from '@/config/sellerConfigData';
import { useCertificateCompanies } from '@/hooks/data/useCertificateCompanies';


type DiamondFormState = {
  name: string,
  stoneType: string,
  description: string,
  images: File[],
  videoURL: string,
  stockNumber: string,
  sellerSKU: string,
  origin: string,
  rap: string,
  price: string,
  discount: string,
  color: string,
  colorFrom: string,
  colorTo: string,
  fancyColor: string,
  fancyColorFrom: string,
  fancyColorTo: string,
  fancyIntencity: string,
  fancyIntencityFrom: string,
  fancyIntencityTo: string,
  fancyOvertone: string,
  fancyOvertoneFrom: string,
  fancyOvertoneTo: string,
  caratWeight: string,
  cut: string,
  clarity: string,
  shade: string,
  shape: string,
  polish: string,
  symmetry: string,
  fluorescence: string,
  treatment: string,
  process: string,
  measurement: string,
  diameter: string,
  ratio: string,
  table: string,
  depth: string,
  gridleMin: string,
  gridleMax: string,
  gridlePercentage: string,
  crownHeight: string,
  crownAngle: string,
  pavilionAngle: string,
  pavilionDepth: string,
  culetSize: string,
  totalPieces: string,
  sizeMin: string,
  sizeMax: string,
  certificateCompanyId: string,
  certificateNumber: string,
  inscription: string,
  certification: File | null,
}

const initialState: DiamondFormState = {
  name: '',
  stoneType: '',
  description: '',
  images: [],
  videoURL: '',
  stockNumber: '',
  sellerSKU: '',
  origin: '',
  rap: '',
  price: '',
  discount: '',
  color: '',
  colorFrom: '',
  colorTo: '',
  fancyColor: '',
  fancyColorFrom: '',
  fancyColorTo: '',
  fancyIntencity: '',
  fancyIntencityFrom: '',
  fancyIntencityTo: '',
  fancyOvertone: '',
  fancyOvertoneFrom: '',
  fancyOvertoneTo: '',
  caratWeight: '',
  cut: '',
  clarity: '',
  shade: '',
  shape: '',
  polish: '',
  symmetry: '',
  fluorescence: '',
  treatment: '',
  process: '',
  measurement: '',
  diameter: '',
  ratio: '',
  table: '',
  depth: '',
  gridleMin: '',
  gridleMax: '',
  gridlePercentage: '',
  crownHeight: '',
  crownAngle: '',
  pavilionAngle: '',
  pavilionDepth: '',
  culetSize: '',
  totalPieces: '',
  sizeMin: '',
  sizeMax: '',
  certificateCompanyId: '',
  certificateNumber: '',
  inscription: '',
  certification: null,
  // end of initialState
};

function AddDiamondForm() {
  // Use dynamic certificate companies
  const { options: certificateCompanies, getCompanyNameById } = useCertificateCompanies();

  const [form, setForm] = useState<DiamondFormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState('Single');
  const isMelee = activeTab === 'Melee';

  useEffect(() => {
    const parts = [form.caratWeight, form.shape, form.color, form.clarity].filter((p) => p && String(p).trim() !== '');
    const newName = parts.join(' ');
    if (form.name !== newName) {
      setForm((prev) => ({ ...prev, name: newName }));
    }
  }, [form.caratWeight, form.shape, form.color, form.clarity]);

  useEffect(() => {
    if (isMelee) {
      const order = diamondColors.map((o) => o.value);
      let from = form.colorFrom;
      let to = form.colorTo;
      if (from && to) {
        const fi = order.indexOf(from);
        const ti = order.indexOf(to);
        if (fi !== -1 && ti !== -1 && fi > ti) {
          from = form.colorTo;
          to = form.colorFrom;
          setForm((prev) => ({ ...prev, colorFrom: from, colorTo: to }));
        }
      }
      const range = [from, to].filter((v) => v && String(v).trim() !== '').join('-');
      if (range !== form.color) setForm((prev) => ({ ...prev, color: range }));
    }
  }, [isMelee, form.colorFrom, form.colorTo]);

  useEffect(() => {
    if (isMelee) {
      const min = parseFloat(String(form.sizeMin || ''));
      const max = parseFloat(String(form.sizeMax || ''));
      if (!isNaN(min) && !isNaN(max) && min > max) {
        setForm((prev) => ({ ...prev, sizeMin: String(max), sizeMax: String(min) }));
      }
    }
  }, [isMelee, form.sizeMin, form.sizeMax]);

  useEffect(() => {
    if (isMelee) {
      const order = fancyIntensities.map((o) => o.value);
      let from = form.fancyIntencityFrom;
      let to = form.fancyIntencityTo;
      if (from && to) {
        const fi = order.indexOf(from);
        const ti = order.indexOf(to);
        if (fi !== -1 && ti !== -1 && fi > ti) {
          from = form.fancyIntencityTo;
          to = form.fancyIntencityFrom;
          setForm((prev) => ({ ...prev, fancyIntencityFrom: from, fancyIntencityTo: to }));
        }
      }
      const range = [from, to].filter((v) => v && String(v).trim() !== '').join('-');
      if (range !== form.fancyIntencity) setForm((prev) => ({ ...prev, fancyIntencity: range }));
    }
  }, [isMelee, form.fancyIntencityFrom, form.fancyIntencityTo]);

  useEffect(() => {
    if (isMelee) {
      const list = fancyOvertones.map((o) => o.value);
      let from = form.fancyOvertoneFrom;
      let to = form.fancyOvertoneTo;
      if (from && to) {
        const fi = list.indexOf(from);
        const ti = list.indexOf(to);
        if (fi !== -1 && ti !== -1 && fi > ti) {
          from = form.fancyOvertoneTo;
          to = form.fancyOvertoneFrom;
          setForm((prev) => ({ ...prev, fancyOvertoneFrom: from, fancyOvertoneTo: to }));
        }
      }
      const range = [from, to].filter((v) => v && String(v).trim() !== '').join('-');
      if (range !== form.fancyOvertone) setForm((prev) => ({ ...prev, fancyOvertone: range }));
    }
  }, [isMelee, form.fancyOvertoneFrom, form.fancyOvertoneTo]);

  useEffect(() => {
    if (isMelee) {
      const list = fancyColors.map((o) => o.value);
      let from = form.fancyColorFrom;
      let to = form.fancyColorTo;
      if (from && to) {
        const fi = list.indexOf(from);
        const ti = list.indexOf(to);
        if (fi !== -1 && ti !== -1 && fi > ti) {
          from = form.fancyColorTo;
          to = form.fancyColorFrom;
          setForm((prev) => ({ ...prev, fancyColorFrom: from, fancyColorTo: to }));
        }
      }
      const range = [from, to].filter((v) => v && String(v).trim() !== '').join('-');
      if (range !== form.fancyColor) setForm((prev) => ({ ...prev, fancyColor: range }));
    }
  }, [isMelee, form.fancyColorFrom, form.fancyColorTo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;
    if (name === 'images') {
      let fileArr = Array.from(files);
      // Enforce 6-image limit
      if (form.images.length + fileArr.length > 6) {
        fileArr = fileArr.slice(0, 6 - form.images.length);
        setError('You can upload a maximum of 6 images.');
      } else {
        setError('');
      }
      setForm(prev => ({ ...prev, images: [...prev.images, ...fileArr].slice(0, 6) }));
      // Reset input value so same file can be reselected if removed
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else if (name === 'certification') {
      setForm(prev => ({ ...prev, certification: files[0] }));
    }
  };

  const handleRemoveImage = (idx: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      // List of all fields as per API curl
      const fields = [
        'stockNumber', 'name', 'description', 'origin', 'rap', 'price', 'discount', 'caratWeight', 'cut', 'color', 'shade', 'fancyColor', 'fancyIntencity', 'fancyOvertone', 'shape', 'symmetry', 'diameter', 'clarity', 'fluorescence', 'measurement', 'ratio', 'table', 'depth', 'gridleMin', 'gridleMax', 'gridlePercentage', 'crownHeight', 'crownAngle', 'pavilionAngle', 'pavilionDepth', 'culetSize', 'polish', 'treatment', 'inscription', 'certificateNumber', 'stoneType', 'process', 'certificateCompanyId', 'videoURL', 'sellerSKU', 'totalPieces', 'sizeMin', 'sizeMax'
      ];
      fields.forEach((key) => {
        const value = form[key as keyof DiamondFormState];
        if (typeof value !== 'undefined' && value !== null && value !== '') {
          formData.append(key, String(value));
        }
      });

      // Handle certificateCompany separately - send company name based on certificateCompanyId
      if (form.certificateCompanyId && form.certificateCompanyId !== '') {
        const companyName = getCompanyNameById(form.certificateCompanyId);
        if (companyName) {
          formData.append('certificateCompany', companyName);
        }
      }
      // Append images as image1, image2, ...
      if (form.images && form.images.length > 0) {
        form.images.forEach((file, idx) => {
          formData.append(`image${idx + 1}`, file);
        });
      }
      // Append certification file
      if (form.certification) {
        formData.append('certification', form.certification);
      }
      formData.append('stoneType', 'naturalDiamond');
      // Get Bearer token from cookie
      const token = getCookie('token');
      if (!token) throw new Error('User not authenticated');
      const response = await diamondService.addDiamond(formData, token);
      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to add diamond');
      }
      toast.success('Diamond added successfully!');
      setForm(initialState);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full mx-auto bg-card  flex flex-col gap-8" onSubmit={handleSubmit}>
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-primary/90 to-primary bg-clip-text">Add Diamond</h2>
        <p className="text-muted-foreground text-sm">Fill in the details below to add a new diamond to your inventory.</p>
      </div>

      <div>
        <div
          role="tablist"
          aria-label="Diamond type"
          className="inline-flex items-center gap-1 p-1 rounded-xl border"
          style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'Single'}
            onClick={() => setActiveTab('Single')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'Single'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-foreground border border-transparent hover:bg-muted'
            }`}
            style={
              activeTab === 'Single'
                ? { background: 'var(--primary)', color: 'var(--primary-foreground)' }
                : { background: 'var(--card)', color: 'var(--foreground)' }
            }
          >
            <Gem className="w-4 h-4" />
            Single Diamond
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'Melee'}
            onClick={() => setActiveTab('Melee')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'Melee'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-foreground border border-transparent hover:bg-muted'
            }`}
            style={
              activeTab === 'Melee'
                ? { background: 'var(--primary)', color: 'var(--primary-foreground)' }
                : { background: 'var(--card)', color: 'var(--foreground)' }
            }
          >
            <Layers className="w-4 h-4" />
            Melee Diamonds
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <section className="space-y-6">
        {/* <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-foreground/90">Basic Information</h3>
          <div className="flex-1 border-b border-border/40"></div>
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1 text-foreground/90">
              Title
              <span className="text-destructive text-xs">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              // required
              disabled
              placeholder="e.g. Round Brilliant Diamond"
              className="w-full transition-all duration-200 hover:border-primary/50"
            />
          </div>
        </div>
      </section>

      {/* Certification */}

      {
        activeTab !== 'Melee' && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-foreground/90">Certification</h3>
              <div className="flex-1 border-b border-border/40"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative group space-y-2">
                <Label htmlFor="certificateCompanyId" className="font-medium">
                  Certificate Company
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <SearchableDropdown
                  name="certificateCompanyId"
                  value={form.certificateCompanyId}
                  onChange={(value) => setForm(prev => ({ ...prev, certificateCompanyId: value }))}
                  options={certificateCompanies}
                  placeholder="Search certificate company..."
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
                  onChange={handleChange}
                  required
                  placeholder="e.g. 123456789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inscription" className="font-medium">
                  Inscription
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="inscription"
                  name="inscription"
                  value={form.inscription}
                  onChange={handleChange}
                  required
                  placeholder="e.g. GIA123456"
                />
              </div>

            </div>
          </section>
        )
      }
      {/* Media */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="images" className="font-medium">
              Product Images
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="images"
                  className={`relative flex flex-col items-center justify-center w-full 
                    border border-dashed rounded-md cursor-pointer 
                    bg-background/50 hover:bg-background/80 
                    border-border hover:border-primary/50
                    transition-all duration-200
                    ${form.images.length === 0 ? 'p-6' : 'p-4'}`}
                >
                  {form.images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4">
                      {/* Cloud Upload Icon */}
                      <svg
                        className="w-16 h-16 text-muted-foreground/60"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                      </svg>

                      <div className="text-center space-y-2">
                        <p className="text-lg font-medium text-foreground/90">
                          Drop Your Files Here
                        </p>
                        <p className="text-sm text-muted-foreground">Or</p>
                        <button
                          type="button"
                          className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('images')?.click();
                          }}
                        >
                          Browse
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="grid grid-cols-3 gap-4">
                        {form.images.map((image, idx) => {
                          const url = URL.createObjectURL(image);
                          return (
                            <div key={idx} className="relative group aspect-square">
                              <Image
                                src={url}
                                alt={`Product image ${idx + 1}`}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover rounded-md"
                                onLoad={() => URL.revokeObjectURL(url)}
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveImage(idx);
                                  }}
                                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                           bg-white/90 text-gray-800 p-2 rounded-full hover:bg-red-500 hover:text-white
                                           transition-colors duration-200"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              {idx === 0 && (
                                <div className="absolute top-2 left-2 bg-primary/90 text-white px-2 py-1 rounded-md text-xs">
                                  Main Image
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {form.images.length < 6 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById('images')?.click();
                            }}
                            className="aspect-square flex items-center justify-center border-2 border-dashed 
                                     border-border hover:border-primary/50 rounded-md transition-colors
                                     bg-background/50 hover:bg-background/80"
                          >
                            <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <Input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    required
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                    disabled={form.images.length >= 6}
                  />
                </label>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <p className="text-muted-foreground">
                  Maximum File Size 4 MB
                </p>
                <p className="text-muted-foreground">
                  {form.images.length}/6 images
                </p>
              </div>

              {error && (
                <p className="text-sm text-destructive mt-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              )}
            </div>
          </div>
          {
            activeTab !== 'Melee' && (
              <div className="space-y-2">
                <Label htmlFor="certification" className="font-medium">
                  Certification Document
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="certification"
                      className="relative flex flex-col items-center justify-center w-full 
                    border border-dashed rounded-md cursor-pointer 
                    bg-background/50 hover:bg-background/80 
                    border-border hover:border-primary/50
                    transition-all duration-200
                    p-6">
                      <div className="flex flex-col items-center justify-center gap-4">
                        {/* Cloud Upload Icon */}
                        <svg
                          className="w-16 h-16 text-muted-foreground/60"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                        </svg>

                        {!form.certification ? (
                          <>
                            <div className="text-center space-y-2">
                              <p className="text-lg font-medium text-foreground/90">
                                Drop Your File Here
                              </p>
                              <p className="text-sm text-muted-foreground">Or</p>
                              <button
                                type="button"
                                className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                                onClick={() => document.getElementById('certification')?.click()}
                              >
                                Browse
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center space-y-2">
                            <p className="text-sm font-medium text-foreground/90">
                              {form.certification.name}
                            </p>
                            {form.certification.type.startsWith('image/') && (
                              <div className="relative w-32 h-32 mx-auto mt-2 rounded-md overflow-hidden border border-border">
                                <Image
                                  src={URL.createObjectURL(form.certification)}
                                  alt="Preview"
                                  width={128}
                                  height={128}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <button
                              type="button"
                              className="text-sm text-blue-500 hover:text-blue-600"
                              onClick={() => document.getElementById('certification')?.click()}
                            >
                              Choose a different file
                            </button>
                          </div>
                        )}

                        <Input
                          id="certification"
                          name="certification"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    </label>
                  </div>
                  <div className="mt-2 text-center text-sm text-muted-foreground">
                    Maximum File Size 4 MB
                  </div>
                </div>
              </div>
            )}
        </div>
        <div className='w-1/2 mt-3  '>
          <Label htmlFor="videoURL" className="font-medium mb-2">
            Video URL
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input name="videoURL" value={form.videoURL} onChange={handleChange} required className="input" placeholder="e.g. https://youtu.be/abcd1234" />
        </div>
      </section>

      {/* Product Details */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Product Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stockNumber" className="font-medium">
              Stock Number
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="stockNumber"
              name="stockNumber"
              type="number"
              value={form.stockNumber}
              onChange={handleChange}
              required
              placeholder="e.g. 1001"
            />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="sellerSKU" className="font-medium">
              Seller SKU
            </Label>
            <Input
              id="sellerSKU"
              name="sellerSKU"
              value={form.sellerSKU}
              onChange={handleChange}
              placeholder="e.g. SKU-001"
            />
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="origin" className="font-medium">
              Origin
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="origin"
              name="origin"
              value={form.origin}
              onChange={handleChange}
              required
              placeholder="e.g. South Africa"
            />
          </div>

          {
        activeTab !== 'Melee' && (
          <div className="space-y-2">
            <Label htmlFor="rap" className="font-medium">
              RAP Price
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="rap"
              name="rap"
              type="number"
              value={form.rap}
              onChange={handleChange}
              required
              placeholder="e.g. 5000"
            />
          </div>
        )}
          <div className="space-y-2">
            <Label htmlFor="price" className="font-medium">
              Price
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
              placeholder="e.g. 4500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount" className="font-medium">
              Discount (%)
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              value={form.discount}
              onChange={handleChange}
              min={0}
              max={100}
              required
              placeholder="e.g. 10"
            />
          </div>
        </div>
      </section>

      {/* Diamond Specifications */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">Diamond Specifications</h3>
          <div className="flex-1 border-b"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!isMelee ? (
            <div className="space-y-2">
              <Label htmlFor="color" className="font-medium">
                Color
                <span className="text-destructive ml-1">*</span>
              </Label>
              <SearchableDropdown
                name="color"
                value={form.color}
                onChange={(value) => setForm(prev => ({ ...prev, color: value }))}
                options={diamondColors}
                placeholder="Search color grade..."
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="colorFrom" className="font-medium">
                Color Range
                <span className="text-destructive ml-1">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <SearchableDropdown
                  name="colorFrom"
                  value={form.colorFrom}
                  onChange={(value) => setForm(prev => ({ ...prev, colorFrom: value }))}
                  options={diamondColors}
                  placeholder="From"
                  required
                />
                <SearchableDropdown
                  name="colorTo"
                  value={form.colorTo}
                  onChange={(value) => setForm(prev => ({ ...prev, colorTo: value }))}
                  options={diamondColors}
                  placeholder="To"
                  required
                />
              </div>
            </div>
          )}
          {!isMelee ? (
            <div className="space-y-2">
              <Label htmlFor="fancyColor" className="font-medium">
                Fancy Color
                <span className="text-destructive ml-1">*</span>
              </Label>
              <SearchableDropdown
                name="fancyColor"
                value={form.fancyColor}
                onChange={(value) => setForm(prev => ({ ...prev, fancyColor: value }))}
                options={fancyColors}
                placeholder="Search fancy color..."
                required={!isMelee}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="fancyColorFrom" className="font-medium">
                Fancy Color Range
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <SearchableDropdown
                  name="fancyColorFrom"
                  value={form.fancyColorFrom}
                  onChange={(value) => setForm(prev => ({ ...prev, fancyColorFrom: value }))}
                  options={fancyColors}
                  placeholder="From"
                />
                <SearchableDropdown
                  name="fancyColorTo"
                  value={form.fancyColorTo}
                  onChange={(value) => setForm(prev => ({ ...prev, fancyColorTo: value }))}
                  options={fancyColors}
                  placeholder="To"
                />
              </div>
            </div>
          )}
          {!isMelee ? (
            <div className="space-y-2">
              <Label htmlFor="fancyIntencity" className="font-medium">
                Fancy Intensity
                <span className="text-destructive ml-1">*</span>
              </Label>
              <SearchableDropdown
                name="fancyIntencity"
                value={form.fancyIntencity}
                onChange={(value) => setForm(prev => ({ ...prev, fancyIntencity: value }))}
                options={fancyIntensities}
                placeholder="Search intensity..."
                required={!isMelee}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="fancyIntencityFrom" className="font-medium">
                Fancy Intensity Range
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <SearchableDropdown
                  name="fancyIntencityFrom"
                  value={form.fancyIntencityFrom}
                  onChange={(value) => setForm(prev => ({ ...prev, fancyIntencityFrom: value }))}
                  options={fancyIntensities}
                  placeholder="From"
                />
                <SearchableDropdown
                  name="fancyIntencityTo"
                  value={form.fancyIntencityTo}
                  onChange={(value) => setForm(prev => ({ ...prev, fancyIntencityTo: value }))}
                  options={fancyIntensities}
                  placeholder="To"
                />
              </div>
            </div>
          )}
          {!isMelee ? (
            <div className="space-y-2">
              <Label htmlFor="fancyOvertone" className="font-medium">
                Fancy Overtone
                <span className="text-destructive ml-1">*</span>
              </Label>
              <SearchableDropdown
                name="fancyOvertone"
                value={form.fancyOvertone}
                onChange={(value) => setForm(prev => ({ ...prev, fancyOvertone: value }))}
                options={fancyOvertones}
                placeholder="Search overtone..."
                required={!isMelee}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="fancyOvertoneFrom" className="font-medium">
                Fancy Overtone Range
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <SearchableDropdown
                  name="fancyOvertoneFrom"
                  value={form.fancyOvertoneFrom}
                  onChange={(value) => setForm(prev => ({ ...prev, fancyOvertoneFrom: value }))}
                  options={fancyOvertones}
                  placeholder="From"
                />
                <SearchableDropdown
                  name="fancyOvertoneTo"
                  value={form.fancyOvertoneTo}
                  onChange={(value) => setForm(prev => ({ ...prev, fancyOvertoneTo: value }))}
                  options={fancyOvertones}
                  placeholder="To"
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="caratWeight" className="font-medium">
              Carat Weight
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="caratWeight"
              name="caratWeight"
              type="number"
              value={form.caratWeight}
              onChange={handleChange}
              required
              placeholder="e.g. 1.25"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cut" className="font-medium">
              Cut Grade
              <span className="text-destructive ml-1">*</span>
            </Label>
          <SearchableDropdown
              name="cut"
              value={form.cut}
              onChange={(value) => setForm(prev => ({ ...prev, cut: value }))}
              options={cutGrades}
              placeholder="Search cut grade..."
              required={!isMelee}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clarity" className="font-medium">
              Clarity
              <span className="text-destructive ml-1">*</span>
            </Label>
            <SearchableDropdown
              name="clarity"
              value={form.clarity}
              onChange={(value) => setForm(prev => ({ ...prev, clarity: value }))}
              options={clarities}
              placeholder="Search clarity grade..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shade" className="font-medium">
              Shade
              <span className="text-destructive ml-1">*</span>
            </Label>
          <SearchableDropdown
              name="shade"
              value={form.shade}
              onChange={(value) => setForm(prev => ({ ...prev, shade: value }))}
              options={shades}
              placeholder="Search diamond shade..."
              required={!isMelee}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shape" className="font-medium">
              Shape
              <span className="text-destructive ml-1">*</span>
            </Label>
            <SearchableDropdown
              name="shape"
              value={form.shape}
              onChange={(value) => setForm(prev => ({ ...prev, shape: value }))}
              options={shapes}
              placeholder="Search diamond shape..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="polish" className="font-medium">
              Polish
              <span className="text-destructive ml-1">*</span>
            </Label>
          <SearchableDropdown
              name="polish"
              value={form.polish}
              onChange={(value) => setForm(prev => ({ ...prev, polish: value }))}
              options={cutGrades}
              placeholder="Search polish grade..."
              required={!isMelee}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="symmetry" className="font-medium">
              Symmetry
              <span className="text-destructive ml-1">*</span>
            </Label>
          <SearchableDropdown
              name="symmetry"
              value={form.symmetry}
              onChange={(value) => setForm(prev => ({ ...prev, symmetry: value }))}
              options={cutGrades}
              placeholder="Search symmetry grade..."
              required={!isMelee}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fluorescence" className="font-medium">
              Fluorescence
              <span className="text-destructive ml-1">*</span>
            </Label>
          <SearchableDropdown
              name="fluorescence"
              value={form.fluorescence}
              onChange={(value) => setForm(prev => ({ ...prev, fluorescence: value }))}
              options={fluorescences}
              placeholder="Search fluorescence..."
              required={!isMelee}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="treatment" className="font-medium">
              Treatment
              <span className="text-destructive ml-1">*</span>
            </Label>
          <SearchableDropdown
              name="treatment"
              value={form.treatment}
              onChange={(value) => setForm(prev => ({ ...prev, treatment: value }))}
              options={treatments}
              placeholder="Search treatment type..."
              required={!isMelee}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="process" className="font-medium">
              Process
              <span className="text-destructive ml-1">*</span>
            </Label>
          <SearchableDropdown
              name="process"
              value={form.process}
              onChange={(value) => setForm(prev => ({ ...prev, process: value }))}
              options={processes}
              placeholder="Search process type..."
              required={!isMelee}
            />
          </div>
      </div>
    </section>

    {isMelee && (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">Melee Parcel</h3>
          <div className="flex-1 border-b"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="totalPieces" className="font-medium">
              Total Pieces
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="totalPieces"
              name="totalPieces"
              type="number"
              value={form.totalPieces}
              onChange={handleChange}
              required
              placeholder="e.g. 150"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sizeMin" className="font-medium">
              Size Min (mm)
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="sizeMin"
              name="sizeMin"
              type="number"
              value={form.sizeMin}
              onChange={handleChange}
              required
              placeholder="e.g. 1.0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sizeMax" className="font-medium">
              Size Max (mm)
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="sizeMax"
              name="sizeMax"
              type="number"
              value={form.sizeMax}
              onChange={handleChange}
              required
              placeholder="e.g. 2.0"
            />
          </div>
        </div>
      </section>
    )}
      {/* Measurements */}
      {!isMelee && (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">Measurements</h3>
          <div className="flex-1 border-b"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="measurement" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Measurement (mm)
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="measurement"
              name="measurement"
              value={form.measurement}
              onChange={handleChange}
              required
              placeholder="e.g. 5.00 x 5.00 x 3.00 mm"
            />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="diameter" className="font-medium">
              Diameter (mm)
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="diameter"
              name="diameter"
              type="number"
              value={form.diameter}
              onChange={handleChange}
              required
              placeholder="e.g. 6.50"
            />
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="ratio" className="font-medium">
              Ratio
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="ratio"
              name="ratio"
              value={form.ratio}
              onChange={handleChange}
              required
              placeholder="e.g. 1.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="table" className="font-medium">
              Table
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="table"
              name="table"
              value={form.table}
              onChange={handleChange}
              required
              placeholder="e.g. 57"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="depth" className="font-medium">
              Depth
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="depth"
              name="depth"
              value={form.depth}
              onChange={handleChange}
              required
              placeholder="e.g. 62.3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gridleMin" className="font-medium">
              Gridle Min
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="gridleMin"
              name="gridleMin"
              type="number"
              value={form.gridleMin}
              onChange={handleChange}
              required
              placeholder="e.g. 1.0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gridleMax" className="font-medium">
              Gridle Max
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="gridleMax"
              name="gridleMax"
              type="number"
              value={form.gridleMax}
              onChange={handleChange}
              required
              placeholder="e.g. 2.0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gridlePercentage" className="font-medium">
              Gridle Percentage
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="gridlePercentage"
              name="gridlePercentage"
              type="number"
              value={form.gridlePercentage}
              onChange={handleChange}
              required
              placeholder="e.g. 1.5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="crownHeight" className="font-medium">
              Crown Height
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="crownHeight"
              name="crownHeight"
              type="number"
              value={form.crownHeight}
              onChange={handleChange}
              required
              placeholder="e.g. 15.0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="crownAngle" className="font-medium">
              Crown Angle
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="crownAngle"
              name="crownAngle"
              type="number"
              value={form.crownAngle}
              onChange={handleChange}
              required
              placeholder="e.g. 34.5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pavilionAngle" className="font-medium">
              Pavilion Angle
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="pavilionAngle"
              name="pavilionAngle"
              type="number"
              value={form.pavilionAngle}
              onChange={handleChange}
              required
              placeholder="e.g. 40.8"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pavilionDepth" className="font-medium">
              Pavilion Depth
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="pavilionDepth"
              name="pavilionDepth"
              type="number"
              value={form.pavilionDepth}
              onChange={handleChange}
              required
              placeholder="e.g. 43.0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="culetSize" className="font-medium">
              Culet Size
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="culetSize"
              name="culetSize"
              type="number"
              value={form.culetSize}
              onChange={handleChange}
              required
              placeholder="e.g. 0.5"
            />
          </div>
        </div>
      </section>
      )}

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="description" className="font-medium">
          Description
          <span className="text-destructive ml-1">*</span>
        </Label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={3}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>


      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="flex justify-end gap-4 mt-8">
        <Button
          type="reset"
          variant="outline"
          onClick={() => setForm(initialState)}
          disabled={loading}
          className="min-w-[100px]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="min-w-[100px]"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Add Diamond'
          )}
        </Button>
      </div>
    </form>
  );
}

export default AddDiamondForm;

