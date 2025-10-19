
import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { jewelryService, JewelryItem } from '@/services/jewelryService';
import { auctionService } from '@/services/auctionService';
import { getCookie } from '@/lib/cookie-utils';
import { auctionProductTypes } from '@/config/sellerConfigData';

interface DropdownOption {
  label: string;
  value: string;
}

interface JewelryItemWithAuction extends JewelryItem {
  auction?: {
    id: string;
    productType: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
  };
}

// --- Dropdown options (label-value format, same as AddJewelryForm) ---
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
  stones: Stone[];
  attributes: Attribute;
  images: File[];
  // Auction fields
  enableAuction: boolean;
  productType: string;
  startTime: string;
  endTime: string;
};

type EditJewelryFormProps = {
  initialData?: JewelryItemWithAuction;
};

// Helper to normalize API data to form state
function normalizeInitialData(data: JewelryItemWithAuction): JewelryFormState {
  return {
    name: data?.name || '',
    skuCode: data?.skuCode || '',
    category: data?.category || '',
    subcategory: data?.subcategory || '',
    collection: data?.collection || '',
    gender: data?.gender || '',
    occasion: data?.occasion || '',
    metalType: data?.metalType || '',
    metalPurity: data?.metalPurity || '',
    metalWeight: data?.metalWeight ? String(data.metalWeight) : '',
    basePrice: data?.basePrice ? String(data.basePrice) : '',
    makingCharge: data?.makingCharge ? String(data.makingCharge) : '',
    tax: data?.tax ? String(data.tax) : '',
    totalPrice: data?.totalPrice ? String(data.totalPrice) : '',
    description: data?.description || '',
    videoURL: data?.videoURL || '',
    stones: Array.isArray(data?.stones) && data.stones.length > 0 ? data.stones.map(s => ({
      type: s.type || '',
      shape: s.shape || '',
      carat: s.carat ? String(s.carat) : '',
      color: s.color || '',
      clarity: s.clarity || '',
      cut: s.cut || '',
      certification: s.certification || '',
    })) : [{ type: '', shape: '', carat: '', color: '', clarity: '', cut: '', certification: '' }],
    attributes: typeof data?.attributes === 'object' && data.attributes !== null ? {
      style: data.attributes.style || '',
      chain_type: data.attributes.chain_type || '',
      clasp_type: data.attributes.clasp_type || '',
      length_cm: data.attributes.length_cm ? String(data.attributes.length_cm) : '',
      is_adjustable: !!data.attributes.is_adjustable,
    } : { style: '', chain_type: '', clasp_type: '', length_cm: '', is_adjustable: false },
    images: [], // File[] for new uploads only
    // Auction fields
    enableAuction: false,
    productType: 'jewelry',
    startTime: '',
    endTime: ''
  };
}

