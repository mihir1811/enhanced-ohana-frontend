import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { getCookie } from '@/lib/cookie-utils';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchableDropdown from '@/components/shared/SearchableDropdown';
import {
  diamondColors, fancyColors, fancyIntensities, fancyOvertones, cutGrades, clarities, shades, shapes, fluorescences, processes, treatments
} from '@/constants/diamondDropdowns';
import { useCertificateCompanies } from '@/hooks/data/useCertificateCompanies';
import { auctionProductTypes } from '@/config/sellerConfigData';
import { auctionService } from '@/services/auctionService';
import toast from 'react-hot-toast';



interface DiamondData {
  id: string;
  name: string;
  stoneType: string;
  description: string;
  videoURL: string;
  stockNumber: string;
  sellerSKU: string;
  origin: string;
  rap: string;
  price: string;
  discount: string;
  color: string;
  fancyColor: string;
  fancyIntencity: string;
  fancyOvertone: string;
  caratWeight: string;
  cut: string;
  clarity: string;
  shade: string;
  shape: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  treatment: string;
  process: string;
  measurement: string;
  diameter: string;
  ratio: string;
  table: string;
  depth: string;
  gridleMin: string;
  gridleMax: string;
  gridlePercentage: string;
  crownHeight: string;
  crownAngle: string;
  pavilionAngle: string;
  pavilionDepth: string;
  culetSize: string;
  certificateCompanyId: string;
  certificateNumber: string;
  inscription: string;
  productType: string;
  startTime: string;
  endTime: string;
  enableAuction: boolean;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  auction?: {
    id: string;
    productType: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
    isSold: boolean;
    bids?: unknown[];
  };
}

type EditDiamondFormProps = {
  initialData?: DiamondData;
};

const initialState = {
  name: '', stoneType: '', description: '', images: [] as File[], videoURL: '', stockNumber: '', sellerSKU: '', origin: '', rap: '', price: '', discount: '', color: '', fancyColor: '', fancyIntencity: '', fancyOvertone: '', caratWeight: '', cut: '', clarity: '', shade: '', shape: '', polish: '', symmetry: '', fluorescence: '', treatment: '', process: '', measurement: '', diameter: '', ratio: '', table: '', depth: '', gridleMin: '', gridleMax: '', gridlePercentage: '', crownHeight: '', crownAngle: '', pavilionAngle: '', pavilionDepth: '', culetSize: '', certificateCompanyId: '', certificateNumber: '', inscription: '', certification: null as File | null,
  // Auction fields
  productType: '', startTime: '', endTime: '', enableAuction: false
};


const normalizeImages = (data: DiamondData): string[] => {
  // Collect image1–image6 into an array, filter null/empty
  return [data.image1, data.image2, data.image3, data.image4, data.image5, data.image6].filter((img): img is string => Boolean(img));
};

