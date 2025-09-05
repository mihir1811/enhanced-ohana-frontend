import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { gemstoneService } from '@/services/gemstoneService';
import { getCookie } from '@/lib/cookie-utils';
import { auctionProductTypes } from '@/config/sellerConfigData';

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
const CERTIFICATE_COMPANIES = [
  { value: '1', label: 'GIA' },
  { value: '2', label: 'IGI' },
  { value: '3', label: 'AGS' },
  { value: '4', label: 'HRD' },
  { value: '5', label: 'Other' },
];
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

interface EditGemstoneFormProps {
  initialData: any;
  onCancel?: () => void;
}

const EditGemstoneForm: React.FC<EditGemstoneFormProps> = ({ initialData, onCancel }) => {
  const [form, setForm] = useState<any>({
    ...initialData,
    isOnAuction: Boolean(initialData?.isOnAuction),
    images: [],
    // Auction fields
    productType: '',
    startTime: '',
    endTime: '',
    enableAuction: false
  });
  const [loading, setLoading] = useState(false);
  const [selectedGemsType, setSelectedGemsType] = useState<string | undefined>(initialData?.gemsType);
  // Extract initial image URLs from initialData (image1-image6)
  const extractInitialImageUrls = (data: any) => {
    const urls: string[] = [];
    for (let i = 1; i <= 6; i++) {
      const key = `image${i}`;
      if (data[key]) urls.push(data[key]);
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
      // Always append 'name' field explicitly
      formData.append('name', form.name ?? '');
      // Attach all other fields (except name, images, id, image1-6, seller, auction, isOnAuction, isSold, isDeleted, and auction-related fields)
      Object.entries(form).forEach(([key, value]) => {
        if (
          key !== 'images' &&
          key !== 'id' &&
          key !== 'name' &&
          key !== 'seller' &&
          key !== 'auction' &&
          key !== 'isOnAuction' &&
          key !== 'isSold' &&
          key !== 'isDeleted' &&
          key !== 'enableAuction' &&
          key !== 'productType' &&
          key !== 'startTime' &&
          key !== 'endTime' &&
          !/^image[1-6]$/.test(key) &&
          value !== undefined && value !== null && value !== ''
        ) {
          if (typeof value === 'boolean') {
            formData.append(key, value ? 'true' : 'false');
          } else {
            formData.append(key, value as string);
          }
        }
      });
      const response = await gemstoneService.updateGemstone(form.id, formData, token);
      if (!response || response.success === false) {
        throw new Error(response?.message || 'Failed to update gemstone');
      }

      // If auction is enabled, create auction
      if (form.enableAuction && form.productType && form.startTime && form.endTime) {
        const auctionData = {
          productId: form.id,
          productType: form.productType,
          startTime: new Date(form.startTime).toISOString(),
          endTime: new Date(form.endTime).toISOString()
        };

        const auctionResponse = await fetch('http://localhost:3000/api/v1/auction/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(auctionData)
        });

        if (!auctionResponse.ok) {
          const errorData = await auctionResponse.json();
          throw new Error(errorData?.message || 'Failed to create auction');
        }
      }

      toast.success('Gemstone updated successfully!' + (form.enableAuction ? ' Auction created!' : ''));
      if (onCancel) onCancel();
    } catch (err: any) {
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
            <label className="block font-medium mb-1">Name *</label>
            <input name="name" value={form.name} onChange={handleInput} required className="input" placeholder="e.g. Natural Ruby" />
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
            <label className="block font-medium mb-1">Sub Type *</label>
            <select name="subType" value={form.subType} onChange={handleSelect} required className="input" disabled={!selectedGemsType}>
              <option value="">{selectedGemsType ? 'Select sub type' : 'Select gem type first'}</option>
              {selectedGemsType &&
                GEM_SUBTYPES[selectedGemsType as keyof typeof GEM_SUBTYPES]?.map((sub: string) => (
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
            <label className="block font-medium mb-1">Seller Stock Number *</label>
            <input name="sellerStockNumber" value={form.sellerStockNumber} onChange={handleInput} required className="input" placeholder="e.g. 67890" />
          </div>
          <div>
            <label className="block font-medium mb-1">Quantity *</label>
            <input name="quantity" value={form.quantity} onChange={handleInput} required className="input" placeholder="e.g. 1" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block font-medium mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleInput} required rows={3} className="input" />
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
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
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
            <label className="block font-medium mb-1">Video URL *</label>
            <input name="videoURL" value={form.videoURL} onChange={handleInput} required className="input" placeholder="e.g. https://youtu.be/abcd1234" />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Price *</label>
            <input name="price" value={form.price} onChange={handleInput} required className="input" placeholder="e.g. 1000" />
          </div>
          <div>
            <label className="block font-medium mb-1">Carat *</label>
            <input name="carat" value={form.carat} onChange={handleInput} required className="input" placeholder="e.g. 2.5" />
          </div>
          <div>
            <label className="block font-medium mb-1">Discount (%) *</label>
            <input name="discount" value={form.discount} onChange={handleInput} required className="input" placeholder="e.g. 10" />
          </div>
        </div>
      </section>

      {/* Gemstone Specifications */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Gemstone Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Quality Grade *</label>
            <select name="qualityGrade" value={form.qualityGrade} onChange={handleSelect} required className="input">
              <option value="">Select quality grade</option>
              {QUALITY_GRADES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Composition *</label>
            <select name="composition" value={form.composition} onChange={handleSelect} required className="input">
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
            <label className="block font-medium mb-1">Color *</label>
            <select name="color" value={form.color} onChange={handleSelect} required className="input">
              <option value="">Select color</option>
              {COLORS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Clarity *</label>
            <select name="clarity" value={form.clarity} onChange={handleSelect} required className="input">
              <option value="">Select clarity</option>
              {CLARITIES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Hardness *</label>
            <input name="hardness" value={form.hardness} onChange={handleInput} required className="input" placeholder="e.g. 9" />
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
            <label className="block font-medium mb-1">Fluorescence *</label>
            <select name="fluoreScence" value={form.fluoreScence} onChange={handleSelect} required className="input">
              <option value="">Select fluorescence</option>
              {FLUORESCENCES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Treatment *</label>
            <select name="treatment" value={form.treatment} onChange={handleSelect} required className="input">
              <option value="">Select treatment</option>
              {TREATMENTS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Refractive Index *</label>
            <input name="refrectiveIndex" value={form.refrectiveIndex} onChange={handleInput} required className="input" placeholder="e.g. 1.76" />
          </div>
          <div>
            <label className="block font-medium mb-1">Birefringence *</label>
            <input name="birefringence" value={form.birefringence} onChange={handleInput} required className="input" placeholder="e.g. 0.008" />
          </div>
          <div>
            <label className="block font-medium mb-1">Process *</label>
            <select name="process" value={form.process} onChange={handleSelect} required className="input">
              <option value="">Select process</option>
              {PROCESSES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Cut *</label>
            <select name="cut" value={form.cut} onChange={handleSelect} required className="input">
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
            <label className="block font-medium mb-1">Certificate Company *</label>
            <select name="certificateCompanyId" value={form.certificateCompanyId} onChange={handleSelect} required className="input">
              <option value="">Select certificate company</option>
              {CERTIFICATE_COMPANIES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Auction Settings */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Auction Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableAuction"
              name="enableAuction"
              checked={form.enableAuction}
              onChange={handleInput}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="enableAuction" className="text-sm font-medium">
              Enable Auction for this Gemstone
            </label>
          </div>

          {form.enableAuction && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div>
                <label className="block font-medium mb-1">
                  Product Type *
                </label>
                <select
                  name="productType"
                  value={form.productType}
                  onChange={handleSelect}
                  required
                  className="input"
                >
                  <option value="">Select Product Type</option>
                  {auctionProductTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Auction Start Time *
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleInput}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Auction End Time *
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleInput}
                  required
                  className="input"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Auction Fields */}
      {(form.isOnAuction || form.auction) && (
        <section>
          <h3 className="text-lg font-semibold mb-2">Existing Auction Details (Legacy)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="col-span-3 text-sm text-yellow-700 mb-2">
              ⚠️ This section shows existing auction data. Use "Auction Settings" above to create new auctions.
            </div>
            <div>
              <label className="block font-medium mb-1">On Auction (Legacy)</label>
              <span className="text-sm">{form.isOnAuction ? 'Yes' : 'No'}</span>
            </div>
            {form.auction && (
              <>
                <div>
                  <label className="block font-medium mb-1">Legacy Start Time</label>
                  <span className="text-sm">{form.auction?.startTime ? new Date(form.auction.startTime).toLocaleString() : 'Not set'}</span>
                </div>
                <div>
                  <label className="block font-medium mb-1">Legacy End Time</label>
                  <span className="text-sm">{form.auction?.endTime ? new Date(form.auction.endTime).toLocaleString() : 'Not set'}</span>
                </div>
                <div>
                  <label className="block font-medium mb-1">Legacy Active Status</label>
                  <span className="text-sm">{form.auction?.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Auction Data Section */}
      {initialData?.auction && (
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold">Existing Auction Details</h3>
            <div className="flex-1 border-b border-gray-300"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div><span className="font-medium">Auction ID:</span> {initialData.auction.id}</div>
            <div><span className="font-medium">Product Type:</span> {initialData.auction.productType}</div>
            <div><span className="font-medium">Start Time:</span> {new Date(initialData.auction.startTime).toLocaleString()}</div>
            <div><span className="font-medium">End Time:</span> {new Date(initialData.auction.endTime).toLocaleString()}</div>
            <div><span className="font-medium">Is Active:</span> {initialData.auction.isActive ? 'Yes' : 'No'}</div>
            <div><span className="font-medium">Created:</span> {new Date(initialData.auction.createdAt).toLocaleString()}</div>
          </div>
        </section>
      )}

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
