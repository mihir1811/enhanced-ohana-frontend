
import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { diamondService } from '@/services/diamondService';
import { getCookie } from '@/lib/cookie-utils';

// Dropdown options
const diamondColors = [
  { value: 'D', label: 'D (Colorless)' },
  { value: 'E', label: 'E (Colorless)' },
  { value: 'F', label: 'F (Colorless)' },
  { value: 'G', label: 'G (Near Colorless)' },
  { value: 'H', label: 'H (Near Colorless)' },
  { value: 'I', label: 'I (Near Colorless)' },
  { value: 'J', label: 'J (Near Colorless)' },
  { value: 'K', label: 'K (Faint)' },
  { value: 'L', label: 'L (Faint)' },
  { value: 'M', label: 'M (Faint)' },
  { value: 'N', label: 'N (Very Light)' },
  { value: 'O', label: 'O (Very Light)' },
  { value: 'P', label: 'P (Very Light)' },
  { value: 'Q', label: 'Q (Very Light)' },
  { value: 'R', label: 'R (Very Light)' },
  { value: 'S', label: 'S (Light)' },
  { value: 'T', label: 'T (Light)' },
  { value: 'U', label: 'U (Light)' },
  { value: 'V', label: 'V (Light)' },
  { value: 'W', label: 'W (Light)' },
  { value: 'X', label: 'X (Light)' },
  { value: 'Y', label: 'Y (Light)' },
  { value: 'Z', label: 'Z (Light)' },
];
const fancyColors = [
  { value: 'Fancy Yellow', label: 'Fancy Yellow' },
  { value: 'Fancy Pink', label: 'Fancy Pink' },
  { value: 'Fancy Blue', label: 'Fancy Blue' },
  { value: 'Fancy Green', label: 'Fancy Green' },
  { value: 'Fancy Brown', label: 'Fancy Brown' },
  { value: 'Fancy Orange', label: 'Fancy Orange' },
  { value: 'Fancy Purple', label: 'Fancy Purple' },
  { value: 'Fancy Red', label: 'Fancy Red' },
  { value: 'Fancy Gray', label: 'Fancy Gray' },
  { value: 'Fancy Black', label: 'Fancy Black' },
];
const fancyIntensities = [
  { value: 'Faint', label: 'Faint' },
  { value: 'Very Light', label: 'Very Light' },
  { value: 'Light', label: 'Light' },
  { value: 'Fancy Light', label: 'Fancy Light' },
  { value: 'Fancy', label: 'Fancy' },
  { value: 'Fancy Intense', label: 'Fancy Intense' },
  { value: 'Fancy Vivid', label: 'Fancy Vivid' },
  { value: 'Fancy Deep', label: 'Fancy Deep' },
  { value: 'Fancy Dark', label: 'Fancy Dark' },
];
const fancyOvertones = [
  { value: 'None', label: 'None' },
  { value: 'Brownish', label: 'Brownish' },
  { value: 'Orangish', label: 'Orangish' },
  { value: 'Pinkish', label: 'Pinkish' },
  { value: 'Purplish', label: 'Purplish' },
  { value: 'Grayish', label: 'Grayish' },
  { value: 'Greenish', label: 'Greenish' },
  { value: 'Bluish', label: 'Bluish' },
  { value: 'Yellowish', label: 'Yellowish' },
];
const cutGrades = [
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Very Good', label: 'Very Good' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
];
const clarities = [
  { value: 'FL', label: 'FL' },
  { value: 'IF', label: 'IF' },
  { value: 'VVS1', label: 'VVS1' },
  { value: 'VVS2', label: 'VVS2' },
  { value: 'VS1', label: 'VS1' },
  { value: 'VS2', label: 'VS2' },
  { value: 'SI1', label: 'SI1' },
  { value: 'SI2', label: 'SI2' },
  { value: 'I1', label: 'I1' },
  { value: 'I2', label: 'I2' },
  { value: 'I3', label: 'I3' },
];
const shades = [
  { value: 'White', label: 'White' },
  { value: 'Yellow', label: 'Yellow' },
  { value: 'Brown', label: 'Brown' },
  { value: 'Pink', label: 'Pink' },
  { value: 'Blue', label: 'Blue' },
  { value: 'Green', label: 'Green' },
  { value: 'Gray', label: 'Gray' },
  { value: 'Black', label: 'Black' },
];
const shapes = [
  { value: 'Round', label: 'Round' },
  { value: 'Princess', label: 'Princess' },
  { value: 'Emerald', label: 'Emerald' },
  { value: 'Asscher', label: 'Asscher' },
  { value: 'Cushion', label: 'Cushion' },
  { value: 'Cushion Modified', label: 'Cushion Modified' },
  { value: 'Cushion Brilliant', label: 'Cushion Brilliant' },
  { value: 'Radiant', label: 'Radiant' },
  { value: 'Oval', label: 'Oval' },
  { value: 'Pear', label: 'Pear' },
  { value: 'Marquise', label: 'Marquise' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Trilliant', label: 'Trilliant' },
  { value: 'Baguette', label: 'Baguette' },
  { value: 'Tapered Baguette', label: 'Tapered Baguette' },
  { value: 'Half-moon', label: 'Half-moon' },
  { value: 'Flanders', label: 'Flanders' },
  { value: 'French', label: 'French' },
  { value: 'Lozenge', label: 'Lozenge' },
  { value: 'Bullet', label: 'Bullet' },
  { value: 'Kite', label: 'Kite' },
  { value: 'Shield', label: 'Shield' },
  { value: 'Star Cut', label: 'Star Cut' },
  { value: 'Rose Cut', label: 'Rose Cut' },
  { value: 'Old Miner', label: 'Old Miner' },
  { value: 'Old European', label: 'Old European' },
  { value: 'Euro Cut', label: 'Euro Cut' },
  { value: 'Briolette', label: 'Briolette' },
  { value: 'Trapezoid', label: 'Trapezoid' },
  { value: 'Pentagonal Cut', label: 'Pentagonal Cut' },
  { value: 'Hexagonal Cut', label: 'Hexagonal Cut' },
  { value: 'Octagonal Cut', label: 'Octagonal Cut' },
  { value: 'Portuguese Cut', label: 'Portuguese Cut' },
];
const fluorescences = [
  { value: 'None', label: 'None' },
  { value: 'Faint', label: 'Faint' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Strong', label: 'Strong' },
  { value: 'Very Strong', label: 'Very Strong' },
];
const processes = [
  { value: 'Natural', label: 'Natural' },
  { value: 'HPHT', label: 'HPHT (High Pressure High Temperature) – Lab-grown' },
  { value: 'CVD', label: 'CVD (Chemical Vapor Deposition) – Lab-grown' },
];
const treatments = [
  { value: 'Natural', label: 'Natural / Untreated' },
  { value: 'laserDrilled', label: 'Laser Drilled' },
  { value: 'fractureFilled', label: 'Fracture Filled' },
  { value: 'HPHT', label: 'HPHT (Color Treatment)' },
  { value: 'Irradiated', label: 'Irradiated' },
  { value: 'heatTreated', label: 'Annealed / Heat Treated' },
  { value: 'Coated', label: 'Coated' },
  { value: 'HPHT', label: 'Lab-Grown HPHT' },
  { value: 'CVD', label: 'Lab-Grown CVD' },
];
const certificateCompanies = [
  { value: '1', label: 'GIA' },
  { value: '2', label: 'IGI' },
  { value: '3', label: 'AGS' },
  { value: '4', label: 'HRD' },
  { value: '5', label: 'Other' },
];

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
  fancyColor: string,
  fancyIntencity: string,
  fancyOvertone: string,
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
  fancyColor: '',
  fancyIntencity: '',
  fancyOvertone: '',
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
  certificateCompanyId: '',
  certificateNumber: '',
  inscription: '',
  certification: null,
  // end of initialState
};

function AddDiamondForm() {
  const [form, setForm] = useState<DiamondFormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        'stockNumber', 'name', 'description', 'origin', 'rap', 'price', 'discount', 'caratWeight', 'cut', 'color', 'shade', 'fancyColor', 'fancyIntencity', 'fancyOvertone', 'shape', 'symmetry', 'diameter', 'clarity', 'fluorescence', 'measurement', 'ratio', 'table', 'depth', 'gridleMin', 'gridleMax', 'gridlePercentage', 'crownHeight', 'crownAngle', 'pavilionAngle', 'pavilionDepth', 'culetSize', 'polish', 'treatment', 'inscription', 'certificateNumber', 'stoneType', 'process', 'certificateCompanyId', 'videoURL', 'sellerSKU'
      ];
      fields.forEach((key) => {
        const value = (form as any)[key];
        if (typeof value !== 'undefined' && value !== null && value !== '') {
          formData.append(key, String(value));
        }
      });
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
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
      toast.error(err.message || 'Failed to add diamond');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full mx-auto p-6 bg-white rounded-2xl shadow flex flex-col gap-8" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-2">Add Diamond</h2>
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
              required
              onChange={handleFileChange}
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
              <option value="1">GIA</option>
              <option value="2">IGI</option>
              <option value="3">AGS</option>
              <option value="4">HRD</option>
              <option value="5">Other</option>
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
            <input name="certification" type="file" accept=".pdf,.jpg,.jpeg,.png" required onChange={handleFileChange} className="input" placeholder="e.g. Upload certificate file" />
          </div>
        </div>
      </section>

      {error && <div className="text-red-600 font-medium">{error}</div>}
        <div className="flex justify-end gap-4 mt-4">
        <button type="reset" className="btn-secondary" onClick={() => setForm(initialState)} disabled={loading}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Add Diamond'}</button>
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

export default AddDiamondForm;
