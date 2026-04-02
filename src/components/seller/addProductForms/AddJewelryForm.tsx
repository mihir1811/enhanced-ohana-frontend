import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { jewelryService } from '@/services/jewelryService';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedMetalType, setSelectedMetalType] = useState<string | undefined>(undefined);
  const randomFrom = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
    setForm(f => ({ ...f, stones: f.stones.filter((_, i: number) => i !== idx) }));
  };
  const handleStoneChange = (idx: number, name: string, value: string) => {
    setForm(f => ({ ...f, stones: f.stones.map((s: Stone, i: number) => i === idx ? { ...s, [name]: value } : s) }));
  };
  // --- Attributes ---
  const handleAttributeChange = (name: string, value: string | boolean) => {
    setForm(f => ({ ...f, attributes: { ...f.attributes, [name]: value } }));
  };
  // --- Images ---
  const handleAddImage = (file: File | null) => {
    if (!file) return;
    setForm(f => {
      if (f.images.length >= 6) return f;
      return { ...f, images: [...f.images, file] };
    });
  };
  const handleRemoveImage = (idx: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i: number) => i !== idx) }));
  };

  const handleFillRandomData = () => {
    const category = randomFrom(DROPDOWN_OPTIONS.category).value;
    const subcategoryOptions = DROPDOWN_OPTIONS.subcategory[category as keyof typeof DROPDOWN_OPTIONS.subcategory] || [];
    const metalType = randomFrom(DROPDOWN_OPTIONS.metalType).value;
    const purityOptions = DROPDOWN_OPTIONS.metalPurity[metalType as keyof typeof DROPDOWN_OPTIONS.metalPurity] || [];
    const basePrice = Math.floor(30000 + Math.random() * 170000);
    const makingCharge = Math.floor(basePrice * 0.08);
    const discount = Math.floor(basePrice * 0.03);

    setSelectedCategory(category);
    setSelectedMetalType(metalType);
    setForm((f) => ({
      ...f,
      name: `Premium ${category} ${Math.floor(100 + Math.random() * 900)}`,
      skuCode: `JW-${Date.now().toString().slice(-6)}`,
      stockNumber: `STK-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      subcategory: subcategoryOptions.length ? randomFrom(subcategoryOptions).value : '',
      collection: randomFrom(['Signature', 'Heritage', 'Eternal']),
      gender: randomFrom(DROPDOWN_OPTIONS.gender).value,
      occasion: randomFrom(['Wedding', 'Daily Wear', 'Party']),
      metalType,
      metalPurity: purityOptions.length ? randomFrom(purityOptions).value : '',
      metalWeight: (3 + Math.random() * 12).toFixed(2),
      basePrice: String(basePrice),
      makingCharge: String(makingCharge),
      tax: '',
      totalPrice: String(basePrice + makingCharge - discount),
      description: 'Crafted jewelry piece with elegant finish and premium quality.',
      videoURL: '',
      stones: [
        {
          type: randomFrom(DROPDOWN_OPTIONS.gemstoneType).value,
          shape: randomFrom(DROPDOWN_OPTIONS.gemstoneShape).value,
          carat: (0.2 + Math.random() * 1.8).toFixed(2),
          color: randomFrom(DROPDOWN_OPTIONS.gemstoneColor).value,
          clarity: randomFrom(DROPDOWN_OPTIONS.gemstoneClarity).value,
          cut: randomFrom(DROPDOWN_OPTIONS.gemstoneCut).value,
          certification: randomFrom(DROPDOWN_OPTIONS.gemstoneCertification).value,
        },
      ],
      attributes: {
        style: randomFrom(DROPDOWN_OPTIONS.style).value,
        chain_type: randomFrom(DROPDOWN_OPTIONS.chain_type).value,
        clasp_type: randomFrom(DROPDOWN_OPTIONS.clasp_type).value,
        length_cm: String(16 + Math.floor(Math.random() * 8)),
        is_adjustable: Math.random() > 0.5,
      },
    }));
  };

  // --- Validation ---
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = 'Name is required';
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
      // Map current UI model to latest backend DTO keys.
      const dtoFieldMap: Record<string, string> = {
        name: 'productTitle',
        stockNumber: 'stockNumber',
        category: 'category',
        subcategory: 'subcategory',
        collection: 'collectionName',
        gender: 'gender',
        occasion: 'occasion',
        metalType: 'metalType',
        metalPurity: 'metalPurity',
        metalWeight: 'metalWeight',
        basePrice: 'basePrice',
        makingCharge: 'makingCharge',
        totalPrice: 'totalPrice',
        description: 'description',
        videoURL: 'videoURL',
      };
      Object.entries(dtoFieldMap).forEach(([oldKey, newKey]) => {
        const value = (form as Record<string, unknown>)[oldKey];
        if (typeof value !== 'undefined' && value !== null && value !== '') {
          formData.append(newKey, String(value));
        }
      });
      // Required by latest backend enum
      formData.append('available', 'AVAILABLE');

      // Stones as DTO-compatible JSON
      if (form.stones && form.stones.length > 0) {
        const stonesPayload = form.stones.map((stone: Stone) => ({
          centerStoneType: stone.type || undefined,
          centerStoneShape: stone.shape || undefined,
          centerStoneColor: stone.color || undefined,
          centerStoneClarity: stone.clarity || undefined,
          centerStoneCertification: stone.certification || undefined,
          centerStoneTotalWeight: stone.carat || undefined,
        }));
        formData.append('stones', JSON.stringify(stonesPayload));
      }
      // Attributes as JSON string (object)
      if (form.attributes && Object.values(form.attributes).some(v => v !== '' && v !== false)) {
        formData.append('attributes', JSON.stringify(form.attributes));
      }
      form.images.forEach((file, index) => {
        if (index < 6) {
          formData.append(`image${index + 1}`, file);
        }
      });
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
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to add jewelry');

    } finally {
      setSubmitting(false);
    }
  };

  // --- UI ---
  return (
    <form className="w-full max-w-7xl mx-auto flex flex-col gap-6 rounded-2xl bg-gray-50 p-3 md:p-4" onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Add Jewelry</h2>
        <p className="mt-1 text-sm text-gray-600">
          Create a clean and complete jewelry listing with product, pricing, stone, and media details.
        </p>
      </div>
      {/* Product Information */}
      <section className="section-card">
        <h3 className="text-lg font-semibold mb-1 text-gray-900">Product Information</h3>
        <p className="text-sm text-gray-500 mb-4">Add title, category, and customer targeting details.</p>
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
      <section className="section-card">
        <h3 className="text-lg font-semibold mb-1 text-gray-900">Media</h3>
        <p className="text-sm text-gray-500 mb-4">Upload upto 6 product images and optional video URL.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Product Images *</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {form.images && form.images.length > 0 && form.images.map((img: File, idx: number) => {
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
      <section className="section-card">
        <h3 className="text-lg font-semibold mb-1 text-gray-900">Pricing & Metal</h3>
        <p className="text-sm text-gray-500 mb-4">Define your pricing and core metal details.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Base Price *</label>
            <input name="basePrice" value={form.basePrice} onChange={handleChange} required className="input" type="number" min="0" step="any" placeholder="e.g. 5000" />
            {errors.basePrice && <div className="text-red-500 text-xs">{errors.basePrice}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Making Charge</label>
            <input name="makingCharge" value={form.makingCharge} onChange={handleChange} className="input" type="number" min="0" step="any" placeholder="e.g. 200" />
          </div>
          <div>
            <label className="block font-medium mb-1">Tax (%)</label>
            <input name="tax" value={form.tax} onChange={handleChange} className="input" type="number" min="0" step="any" placeholder="e.g. 5" />
          </div>
          <div>
            <label className="block font-medium mb-1">Total Price *</label>
            <input name="totalPrice" value={form.totalPrice} onChange={handleChange} required className="input" type="number" min="0" step="any" placeholder="e.g. 5200" />
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
            <input name="metalWeight" value={form.metalWeight} onChange={handleChange} className="input" type="number" min="0" step="any" placeholder="e.g. 15.5" />
          </div>
          <div>
            <label className="block font-medium mb-1">Stock Number *</label>
            <input name="stockNumber" value={form.stockNumber} onChange={handleChange} required className="input" type="number" min="0" step="any" placeholder="e.g. 1001" />
            {errors.stockNumber && <div className="text-red-500 text-xs">{errors.stockNumber}</div>}
          </div>
        </div>
      </section>
      {/* Description */}
      <section className="section-card">
        <h3 className="text-lg font-semibold mb-1 text-gray-900">Description</h3>
        <p className="text-sm text-gray-500 mb-4">Write product highlights and key selling points.</p>
        <div className="grid grid-cols-1">
          <div>
            <label className="block font-medium mb-1">Product Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required className="input" rows={3} placeholder="Describe your product..." />
            {errors.description && <div className="text-red-500 text-xs">{errors.description}</div>}
          </div>
        </div>
      </section>
      {/* Gemstones */}
      <section className="section-card">
        <h3 className="text-lg font-semibold mb-1 text-gray-900">Gemstones</h3>
        <p className="text-sm text-gray-500 mb-4">Add one or more stones used in the jewelry.</p>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Gemstones</span>
          <button type="button" className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100" onClick={handleAddStone}>+ Add Gemstone</button>
        </div>
        {form.stones && form.stones.length > 0 && form.stones.map((stone: Stone, idx: number) => (
          <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 border border-gray-200 bg-gray-50 p-3 rounded-xl">
            <select value={stone.type} onChange={e => handleStoneChange(idx, 'type', e.target.value)} className="input">
              <option value="" disabled hidden>Select Type</option>
              {DROPDOWN_OPTIONS.gemstoneType.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select value={stone.shape} onChange={e => handleStoneChange(idx, 'shape', e.target.value)} className="input">
              <option value="" disabled hidden>Select Shape</option>
              {DROPDOWN_OPTIONS.gemstoneShape.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <input type="number" min="0" step="any" value={stone.carat} onChange={e => handleStoneChange(idx, 'carat', e.target.value)} className="input" placeholder="Carat" />
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
            <button type="button" className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-red-600 text-sm font-semibold transition hover:bg-red-100" onClick={() => handleRemoveStone(idx)}>Remove</button>
          </div>
        ))}
      </section>
      {/* Attributes */}
      <section className="section-card">
        <h3 className="text-lg font-semibold mb-1 text-gray-900">Attributes</h3>
        <p className="text-sm text-gray-500 mb-4">Provide style and fitting details for better filtering.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 border border-gray-200 bg-gray-50 p-3 rounded-xl">
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
          <input type="number" min="0" step="any" value={form.attributes.length_cm} onChange={e => handleAttributeChange('length_cm', e.target.value)} className="input" placeholder="Length (cm)" />
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.attributes.is_adjustable} onChange={e => handleAttributeChange('is_adjustable', e.target.checked)} />
            <span>Is Adjustable?</span>
          </div>
        </div>
      </section>
      {/* Submit Button */}
      <div className="sticky bottom-0 z-10 flex justify-end gap-3 border border-gray-200 bg-white/95 backdrop-blur rounded-xl p-3 shadow-sm">
        <button type="button" className="btn-secondary" onClick={handleFillRandomData} disabled={submitting}>
          Fill Random Data
        </button>
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
        .section-card {
          border-radius: 1rem;
          border: 1px solid #e5e7eb;
          background: #fff;
          padding: 1.25rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }
        .input {
          width: 100%;
          padding: 0.625rem 0.8rem;
          border-radius: 0.75rem;
          border: 1px solid #d1d5db;
          background: #ffffff;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        label.block {
          font-size: 0.86rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.35rem;
        }
        .input:focus {
          outline: none;
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
        }
        .btn-primary {
          background: #111827;
          color: #fff;
          padding: 0.6rem 1.2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          border: 1px solid #111827;
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          background: #1f2937;
        }
        .btn-secondary {
          background: #fff;
          color: #374151;
          padding: 0.6rem 1.2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          border: 1px solid #d1d5db;
          transition: all 0.2s ease;
        }
        .btn-secondary:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }
      `}</style>
    </form>
  );
};

export default AddJewelryForm;
