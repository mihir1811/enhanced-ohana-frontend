'use client';

import { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Grid, List, Search, X, ShoppingCart,
  Eye, MapPin, Star, Loader2, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Filter, ArrowUpDown
} from 'lucide-react';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';
import { jewelryService } from '@/services/jewelryService';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import debounce from 'lodash.debounce';
import WishlistButton from '@/components/shared/WishlistButton';

// Watch brand logos mapping
const WATCH_BRAND_LOGOS = {
  'rolex': '/images/watch_logo/Rolex Logo.png',
  'cartier': '/images/watch_logo/Cartier.png',
  'omega': '/images/watch_logo/Omega-Logo.png',
  'patek-philippe': '/images/watch_logo/Patek-Philippe-Logo.png',
  'audemars-piguet': '/images/watch_logo/Audemars-Piguet.png',
  'tag-heuer': '/images/watch_logo/TAG-Heuer-Logo.png',
  'iwc': '/images/watch_logo/IWC-Logo.png',
  'breitling': '/images/watch_logo/Breitling-logo.png',
  'hublot': '/images/watch_logo/Hublot-Logo.png',
  'panerai': '/images/watch_logo/Panerai-Logo.png',
  'grand-seiko': '/images/watch_logo/Grand-Seiko-Logo.png',
  'richard-mille': '/images/watch_logo/Richard_Mille_Logo.png',
  'vacheron-constantin': '/images/watch_logo/Vacheron-Constantin-Logo.png'
} as const

// Types
interface JewelryItem {
  id: string | number;
  name?: string;
  skuCode?: string;
  totalPrice?: number;
  metalType?: string;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  image5?: string | null;
  image6?: string | null;
  sellerId?: string;
  stones?: Array<{
    id?: number;
    jewelleryId?: number;
    type?: string;
    shape?: string;
    carat?: number;
    color?: string;
    clarity?: string;
    cut?: string;
    certification?: string;
  }>;
  isOnAuction?: boolean;
}

interface JewelryQueryParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  priceMin?: number;
  priceMax?: number;
  metal?: string[];
  style?: string[];
  certification?: string[];
}

interface JewelryFilters {
  priceRange: { min: number; max: number }
  metalType: string[]
  style: string[]
  purity: string[]
  stones: string[]
  certification: string[]
  sort: string
  // Category-specific filters
  ringTypes?: string[]
  ringSettings?: string[]
  sizes?: string[]
  lengths?: string[]
  brands?: string[]
  models?: string[]
  dialColors?: string[]
  caseShapes?: string[]
  caseSizes?: string[]
  caseMaterials?: string[]
  strapMaterials?: string[]
  strapColors?: string[]
  movements?: string[]
  waterResistance?: string[]
  features?: string[]
  dialStones?: string[]
  accessoryTypes?: string[]
  chainTypes?: string[]
  settings?: string[]
  diamondShapes?: string[]
  gemstones?: string[]
}

const JEWELRY_CATEGORIES = {
  rings: 'Rings',
  necklaces: 'Necklaces',
  earrings: 'Earrings',
  bracelets: 'Bracelets',
  watches: 'Watches',
  chains: 'Chains',
  accessories: 'Accessories'
} as const