const EditJewelryForm: React.FC<EditJewelryFormProps> = ({ initialData }) => {
  // --- State ---
  const [form, setForm] = useState<JewelryFormState>(() => initialData ? normalizeInitialData(initialData) : {
    name: '', skuCode: '', category: '', subcategory: '', collection: '', gender: '', occasion: '',
    metalType: '', metalPurity: '', metalWeight: '', basePrice: '', makingCharge: '', tax: '', totalPrice: '',
    description: '', videoURL: '',
    stones: [{ type: '', shape: '', carat: '', color: '', clarity: '', cut: '', certification: '' }],
    attributes: { style: '', chain_type: '', clasp_type: '', length_cm: '', is_adjustable: false },
    images: [],
    // Auction fields
    enableAuction: false,
    productType: 'jewelry',
    startTime: '',
    endTime: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialData?.category);
  const [selectedMetalType, setSelectedMetalType] = useState<string | undefined>(initialData?.metalType);
  const [existingImages, setExistingImages] = useState<string[]>(() => {
    // Collect image1–image6 from initialData
    if (!initialData) return [];
    return [initialData.image1, initialData.image2, initialData.image3, initialData.image4, initialData.image5, initialData.image6].filter((img): img is string => Boolean(img));
  });

  // --- Handlers (same as AddJewelryForm, but with edit logic) ---
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
    setForm(f => ({ ...f, stones: f.stones.map((s, i: number) => i === idx ? { ...s, [name]: value } : s) }));
  };
  // --- Attributes ---
  const handleAttributeChange = (name: string, value: string | boolean) => {
    setForm(f => ({ ...f, attributes: { ...f.attributes, [name]: value } }));
  };
  // --- Images ---
  const handleAddImage = (file: File | null) => {
    if (!file) return;
    setForm(f => {
      if (f.images.length + existingImages.length >= 6) return f;
      return { ...f, images: [...f.images, file] };
    });
  };
  const handleRemoveImage = (idx: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i: number) => i !== idx) }));
  };
  const handleRemoveExistingImage = (idx: number) => {
    setExistingImages(imgs => imgs.filter((_, i) => i !== idx));
  };

  // --- Validation ---
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = 'Name is required';
    if (!form.skuCode) errs.skuCode = 'SKU Code is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.subcategory) errs.subcategory = 'Subcategory is required';
    if (!form.metalType) errs.metalType = 'Metal type is required';
    if (!form.metalPurity) errs.metalPurity = 'Metal purity is required';
    if (!form.basePrice) errs.basePrice = 'Base price is required';
    if (!form.totalPrice) errs.totalPrice = 'Total price is required';
    // removed stockNumber validation
    if (!form.description) errs.description = 'Description is required';
    return errs;
  };

  // --- Submit (PATCH) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);

    try {
      // Prepare FormData for PATCH (like EditGemstoneForm)
      const formData = new FormData();
      // For each image slot, set only one value (file or URL)
      for (let i = 0; i < 6; i++) {
        if (form.images[i]) {
          formData.append(`image${i + 1}`, form.images[i]);
        } else if (existingImages[i]) {
          formData.append(`image${i + 1}`, existingImages[i]);
        }
      }
      // Always append 'name' field explicitly
      formData.append('name', form.name ?? '');
      // Attach all other fields (except name, images, id, image1-6, and auction fields)
      Object.entries(form).forEach(([key, value]) => {
        if (
          key !== 'images' &&
          key !== 'id' &&
          key !== 'name' &&
          !/^image[1-6]$/.test(key) &&
          // Exclude auction fields - they are handled separately
          key !== 'enableAuction' &&
          key !== 'productType' &&
          key !== 'startTime' &&
          key !== 'endTime' &&
          value !== undefined && value !== null && value !== ''
        ) {
          if (typeof value === 'boolean') {
            formData.append(key, value ? 'true' : 'false');
          } else if (Array.isArray(value)) {
            // For stones array, serialize as JSON to preserve data types
            if (key === 'stones') {
              const processedStones = (value as Stone[])
                .filter((stone: Stone) => stone && typeof stone === 'object' && !('lastModified' in stone)) // Filter out File objects
                .map((stone: Stone) => ({
                  ...stone,
                  carat: stone.carat ? parseFloat(String(stone.carat)) : null
                }))
                .filter((stone) => Boolean(stone.type || stone.shape || stone.carat || stone.color || stone.clarity || stone.cut || stone.certification));
              
              if (processedStones.length > 0) {
                formData.append('stones', JSON.stringify(processedStones));
              }
            }
          } else if (typeof value === 'object') {
            // For attributes object, serialize as JSON to preserve data types
            if (key === 'attributes') {
              const processedAttributes = { ...value as Attribute };
              // Convert length_cm to number if it exists, for the API
              const attributesForAPI = {
                ...processedAttributes,
                length_cm: processedAttributes.length_cm ? parseFloat(processedAttributes.length_cm) : ''
              };
              formData.append('attributes', JSON.stringify(attributesForAPI));
            }
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Get Bearer token
      const token = getCookie('token');
      if (!token) throw new Error('User not authenticated');
      if (!initialData) throw new Error('No initial data provided');

      // API call (PATCH, FormData)
      const response = await jewelryService.updateJewelry(String(initialData.id), formData, token);
      if (!response || response.success === false) {
        throw new Error(response?.message || 'Failed to update jewelry');
      }

      // If auction is enabled, create auction
      if (form.enableAuction && form.productType && form.startTime && form.endTime) {
        const auctionData = {
          productId: String(initialData.id),
          productType: form.productType as 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond',
          startTime: new Date(form.startTime).toISOString(),
          endTime: new Date(form.endTime).toISOString()
        };

        const auctionResponse = await auctionService.createAuction(auctionData, token);

        if (!auctionResponse || auctionResponse.success === false) {
          throw new Error(auctionResponse?.message || 'Failed to create auction');
        }
      }
      toast.success('Jewelry product updated successfully!' + (form.enableAuction ? ' Auction created!' : ''));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update jewelry';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // --- UI ---
  return (
    <form className="w-full mx-auto p-6 bg-white rounded-2xl shadow flex flex-col gap-8" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-2">Edit Jewelry</h2>
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
              {DROPDOWN_OPTIONS.category.map((opt: DropdownOption) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {errors.category && <div className="text-red-500 text-xs">{errors.category}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Subcategory *</label>
            <select name="subcategory" value={form.subcategory} onChange={handleChange} required className="input" disabled={!selectedCategory}>
              <option value="" disabled hidden>Select Subcategory</option>
              {selectedCategory && DROPDOWN_OPTIONS.subcategory[selectedCategory as keyof typeof DROPDOWN_OPTIONS.subcategory]?.map((opt: DropdownOption) => (
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
              {DROPDOWN_OPTIONS.gender.map((opt: DropdownOption) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
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
              {existingImages && existingImages.length > 0 && existingImages.map((img, idx) => (
                <div key={img} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center relative group">
                  <Image src={img} alt={`Preview ${idx + 1}`} width={80} height={80} className="object-cover w-full h-full" />
                  <button type="button" onClick={() => handleRemoveExistingImage(idx)} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow text-gray-700 hover:bg-red-500 hover:text-white transition" title="Remove image">&times;</button>
                </div>
              ))}
              {form.images && form.images.length > 0 && form.images.map((img: File, idx: number) => {
                const url = URL.createObjectURL(img);
                return (
                  <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center relative group">
                    <Image src={url} alt={`Preview ${idx + 1}`} width={80} height={80} className="object-cover w-full h-full" onLoad={() => URL.revokeObjectURL(url)} />
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow text-gray-700 hover:bg-red-500 hover:text-white transition" title="Remove image">&times;</button>
                  </div>
                );
              })}
              {form.images.length + existingImages.length < 6 && (
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
              {DROPDOWN_OPTIONS.metalType.map((opt: DropdownOption) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {errors.metalType && <div className="text-red-500 text-xs">{errors.metalType}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Metal Purity *</label>
            <select name="metalPurity" value={form.metalPurity} onChange={handleChange} required className="input" disabled={!selectedMetalType}>
              <option value="" disabled hidden>Select Metal Purity</option>
              {selectedMetalType && DROPDOWN_OPTIONS.metalPurity[selectedMetalType as keyof typeof DROPDOWN_OPTIONS.metalPurity]?.map((opt: DropdownOption) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.metalPurity && <div className="text-red-500 text-xs">{errors.metalPurity}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Metal Weight (grams) *</label>
            <input name="metalWeight" value={form.metalWeight} onChange={handleChange} className="input" type="number" min="0" placeholder="e.g. 15.5" />
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
        {form.stones && form.stones.length > 0 && form.stones.map((stone: Stone, idx: number) => (
          <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 bg-gray-50 p-3 rounded-lg">
            <select value={stone.type} onChange={e => handleStoneChange(idx, 'type', e.target.value)} className="input">
              <option value="" disabled hidden>Select Type</option>
              {DROPDOWN_OPTIONS.gemstoneType.map((opt: DropdownOption) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select value={stone.shape} onChange={e => handleStoneChange(idx, 'shape', e.target.value)} className="input">
              <option value="" disabled hidden>Select Shape</option>
              {DROPDOWN_OPTIONS.gemstoneShape.map((opt: DropdownOption) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <input type="number" min="0" step="0.01" value={stone.carat} onChange={e => handleStoneChange(idx, 'carat', e.target.value)} className="input" placeholder="Carat" />
            <select value={stone.color} onChange={e => handleStoneChange(idx, 'color', e.target.value)} className="input">
              <option value="" disabled hidden>Select Color</option>
              {DROPDOWN_OPTIONS.gemstoneColor.map((opt: DropdownOption) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select value={stone.clarity} onChange={e => handleStoneChange(idx, 'clarity', e.target.value)} className="input">
              <option value="" disabled hidden>Select Clarity</option>
              {DROPDOWN_OPTIONS.gemstoneClarity.map((opt: DropdownOption) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select value={stone.cut} onChange={e => handleStoneChange(idx, 'cut', e.target.value)} className="input">
              <option value="" disabled hidden>Select Cut</option>
              {DROPDOWN_OPTIONS.gemstoneCut.map((opt: DropdownOption) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select value={stone.certification} onChange={e => handleStoneChange(idx, 'certification', e.target.value)} className="input">
              <option value="" disabled hidden>Select Certification</option>
              {DROPDOWN_OPTIONS.gemstoneCertification.map((opt: DropdownOption) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
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
            {DROPDOWN_OPTIONS.style.map((opt: DropdownOption) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <select value={form.attributes.chain_type} onChange={e => handleAttributeChange('chain_type', e.target.value)} className="input">
            <option value="" disabled hidden>Select Chain Type</option>
            {DROPDOWN_OPTIONS.chain_type.map((opt: DropdownOption) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <select value={form.attributes.clasp_type} onChange={e => handleAttributeChange('clasp_type', e.target.value)} className="input">
            <option value="" disabled hidden>Select Clasp Type</option>
            {DROPDOWN_OPTIONS.clasp_type.map((opt: DropdownOption) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <input type="number" min="0" value={form.attributes.length_cm} onChange={e => handleAttributeChange('length_cm', e.target.value)} className="input" placeholder="Length (cm)" />
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.attributes.is_adjustable} onChange={e => handleAttributeChange('is_adjustable', e.target.checked)} />
            <span>Is Adjustable?</span>
          </div>
        </div>
      </section>

      {/* Auction Section */}
      <section className="bg-gray-50 p-4 rounded border">
        <h4 className="font-medium text-gray-800 mb-2">Auction Configuration</h4>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableAuction"
              checked={form.enableAuction}
              onChange={(e) => setForm(prev => ({ ...prev, enableAuction: e.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="enableAuction" className="text-sm font-medium">
              Enable Auction for this Jewelry
            </label>
          </div>

          {form.enableAuction && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-card/50 border border-border/40 rounded-lg">
              <div className="space-y-2">
                <label htmlFor="productType" className="text-sm font-medium flex items-center gap-1 text-foreground/90">
                  Product Type
                  <span className="text-red-500 text-xs">*</span>
                </label>
                <select
                  id="productType"
                  value={form.productType}
                  onChange={(e) => setForm(prev => ({ ...prev, productType: e.target.value }))}
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
                <label htmlFor="startTime" className="text-sm font-medium flex items-center gap-1 text-foreground/90">
                  Auction Start Time
                  <span className="text-red-500 text-xs">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  value={form.startTime}
                  onChange={(e) => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="endTime" className="text-sm font-medium flex items-center gap-1 text-foreground/90">
                  Auction End Time
                  <span className="text-red-500 text-xs">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  value={form.endTime}
                  onChange={(e) => setForm(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-primary/50"
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
          </div>
        </section>
      )}
      {/* Submit Button */}
      <div className="flex justify-end gap-4 mt-4">
        <button type="reset" className="btn-secondary" onClick={() => setForm(initialData ? normalizeInitialData(initialData) : {
          name: '', skuCode: '', category: '', subcategory: '', collection: '', gender: '', occasion: '',
          metalType: '', metalPurity: '', metalWeight: '', basePrice: '', makingCharge: '', tax: '', totalPrice: '',
          description: '', videoURL: '',
          stones: [{ type: '', shape: '', carat: '', color: '', clarity: '', cut: '', certification: '' }],
          attributes: { style: '', chain_type: '', clasp_type: '', length_cm: '', is_adjustable: false },
          images: [],
          // Auction fields
          enableAuction: false,
          productType: 'jewelry',
          startTime: '',
          endTime: ''
        })} disabled={submitting}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</button>
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

export default EditJewelryForm;
