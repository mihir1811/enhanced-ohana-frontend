import React, { useEffect, useState, useRef } from 'react';
import { getCookie } from '@/lib/cookie-utils';
import {
  diamondColors, fancyColors, fancyIntensities, fancyOvertones, cutGrades, clarities, shades, shapes, fluorescences, processes, treatments, certificateCompanies
} from '@/constants/diamondDropdowns';

type EditDiamondFormProps = {
  initialData?: any;
};

const initialState = {
  name: '', stoneType: '', description: '', images: [] as File[], videoURL: '', stockNumber: '', sellerSKU: '', origin: '', rap: '', price: '', discount: '', color: '', fancyColor: '', fancyIntencity: '', fancyOvertone: '', caratWeight: '', cut: '', clarity: '', shade: '', shape: '', polish: '', symmetry: '', fluorescence: '', treatment: '', process: '', measurement: '', diameter: '', ratio: '', table: '', depth: '', gridleMin: '', gridleMax: '', gridlePercentage: '', crownHeight: '', crownAngle: '', pavilionAngle: '', pavilionDepth: '', culetSize: '', certificateCompanyId: '', certificateNumber: '', inscription: '', certification: null as File | null
};


const normalizeImages = (data: any) => {
  // Collect image1–image6 into an array, filter null/empty
  return [data.image1, data.image2, data.image3, data.image4, data.image5, data.image6].filter(Boolean);
};

