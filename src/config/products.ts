import { ProductConfig } from '@/types/products'

// Diamond Product Configuration
export const DIAMOND_CONFIG: ProductConfig = {
  name: 'Diamonds',
  icon: '💎',
  categories: ['single', 'melee'],
  priceRanges: {
    'natural-single': { min: 1000, max: 100000 },
    'natural-melee': { min: 10, max: 500 },
    'lab-grown-single': { min: 500, max: 50000 },
    'lab-grown-melee': { min: 5, max: 200 }
  },
  filters: [
    {
      key: 'shape',
      label: 'Shape',
      type: 'multiselect',
      options: [
        'Round', 'Pear', 'Emerald', 'Oval', 'Heart', 'Marquise', 'Asscher', 'Cushion',
        'Cushion modified', 'Cushion brilliant', 'Radiant', 'Princess', 'French', 'Trilliant',
        'Euro cut', 'Old Miner', 'Briollette', 'Rose cut', 'Lozenge', 'Baguette',
        'Tapered baguette', 'Half-moon', 'Flanders', 'Trapezoid', 'Bullet', 'Kite',
        'Shield', 'Star cut', 'Pentagonal cut', 'Hexagonal cut', 'Octagonal cut', 'Portugeese cut'
      ]
    },
    {
      key: 'color',
      label: 'Color',
      type: 'multiselect',
      options: ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    },
    {
      key: 'clarity',
      label: 'Clarity',
      type: 'multiselect',
      options: ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'SI3', 'I1', 'I2', 'I3']
    },
    {
      key: 'cut',
      label: 'Cut',
      type: 'multiselect',
      options: ['Ideal', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor']
    },
    {
      key: 'caratWeight',
      label: 'Carat Weight',
      type: 'range',
      min: 0.001,
      max: 5.0,
      step: 0.01
    },
    {
      key: 'fluorescence',
      label: 'Fluorescence',
      type: 'multiselect',
      options: ['None', 'Faint', 'Medium', 'Strong', 'Very Strong']
    },
    {
      key: 'polish',
      label: 'Polish',
      type: 'multiselect',
      options: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
      advanced: true
    },
    {
      key: 'symmetry',
      label: 'Symmetry',
      type: 'multiselect',
      options: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
      advanced: true
    }
  ]
}

// Gemstone Product Configuration
export const GEMSTONE_CONFIG: ProductConfig = {
  name: 'Gemstones',
  icon: '🔮',
  categories: ['single', 'melee'],
  priceRanges: {
    'ruby-single': { min: 500, max: 50000 },
    'sapphire-single': { min: 400, max: 40000 },
    'emerald-single': { min: 600, max: 60000 },
    'other-single': { min: 100, max: 20000 },
    'melee': { min: 10, max: 1000 }
  },
  filters: [
    {
      key: 'gemType',
      label: 'Gemstone Type',
      type: 'multiselect',
      options: ['Ruby', 'Sapphire', 'Emerald', 'Tanzanite', 'Aquamarine', 'Tourmaline', 'Topaz', 'Garnet', 'Amethyst', 'Citrine', 'Peridot', 'Opal']
    },
    {
      key: 'shape',
      label: 'Shape',
      type: 'multiselect',
      options: ['Round', 'Oval', 'Cushion', 'Emerald', 'Pear', 'Marquise', 'Heart', 'Princess', 'Asscher', 'Radiant']
    },
    {
      key: 'color',
      label: 'Color',
      type: 'multiselect',
      options: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'White', 'Black', 'Multi-Color']
    },
    {
      key: 'clarity',
      label: 'Clarity',
      type: 'multiselect',
      options: ['FL', 'IF', 'VVS', 'VS', 'SI', 'I']
    },
    {
      key: 'caratWeight',
      label: 'Carat Weight',
      type: 'range',
      min: 0.1,
      max: 20.0,
      step: 0.1
    },
    {
      key: 'origin',
      label: 'Origin',
      type: 'multiselect',
      options: ['Burma (Myanmar)', 'Ceylon (Sri Lanka)', 'Kashmir', 'Madagascar', 'Thailand', 'Brazil', 'Colombia', 'Tanzania', 'Mozambique', 'Australia'],
      advanced: true
    },
    {
      key: 'treatment',
      label: 'Treatment',
      type: 'multiselect',
      options: ['None', 'Heat Only', 'Heat & Oil', 'Diffusion', 'Fracture Filled', 'Irradiation'],
      advanced: true
    }
  ]
}

// Jewelry Product Configuration
export const JEWELRY_CONFIG: ProductConfig = {
  name: 'Jewelry',
  icon: '💍',
  categories: ['rings', 'necklaces', 'earrings', 'bracelets', 'watches', 'chains', 'sets', 'accessories'],
  priceRanges: {
    'rings': { min: 200, max: 50000 },
    'necklaces': { min: 150, max: 25000 },
    'earrings': { min: 100, max: 15000 },
    'bracelets': { min: 150, max: 20000 },
    'watches': { min: 500, max: 100000 },
    'chains': { min: 100, max: 10000 },
    'sets': { min: 300, max: 75000 },
    'accessories': { min: 50, max: 5000 }
  },
  filters: [
    {
      key: 'jewelryType',
      label: 'Jewelry Type',
      type: 'multiselect',
      options: ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Watches', 'Chains', 'Sets', 'Accessories', 'Pendants', 'Bangles', 'Anklets']
    },
    {
      key: 'metal',
      label: 'Metal',
      type: 'multiselect',
      options: ['Gold', 'White Gold', 'Rose Gold', 'Platinum', 'Silver', 'Titanium', 'Palladium']
    },
    {
      key: 'style',
      label: 'Style',
      type: 'multiselect',
      options: ['Classic', 'Modern', 'Vintage', 'Art Deco', 'Minimalist', 'Bold', 'Elegant', 'Casual']
    },
    {
      key: 'setting',
      label: 'Setting Type',
      type: 'multiselect',
      options: ['Prong', 'Bezel', 'Pave', 'Channel', 'Tension', 'Halo', 'Three Stone', 'Solitaire']
    },
    {
      key: 'gemstone',
      label: 'Featured Gemstone',
      type: 'multiselect',
      options: ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Tanzanite', 'Pearl', 'Opal', 'None']
    },
    {
      key: 'brand',
      label: 'Brand',
      type: 'multiselect',
      options: ['Tiffany & Co', 'Cartier', 'Bulgari', 'Harry Winston', 'Van Cleef & Arpels', 'Graff', 'Custom', 'House Brand'],
      advanced: true
    }
  ]
}

// Product configurations registry
export const PRODUCT_CONFIGS = {
  diamonds: DIAMOND_CONFIG,
  gemstones: GEMSTONE_CONFIG,
  jewelry: JEWELRY_CONFIG
} as const

export type ProductType = keyof typeof PRODUCT_CONFIGS