const EditDiamondForm: React.FC<EditDiamondFormProps> = ({ initialData }) => {
  // Use dynamic certificate companies
  const { options: certificateCompanies } = useCertificateCompanies();

  // Helper to map API string to dropdown value (case-insensitive, handle camelCase, spaces, etc)
  function normalizeApiValue(val: string | undefined) {
    if (!val) return '';
    // Convert camelCase or snake_case to spaced words, then title case
    let s = val.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
    s = s.replace(/\b\w/g, c => c.toUpperCase());
    return s.trim();
  }
  function getDropdownValue(options: { value: string; label: string }[], apiValue: string | undefined, field?: string) {
    if (!apiValue) return '';
    // Try direct match
    let found = options.find(opt => opt.value === apiValue || opt.label === apiValue);
    if (found) return found.value;
    // Try normalized match
    const norm = normalizeApiValue(apiValue);
    found = options.find(opt => opt.value.toLowerCase() === norm.toLowerCase() || opt.label.toLowerCase() === norm.toLowerCase());
    if (found) return found.value;
    // Try lowercased, spaceless, and camelCase-insensitive match
    const apiValLower = apiValue.toLowerCase().replace(/\s+/g, '');
    found = options.find(opt =>
      opt.value.toLowerCase().replace(/\s+/g, '') === apiValLower ||
      opt.label.toLowerCase().replace(/\s+/g, '') === apiValLower
    );
    if (found) return found.value;
    // Try matching ignoring case and non-alphanumeric
    const apiValAlpha = apiValue.toLowerCase().replace(/[^a-z0-9]/g, '');
    found = options.find(opt =>
      opt.value.toLowerCase().replace(/[^a-z0-9]/g, '') === apiValAlpha ||
      opt.label.toLowerCase().replace(/[^a-z0-9]/g, '') === apiValAlpha
    );
    if (found) return found.value;
    // Special mapping for process field (e.g. 'annealed' => 'Natural')
    if (field === 'process') {
      if (apiValue.toLowerCase() === 'annealed') {
        found = options.find(opt => opt.value.toLowerCase() === 'natural');
        if (found) return found.value;
      }
    }
    return apiValue;
  }

  const [form, setForm] = useState<typeof initialState>(() => {
    if (initialData) {
      return {
        ...initialState,
        ...initialData,
        fancyColor: getDropdownValue(fancyColors, initialData.fancyColor),
        fancyIntencity: getDropdownValue(fancyIntensities, initialData.fancyIntencity),
        fancyOvertone: getDropdownValue(fancyOvertones, initialData.fancyOvertone),
        shade: getDropdownValue(shades, initialData.shade),
        fluorescence: getDropdownValue(fluorescences, initialData.fluorescence),
        treatment: getDropdownValue(treatments, initialData.treatment),
        process: getDropdownValue(processes, initialData.process, 'process'),
        certificateCompanyId: initialData.certificateCompanyId ? String(initialData.certificateCompanyId) : '',
        images: [],
        certification: null
      };
    }
    return initialState;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>(initialData ? normalizeImages(initialData) : []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialState,
        ...initialData,
        fancyColor: getDropdownValue(fancyColors, initialData.fancyColor),
        fancyIntencity: getDropdownValue(fancyIntensities, initialData.fancyIntencity),
        fancyOvertone: getDropdownValue(fancyOvertones, initialData.fancyOvertone),
        shade: getDropdownValue(shades, initialData.shade),
        fluorescence: getDropdownValue(fluorescences, initialData.fluorescence),
        treatment: getDropdownValue(treatments, initialData.treatment),
        process: getDropdownValue(processes, initialData.process, 'process'),
        certificateCompanyId: initialData.certificateCompanyId ? String(initialData.certificateCompanyId) : '',
        images: []
      });
      setExistingImages(normalizeImages(initialData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev: typeof form) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev: typeof form) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files, name } = e.target;
    if (!files) return;

    if (name === 'images') {
      const fileArr = Array.from(files);
      if (form.images.length + fileArr.length > 6) {
        const limitedFiles = fileArr.slice(0, 6 - form.images.length);
        setError('You can upload a maximum of 6 images.');
        setForm((prev: typeof form) => ({ ...prev, images: [...prev.images, ...limitedFiles].slice(0, 6) }));
      } else {
        setError('');
        setForm((prev: typeof form) => ({ ...prev, images: [...prev.images, ...fileArr].slice(0, 6) }));
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else if (name === 'certification') {
      const file = files[0];
      if (file) {
        setForm((prev: typeof form) => ({ ...prev, certification: file }));
      }
    }
  };

  const handleRemoveImage = (idx: number) => {
    setForm((prev: typeof form) => ({ ...prev, images: prev.images.filter((_, i: number) => i !== idx) }));
  };
  const handleRemoveExistingImage = (idx: number) => {
    setExistingImages((prev: string[]) => prev.filter((_, i: number) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Prepare FormData for multipart/form-data
      const formDataToSend = new FormData();

      // Only append specific fields as per the curl request
      const fieldsToInclude = [
        'stoneType', 'stockNumber', 'sellerSKU', 'name', 'description', 'origin',
        'rap', 'price', 'discount', 'caratWeight', 'cut', 'color', 'shade',
        'fancyColor', 'fancyIntencity', 'fancyOvertone', 'shape', 'symmetry',
        'diameter', 'clarity', 'fluorescence', 'measurement', 'ratio', 'table',
        'depth', 'gridleMin', 'gridleMax', 'gridlePercentage', 'crownHeight',
        'crownAngle', 'pavilionAngle', 'pavilionDepth', 'culetSize', 'polish',
        'treatment', 'inscription', 'certificateNumber', 'process',
        'certificateCompanyId', 'videoURL'
      ];

      fieldsToInclude.forEach(key => {
        const value = form[key as keyof typeof form];
        if (value !== null && value !== undefined && value !== '') {
          formDataToSend.append(key, value.toString());
        }
      });

      // Handle images (image1 to image6)
      if (form.images && form.images.length > 0) {
        form.images.forEach((image, index) => {
          if (image) {
            formDataToSend.append(`image${index + 1}`, image);
          }
        });
      }

      // Handle certification file
      if (form.certification) {
        formDataToSend.append('certification', form.certification);
      }

      const token = getCookie('token');
      if (!token) throw new Error('User not authenticated');
      if (!initialData?.id) throw new Error('Invalid diamond data');
      
      const response = await import('@/services/diamondService').then(m => m.diamondService.updateDiamond(initialData.id, formDataToSend, token));
      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to update diamond');
      }

      // If auction is enabled, create auction
      if (form.enableAuction && form.productType && form.startTime && form.endTime && initialData?.id) {
        const auctionData = {
          productId: initialData.id,
          productType: form.productType as 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond',
          startTime: new Date(form.startTime).toISOString(),
          endTime: new Date(form.endTime).toISOString()
        };

        const auctionResponse = await auctionService.createAuction(auctionData, token);

        if (!auctionResponse || auctionResponse.success === false) {
          throw new Error(auctionResponse?.message || 'Failed to create auction');
        }
      }
      toast.success('Diamond updated successfully!' + (form.enableAuction ? ' Auction created!' : ''));

      // alert('Diamond updated successfully!' + (form.enableAuction ? ' Auction created!' : ''));
    } catch (error) {
      const err = error as Error;
      setError(err.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <form className="w-full mx-auto bg-card flex flex-col gap-8" onSubmit={handleSubmit} noValidate>
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-primary/90 to-primary bg-clip-text ">Edit Diamond</h2>
        <p className="text-muted-foreground text-sm">Edit the details below to update this diamond in your inventory.</p>
      </div>

      {/* Basic Information */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-foreground/90">Basic Information</h3>
          <div className="flex-1 border-b border-border/40"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1 text-foreground/90">
              Name
              <span className="text-destructive text-xs">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Round Brilliant Diamond"
              className="w-full transition-all duration-200 hover:border-primary/50"
            />
          </div>
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
        </div>
      </section>

      {/* Media */}
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
              ${existingImages.length === 0 && form.images.length === 0 ? 'p-6' : 'p-4'}`}
                >
                  {existingImages.length === 0 && form.images.length === 0 ? (
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
                        {/* Add Product Box */}
                        {(existingImages.length + form.images.length) < 6 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById('images')?.click();
                            }}
                            className="aspect-square rounded-md border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors bg-background/50 hover:bg-background/80 cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-muted-foreground">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span className="text-sm text-muted-foreground font-medium">Add Product</span>
                          </button>
                        )}
                        {existingImages.map((img, idx) => (
                          <div key={idx} className="relative group aspect-square">
                            <Image
                              src={img}
                              alt={`Product image ${idx + 1}`}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemoveExistingImage(idx);
                                }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                        {form.images.map((img: File, idx: number) => {
                          const url = URL.createObjectURL(img);
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
                                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    max={6}
                    ref={fileInputRef}
                    disabled={form.images.length + existingImages.length >= 6}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='w-1/2 mt-4 space-y-2'>
          <Label htmlFor="videoURL" className="font-medium">
            Video URL
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="videoURL"
            name="videoURL"
            value={form.videoURL}
            onChange={handleChange}
            required
            placeholder="e.g. https://youtu.be/abcd1234"
            className="w-full transition-all duration-200 hover:border-primary/50"
          />
        </div>

        {/* Certification File Upload */}
        <div className='w-1/2 mt-4 space-y-2'>
          <Label htmlFor="certification" className="font-medium">
            Certification File
          </Label>
          <div className="space-y-2">
            <Input
              id="certification"
              name="certification"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full transition-all duration-200 hover:border-primary/50"
              required={false}
            />
            {form.certification && (
              <p className="text-sm text-muted-foreground">
                Selected: {form.certification.name}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-foreground/90">Product Details</h3>
          <div className="flex-1 border-b border-border/40"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className='space-y-2'>
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
              className="w-full transition-all duration-200 hover:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sellerSKU" className="font-medium">
              Seller SKU
            </Label>
            <Input
              id="sellerSKU"
              name="sellerSKU"
              value={form.sellerSKU}
              onChange={handleChange}
              placeholder="e.g. SKU-001"
              className="w-full transition-all duration-200 hover:border-primary/50"
            />
          </div>
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
              className="w-full transition-all duration-200 hover:border-primary/50"
            />
          </div>
          <div className='space-y-2'>
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
              className="w-full transition-all duration-200 hover:border-primary/50"
            />
          </div>
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
              className="w-full transition-all duration-200 hover:border-primary/50"
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
              className="w-full transition-all duration-200 hover:border-primary/50"
            />
          </div>
        </div>
      </section>

      {/* Diamond Specifications */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-foreground/90">Diamond Specifications</h3>
          <div className="flex-1 border-b border-border/40"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="color" className="font-medium">
              Color
              <span className="text-destructive ml-1">*</span>
            </Label>
            <SearchableDropdown
              name="color"
              options={diamondColors}
              value={form.color}
              onChange={(value) => setForm(prev => ({ ...prev, color: value }))}
              placeholder="Select Color"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fancyColor" className="font-medium">
              Fancy Color
              <span className="text-destructive ml-1">*</span>
            </Label>
            <SearchableDropdown
              name="fancyColor"
              options={fancyColors}
              value={form.fancyColor}
              onChange={(value) => setForm(prev => ({ ...prev, fancyColor: value }))}
              placeholder="Select Fancy Color"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fancyIntencity" className="font-medium">
              Fancy Intensity
              <span className="text-destructive ml-1">*</span>
            </Label>
            <SearchableDropdown
              name="fancyIntencity"
              options={fancyIntensities}
              value={form.fancyIntencity}
              onChange={(value) => setForm(prev => ({ ...prev, fancyIntencity: value }))}
              placeholder="Select Fancy Intensity"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fancyOvertone" className="font-medium">
              Fancy Overtone
              <span className="text-destructive ml-1">*</span>
            </Label>
            <SearchableDropdown
              name="fancyOvertone"
              options={fancyOvertones}
              value={form.fancyOvertone}
              onChange={(value) => setForm(prev => ({ ...prev, fancyOvertone: value }))}
              placeholder="Select Fancy Overtone"
              required
            />
          </div>
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
              className="w-full transition-all duration-200 hover:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cut" className="font-medium">
              Cut
              <span className="text-destructive ml-1">*</span>
            </Label>
            <SearchableDropdown
              name="cut"
              options={cutGrades}
              value={form.cut}
              onChange={(value) => setForm(prev => ({ ...prev, cut: value }))}
              placeholder="Select Cut"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clarity" className="font-medium">
              Clarity
              <span className="text-destructive ml-1">*</span>
            </Label>
            <SearchableDropdown
              name="clarity"
              options={clarities}
              value={form.clarity}
              onChange={(value) => setForm(prev => ({ ...prev, clarity: value }))}
              placeholder="Select Clarity"
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
              options={shades}
              value={form.shade}
              onChange={(value) => setForm(prev => ({ ...prev, shade: value }))}
              placeholder="Select Shade"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shape" className="font-medium">
              Shape
              <span className="text-destructive ml-1">*</span>
            </Label>
            <SearchableDropdown
              name="shape"
              options={shapes}
              value={form.shape}
              onChange={(value) => setForm(prev => ({ ...prev, shape: value }))}
              placeholder="Select Shape"
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
              options={cutGrades}
              value={form.polish}
              onChange={(value) => setForm(prev => ({ ...prev, polish: value }))}
              placeholder="Select Polish"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="symmetry" className="font-medium">
              Symmetry
              <span className="text-destructive ml-1">*</span>
            </Label>
            <SearchableDropdown
              name="symmetry"
              options={cutGrades}
              value={form.symmetry}
              onChange={(value) => setForm(prev => ({ ...prev, symmetry: value }))}
              placeholder="Select Symmetry"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fluorescence" className="font-medium">
              Fluorescence
              <span className="text-destructive ml-1">*</span>
            </Label>
            <SearchableDropdown
              name="fluorescence"
              options={fluorescences}
              value={form.fluorescence}
              onChange={(value) => setForm(prev => ({ ...prev, fluorescence: value }))}
              placeholder="Select Fluorescence"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="treatment" className="font-medium">
              Treatment
              <span className="text-destructive ml-1">*</span>
            </Label>
            <SearchableDropdown
              name="treatment"
              options={treatments}
              value={form.treatment}
              onChange={(value) => setForm(prev => ({ ...prev, treatment: value }))}
              placeholder="Select Treatment"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="process" className="font-medium">
              Process
              <span className="text-destructive ml-1">*</span>
            </Label>
            <SearchableDropdown
              name="process"
              options={processes}
              value={form.process}
              onChange={(value) => setForm(prev => ({ ...prev, process: value }))}
              placeholder="Select Process"
              required
            />
          </div>
        </div>
      </section>

      {/* Measurements */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-foreground/90">Measurements</h3>
          <div className="flex-1 border-b border-border/40"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="measurement" className="font-medium">
              Measurement
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="measurement"
              name="measurement"
              value={form.measurement}
              onChange={handleChange}
              required
              placeholder="e.g. 5.00 x 5.00 x 3.00 mm"
              className="w-full transition-all duration-200 hover:border-primary/50"
            />
          </div>
          <div className="space-y-2">
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
              className="w-full transition-all duration-200 hover:border-primary/50"
            />
          </div>
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
              className="w-full transition-all duration-200 hover:border-primary/50"
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
              className="w-full transition-all duration-200 hover:border-primary/50"
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
              className="w-full transition-all duration-200 hover:border-primary/50"
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
              className="w-full transition-all duration-200 hover:border-primary/50"
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
              className="w-full transition-all duration-200 hover:border-primary/50"
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
              className="w-full transition-all duration-200 hover:border-primary/50"
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
              className="w-full transition-all duration-200 hover:border-primary/50"
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
              className="w-full transition-all duration-200 hover:border-primary/50"
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
              className="w-full transition-all duration-200 hover:border-primary/50"
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
              className="w-full transition-all duration-200 hover:border-primary/50"
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
              className="w-full transition-all duration-200 hover:border-primary/50"
            />
          </div>
        </div>
      </section>

      {/* Certification */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-foreground/90">Certification</h3>
          <div className="flex-1 border-b border-border/40"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="certificateCompanyId" className="font-medium">
              Certificate Company
              <span className="text-destructive ml-1">*</span>
            </Label>
            <SearchableDropdown
              name="certificateCompanyId"
              options={certificateCompanies}
              value={form.certificateCompanyId}
              onChange={(value) => setForm(prev => ({ ...prev, certificateCompanyId: value }))}
              placeholder="Select Certificate Company"
              required
            />
          </div>
          <div className='space-y-2'>
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
              className="w-full transition-all duration-200 hover:border-primary/50"
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
              className="w-full transition-all duration-200 hover:border-primary/50"
            />
          </div>
          <div className="md:col-span-3 space-y-2">
            <Label htmlFor="certification" className="font-medium">
              Certification Document
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="certification"
                  className={`relative flex flex-col items-center justify-center w-full 
                    border border-dashed rounded-md cursor-pointer 
                    bg-background/50 hover:bg-background/80 
                    border-border hover:border-primary/50
                    transition-all duration-200
                    ${!form.certification ? 'p-6' : 'p-4'}`}
                >
                  {!form.certification ? (
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
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground/90">{form.certification.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click to change file
                        </p>
                      </div>
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
                </label>
              </div>
              <div className="mt-2 text-center text-sm text-muted-foreground">
                Maximum File Size 4 MB
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auction Form Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-foreground/90">Auction Settings</h3>
          <div className="flex-1 border-b border-border/40"></div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableAuction"
              name="enableAuction"
              checked={form.enableAuction}
              onChange={(e) => setForm(prev => ({ ...prev, enableAuction: e.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="enableAuction" className="text-sm font-medium">
              Enable Auction for this Diamond
            </Label>
          </div>

          {form.enableAuction && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-card/50 border border-border/40 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="productType" className="text-sm font-medium flex items-center gap-1 text-foreground/90">
                  Product Type
                  <span className="text-destructive text-xs">*</span>
                </Label>
                <select
                  id="productType"
                  name="productType"
                  value={form.productType}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Product Type</option>
                  {auctionProductTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm font-medium flex items-center gap-1 text-foreground/90">
                  Auction Start Time
                  <span className="text-destructive text-xs">*</span>
                </Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                  className="w-full transition-all duration-200 hover:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm font-medium flex items-center gap-1 text-foreground/90">
                  Auction End Time
                  <span className="text-destructive text-xs">*</span>
                </Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                  className="w-full transition-all duration-200 hover:border-primary/50"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Auction Data Section */}
      {initialData?.auction && (
        <section className="bg-card/50 border border-border/40 rounded-lg p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xl font-semibold text-foreground/90">Auction Details</h3>
            <div className="flex-1 border-b border-border/40"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div><span className="font-medium">Auction ID:</span> {initialData.auction.id}</div>
            <div><span className="font-medium">Product Type:</span> {initialData.auction.productType}</div>
            <div><span className="font-medium">Start Time:</span> {new Date(initialData.auction.startTime).toLocaleString()}</div>
            <div><span className="font-medium">End Time:</span> {new Date(initialData.auction.endTime).toLocaleString()}</div>
            <div><span className="font-medium">Is Active:</span> {initialData.auction.isActive ? 'Yes' : 'No'}</div>
            <div><span className="font-medium">Is Sold:</span> {initialData.auction.isSold ? 'Yes' : 'No'}</div>
            <div><span className="font-medium">Bids:</span> {initialData.auction.bids?.length ?? 0}</div>
          </div>
        </section>
      )}

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
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditDiamondForm;