const EditDiamondForm: React.FC<EditDiamondFormProps> = ({ initialData }) => {
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

  const [form, setForm] = useState(() => {
    if (initialData) {
      const { images, ...rest } = initialData;
      return {
        ...initialState,
        ...rest,
        fancyColor: getDropdownValue(fancyColors, rest.fancyColor),
        fancyIntencity: getDropdownValue(fancyIntensities, rest.fancyIntencity),
        fancyOvertone: getDropdownValue(fancyOvertones, rest.fancyOvertone),
        shade: getDropdownValue(shades, rest.shade),
        fluorescence: getDropdownValue(fluorescences, rest.fluorescence),
        treatment: getDropdownValue(treatments, rest.treatment),
        process: getDropdownValue(processes, rest.process, 'process'),
        images: []
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
      const { images, ...rest } = initialData;
      setForm({
        ...initialState,
        ...rest,
        fancyColor: getDropdownValue(fancyColors, rest.fancyColor),
        fancyIntencity: getDropdownValue(fancyIntensities, rest.fancyIntencity),
        fancyOvertone: getDropdownValue(fancyOvertones, rest.fancyOvertone),
        shade: getDropdownValue(shades, rest.shade),
        fluorescence: getDropdownValue(fluorescences, rest.fluorescence),
        treatment: getDropdownValue(treatments, rest.treatment),
        process: getDropdownValue(processes, rest.process, 'process'),
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
    const { files } = e.target;
    if (!files) return;
    let fileArr = Array.from(files);
    if (form.images.length + fileArr.length > 6) {
      fileArr = fileArr.slice(0, 6 - form.images.length);
      setError('You can upload a maximum of 6 images.');
    } else {
      setError('');
    }
    setForm((prev: typeof form) => ({ ...prev, images: [...prev.images, ...fileArr].slice(0, 6) }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (idx: number) => {
    setForm((prev: typeof form) => ({ ...prev, images: prev.images.filter((_: File, i: number) => i !== idx) }));
  };
  const handleRemoveExistingImage = (idx: number) => {
    setExistingImages((prev: string[]) => prev.filter((_: string, i: number) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      const fields = [
        'stockNumber','name','description','origin','rap','price','discount','caratWeight','cut','color','shade','fancyColor','fancyIntencity','fancyOvertone','shape','symmetry','diameter','clarity','fluorescence','measurement','ratio','table','depth','gridleMin','gridleMax','gridlePercentage','crownHeight','crownAngle','pavilionAngle','pavilionDepth','culetSize','polish','treatment','inscription','certificateNumber','stoneType','process','certificateCompanyId','videoURL','sellerSKU','isOnAuction','isSold'
      ];
      fields.forEach((key) => {
        const value = (form as any)[key];
        if (typeof value !== 'undefined' && value !== null && value !== '') {
          formData.append(key, String(value));
        }
      });
      // Append new images
      if (form.images && form.images.length > 0) {
        form.images.forEach((file: File, idx: number) => {
          formData.append(`image${idx + 1}`, file);
        });
      }
      // Append certification file
      if (form.certification) {
        formData.append('certification', form.certification);
      }
      // Existing images (if API supports keeping them)
      existingImages.forEach((url, idx) => {
        formData.append(`existingImage${idx + 1}`, url);
      });
      const token = getCookie('token');
      if (!token) throw new Error('User not authenticated');
      const response = await import('@/services/diamondService').then(m => m.diamondService.updateDiamond(initialData.id, formData, token));
      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to update diamond');
      }
      alert('Diamond updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <form className="w-full mx-auto p-6 bg-white rounded-2xl shadow flex flex-col gap-8" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-2">Edit Diamond</h2>

      {/* Basic Information */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="input" placeholder="e.g. Round Brilliant Diamond" />
          </div>
          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="input" />
          </div>
        </div>
      </section>

      {/* Media */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Product Images *</label>
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="input"
              max={6}
              ref={fileInputRef}
              disabled={form.images.length + existingImages.length >= 6}
            />
            {/* Image preview grid */}
            {(existingImages.length > 0 || form.images.length > 0) && (
              <div className="flex flex-wrap gap-3 mt-3">
                {existingImages.map((img, idx) => (
                  <div key={img} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center relative group">
                    <img src={img} alt={`Preview ${idx + 1}`} className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(idx)}
                      className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow text-gray-700 hover:bg-red-500 hover:text-white transition"
                      title="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {form.images.map((img: File, idx: number) => {
                  const url = URL.createObjectURL(img);
                  return (
                    <div key={url} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center relative group">
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className="object-cover w-full h-full"
                        onLoad={() => URL.revokeObjectURL(url)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
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
            <label className="block font-medium mb-1">Video URL *</label>
            <input name="videoURL" value={form.videoURL} onChange={handleChange} required className="input" placeholder="e.g. https://youtu.be/abcd1234" />
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Product Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Stock Number *</label>
            <input name="stockNumber" type="number" value={form.stockNumber} onChange={handleChange} required className="input" placeholder="e.g. 1001" />
          </div>
          <div>
            <label className="block font-medium mb-1">Seller SKU</label>
            <input name="sellerSKU" value={form.sellerSKU} onChange={handleChange} className="input" placeholder="e.g. SKU-001" />
          </div>
          <div>
            <label className="block font-medium mb-1">Origin *</label>
            <input name="origin" value={form.origin} onChange={handleChange} required className="input" placeholder="e.g. South Africa" />
          </div>
          <div>
            <label className="block font-medium mb-1">RAP Price *</label>
            <input name="rap" type="number" value={form.rap} onChange={handleChange} required className="input" placeholder="e.g. 5000" />
          </div>
          <div>
            <label className="block font-medium mb-1">Price *</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} required className="input" placeholder="e.g. 4500" />
          </div>
          <div>
            <label className="block font-medium mb-1">Discount (%) *</label>
            <input name="discount" type="number" value={form.discount} onChange={handleChange} min={0} max={100} required className="input" placeholder="e.g. 10" />
          </div>
        </div>
      </section>

      {/* Diamond Specifications */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Diamond Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Color *</label>
            <select name="color" value={form.color} onChange={handleChange} required className="input">
              <option value="">Select Color</option>
              {diamondColors.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Fancy Color *</label>
            <select name="fancyColor" value={form.fancyColor} onChange={handleChange} required className="input">
              <option value="">Select Fancy Color</option>
              {fancyColors.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Fancy Intensity *</label>
            <select name="fancyIntencity" value={form.fancyIntencity} onChange={handleChange} required className="input">
              <option value="">Select Fancy Intensity</option>
              {fancyIntensities.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Fancy Overtone *</label>
            <select name="fancyOvertone" value={form.fancyOvertone} onChange={handleChange} required className="input">
              <option value="">Select Fancy Overtone</option>
              {fancyOvertones.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Carat Weight *</label>
            <input name="caratWeight" type="number" value={form.caratWeight} onChange={handleChange} required className="input" placeholder="e.g. 1.25" />
          </div>
          <div>
            <label className="block font-medium mb-1">Cut *</label>
            <select name="cut" value={form.cut} onChange={handleChange} required className="input">
              <option value="">Select Cut</option>
              {cutGrades.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Clarity *</label>
            <select name="clarity" value={form.clarity} onChange={handleChange} required className="input">
              <option value="">Select Clarity</option>
              {clarities.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Shade *</label>
            <select name="shade" value={form.shade} onChange={handleChange} required className="input">
              <option value="">Select Shade</option>
              {shades.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Shape *</label>
            <select name="shape" value={form.shape} onChange={handleChange} required className="input">
              <option value="">Select Shape</option>
              {shapes.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Polish *</label>
            <select name="polish" value={form.polish} onChange={handleChange} required className="input">
              <option value="">Select Polish</option>
              {cutGrades.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Symmetry *</label>
            <select name="symmetry" value={form.symmetry} onChange={handleChange} required className="input">
              <option value="">Select Symmetry</option>
              {cutGrades.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Fluorescence *</label>
            <select name="fluorescence" value={form.fluorescence} onChange={handleChange} required className="input">
              <option value="">Select Fluorescence</option>
              {fluorescences.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Treatment *</label>
            <select name="treatment" value={form.treatment} onChange={handleChange} required className="input">
              <option value="">Select Treatment</option>
              {treatments.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Process *</label>
            <select name="process" value={form.process} onChange={handleChange} required className="input">
              <option value="">Select Process</option>
              {processes.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Measurements */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Measurements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Measurement *</label>
            <input name="measurement" value={form.measurement} onChange={handleChange} required className="input" placeholder="e.g. 5.00 x 5.00 x 3.00 mm" />
          </div>
          <div>
            <label className="block font-medium mb-1">Diameter (mm) *</label>
            <input name="diameter" type="number" value={form.diameter} onChange={handleChange} required className="input" placeholder="e.g. 6.50" />
          </div>
          <div>
            <label className="block font-medium mb-1">Ratio *</label>
            <input name="ratio" value={form.ratio} onChange={handleChange} required className="input" placeholder="e.g. 1.00" />
          </div>
          <div>
            <label className="block font-medium mb-1">Table *</label>
            <input name="table" value={form.table} onChange={handleChange} required className="input" placeholder="e.g. 57" />
          </div>
          <div>
            <label className="block font-medium mb-1">Depth *</label>
            <input name="depth" value={form.depth} onChange={handleChange} required className="input" placeholder="e.g. 62.3" />
          </div>
          <div>
            <label className="block font-medium mb-1">Gridle Min *</label>
            <input name="gridleMin" type="number" value={form.gridleMin} onChange={handleChange} required className="input" placeholder="e.g. 1.0" />
          </div>
          <div>
            <label className="block font-medium mb-1">Gridle Max *</label>
            <input name="gridleMax" type="number" value={form.gridleMax} onChange={handleChange} required className="input" placeholder="e.g. 2.0" />
          </div>
          <div>
            <label className="block font-medium mb-1">Gridle Percentage *</label>
            <input name="gridlePercentage" type="number" value={form.gridlePercentage} onChange={handleChange} required className="input" placeholder="e.g. 1.5" />
          </div>
          <div>
            <label className="block font-medium mb-1">Crown Height *</label>
            <input name="crownHeight" type="number" value={form.crownHeight} onChange={handleChange} required className="input" placeholder="e.g. 15.0" />
          </div>
          <div>
            <label className="block font-medium mb-1">Crown Angle *</label>
            <input name="crownAngle" type="number" value={form.crownAngle} onChange={handleChange} required className="input" placeholder="e.g. 34.5" />
          </div>
          <div>
            <label className="block font-medium mb-1">Pavilion Angle *</label>
            <input name="pavilionAngle" type="number" value={form.pavilionAngle} onChange={handleChange} required className="input" placeholder="e.g. 40.8" />
          </div>
          <div>
            <label className="block font-medium mb-1">Pavilion Depth *</label>
            <input name="pavilionDepth" type="number" value={form.pavilionDepth} onChange={handleChange} required className="input" placeholder="e.g. 43.0" />
          </div>
          <div>
            <label className="block font-medium mb-1">Culet Size *</label>
            <input name="culetSize" type="number" value={form.culetSize} onChange={handleChange} required className="input" placeholder="e.g. 0.5" />
          </div>
        </div>
      </section>

      {/* Certification */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Certification</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Certificate Company *</label>
            <select
              name="certificateCompanyId"
              value={form.certificateCompanyId}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Select certificate company</option>
              {certificateCompanies.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Certificate Number *</label>
            <input name="certificateNumber" value={form.certificateNumber} onChange={handleChange} required className="input" placeholder="e.g. 123456789" />
          </div>
          <div>
            <label className="block font-medium mb-1">Inscription *</label>
            <input name="inscription" value={form.inscription} onChange={handleChange} required className="input" placeholder="e.g. GIA123456" />
          </div>
          <div className="md:col-span-3">
            <label className="block font-medium mb-1">Certification Document *</label>
            <input name="certification" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="input" placeholder="e.g. Upload certificate file" />
          </div>
        </div>
      </section>

      {/* Auction Data Section */}
      {initialData?.auction && (
        <section className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
          <h3 className="font-semibold text-blue-700 mb-2">Auction Details</h3>
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

      {error && <div className="text-red-600 font-medium">{error}</div>}
      <div className="flex justify-end gap-4 mt-4">
        <button type="reset" className="btn-secondary" disabled={loading}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
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

export default EditDiamondForm;
