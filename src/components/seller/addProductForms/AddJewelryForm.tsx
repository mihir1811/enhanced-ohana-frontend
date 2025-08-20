import { jewelryService } from '@/services/jewelryService';
// ...existing code will be replaced with a new, full-featured form matching your requirements...
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

// --- Dropdown options and mappings (label-value format) ---
const DROPDOWN_OPTIONS = {
  category: [
    { label: 'Rings', value: 'Rings' },
    { label: 'Necklaces', value: 'Necklaces' },
    { label: 'Chains', value: 'Chains' },
    { label: 'Earrings', value: 'Earrings' },
    { label: 'Bracelets', value: 'Bracelets' },
    { label: 'Watches', value: 'Watches' },
    { label: 'Accessories', value: 'Accessories' }
  ],
  subcategory: {
    Rings: [
      { label: 'Engagement Ring', value: 'Engagement Ring' },
      { label: 'Wedding Band', value: 'Wedding Band' },
      { label: 'Eternity Ring', value: 'Eternity Ring' },
      { label: 'Promise Ring', value: 'Promise Ring' },
      { label: 'Cocktail Ring', value: 'Cocktail Ring' },
      { label: 'Statement Ring', value: 'Statement Ring' },
      { label: 'Stacking Ring', value: 'Stacking Ring' },
      { label: 'Solitaire', value: 'Solitaire' },
      { label: 'Halo', value: 'Halo' },
      { label: 'Three Stone', value: 'Three Stone' },
      { label: 'Pave', value: 'Pave' },
      { label: 'Channel', value: 'Channel' },
      { label: 'Bezel', value: 'Bezel' },
      { label: 'Tension', value: 'Tension' },
      { label: 'Vintage', value: 'Vintage' },
      { label: 'Modern', value: 'Modern' }
    ],
    Necklaces: [
      { label: 'Beaded', value: 'Beaded' },
      { label: 'Pearl', value: 'Pearl' },
      { label: 'Tennis', value: 'Tennis' },
      { label: 'Festoon', value: 'Festoon' },
      { label: 'Initial', value: 'Initial' },
      { label: 'Sautoir', value: 'Sautoir' },
      { label: 'Torque', value: 'Torque' },
      { label: 'Lariat', value: 'Lariat' },
      { label: 'Graduated', value: 'Graduated' },
      { label: 'Collar', value: 'Collar' },
      { label: 'Pendant', value: 'Pendant' },
      { label: 'Station', value: 'Station' },
      { label: 'Multi-Layer', value: 'Multi-Layer' },
      { label: 'Charm', value: 'Charm' },
      { label: 'Bib', value: 'Bib' },
      { label: 'Solitaire', value: 'Solitaire' },
      { label: 'Tassel', value: 'Tassel' },
      { label: 'Leather', value: 'Leather' },
      { label: 'Bauble', value: 'Bauble' },
      { label: 'Rivière', value: 'Rivière' },
      { label: 'Choker', value: 'Choker' },
      { label: 'Torsade', value: 'Torsade' },
      { label: 'Locket', value: 'Locket' },
      { label: 'Negligee', value: 'Negligee' },
      { label: 'Plastron', value: 'Plastron' },
      { label: 'Birthstone', value: 'Birthstone' },
      { label: 'Fringe', value: 'Fringe' },
      { label: 'Thread', value: 'Thread' },
      { label: 'Opera', value: 'Opera' },
      { label: 'Statement', value: 'Statement' },
      { label: 'Byadere', value: 'Byadere' }
    ],
    Chains: [
      { label: 'Cable Chain', value: 'Cable Chain' },
      { label: 'Rope Chain', value: 'Rope Chain' },
      { label: 'Box Chain', value: 'Box Chain' },
      { label: 'Curb Chain', value: 'Curb Chain' },
      { label: 'Figaro Chain', value: 'Figaro Chain' },
      { label: 'Snake Chain', value: 'Snake Chain' },
      { label: 'Wheat Chain', value: 'Wheat Chain' },
      { label: 'Link Chain', value: 'Link Chain' }
    ],
    Earrings: [
      { label: 'Bajoran', value: 'Bajoran' },
      { label: 'Barbell', value: 'Barbell' },
      { label: 'Cartilage', value: 'Cartilage' },
      { label: 'chandbali', value: 'chandbali' },
      { label: 'Barbell', value: 'Barbell' },
      { label: 'Cartilage', value: 'Cartilage' },
      { label: 'Chandelier', value: 'Chandelier' },
      { label: 'Cluster', value: 'Cluster' },
      { label: 'Dangle', value: 'Dangle' },
      { label: 'Drop', value: 'Drop' },
      { label: 'Ear Climbers (Crawlers)', value: 'Ear Climbers (Crawlers)' },
      { label: 'Ear Cuffs', value: 'Ear Cuffs' },
      { label: 'Gauge', value: 'Gauge' },
      { label: 'Halo', value: 'Halo' },
      { label: 'Hoop', value: 'Hoop' },
      { label: 'Huggie', value: 'Huggie' },
      { label: 'Jacket', value: 'Jacket' },
      { label: 'Jhumanka', value: 'Jhumanka' },
      { label: 'Single', value: 'Single' },
      { label: 'Stud', value: 'Stud' },
      { label: 'tassel', value: 'tassel' },
      { label: 'Threader', value: 'Threader' },
      { label: 'Mismatched', value: 'Mismatched' },
      { label: 'Others', value: 'Others' }
    ],
    Bracelets: [
      { label: 'Bangle', value: 'Bangle' },
      { label: 'Beaded', value: 'Beaded' },
      { label: 'Chain Link', value: 'Chain Link' },
      { label: 'Charm', value: 'Charm' },
      { label: 'Cuff', value: 'Cuff' },
      { label: 'Kada', value: 'Kada' },
      { label: 'Pearl', value: 'Pearl' },
      { label: 'Slider', value: 'Slider' },
      { label: 'Tennis', value: 'Tennis' },
      { label: 'Wrap', value: 'Wrap' },
      { label: 'Cord', value: 'Cord' },
      { label: 'Braided', value: 'Braided' },
      { label: 'Multi Layer', value: 'Multi Layer' },
      { label: 'Hololith', value: 'Hololith' },
      { label: 'Kaliras', value: 'Kaliras' },
      { label: 'Bar', value: 'Bar' }
    ],
    Watches: [
      { label: 'Rolex', value: 'Rolex' },
      { label: 'Cartier', value: 'Cartier' },
      { label: 'Omega', value: 'Omega' },
      { label: 'Patek Philippe', value: 'Patek Philippe' },
      { label: 'Audemars Piguet', value: 'Audemars Piguet' },
      { label: 'TAG Heuer', value: 'TAG Heuer' },
      { label: 'IWC', value: 'IWC' },
      { label: 'Breitling', value: 'Breitling' },
      { label: 'Hublot', value: 'Hublot' },
      { label: 'Panerai', value: 'Panerai' }
    ],
    Accessories: [
      { label: 'Maang Tikka', value: 'Maang Tikka' },
      { label: 'Nose Pin', value: 'Nose Pin' },
      { label: 'Anklet', value: 'Anklet' },
      { label: 'Charms', value: 'Charms' },
      { label: 'Hair Pin', value: 'Hair Pin' },
      { label: 'Cuff Links', value: 'Cuff Links' },
      { label: 'Armlet', value: 'Armlet' },
      { label: 'Brooch', value: 'Brooch' },
      { label: 'Belly Chain', value: 'Belly Chain' },
      { label: 'Belly Button Ring', value: 'Belly Button Ring' },
      { label: 'Toe Ring', value: 'Toe Ring' },
      { label: 'Chatelaine', value: 'Chatelaine' }
    ]
  },
  gender: [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex', value: 'unisex' },
    { label: 'Kids', value: 'kids' }
  ],
  metalType: [
    { label: 'Yellow Gold', value: 'yellow-gold' },
    { label: 'White Gold', value: 'white-gold' },
    { label: 'Rose Gold', value: 'rose-gold' },
    { label: 'Platinum', value: 'platinum' },
    { label: 'Palladium', value: 'palladium' },
    { label: 'Silver', value: 'silver' }
  ],
  metalPurity: {
    'yellow-gold': [
      { label: '18KT', value: '18KT' },
      { label: '22KT', value: '22KT' },
      { label: '24KT', value: '24KT' },
      { label: '14KT', value: '14KT' },
      { label: '10KT', value: '10KT' }
    ],
    'white-gold': [
      { label: '18KT', value: '18KT' },
      { label: '22KT', value: '22KT' },
      { label: '24KT', value: '24KT' },
      { label: '14KT', value: '14KT' },
      { label: '10KT', value: '10KT' }
    ],
    'rose-gold': [
      { label: '18KT', value: '18KT' },
      { label: '22KT', value: '22KT' },
      { label: '24KT', value: '24KT' },
      { label: '14KT', value: '14KT' },
      { label: '10KT', value: '10KT' }
    ],
    'silver': [
      { label: '925 Silver', value: '925' }
    ],
    'platinum': [
      { label: '950 Platinum', value: '950' },
      { label: '900 Platinum', value: '900' }
    ],
    'palladium': [
      { label: 'Palladium', value: 'palladium' }
    ]
  },
  style: [
    { label: 'Cuff', value: 'Cuff' },
    { label: 'Bangle', value: 'Bangle' },
    { label: 'Chain', value: 'Chain' },
    { label: 'Pendant', value: 'Pendant' },
    { label: 'Beaded', value: 'Beaded' },
    { label: 'Charm', value: 'Charm' },
    { label: 'Link', value: 'Link' },
    { label: 'Slider', value: 'Slider' },
    { label: 'Wrap', value: 'Wrap' },
    { label: 'Other', value: 'Other' }
  ],
  chain_type: [
    { label: 'Cable', value: 'Cable' },
    { label: 'Rope', value: 'Rope' },
    { label: 'Box', value: 'Box' },
    { label: 'Curb', value: 'Curb' },
    { label: 'Figaro', value: 'Figaro' },
    { label: 'Snake', value: 'Snake' },
    { label: 'Wheat', value: 'Wheat' },
    { label: 'Link', value: 'Link' },
    { label: 'Other', value: 'Other' }
  ],
  clasp_type: [
    { label: 'Lobster', value: 'Lobster' },
    { label: 'Spring Ring', value: 'Spring Ring' },
    { label: 'Toggle', value: 'Toggle' },
    { label: 'Box', value: 'Box' },
    { label: 'Magnetic', value: 'Magnetic' },
    { label: 'Hook', value: 'Hook' },
    { label: 'Barrel', value: 'Barrel' },
    { label: 'Other', value: 'Other' }
  ],
  gemstoneType: [
    { label: 'Diamond', value: 'Diamond' },
    { label: 'Ruby', value: 'Ruby' },
    { label: 'Sapphire', value: 'Sapphire' },
    { label: 'Emerald', value: 'Emerald' },
    { label: 'Pearl', value: 'Pearl' },
    { label: 'Opal', value: 'Opal' },
    { label: 'Topaz', value: 'Topaz' },
    { label: 'Amethyst', value: 'Amethyst' },
    { label: 'Garnet', value: 'Garnet' },
    { label: 'Aquamarine', value: 'Aquamarine' },
    { label: 'Other', value: 'Other' }
  ],
  gemstoneShape: [
    { label: 'Round', value: 'Round' },
    { label: 'Oval', value: 'Oval' },
    { label: 'Cushion', value: 'Cushion' },
    { label: 'Princess', value: 'Princess' },
    { label: 'Emerald', value: 'Emerald' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Marquise', value: 'Marquise' },
    { label: 'Heart', value: 'Heart' },
    { label: 'Radiant', value: 'Radiant' },
    { label: 'Asscher', value: 'Asscher' },
    { label: 'Trillion', value: 'Trillion' },
    { label: 'Baguette', value: 'Baguette' },
    { label: 'Other', value: 'Other' }
  ],
  gemstoneColor: [
    { label: 'D', value: 'D' }, { label: 'E', value: 'E' }, { label: 'F', value: 'F' }, { label: 'G', value: 'G' }, { label: 'H', value: 'H' }, { label: 'I', value: 'I' }, { label: 'J', value: 'J' }, { label: 'K', value: 'K' }, { label: 'L', value: 'L' }, { label: 'M', value: 'M' }, { label: 'N', value: 'N' }, { label: 'O', value: 'O' }, { label: 'P', value: 'P' }, { label: 'Q', value: 'Q' }, { label: 'R', value: 'R' }, { label: 'S', value: 'S' }, { label: 'T', value: 'T' }, { label: 'U', value: 'U' }, { label: 'V', value: 'V' }, { label: 'W', value: 'W' }, { label: 'X', value: 'X' }, { label: 'Y', value: 'Y' }, { label: 'Z', value: 'Z' }, { label: 'Other', value: 'Other' }
  ],
  gemstoneClarity: [
    { label: 'FL', value: 'FL' }, { label: 'IF', value: 'IF' }, { label: 'VVS1', value: 'VVS1' }, { label: 'VVS2', value: 'VVS2' }, { label: 'VS1', value: 'VS1' }, { label: 'VS2', value: 'VS2' }, { label: 'SI1', value: 'SI1' }, { label: 'SI2', value: 'SI2' }, { label: 'I1', value: 'I1' }, { label: 'I2', value: 'I2' }, { label: 'I3', value: 'I3' }, { label: 'Other', value: 'Other' }
  ],
  gemstoneCut: [
    { label: 'Excellent', value: 'Excellent' }, { label: 'Very Good', value: 'Very Good' }, { label: 'Good', value: 'Good' }, { label: 'Fair', value: 'Fair' }, { label: 'Poor', value: 'Poor' }, { label: 'Other', value: 'Other' }
  ],
  gemstoneCertification: [
    { label: 'GIA', value: 'GIA' }, { label: 'IGI', value: 'IGI' }, { label: 'HRD', value: 'HRD' }, { label: 'AGS', value: 'AGS' }, { label: 'EGL', value: 'EGL' }, { label: 'Other', value: 'Other' }
  ]
};

// --- Main AddJewelryForm component ---
type Stone = {
  type: string;
  shape: string;
  carat: string;
  color: string;
  clarity: string;
  cut: string;
  certification: string;
};
type Attribute = {
  style: string;
  chain_type: string;
  clasp_type: string;
  length_cm: string;
  is_adjustable: boolean;
};
type JewelryFormState = {
  name: string;
  skuCode: string;
  category: string;
  subcategory: string;
  collection: string;
  gender: string;
  occasion: string;
  metalType: string;
  metalPurity: string;
  metalWeight: string;
  basePrice: string;
  makingCharge: string;
  tax: string;
  totalPrice: string;
  description: string;
  videoURL: string;
  stockNumber: string;
  stones: Stone[];
  attributes: Attribute;
  images: File[];
};

const AddJewelryForm = () => {
  // --- State ---
  const [form, setForm] = useState<JewelryFormState>({
    name: '', skuCode: '', category: '', subcategory: '', collection: '', gender: '', occasion: '',
    metalType: '', metalPurity: '', metalWeight: '', basePrice: '', makingCharge: '', tax: '', totalPrice: '',
    description: '', videoURL: '', stockNumber: '',
    stones: [{ type: '', shape: '', carat: '', color: '', clarity: '', cut: '', certification: '' }],
    attributes: { style: '', chain_type: '', clasp_type: '', length_cm: '', is_adjustable: false },
    images: []
  });
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedMetalType, setSelectedMetalType] = useState<string | undefined>(undefined);

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleDropdownChange = (name: string, value: string) => {
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'category') setSelectedCategory(value);
    if (name === 'metalType') setSelectedMetalType(value);
  };
  // --- Stones ---
  const handleAddStone = () => {
    setForm(f => ({ ...f, stones: [...(f.stones || []), { type: '', shape: '', carat: '', color: '', clarity: '', cut: '', certification: '' }] }));
  };
  const handleRemoveStone = (idx: number) => {
    setForm(f => ({ ...f, stones: f.stones.filter((_: any, i: number) => i !== idx) }));
  };
  const handleStoneChange = (idx: number, name: string, value: string) => {
    setForm(f => ({ ...f, stones: f.stones.map((s: any, i: number) => i === idx ? { ...s, [name]: value } : s) }));
  };
  // --- Attributes ---
  const handleAttributeChange = (name: string, value: string | boolean) => {
    setForm(f => ({ ...f, attributes: { ...f.attributes, [name]: value } }));
  };
  // --- Images ---
  const handleImageChange = (idx: number, file: File) => {
    if (!file) return;
    setForm(f => {
      const images = f.images.slice();
      images[idx] = file;
      return { ...f, images };
    });
  };
  const handleAddImage = (file: File | null) => {
    if (!file) return;
    setForm(f => {
      if (f.images.length >= 6) return f;
      return { ...f, images: [...f.images, file] };
    });
  };
  const handleRemoveImage = (idx: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_: any, i: number) => i !== idx) }));
  };

  // --- Validation ---
  const validate = () => {
    const errs: any = {};
    if (!form.name) errs.name = 'Name is required';
    if (!form.skuCode) errs.skuCode = 'SKU Code is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.subcategory) errs.subcategory = 'Subcategory is required';
    if (!form.metalType) errs.metalType = 'Metal type is required';
    if (!form.metalPurity) errs.metalPurity = 'Metal purity is required';
    if (!form.basePrice) errs.basePrice = 'Base price is required';
    if (!form.totalPrice) errs.totalPrice = 'Total price is required';
    if (!form.stockNumber) errs.stockNumber = 'Stock number is required';
    if (!form.description) errs.description = 'Description is required';
    return errs;
  };

  // --- Submit ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      // Append primitive fields
      const fieldMap: Record<string, string> = {
        name: 'name',
        skuCode: 'skuCode',
        category: 'category',
        basePrice: 'basePrice',
        makingCharge: 'makingCharge',
        tax: 'tax',
        totalPrice: 'totalPrice',
        videoURL: 'videoURL',
        subcategory: 'subcategory',
        collection: 'collection',
        gender: 'gender',
        occasion: 'occasion',
        metalType: 'metalType',
        metalPurity: 'metalPurity',
        metalWeight: 'metalWeight',
        description: 'description',
      };
      // Ensure number fields are sent as numbers, not strings
      const numberFields = ['metalWeight', 'basePrice', 'makingCharge', 'tax', 'totalPrice'];
      Object.keys(fieldMap).forEach(key => {
        let value = (form as any)[key];
        if (typeof value !== 'undefined' && value !== null && value !== '') {
          if (numberFields.includes(key)) {
            // Only append if value is a valid number
            const num = Number(value);
            if (!isNaN(num)) formData.append(fieldMap[key], num.toString());
          } else {
            formData.append(fieldMap[key], String(value));
          }
        }
      });
      // Images as image1–image6
      if (form.images && form.images.length > 0) {
        form.images.forEach((file, idx) => {
          formData.append(`image${idx + 1}`, file);
        });
      }
      // Stones as JSON string (array), ensure carat is number
      if (form.stones && form.stones.length > 0) {
        const stonesPayload = form.stones.map(stone => ({
          ...stone,
          carat: stone.carat === '' ? undefined : Number(stone.carat)
        }));
        formData.append('stones', JSON.stringify(stonesPayload));
      }
      // Attributes as JSON string (object)
      if (form.attributes && Object.values(form.attributes).some(v => v !== '' && v !== false)) {
        formData.append('attributes', JSON.stringify(form.attributes));
      }
      // Get Bearer token
      let token = '';
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('token') || '';
        if (!token && document.cookie) {
          const match = document.cookie.match(/token=([^;]+)/);
          if (match) token = match[1];
        }
      }
      if (!token) throw new Error('User not authenticated');
      // API call
      const response = await jewelryService.addJewelry(formData, token);
      if (!response || response.success === false) {
        throw new Error(response?.message || 'Failed to add jewelry');
      }
      toast.success('Jewelry product added successfully!');
      setForm({
        ...form, ...{
          name: '', skuCode: '', category: '', subcategory: '', collection: '', gender: '', occasion: '',
          metalType: '', metalPurity: '', metalWeight: '', basePrice: '', makingCharge: '', tax: '', totalPrice: '',
          description: '', videoURL: '', stockNumber: '', stones: [], attributes: { style: '', chain_type: '', clasp_type: '', length_cm: '', is_adjustable: false }, images: []
        }
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to add jewelry');

    } finally {
      setSubmitting(false);
    }
  };

  // --- UI ---
  return (
    <form className="w-full mx-auto p-6 bg-white rounded-2xl shadow flex flex-col gap-8" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-2">Add Jewelry</h2>
      {/* Product Information */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Product Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="input" placeholder="e.g. Royal Necklace" />
            {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">SKU Code *</label>
            <input name="skuCode" value={form.skuCode} onChange={handleChange} required className="input" placeholder="e.g. SKU-001" />
            {errors.skuCode && <div className="text-red-500 text-xs">{errors.skuCode}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Category *</label>
            <select name="category" value={form.category} onChange={e => { handleDropdownChange('category', e.target.value); }} required className="input">
              <option value="" disabled hidden>Select Category</option>
              {DROPDOWN_OPTIONS.category.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {errors.category && <div className="text-red-500 text-xs">{errors.category}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Subcategory *</label>
            <select name="subcategory" value={form.subcategory} onChange={handleChange} required className="input" disabled={!selectedCategory}>
              <option value="" disabled hidden>Select Subcategory</option>
              {selectedCategory && DROPDOWN_OPTIONS.subcategory[selectedCategory as keyof typeof DROPDOWN_OPTIONS.subcategory]?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.subcategory && <div className="text-red-500 text-xs">{errors.subcategory}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Collection</label>
            <input name="collection" value={form.collection} onChange={handleChange} className="input" placeholder="e.g. Royal Collection" />
          </div>
          <div>
            <label className="block font-medium mb-1">Gender *</label>
            <select name="gender" value={form.gender} onChange={handleChange} required className="input">
              <option value="" disabled hidden>Select Gender</option>
              {DROPDOWN_OPTIONS.gender.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Occasion *</label>
            <input name="occasion" value={form.occasion} onChange={handleChange} required className="input" placeholder="e.g. Wedding" />
          </div>
        </div>
      </section>
      {/* Media */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Product Images *</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {form.images && form.images.length > 0 && form.images.map((img: File, idx: number) => {
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
              {form.images.length < 6 && (
                <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed rounded cursor-pointer text-gray-400 hover:border-blue-400">
                  <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files && e.target.files[0] && handleAddImage(e.target.files[0])} />
                  <span className="text-2xl">+</span>
                </label>
              )}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Video URL</label>
            <input name="videoURL" value={form.videoURL} onChange={handleChange} className="input" placeholder="e.g. https://youtu.be/abcd1234" />
          </div>
        </div>
      </section>
      {/* Pricing & Metal */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Pricing & Metal</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Base Price *</label>
            <input name="basePrice" value={form.basePrice} onChange={handleChange} required className="input" type="number" min="0" placeholder="e.g. 5000" />
            {errors.basePrice && <div className="text-red-500 text-xs">{errors.basePrice}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Making Charge</label>
            <input name="makingCharge" value={form.makingCharge} onChange={handleChange} className="input" type="number" min="0" placeholder="e.g. 200" />
          </div>
          <div>
            <label className="block font-medium mb-1">Tax (%)</label>
            <input name="tax" value={form.tax} onChange={handleChange} className="input" type="number" min="0" placeholder="e.g. 5" />
          </div>
          <div>
            <label className="block font-medium mb-1">Total Price *</label>
            <input name="totalPrice" value={form.totalPrice} onChange={handleChange} required className="input" type="number" min="0" placeholder="e.g. 5200" />
            {errors.totalPrice && <div className="text-red-500 text-xs">{errors.totalPrice}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Metal Type *</label>
            <select name="metalType" value={form.metalType} onChange={e => { handleDropdownChange('metalType', e.target.value); }} required className="input">
              <option value="" disabled hidden>Select Metal Type</option>
              {DROPDOWN_OPTIONS.metalType.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {errors.metalType && <div className="text-red-500 text-xs">{errors.metalType}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Metal Purity *</label>
            <select name="metalPurity" value={form.metalPurity} onChange={handleChange} required className="input" disabled={!selectedMetalType}>
              <option value="" disabled hidden>Select Metal Purity</option>
              {selectedMetalType && DROPDOWN_OPTIONS.metalPurity[selectedMetalType as keyof typeof DROPDOWN_OPTIONS.metalPurity]?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.metalPurity && <div className="text-red-500 text-xs">{errors.metalPurity}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Metal Weight (grams) *</label>
            <input name="metalWeight" value={form.metalWeight} onChange={handleChange} className="input" type="number" min="0" placeholder="e.g. 15.5" />
          </div>
          <div>
            <label className="block font-medium mb-1">Stock Number *</label>
            <input name="stockNumber" value={form.stockNumber} onChange={handleChange} required className="input" type="number" min="0" placeholder="e.g. 1001" />
            {errors.stockNumber && <div className="text-red-500 text-xs">{errors.stockNumber}</div>}
          </div>
        </div>
      </section>
      {/* Description */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <div className="grid grid-cols-1">
          <div>
            <label className="block font-medium mb-1">Product Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required className="input" rows={3} placeholder="Describe your product..." />
            {errors.description && <div className="text-red-500 text-xs">{errors.description}</div>}
          </div>
        </div>
      </section>
      {/* Gemstones */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Gemstones</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Gemstones</span>
          <button type="button" className="text-blue-600 font-bold" onClick={handleAddStone}>+ Add Gemstone</button>
        </div>
        {form.stones && form.stones.length > 0 && form.stones.map((stone: any, idx: number) => (
          <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 bg-gray-50 p-3 rounded-lg">
            <select value={stone.type} onChange={e => handleStoneChange(idx, 'type', e.target.value)} className="input">
              <option value="" disabled hidden>Select Type</option>
              {DROPDOWN_OPTIONS.gemstoneType.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select value={stone.shape} onChange={e => handleStoneChange(idx, 'shape', e.target.value)} className="input">
              <option value="" disabled hidden>Select Shape</option>
              {DROPDOWN_OPTIONS.gemstoneShape.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <input type="number" min="0" value={stone.carat} onChange={e => handleStoneChange(idx, 'carat', e.target.value)} className="input" placeholder="Carat" />
            <select value={stone.color} onChange={e => handleStoneChange(idx, 'color', e.target.value)} className="input">
              <option value="" disabled hidden>Select Color</option>
              {DROPDOWN_OPTIONS.gemstoneColor.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select value={stone.clarity} onChange={e => handleStoneChange(idx, 'clarity', e.target.value)} className="input">
              <option value="" disabled hidden>Select Clarity</option>
              {DROPDOWN_OPTIONS.gemstoneClarity.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select value={stone.cut} onChange={e => handleStoneChange(idx, 'cut', e.target.value)} className="input">
              <option value="" disabled hidden>Select Cut</option>
              {DROPDOWN_OPTIONS.gemstoneCut.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select value={stone.certification} onChange={e => handleStoneChange(idx, 'certification', e.target.value)} className="input">
              <option value="" disabled hidden>Select Certification</option>
              {DROPDOWN_OPTIONS.gemstoneCertification.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <button type="button" className="text-red-500 font-bold" onClick={() => handleRemoveStone(idx)}>Remove</button>
          </div>
        ))}
      </section>
      {/* Attributes */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Attributes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 bg-gray-50 p-3 rounded-lg">
          <select value={form.attributes.style} onChange={e => handleAttributeChange('style', e.target.value)} className="input">
            <option value="" disabled hidden>Select Style</option>
            {DROPDOWN_OPTIONS.style.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <select value={form.attributes.chain_type} onChange={e => handleAttributeChange('chain_type', e.target.value)} className="input">
            <option value="" disabled hidden>Select Chain Type</option>
            {DROPDOWN_OPTIONS.chain_type.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <select value={form.attributes.clasp_type} onChange={e => handleAttributeChange('clasp_type', e.target.value)} className="input">
            <option value="" disabled hidden>Select Clasp Type</option>
            {DROPDOWN_OPTIONS.clasp_type.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <input type="number" min="0" value={form.attributes.length_cm} onChange={e => handleAttributeChange('length_cm', e.target.value)} className="input" placeholder="Length (cm)" />
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.attributes.is_adjustable} onChange={e => handleAttributeChange('is_adjustable', e.target.checked)} />
            <span>Is Adjustable?</span>
          </div>
        </div>
      </section>
      {/* Submit Button */}
      <div className="flex justify-end gap-4 mt-4">
        <button type="reset" className="btn-secondary" onClick={() => setForm({
          name: '', skuCode: '', category: '', subcategory: '', collection: '', gender: '', occasion: '',
          metalType: '', metalPurity: '', metalWeight: '', basePrice: '', makingCharge: '', tax: '', totalPrice: '',
          description: '', videoURL: '', stockNumber: '',
          stones: [{ type: '', shape: '', carat: '', color: '', clarity: '', cut: '', certification: '' }],
          attributes: { style: '', chain_type: '', clasp_type: '', length_cm: '', is_adjustable: false },
          images: []
        })} disabled={submitting}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Add Jewelry'}</button>
      </div>
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

export default AddJewelryForm;