// Your comprehensive category filters
const CATEGORY_FILTERS = {
  rings: {
    ringTypes: [
      { label: 'Engagement Ring', value: 'engagement' },
      { label: 'Wedding Band', value: 'wedding-band' },
      { label: 'Eternity Ring', value: 'eternity' },
      { label: 'Promise Ring', value: 'promise' },
      { label: 'Cocktail Ring', value: 'cocktail' },
      { label: 'Statement Ring', value: 'statement' },
      { label: 'Stacking Ring', value: 'stacking' }
    ],
    ringSettings: [
      { label: 'Solitaire', value: 'solitaire' },
      { label: 'Halo', value: 'halo' },
      { label: 'Three Stone', value: 'three-stone' },
      { label: 'Pave', value: 'pave' },
      { label: 'Channel', value: 'channel' },
      { label: 'Bezel', value: 'bezel' },
      { label: 'Tension', value: 'tension' },
      { label: 'Vintage', value: 'vintage' },
      { label: 'Modern', value: 'modern' }
    ],
    metalTypes: [
      { label: 'Yellow Gold', value: 'yellow-gold' },
      { label: 'White Gold', value: 'white-gold' },
      { label: 'Rose Gold', value: 'rose-gold' },
      { label: 'Platinum', value: 'platinum' },
      { label: 'Palladium', value: 'palladium' },
      { label: 'Silver', value: 'silver' }
    ],
    metalPurity: [
      { label: '24K', value: '24k' },
      { label: '18K', value: '18k' },
      { label: '14K', value: '14k' },
      { label: '10K', value: '10k' },
      { label: '950 Platinum', value: '950-platinum' },
      { label: '900 Platinum', value: '900-platinum' },
      { label: '925 Silver', value: '925-silver' }
    ],
    sizes: [
      { label: '3', value: '3' },
      { label: '3.5', value: '3.5' },
      { label: '4', value: '4' },
      { label: '4.5', value: '4.5' },
      { label: '5', value: '5' },
      { label: '5.5', value: '5.5' },
      { label: '6', value: '6' },
      { label: '6.5', value: '6.5' },
      { label: '7', value: '7' },
      { label: '7.5', value: '7.5' },
      { label: '8', value: '8' },
      { label: '8.5', value: '8.5' },
      { label: '9', value: '9' },
      { label: '9.5', value: '9.5' },
      { label: '10', value: '10' }
    ],
    diamondShapes: [
      { label: 'Round', value: 'round' },
      { label: 'Princess', value: 'princess' },
      { label: 'Cushion', value: 'cushion' },
      { label: 'Oval', value: 'oval' },
      { label: 'Emerald', value: 'emerald' },
      { label: 'Pear', value: 'pear' },
      { label: 'Marquise', value: 'marquise' },
      { label: 'Radiant', value: 'radiant' },
      { label: 'Asscher', value: 'asscher' },
      { label: 'Heart', value: 'heart' }
    ],
    gemstones: [
      { label: 'Diamond', value: 'diamond' },
      { label: 'Ruby', value: 'ruby' },
      { label: 'Sapphire', value: 'sapphire' },
      { label: 'Emerald', value: 'emerald' },
      { label: 'Aquamarine', value: 'aquamarine' },
      { label: 'Amethyst', value: 'amethyst' },
      { label: 'Citrine', value: 'citrine' },
      { label: 'Garnet', value: 'garnet' },
      { label: 'Opal', value: 'opal' },
      { label: 'Pearl', value: 'pearl' },
      { label: 'Tanzanite', value: 'tanzanite' },
      { label: 'Topaz', value: 'topaz' },
      { label: 'Tourmaline', value: 'tourmaline' }
    ]
  },
  necklaces: {
    chainTypes: [
      { label: 'Cable Chain', value: 'cable' },
      { label: 'Rope Chain', value: 'rope' },
      { label: 'Box Chain', value: 'box' },
      { label: 'Curb Chain', value: 'curb' },
      { label: 'Figaro Chain', value: 'figaro' },
      { label: 'Snake Chain', value: 'snake' },
      { label: 'Wheat Chain', value: 'wheat' },
      { label: 'Link Chain', value: 'link' }
    ],
    styles: [
      { label: 'Beaded', value: 'beaded' },
      { label: 'Pearl', value: 'pearl' },
      { label: 'Tennis', value: 'tennis' },
      { label: 'Festoon', value: 'festoon' },
      { label: 'Initial', value: 'initial' },
      { label: 'Sautoir', value: 'sautoir' },
      { label: 'Torque', value: 'torque' },
      { label: 'Lariat', value: 'lariat' },
      { label: 'Graduated', value: 'graduated' },
      { label: 'Collar', value: 'collar' },
      { label: 'Pendant', value: 'pendant' },
      { label: 'Station', value: 'station' },
      { label: 'Multi-Layer', value: 'multi-layer' },
      { label: 'Charm', value: 'charm' },
      { label: 'Bib', value: 'bib' },
      { label: 'Solitaire', value: 'solitaire' },
      { label: 'Tassel', value: 'tassel' },
      { label: 'Leather', value: 'leather' },
      { label: 'Bauble', value: 'bauble' },
      { label: 'Rivière', value: 'riviere' },
      { label: 'Choker', value: 'choker' },
      { label: 'Torsade', value: 'torsade' },
      { label: 'Locket', value: 'locket' },
      { label: 'Negligee', value: 'negligee' },
      { label: 'Plastron', value: 'plastron' },
      { label: 'Birthstone', value: 'birthstone' },
      { label: 'Fringe', value: 'fringe' },
      { label: 'Thread', value: 'thread' },
      { label: 'Opera', value: 'opera' },
      { label: 'Statement', value: 'statement' },
      { label: 'Byadere', value: 'byadere' }
    ],
    metalTypes: [
      { label: 'Yellow Gold', value: 'yellow-gold' },
      { label: 'White Gold', value: 'white-gold' },
      { label: 'Rose Gold', value: 'rose-gold' },
      { label: 'Platinum', value: 'platinum' },
      { label: 'Palladium', value: 'palladium' },
      { label: 'Silver', value: 'silver' }
    ],
    metalPurity: [
      { label: '24K', value: '24k' },
      { label: '18K', value: '18k' },
      { label: '14K', value: '14k' },
      { label: '10K', value: '10k' },
      { label: '950 Platinum', value: '950-platinum' },
      { label: '900 Platinum', value: '900-platinum' },
      { label: '925 Silver', value: '925-silver' }
    ],
    lengths: [
      { label: '14 inches', value: '14' },
      { label: '16 inches', value: '16' },
      { label: '18 inches', value: '18' },
      { label: '20 inches', value: '20' },
      { label: '22 inches', value: '22' },
      { label: '24 inches', value: '24' },
      { label: '30 inches', value: '30' },
      { label: '36 inches', value: '36' }
    ],
    diamondShapes: [
      { label: 'Round', value: 'round' },
      { label: 'Princess', value: 'princess' },
      { label: 'Cushion', value: 'cushion' },
      { label: 'Oval', value: 'oval' },
      { label: 'Emerald', value: 'emerald' },
      { label: 'Pear', value: 'pear' },
      { label: 'Marquise', value: 'marquise' },
      { label: 'Radiant', value: 'radiant' },
      { label: 'Asscher', value: 'asscher' },
      { label: 'Heart', value: 'heart' }
    ],
    gemstones: [
      { label: 'Diamond', value: 'diamond' },
      { label: 'Ruby', value: 'ruby' },
      { label: 'Sapphire', value: 'sapphire' },
      { label: 'Emerald', value: 'emerald' },
      { label: 'Aquamarine', value: 'aquamarine' },
      { label: 'Amethyst', value: 'amethyst' },
      { label: 'Citrine', value: 'citrine' },
      { label: 'Garnet', value: 'garnet' },
      { label: 'Opal', value: 'opal' },
      { label: 'Pearl', value: 'pearl' },
      { label: 'Tanzanite', value: 'tanzanite' },
      { label: 'Topaz', value: 'topaz' },
      { label: 'Tourmaline', value: 'tourmaline' }
    ]
  },
  chains: {
    styles: [
      { label: 'Cable Chain', value: 'cable' },
      { label: 'Rope Chain', value: 'rope' },
      { label: 'Box Chain', value: 'box' },
      { label: 'Curb Chain', value: 'curb' },
      { label: 'Figaro Chain', value: 'figaro' },
      { label: 'Snake Chain', value: 'snake' },
      { label: 'Wheat Chain', value: 'wheat' },
      { label: 'Link Chain', value: 'link' }
    ],
    metalTypes: [
      { label: 'Titanium', value: 'titanium' },
      { label: 'Tungsten', value: 'tungsten' },
      { label: 'Platinum', value: 'platinum' },
      { label: 'Stainless Steel', value: 'stainless-steel' },
      { label: 'Sterling Silver', value: 'sterling-silver' },
      { label: 'Palladium', value: 'palladium' },
      { label: 'Brass', value: 'brass' },
      { label: 'Yellow gold', value: 'yellow-gold' },
      { label: 'Rose gold', value: 'rose-gold' },
      { label: 'White gold', value: 'white-gold' },
      { label: 'Dual tone', value: 'dual-tone' }
    ],
    metalPurity: [
      { label: '24K', value: '24k' },
      { label: '18K', value: '18k' },
      { label: '14K', value: '14k' },
      { label: '10K', value: '10k' },
      { label: '950 Platinum', value: '950-platinum' },
      { label: '900 Platinum', value: '900-platinum' },
      { label: '925 Silver', value: '925-silver' }
    ],
    diamondShapes: [ // Assuming chains can have diamonds
      { label: 'Round', value: 'round' },
      { label: 'Princess', value: 'princess' },
      { label: 'Cushion', value: 'cushion' }
    ],
    gemstones: [ // Assuming chains can have gemstones
      { label: 'Diamond', value: 'diamond' },
      { label: 'Ruby', value: 'ruby' },
      { label: 'Sapphire', value: 'sapphire' }
    ]
  },
  earrings: {
    styles: [
      { label: 'Bajoran', value: 'bajoran' },
      { label: 'Barbell', value: 'barbell' },
      { label: 'Cartilage', value: 'cartilage' },
      { label: 'chandbali', value: 'chandbali' },
      { label: 'Chandelier', value: 'chandelier' },
      { label: 'Cluster', value: 'cluster' },
      { label: 'Dangle', value: 'dangle' },
      { label: 'Drop', value: 'drop' },
      { label: 'Ear Climbers (Crawlers)', value: 'ear-climbers-crawlers' },
      { label: 'Ear Cuffs', value: 'ear-cuffs' },
      { label: 'Gauge', value: 'gauge' },
      { label: 'Halo', value: 'halo' },
      { label: 'Hoop', value: 'hoop' },
      { label: 'Huggie', value: 'huggie' },
      { label: 'Jacket', value: 'jacket' },
      { label: 'Jhumanka', value: 'jhumanka' },
      { label: 'Single', value: 'single' },
      { label: 'Stud', value: 'stud' },
      { label: 'tassel', value: 'tassel' },
      { label: 'Threader', value: 'threader' },
      { label: 'Mismatched', value: 'mismatched' },
      { label: 'Others', value: 'others' }
    ],
    settings: [
      { label: 'Butterfly Backs', value: 'butterfly-backs' },
      { label: 'Clip-On Backs', value: 'clip-on-backs' },
      { label: 'Flat backs', value: 'flat-backs' },
      { label: 'French wire (Fish hook)', value: 'french-wire-fish-hook' },
      { label: 'Hinged Snap backs', value: 'hinged-snap-backs' },
      { label: 'La Pousette Backs', value: 'la-pousette-backs' },
      { label: 'Latch backs (Omega Backs)', value: 'latch-backs-omega-backs' },
      { label: 'Lever Backs', value: 'lever-backs' },
      { label: 'Push Backs (Friction Backs)', value: 'push-backs-friction-backs' },
      { label: 'Screw Backs', value: 'screw-backs' }
    ],
    metalTypes: [
      { label: 'Titanium', value: 'titanium' },
      { label: 'Tungsten', value: 'tungsten' },
      { label: 'Platinum', value: 'platinum' },
      { label: 'Stainless Steel', value: 'stainless-steel' },
      { label: 'Sterling Silver', value: 'sterling-silver' },
      { label: 'Palladium', value: 'palladium' },
      { label: 'Brass', value: 'brass' },
      { label: 'Yellow gold', value: 'yellow-gold' },
      { label: 'Rose gold', value: 'rose-gold' },
      { label: 'White gold', value: 'white-gold' },
      { label: 'Dual tone', value: 'dual-tone' }
    ],
    metalPurity: [
      { label: '24K', value: '24k' },
      { label: '18K', value: '18k' },
      { label: '14K', value: '14k' },
      { label: '10K', value: '10k' },
      { label: '925 Silver', value: '925-silver' }
    ],
    diamondShapes: [
      { label: 'Round', value: 'round' },
      { label: 'Princess', value: 'princess' },
      { label: 'Cushion', value: 'cushion' },
      { label: 'Oval', value: 'oval' },
      { label: 'Emerald', value: 'emerald' }
    ],
    gemstones: [
      { label: 'Diamond', value: 'diamond' },
      { label: 'Sapphire', value: 'sapphire' },
      { label: 'Ruby', value: 'ruby' },
      { label: 'Emerald', value: 'emerald' },
      { label: 'Pearl', value: 'pearl' }
    ]
  },
  watches: {
    brands: [
      { label: 'Rolex', value: 'rolex' },
      { label: 'Cartier', value: 'cartier' },
      { label: 'Omega', value: 'omega' },
      { label: 'Patek Philippe', value: 'patek-philippe' },
      { label: 'Audemars Piguet', value: 'audemars-piguet' },
      { label: 'TAG Heuer', value: 'tag-heuer' },
      { label: 'IWC', value: 'iwc' },
      { label: 'Breitling', value: 'breitling' },
      { label: 'Hublot', value: 'hublot' },
      { label: 'Panerai', value: 'panerai' }
    ],
    models: [
      { label: 'Datejust', value: 'datejust' },
      { label: 'Submariner', value: 'submariner' },
      { label: 'Daytona', value: 'daytona' },
      { label: 'GMT-Master', value: 'gmt-master' },
      { label: 'Tank', value: 'tank' },
      { label: 'Santos', value: 'santos' },
      { label: 'Speedmaster', value: 'speedmaster' },
      { label: 'Seamaster', value: 'seamaster' }
    ],
    dialColors: [
      { label: 'Black', value: 'black' },
      { label: 'White', value: 'white' },
      { label: 'Silver', value: 'silver' },
      { label: 'Blue', value: 'blue' },
      { label: 'Green', value: 'green' },
      { label: 'Mother of Pearl', value: 'mother-of-pearl' },
      { label: 'Champagne', value: 'champagne' }
    ],
    caseShapes: [
      { label: 'Round', value: 'round' },
      { label: 'Square', value: 'square' },
      { label: 'Rectangle', value: 'rectangle' },
      { label: 'Oval', value: 'oval' },
      { label: 'Tonneau', value: 'tonneau' }
    ],
    caseSizes: [
      { label: '28mm', value: '28' },
      { label: '31mm', value: '31' },
      { label: '34mm', value: '34' },
      { label: '36mm', value: '36' },
      { label: '38mm', value: '38' },
      { label: '40mm', value: '40' },
      { label: '41mm', value: '41' },
      { label: '42mm', value: '42' },
      { label: '44mm', value: '44' }
    ],
    caseMaterials: [
      { label: 'Stainless Steel', value: 'stainless-steel' },
      { label: 'Yellow Gold', value: 'yellow-gold' },
      { label: 'White Gold', value: 'white-gold' },
      { label: 'Rose Gold', value: 'rose-gold' },
      { label: 'Platinum', value: 'platinum' },
      { label: 'Titanium', value: 'titanium' },
      { label: 'Ceramic', value: 'ceramic' }
    ],
    strapMaterials: [
      { label: 'Stainless Steel', value: 'stainless-steel' },
      { label: 'Leather', value: 'leather' },
      { label: 'Rubber', value: 'rubber' },
      { label: 'Fabric', value: 'fabric' },
      { label: 'Ceramic', value: 'ceramic' }
    ],
    strapColors: [
      { label: 'Black', value: 'black' },
      { label: 'Brown', value: 'brown' },
      { label: 'Blue', value: 'blue' },
      { label: 'Green', value: 'green' },
      { label: 'Red', value: 'red' },
      { label: 'White', value: 'white' }
    ],
    movements: [
      { label: 'Automatic', value: 'automatic' },
      { label: 'Manual Wind', value: 'manual-wind' },
      { label: 'Quartz', value: 'quartz' },
      { label: 'Kinetic', value: 'kinetic' },
      { label: 'Solar', value: 'solar' }
    ],
    waterResistance: [
      { label: '30m', value: '30m' },
      { label: '50m', value: '50m' },
      { label: '100m', value: '100m' },
      { label: '200m', value: '200m' },
      { label: '300m', value: '300m' },
      { label: '500m', value: '500m' }
    ],
    features: [
      { label: 'Date', value: 'date' },
      { label: 'Chronograph', value: 'chronograph' },
      { label: 'GMT', value: 'gmt' },
      { label: 'Moon Phase', value: 'moon-phase' },
      { label: 'Perpetual Calendar', value: 'perpetual-calendar' },
      { label: 'Power Reserve', value: 'power-reserve' },
      { label: 'Tourbillon', value: 'tourbillon' }
    ],
    dialStones: [
      { label: 'Diamond', value: 'diamond' },
      { label: 'Sapphire', value: 'sapphire' },
      { label: 'Ruby', value: 'ruby' },
      { label: 'Emerald', value: 'emerald' },
      { label: 'None', value: 'none' }
    ],
    styles: [
      { label: 'Dress Watch', value: 'dress' },
      { label: 'Dive Watch', value: 'dive' },
      { label: 'Sports Watch', value: 'sports' },
      { label: 'Chronograph', value: 'chronograph' },
      { label: 'Pilot Watch', value: 'pilot' },
      { label: 'Luxury Watch', value: 'luxury' },
      { label: 'Smart Watch', value: 'smart' },
      { label: 'Field Watch', value: 'field' },
      { label: 'Racing Watch', value: 'racing' },
      { label: 'GMT Watch', value: 'gmt' }
    ]
  },
  bracelets: {
    chainTypes: [
      { label: 'Bangle', value: 'bangle' },
      { label: 'Beaded', value: 'beaded' },
      { label: 'Chain Link', value: 'chain-link' },
      { label: 'Charm', value: 'charm' },
      { label: 'Cuff', value: 'cuff' },
      { label: 'Kada', value: 'kada' },
      { label: 'Pearl', value: 'pearl' },
      { label: 'Slider', value: 'slider' },
      { label: 'Tennis', value: 'tennis' },
      { label: 'Wrap', value: 'wrap' },
      { label: 'Cord', value: 'cord' },
      { label: 'Braided', value: 'braided' },
      { label: 'Multi Layer', value: 'multi-layer' },
      { label: 'Hololith', value: 'hololith' },
      { label: 'Kaliras', value: 'kaliras' },
      { label: 'Bar', value: 'bar' }
    ],
    styles: [
      { label: 'Bangle', value: 'bangle' },
      { label: 'Beaded', value: 'beaded' },
      { label: 'Chain Link', value: 'chain-link' },
      { label: 'Charm', value: 'charm' },
      { label: 'Cuff', value: 'cuff' },
      { label: 'Kada', value: 'kada' },
      { label: 'Pearl', value: 'pearl' },
      { label: 'Slider', value: 'slider' },
      { label: 'Tennis', value: 'tennis' },
      { label: 'Wrap', value: 'wrap' },
      { label: 'Cord', value: 'cord' },
      { label: 'Braided', value: 'braided' },
      { label: 'Multi Layer', value: 'multi-layer' },
      { label: 'Hololith', value: 'hololith' },
      { label: 'Kaliras', value: 'kaliras' },
      { label: 'Bar', value: 'bar' }
    ],
    metalTypes: [
      { label: 'Titanium', value: 'titanium' },
      { label: 'Tungsten', value: 'tungsten' },
      { label: 'Platinum', value: 'platinum' },
      { label: 'Stainless Steel', value: 'stainless-steel' },
      { label: 'Sterling Silver', value: 'sterling-silver' },
      { label: 'Palladium', value: 'palladium' },
      { label: 'Brass', value: 'brass' },
      { label: 'Yellow gold', value: 'yellow-gold' },
      { label: 'Rose gold', value: 'rose-gold' },
      { label: 'White gold', value: 'white-gold' },
      { label: 'Dual tone', value: 'dual-tone' },
      { label: 'Leather', value: 'leather' },
    ],
    metalPurity: [
      { label: '24K', value: '24k' },
      { label: '18K', value: '18k' },
      { label: '14K', value: '14k' },
      { label: '10K', value: '10k' },
      { label: '950 Platinum', value: '950-platinum' },
      { label: '900 Platinum', value: '900-platinum' },
      { label: '925 Silver', value: '925-silver' }
    ],
    lengths: [
      { label: '6 inches', value: '6' },
      { label: '6.5 inches', value: '6.5' },
      { label: '7 inches', value: '7' },
      { label: '7.5 inches', value: '7.5' },
      { label: '8 inches', value: '8' },
      { label: '8.5 inches', value: '8.5' },
      { label: '9 inches', value: '9' }
    ],
    diamondShapes: [
      { label: 'Round', value: 'round' },
      { label: 'Princess', value: 'princess' },
      { label: 'Cushion', value: 'cushion' },
      { label: 'Oval', value: 'oval' },
      { label: 'Emerald', value: 'emerald' },
      { label: 'Pear', value: 'pear' },
      { label: 'Marquise', value: 'marquise' },
      { label: 'Radiant', value: 'radiant' },
      { label: 'Asscher', value: 'asscher' },
      { label: 'Heart', value: 'heart' }
    ],
    gemstones: [
      { label: 'Diamond', value: 'diamond' },
      { label: 'Ruby', value: 'ruby' },
      { label: 'Sapphire', value: 'sapphire' },
      { label: 'Emerald', value: 'emerald' },
      { label: 'Aquamarine', value: 'aquamarine' },
      { label: 'Amethyst', value: 'amethyst' },
      { label: 'Citrine', value: 'citrine' },
      { label: 'Garnet', value: 'garnet' },
      { label: 'Opal', value: 'opal' },
      { label: 'Pearl', value: 'pearl' },
      { label: 'Tanzanite', value: 'tanzanite' },
      { label: 'Topaz', value: 'topaz' },
      { label: 'Tourmaline', value: 'tourmaline' }
    ]
  },
  accessories: {
    accessoryTypes: [
      { label: 'Maang Tikka', value: 'maang-tikka' },
      { label: 'Nose Pin', value: 'nose-pin' },
      { label: 'Anklet', value: 'anklet' },
      { label: 'Charms', value: 'charms' },
      { label: 'Hair Pin', value: 'hair-pin' },
      { label: 'Cuff Links', value: 'cuff-links' },
      { label: 'Armlet', value: 'armlet' },
      { label: 'Brooch', value: 'brooch' },
      { label: 'Belly Chain', value: 'belly-chain' },
      { label: 'Belly Button Ring', value: 'belly-button-ring' },
      { label: 'Toe Ring', value: 'toe-ring' },
      { label: 'Chatelaine', value: 'chatelaine' }
    ],
    metalTypes: [
      { label: 'Yellow Gold', value: 'yellow-gold' },
      { label: 'White Gold', value: 'white-gold' },
      { label: 'Rose Gold', value: 'rose-gold' },
      { label: 'Platinum', value: 'platinum' },
      { label: 'Sterling Silver', value: 'sterling-silver' },
      { label: 'Stainless Steel', value: 'stainless-steel' },
      { label: 'Brass', value: 'brass' },
      { label: 'Copper', value: 'copper' },
      { label: 'Titanium', value: 'titanium' },
      { label: 'Alloy', value: 'alloy' }
    ],
    metalPurity: [
      { label: '24K', value: '24k' },
      { label: '18K', value: '18k' },
      { label: '14K', value: '14k' },
      { label: '10K', value: '10k' },
      { label: '925 Silver', value: '925-silver' },
      { label: '950 Platinum', value: '950-platinum' },
      { label: '900 Platinum', value: '900-platinum' }
    ],
    diamondShapes: [
      { label: 'Round', value: 'round' },
      { label: 'Princess', value: 'princess' },
      { label: 'Cushion', value: 'cushion' },
      { label: 'Oval', value: 'oval' },
      { label: 'Emerald', value: 'emerald' },
      { label: 'Pear', value: 'pear' },
      { label: 'Marquise', value: 'marquise' },
      { label: 'Radiant', value: 'radiant' },
      { label: 'Asscher', value: 'asscher' },
      { label: 'Heart', value: 'heart' }
    ],
    gemstones: [
      { label: 'Diamond', value: 'diamond' },
      { label: 'Ruby', value: 'ruby' },
      { label: 'Sapphire', value: 'sapphire' },
      { label: 'Emerald', value: 'emerald' },
      { label: 'Pearl', value: 'pearl' },
      { label: 'Cubic Zirconia', value: 'cubic-zirconia' },
      { label: 'Crystal', value: 'crystal' },
      { label: 'Rhinestone', value: 'rhinestone' },
      { label: 'None', value: 'none' }
    ]
  }
};

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'totalPrice', label: 'Price: Low to High' },
  { value: '-totalPrice', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
  { value: '-name', label: 'Name: Z to A' }
]

// Helper function to get ring type icons
const getRingTypeIcon = (ringType: string) => {
  const iconMap: Record<string, string> = {
    'engagement': '💍',
    'wedding-band': '💒',
    'eternity': '♾️',
    'promise': '💝',
    'cocktail': '🍸',
    'statement': '✨',
    'stacking': '📚'
  }
  return iconMap[ringType] || '💍'
}

export default function JewelryCategoryPage() {
  const params = useParams()

  const category = params?.category as string
  const categoryTitle = category ? JEWELRY_CATEGORIES[category as keyof typeof JEWELRY_CATEGORIES] || category : 'Jewelry'

  // State
  const [jewelry, setJewelry] = useState<JewelryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Drawer state for filters
  const [showFilters, setShowFilters] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })

  const [filters, setFilters] = useState<JewelryFilters>({
    priceRange: { min: 0, max: 50000 },
    metalType: [],
    style: [],
    purity: [],
    stones: [],
    certification: [],
    sort: '-createdAt',
    ringTypes: [],
    ringSettings: [],
    sizes: [],
    lengths: [],
    brands: [],
    models: [],
    dialColors: [],
    caseShapes: [],
    caseSizes: [],
    caseMaterials: [],
    strapMaterials: [],
    strapColors: [],
    movements: [],
    waterResistance: [],
    features: [],
    dialStones: [],
    accessoryTypes: [],
    chainTypes: [],
    settings: [],
    diamondShapes: [],
    gemstones: []
  })

  // Local price range for immediate UI updates (no debouncing)
  const [localPriceRange, setLocalPriceRange] = useState({ min: 0, max: 50000 })

  // Mount the drawer immediately when opening
  useEffect(() => {
    if (showFilters) {
      setDrawerVisible(true)
    }
  }, [showFilters])

  // Instantly trigger the open animation after mount
  useLayoutEffect(() => {
    if (drawerVisible && showFilters) {
      setDrawerOpen(true)
    } else if (!showFilters) {
      setDrawerOpen(false)
    }
  }, [drawerVisible, showFilters])

  // Get category-specific filter options with proper typing
  const getCategoryFilters = (): Record<string, unknown> => {
    const categoryKey = category as keyof typeof CATEGORY_FILTERS
    const filters = CATEGORY_FILTERS[categoryKey] || {}
    return filters as Record<string, unknown>
  }

  const categoryFilters = getCategoryFilters()

  // Clear filters function
  const clearFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 50000 },
      metalType: [],
      style: [],
      purity: [],
      stones: [],
      certification: [],
      sort: '-createdAt',
      ringTypes: [],
      ringSettings: [],
      sizes: [],
      lengths: [],
      brands: [],
      models: [],
      dialColors: [],
      caseShapes: [],
      caseSizes: [],
      caseMaterials: [],
      strapMaterials: [],
      strapColors: [],
      movements: [],
      waterResistance: [],
      features: [],
      dialStones: [],
      accessoryTypes: [],
      chainTypes: [],
      settings: [],
      diamondShapes: [],
      gemstones: []
    })
    setSearchQuery('')
    setLocalPriceRange({ min: 0, max: 50000 })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Debounced price range update function
  const debouncedPriceRangeUpdate = useCallback(
    (newPriceRange: { min: number; max: number }) => {
      const debouncedFn = debounce(() => {
        setFilters(prev => ({
          ...prev,
          priceRange: newPriceRange
        }))
        setPagination(prev => ({ ...prev, page: 1 }))
      }, 500);
      debouncedFn();
    },
    [setFilters, setPagination]
  )

  // Handle price range change with immediate UI update and debounced API call
  const handlePriceRangeChange = (newPriceRange: { min: number; max: number }) => {
    // Update local state immediately for smooth UI
    setLocalPriceRange(newPriceRange)
    // Debounce the actual filter update that triggers API call
    debouncedPriceRangeUpdate(newPriceRange)
  }

  // Fetch jewelry data
  const fetchJewelry = useCallback(async (queryParams: JewelryQueryParams) => {
    try {
      setLoading(true)
      setError(null)

      const response = await jewelryService.getAllJewelry(queryParams)

      if (response.success) {
        setJewelry(response.data.data || [])
        setPagination({
          page: response.data.meta.currentPage,
          limit: response.data.meta.perPage,
          total: response.data.meta.total,
          totalPages: response.data.meta.lastPage
        })
      }
    } catch (err) {
      setError('Failed to fetch jewelry. Please try again.')
      console.error('Error fetching jewelry:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Build query params from filters
  const buildQueryParams = useCallback((): JewelryQueryParams => {
    const params = {
      // category,
      search: searchQuery || undefined,
      page: pagination.page,
      limit: pagination.limit,
      sort: filters.sort,
      priceMin: filters.priceRange.min > 0 ? filters.priceRange.min : undefined,
      priceMax: filters.priceRange.max < 50000 ? filters.priceRange.max : undefined,
      metal: filters.metalType.length > 0 ? filters.metalType : undefined,
      style: filters.style.length > 0 ? filters.style : undefined,
      certification: filters.certification.length > 0 ? filters.certification : undefined,
    }
    console.log('Query params:', params) // Debug log
    return params
  }, [searchQuery, pagination.page, pagination.limit, filters])

  // Load data on mount and filter changes
  useEffect(() => {
    fetchJewelry(buildQueryParams())
  }, [fetchJewelry, buildQueryParams])

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Handle filter changes
  const handleFilterChange = (filterType: keyof JewelryFilters, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Count applied filters
  const getTotalAppliedFilters = () => {
    let count = 0
    if (filters.priceRange.min > 0 || filters.priceRange.max < 50000) count++
    count += filters.metalType.length
    count += filters.style.length
    count += filters.purity.length
    count += filters.stones.length
    count += filters.certification.length
    count += filters.ringTypes?.length || 0
    count += filters.ringSettings?.length || 0
    count += filters.sizes?.length || 0
    count += filters.lengths?.length || 0
    count += filters.brands?.length || 0
    count += filters.models?.length || 0
    count += filters.dialColors?.length || 0
    count += filters.caseShapes?.length || 0
    count += filters.caseSizes?.length || 0
    count += filters.caseMaterials?.length || 0
    count += filters.strapMaterials?.length || 0
    count += filters.strapColors?.length || 0
    count += filters.movements?.length || 0
    count += filters.waterResistance?.length || 0
    count += filters.features?.length || 0
    count += filters.dialStones?.length || 0
    count += filters.accessoryTypes?.length || 0
    count += filters.chainTypes?.length || 0
    count += filters.settings?.length || 0
    count += filters.diamondShapes?.length || 0
    count += filters.gemstones?.length || 0
    return count
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <NavigationUser />

        <div className="container mx-auto px-6 pb-8 pt-4">
          {/* Search and Controls */}
        <div className="bg-white rounded-lg p-3 mb-2 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search jewelry..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Sort */}
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
                aria-label="Sort"
              >
                <ArrowUpDown className="w-4 h-4 text-gray-700" />
              </button>

              {/* Filter Button */}
              <button
                className="px-3 py-2 flex items-center gap-2 rounded-lg bg-white shadow border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
                onClick={() => setShowFilters(true)}
                aria-label="Open filters"
              >
                <Filter className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">Filters</span>
                {getTotalAppliedFilters() > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                    {getTotalAppliedFilters()}
                  </span>
                )}
              </button>

              {/* View Mode */}
              <div className="flex items-center bg-white shadow border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Toggle */}
              {/* <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button> */}
            </div>
          </div>

          {/* Active Filters */}
          {(filters.metalType.length > 0 || filters.style.length > 0 ||
            filters.certification.length > 0 || filters.priceRange.min > 0 || filters.priceRange.max < 50000 ||
            (filters.ringTypes && filters.ringTypes.length > 0)) && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">Active Filters:</span>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Ring Types */}
                  {(filters.ringTypes || []).map(ringType => {
                    const ringTypeLabel = (categoryFilters.ringTypes as Array<{ value: string; label: string }> | undefined)?.find(r => r.value === ringType)?.label || ringType
                    return (
                      <span key={ringType} className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-800 text-sm rounded-full">
                        Ring: {ringTypeLabel}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleFilterChange('ringTypes', (filters.ringTypes || []).filter(r => r !== ringType))}
                        />
                      </span>
                    )
                  })}
                  {filters.metalType.map(metal => (
                    <span key={metal} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      Metal: {metal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleFilterChange('metalType', filters.metalType.filter(m => m !== metal))}
                      />
                    </span>
                  ))}
                  {filters.style.map(style => (
                    <span key={style} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Style: {style}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleFilterChange('style', filters.style.filter(s => s !== style))}
                      />
                    </span>
                  ))}
                  {(filters.priceRange.min > 0 || filters.priceRange.max < 50000) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      Price: ${filters.priceRange.min.toLocaleString()} - ${filters.priceRange.max.toLocaleString()}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleFilterChange('priceRange', { min: 0, max: 50000 })}
                      />
                    </span>
                  )}
                </div>
              </div>
            )}
        </div>

        {/* Watch Brands Horizontal Filter - For watches category */}
        {category === 'watches' && Array.isArray(categoryFilters.brands) && categoryFilters.brands.length > 0 && (
          <div className="mb-2 bg-white rounded-lg shadow-sm p-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-3 whitespace-nowrap">Filter by Brand:</span>
              </div>
              <div className="flex flex-nowrap gap-3 overflow-x-auto w-full scrollbar-hide">
                {/* All Brands Button */}
                <button
                  onClick={() => handleFilterChange('brands', [])}
                  className={`rounded-lg whitespace-nowrap px-4 py-2 h-auto transition-all duration-200 ${
                    (!filters.brands || filters.brands.length === 0)
                      ? 'bg-gray-700 border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-800' 
                      : 'border border-slate-300 text-slate-700 hover:border-gray-500 hover:text-gray-700 bg-white'
                  }`}
                >
                  All Brands
                </button>
                
                {/* Brand Logo Buttons */}
                {(categoryFilters.brands as Array<{ value: string; label: string }> | undefined)?.map(brand => {
                  const isSelected = filters.brands?.includes(brand.value) || false
                  const logoPath = WATCH_BRAND_LOGOS[brand.value as keyof typeof WATCH_BRAND_LOGOS]
                  
                  return (
                    <button
                      key={brand.value}
                      onClick={() => {
                        const currentBrands = filters.brands || []
                        const newBrands = isSelected
                          ? currentBrands.filter(b => b !== brand.value)
                          : [...currentBrands, brand.value] // Allow multiple selection
                        handleFilterChange('brands', newBrands)
                      }}
                      className={`p-1 rounded-lg transition-all duration-200 flex items-center justify-center whitespace-nowrap h-auto border ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-slate-300 hover:text-yellow-600 hover:border-yellow-400'
                      }`}
                    >
                      <div className="w-20 h-10 relative flex items-center justify-center">
                        {logoPath ? (
                          <Image
                            src={logoPath}
                            alt={brand.label}
                            width={80}
                            height={40}
                            className="object-contain max-w-full max-h-full"
                            style={{ 
                              filter: isSelected ? 'brightness(0) invert(1)' : 'none' 
                            }}
                            onError={(e) => {
                              // Fallback to text if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('span')) {
                                const fallback = document.createElement('span');
                                fallback.textContent = brand.label;
                                fallback.className = 'text-xs font-medium text-center';
                                fallback.style.color = isSelected ? 'white' : '#6b7280';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          <span className={`text-xs font-medium text-center ${
                            isSelected ? 'text-white' : 'text-slate-600'
                          }`}>
                            {brand.label}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Ring Types Filter Bar - For rings category */}
        {category === 'rings' && Array.isArray(categoryFilters.ringTypes) && categoryFilters.ringTypes.length > 0 && (
          <div className="mb-2 bg-white rounded-lg shadow-sm p-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-3 whitespace-nowrap">Filter by Ring Type:</span>
              </div>
              <div className="flex flex-nowrap gap-3 overflow-x-auto w-full scrollbar-hide">
                {/* All Ring Types Button */}
                <button
                  onClick={() => handleFilterChange('ringTypes', [])}
                  className={`rounded-lg whitespace-nowrap px-4 py-2 h-auto transition-all duration-200 ${
                    (!filters.ringTypes || filters.ringTypes.length === 0)
                      ? 'bg-gray-700 border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-800' 
                      : 'border border-slate-300 text-slate-700 hover:border-gray-500 hover:text-gray-700 bg-white'
                  }`}
                >
                  All Types
                </button>
                
                {/* Ring Type Buttons */}
                {(categoryFilters.ringTypes as Array<{ value: string; label: string }> | undefined)?.map(ringType => {
                  const isSelected = filters.ringTypes?.includes(ringType.value) || false

                  return (
                    <button
                      key={ringType.value}
                      onClick={() => {
                        const currentRingTypes = filters.ringTypes || []
                        const newRingTypes = isSelected
                          ? currentRingTypes.filter(r => r !== ringType.value)
                          : [...currentRingTypes, ringType.value]
                        handleFilterChange('ringTypes', newRingTypes)
                      }}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap ${
                        isSelected
                          ? 'bg-amber-600 border-amber-600 text-white hover:bg-amber-700'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-amber-400 hover:text-amber-600'
                      }`}
                    >
                      {/* Ring Type Icon */}
                      <span className="text-lg" role="img" aria-label={ringType.label}>
                        {getRingTypeIcon(ringType.value)}
                      </span>
                      {/* Ring Type Name */}
                      <span className="text-sm font-medium">
                        {ringType.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="w-full">
          {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600">
                {loading ? (
                  'Loading...'
                ) : (
                  `Showing ${jewelry.length} of ${pagination.total} results`
                )}
              </p>
            </div>
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => fetchJewelry(buildQueryParams())}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && jewelry.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">No jewelry found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Product Grid/List */}
            {!loading && !error && jewelry.length > 0 && (
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {jewelry.map(item => (
                    <JewelryCard key={item.id} item={item} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                      >
                        Previous
                      </button>

                      {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
                        const page = Math.max(1, pagination.page - 2) + index
                        if (page > pagination.totalPages) return null

                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 border rounded-lg ${page === pagination.page
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'border-slate-300 hover:bg-slate-50'
                              }`}
                          >
                            {page}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />

    {/* Drawer for filters - positioned outside main content */}
    {drawerVisible && (
      <>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setShowFilters(false)}
          aria-label="Close filters overlay"
        />
        {/* Drawer */}
        <div
          className={`fixed top-0 right-0 w-full max-w-md h-full bg-white dark:bg-gray-900 z-[110] shadow-2xl p-0 flex flex-col transition-transform duration-300 ease-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ minHeight: '100vh' }}
          onTransitionEnd={() => {
            if (!drawerOpen) setDrawerVisible(false);
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-5 sticky top-0 z-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters</h2>
              <button
                className="p-1.5 rounded-full hover:bg-white dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
                onClick={() => setShowFilters(false)}
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              {getTotalAppliedFilters() > 0 ? (
                <>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {getTotalAppliedFilters()} {getTotalAppliedFilters() === 1 ? 'filter' : 'filters'} applied
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 transition-colors"
                  >
                    Clear all
                  </button>
                </>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-500">No filters applied</span>
              )}
            </div>
          </div>

          {/* Custom Scrollbar Styles */}
          <style jsx>{`
            .filter-scroll::-webkit-scrollbar {
              width: 6px;
            }
            .filter-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .filter-scroll::-webkit-scrollbar-thumb {
              background: #d1d5db;
              border-radius: 3px;
            }
            .filter-scroll::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
            .dark .filter-scroll::-webkit-scrollbar-thumb {
              background: #4b5563;
            }
            .dark .filter-scroll::-webkit-scrollbar-thumb:hover {
              background: #6b7280;
            }
          `}</style>

          {/* Filter Sections Container */}
          <div className="filter-scroll flex-1 overflow-y-auto">
            <div className="space-y-6 py-4">
              {/* Price Range Filter */}
              <FilterSection 
                title="Price Range" 
                count={filters.priceRange.min > 0 || filters.priceRange.max < 50000 ? 1 : 0}
              >
                <div className="px-6 py-4">
                  <div className="mb-4 flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span>${filters.priceRange.min.toLocaleString()}</span>
                    <span>${filters.priceRange.max.toLocaleString()}</span>
                  </div>
                  <Slider
                    range
                    min={0}
                    max={50000}
                    step={100}
                    value={[filters.priceRange.min, filters.priceRange.max]}
                    onChange={(value) => {
                      if (Array.isArray(value)) {
                        handleFilterChange('priceRange', {
                          min: value[0],
                          max: value[1]
                        })
                      }
                    }}
                    trackStyle={[{ backgroundColor: '#f59e0b', height: '4px' }]}
                    handleStyle={[
                      { backgroundColor: '#f59e0b', borderColor: '#f59e0b', width: '16px', height: '16px', marginTop: '-6px' },
                      { backgroundColor: '#f59e0b', borderColor: '#f59e0b', width: '16px', height: '16px', marginTop: '-6px' }
                    ]}
                    railStyle={{ backgroundColor: '#e5e7eb', height: '4px' }}
                  />
                </div>
              </FilterSection>

              {/* Ring Types - Show only for rings category */}
              {category === 'rings' && Array.isArray(categoryFilters.ringTypes) && categoryFilters.ringTypes.length > 0 && (
                <FilterSection 
                  title="Ring Type" 
                  count={filters.ringTypes?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.ringTypes}
                    selectedValues={filters.ringTypes || []}
                    onChange={(value) => handleFilterChange('ringTypes', value)}
                  />
                </FilterSection>
              )}

              {/* Ring Settings - Show only for rings category */}
              {category === 'rings' && Array.isArray(categoryFilters.ringSettings) && categoryFilters.ringSettings.length > 0 && (
                <FilterSection 
                  title="Ring Setting" 
                  count={filters.ringSettings?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.ringSettings}
                    selectedValues={filters.ringSettings || []}
                    onChange={(value) => handleFilterChange('ringSettings', value)}
                  />
                </FilterSection>
              )}

              {/* Watch Brands - Show only for watches category */}
              {category === 'watches' && Array.isArray(categoryFilters.brands) && categoryFilters.brands.length > 0 && (
                <FilterSection 
                  title="Brand" 
                  count={filters.brands?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.brands}
                    selectedValues={filters.brands || []}
                    onChange={(value) => handleFilterChange('brands', value)}
                  />
                </FilterSection>
              )}

              {/* Watch Models - Show only for watches category */}
              {category === 'watches' && Array.isArray(categoryFilters.models) && categoryFilters.models.length > 0 && (
                <FilterSection 
                  title="Model" 
                  count={filters.models?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.models}
                    selectedValues={filters.models || []}
                    onChange={(value) => handleFilterChange('models', value)}
                  />
                </FilterSection>
              )}

              {/* Metal Type */}
              {Array.isArray(categoryFilters.metalTypes) && categoryFilters.metalTypes.length > 0 && (
                <FilterSection 
                  title="Metal Type" 
                  count={filters.metalType.length}
                >
                  <CheckboxGroup
                    options={categoryFilters.metalTypes}
                    selectedValues={filters.metalType}
                    onChange={(value) => handleFilterChange('metalType', value)}
                  />
                </FilterSection>
              )}

              {/* Metal Purity */}
              {Array.isArray(categoryFilters.metalPurity) && categoryFilters.metalPurity.length > 0 && (
                <FilterSection 
                  title="Purity" 
                  count={filters.purity.length}
                >
                  <CheckboxGroup
                    options={categoryFilters.metalPurity}
                    selectedValues={filters.purity}
                    onChange={(value) => handleFilterChange('purity', value)}
                  />
                </FilterSection>
              )}

              {/* Diamond Shapes */}
              {Array.isArray(categoryFilters.diamondShapes) && categoryFilters.diamondShapes.length > 0 && (
                <FilterSection 
                  title="Diamond Shape" 
                  count={filters.diamondShapes?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.diamondShapes}
                    selectedValues={filters.diamondShapes || []}
                    onChange={(value) => handleFilterChange('diamondShapes', value)}
                  />
                </FilterSection>
              )}

              {/* Gemstone Types */}
              {Array.isArray(categoryFilters.gemstones) && categoryFilters.gemstones.length > 0 && (
                <FilterSection 
                  title="Gemstone" 
                  count={filters.gemstones?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.gemstones}
                    selectedValues={filters.gemstones || []}
                    onChange={(value) => handleFilterChange('gemstones', value)}
                  />
                </FilterSection>
              )}

              {/* Styles */}
              {Array.isArray(categoryFilters.styles) && categoryFilters.styles.length > 0 && (
                <FilterSection 
                  title="Style" 
                  count={filters.style.length}
                >
                  <CheckboxGroup
                    options={categoryFilters.styles}
                    selectedValues={filters.style}
                    onChange={(value) => handleFilterChange('style', value)}
                  />
                </FilterSection>
              )}

              {/* Watch-specific filters */}
              {category === 'watches' && (
                <>
                  {/* Dial Color */}
                  {Array.isArray(categoryFilters.dialColors) && categoryFilters.dialColors.length > 0 && (
                    <FilterSection 
                      title="Dial Color" 
                      count={filters.dialColors?.length || 0}
                    >
                      <CheckboxGroup
                        options={categoryFilters.dialColors}
                        selectedValues={filters.dialColors || []}
                        onChange={(value) => handleFilterChange('dialColors', value)}
                      />
                    </FilterSection>
                  )}

                  {/* Case Shape */}
                  {Array.isArray(categoryFilters.caseShapes) && categoryFilters.caseShapes.length > 0 && (
                    <FilterSection 
                      title="Case Shape" 
                      count={filters.caseShapes?.length || 0}
                    >
                      <CheckboxGroup
                        options={categoryFilters.caseShapes}
                        selectedValues={filters.caseShapes || []}
                        onChange={(value) => handleFilterChange('caseShapes', value)}
                      />
                    </FilterSection>
                  )}

                  {/* Movement */}
                  {Array.isArray(categoryFilters.movements) && categoryFilters.movements.length > 0 && (
                    <FilterSection 
                      title="Movement" 
                      count={filters.movements?.length || 0}
                    >
                      <CheckboxGroup
                        options={categoryFilters.movements}
                        selectedValues={filters.movements || []}
                        onChange={(value) => handleFilterChange('movements', value)}
                      />
                    </FilterSection>
                  )}

                  {/* Water Resistance */}
                  {Array.isArray(categoryFilters.waterResistance) && categoryFilters.waterResistance.length > 0 && (
                    <FilterSection 
                      title="Water Resistance" 
                      count={filters.waterResistance?.length || 0}
                    >
                      <CheckboxGroup
                        options={categoryFilters.waterResistance}
                        selectedValues={filters.waterResistance || []}
                        onChange={(value) => handleFilterChange('waterResistance', value)}
                      />
                    </FilterSection>
                  )}

                  {/* Case Size */}
                  {Array.isArray(categoryFilters.caseSizes) && categoryFilters.caseSizes.length > 0 && (
                    <FilterSection 
                      title="Case Size" 
                      count={filters.caseSizes?.length || 0}
                    >
                      <CheckboxGroup
                        options={categoryFilters.caseSizes}
                        selectedValues={filters.caseSizes || []}
                        onChange={(value) => handleFilterChange('caseSizes', value)}
                      />
                    </FilterSection>
                  )}

                  {/* Case Material */}
                  {Array.isArray(categoryFilters.caseMaterials) && categoryFilters.caseMaterials.length > 0 && (
                    <FilterSection 
                      title="Case Material" 
                      count={filters.caseMaterials?.length || 0}
                    >
                      <CheckboxGroup
                        options={categoryFilters.caseMaterials}
                        selectedValues={filters.caseMaterials || []}
                        onChange={(value) => handleFilterChange('caseMaterials', value)}
                      />
                    </FilterSection>
                  )}

                  {/* Strap Material */}
                  {Array.isArray(categoryFilters.strapMaterials) && categoryFilters.strapMaterials.length > 0 && (
                    <FilterSection 
                      title="Strap Material" 
                      count={filters.strapMaterials?.length || 0}
                    >
                      <CheckboxGroup
                        options={categoryFilters.strapMaterials}
                        selectedValues={filters.strapMaterials || []}
                        onChange={(value) => handleFilterChange('strapMaterials', value)}
                      />
                    </FilterSection>
                  )}

                  {/* Strap Color */}
                  {Array.isArray(categoryFilters.strapColors) && categoryFilters.strapColors.length > 0 && (
                    <FilterSection 
                      title="Strap Color" 
                      count={filters.strapColors?.length || 0}
                    >
                      <CheckboxGroup
                        options={categoryFilters.strapColors}
                        selectedValues={filters.strapColors || []}
                        onChange={(value) => handleFilterChange('strapColors', value)}
                      />
                    </FilterSection>
                  )}

                  {/* Features */}
                  {Array.isArray(categoryFilters.features) && categoryFilters.features.length > 0 && (
                    <FilterSection 
                      title="Features" 
                      count={filters.features?.length || 0}
                    >
                      <CheckboxGroup
                        options={categoryFilters.features}
                        selectedValues={filters.features || []}
                        onChange={(value) => handleFilterChange('features', value)}
                      />
                    </FilterSection>
                  )}

                  {/* Dial Stones */}
                  {Array.isArray(categoryFilters.dialStones) && categoryFilters.dialStones.length > 0 && (
                    <FilterSection 
                      title="Dial Stones" 
                      count={filters.dialStones?.length || 0}
                    >
                      <CheckboxGroup
                        options={categoryFilters.dialStones}
                        selectedValues={filters.dialStones || []}
                        onChange={(value) => handleFilterChange('dialStones', value)}
                      />
                    </FilterSection>
                  )}
                </>
              )}

              {/* Chain Types - For necklaces and bracelets only */}
              {(category === 'necklaces' || category === 'bracelets') && Array.isArray(categoryFilters.chainTypes) && categoryFilters.chainTypes.length > 0 && (
                <FilterSection 
                  title="Chain Type" 
                  count={filters.chainTypes?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.chainTypes}
                    selectedValues={filters.chainTypes || []}
                    onChange={(value) => handleFilterChange('chainTypes', value)}
                  />
                </FilterSection>
              )}

              {/* Length - For chains, necklaces, and bracelets */}
              {(category === 'chains' || category === 'necklaces' || category === 'bracelets') && Array.isArray(categoryFilters.lengths) && categoryFilters.lengths.length > 0 && (
                <FilterSection 
                  title={category === 'bracelets' ? 'Bracelet Length' : 'Chain Length'}
                  count={filters.lengths?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.lengths}
                    selectedValues={filters.lengths || []}
                    onChange={(value) => handleFilterChange('lengths', value)}
                  />
                </FilterSection>
              )}

              {/* Ring Size - For rings */}
              {category === 'rings' && Array.isArray(categoryFilters.sizes) && categoryFilters.sizes.length > 0 && (
                <FilterSection 
                  title="Ring Size" 
                  count={filters.sizes?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.sizes}
                    selectedValues={filters.sizes || []}
                    onChange={(value) => handleFilterChange('sizes', value)}
                  />
                </FilterSection>
              )}

              {/* Earring Settings - For earrings category */}
              {category === 'earrings' && Array.isArray(categoryFilters.settings) && categoryFilters.settings.length > 0 && (
                <FilterSection 
                  title="Earring Settings" 
                  count={filters.settings?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.settings}
                    selectedValues={filters.settings || []}
                    onChange={(value) => handleFilterChange('settings', value)}
                  />
                </FilterSection>
              )}

              {/* Accessory Types - For accessories category */}
              {category === 'accessories' && Array.isArray(categoryFilters.accessoryTypes) && categoryFilters.accessoryTypes.length > 0 && (
                <FilterSection 
                  title="Accessory Type" 
                  count={filters.accessoryTypes?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.accessoryTypes}
                    selectedValues={filters.accessoryTypes || []}
                    onChange={(value) => handleFilterChange('accessoryTypes', value)}
                  />
                </FilterSection>
              )}
            </div>
          </div>

          {/* Footer - Show Results Button */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
            <button
              onClick={() => setShowFilters(false)}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
            >
              Show Results
            </button>
          </div>
        </div>
      </>
    )}
  </>
  )
}

// Helper Components
interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  count?: number;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, isOpen = false, children, count }) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
          {title}
          {count !== undefined && count > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
              {count}
            </span>
          )}
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="px-6 pb-5 pt-3 bg-gray-50/50 dark:bg-gray-800/20">
          {children}
        </div>
      )}
    </div>
  );
};

interface CheckboxGroupProps {
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  searchable?: boolean;
  maxHeight?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  selectedValues,
  onChange,
  searchable = true,
  maxHeight = "200px"
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayOptions = showAll ? filteredOptions : filteredOptions.slice(0, 8);
  const hasMoreOptions = filteredOptions.length > 8;

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <div className="space-y-3">
      {/* Search Input */}
      {searchable && options.length > 5 && (
        <div className="mb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Options Container */}
      <div
        className="space-y-1 max-h-64 overflow-y-auto"
        style={{ maxHeight: showAll ? maxHeight : 'auto' }}
      >
        {displayOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors flex-1">{option.label}</span>
            {selectedValues.includes(option.value) && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                ✓
              </span>
            )}
          </label>
        ))}
      </div>

      {/* Show More/Less Button */}
      {hasMoreOptions && !searchQuery && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-sm text-blue-600 hover:text-blue-800 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          {showAll ? 'Show Less' : `Show All (${filteredOptions.length})`}
        </button>
      )}

      {/* No Results */}
      {searchQuery && filteredOptions.length === 0 && (
        <div className="text-center py-4 text-slate-500 text-sm">
          No options found for &quot;{searchQuery}&quot;
        </div>
      )}

      {/* Selected Count */}
      {selectedValues.length > 0 && (
        <div className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
          {selectedValues.length} selected
        </div>
      )}
    </div>
  );
};

// Image Carousel Component
interface ImageCarouselProps {
  images: (string | null | undefined)[]
  alt: string
  className?: string
}

function ImageCarousel({ images, alt, className = "" }: ImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Filter out null and undefined images
  const validImages = images.filter((img): img is string => img !== null && img !== undefined && img !== '')
  
  if (validImages.length === 0) {
    return (
      <div className={`bg-slate-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-slate-400">
          <div className="w-16 h-16 mx-auto mb-2 bg-slate-200 rounded-full flex items-center justify-center">
            <Star className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-sm">No Image</p>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
  }

  return (
    <div className={`relative group ${className}`}>
      <Image
        src={validImages[currentImageIndex]}
        alt={alt}
        width={400}
        height={400}
        className="w-full h-full object-cover transition-transform duration-300"
        onError={() => {
          // Fallback to next image if current one fails
          const nextIndex = (currentImageIndex + 1) % validImages.length;
          if (nextIndex !== currentImageIndex && validImages[nextIndex]) {
            setCurrentImageIndex(nextIndex);
          }
        }}
      />
      
      {/* Navigation Arrows - only show if more than 1 image */}
      {validImages.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
      
      {/* Image Indicators - only show if more than 1 image */}
      {validImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                setCurrentImageIndex(index)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Image Counter */}
      {validImages.length > 1 && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm">
          {currentImageIndex + 1}/{validImages.length}
        </div>
      )}
    </div>
  )
}

// Jewelry Card Component
interface JewelryCardProps {
  item: JewelryItem
  viewMode: 'grid' | 'list'
}

function JewelryCard({ item, viewMode }: JewelryCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/product/jewelry/${item.id}`)
  }

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex gap-6">
          <div className="w-32 h-32 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
            <ImageCarousel
              images={[item.image1, item.image2, item.image3, item.image4, item.image5, item.image6]}
              alt={item.name || 'Jewelry item'}
              className="w-full h-full"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-medium text-slate-900">{item.name}</h3>
              <div onClick={(e) => e.stopPropagation()}>
                <WishlistButton
                  productId={Number(item.id)}
                  productType="jewellery"
                  size="md"
                  variant="minimal"
                />
              </div>
            </div>

            <p className="text-slate-600 text-sm mb-2">{item.skuCode}</p>

            <div className="flex items-center gap-4 mb-3">
              <span className="text-2xl font-bold text-slate-900">
                ${item.totalPrice?.toLocaleString() || 'Price on request'}
              </span>

              {item.metalType && (
                <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                  {item.metalType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Seller ID: {item.sellerId?.slice(-8) || 'N/A'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square bg-slate-100">
        <ImageCarousel
          images={[item.image1, item.image2, item.image3, item.image4, item.image5, item.image6]}
          alt={item.name || 'Jewelry item'}
          className="w-full h-full"
        />

        <div onClick={(e) => e.stopPropagation()}>
          <WishlistButton
            productId={Number(item.id)}
            productType="jewellery"
            size="md"
            className="absolute top-3 right-3"
          />
        </div>

        {item.isOnAuction && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs rounded">
            Auction
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-slate-900 mb-1 line-clamp-1">{item.name}</h3>
        <p className="text-sm text-slate-600 mb-2">{item.skuCode}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-slate-900">
            ${item.totalPrice?.toLocaleString() || 'POA'}
          </span>

          {item.metalType && (
            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
              {item.metalType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>ID: {item.sellerId?.slice(-8) || 'N/A'}</span>
          </div>

          {item.stones && item.stones.length > 0 && (
            <div className="text-xs text-slate-500">
              {item.stones.length} stone{item.stones.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => e.stopPropagation()}
            className="flex-1 px-3 py-2 bg-slate-900 text-white text-sm rounded hover:bg-slate-800 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-2 border border-slate-300 rounded hover:bg-slate-50"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
