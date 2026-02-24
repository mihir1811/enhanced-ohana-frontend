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

// Helper function to get necklace chain type icons
const getChainTypeIcon = (chainType: string) => {
  const iconMap: Record<string, string> = {
    'cable': '🔗',
    'rope': '🪢',
    'box': '📦',
    'curb': '⛓️',
    'figaro': '🔗',
    'snake': '🐍',
    'wheat': '🌾',
    'link': '🔗'
  }
  return iconMap[chainType] || '🔗'
}

// Helper function to get earring style icons
const getEarringStyleIcon = (style: string) => {
  const iconMap: Record<string, string> = {
    'stud': '💎',
    'hoop': '⭕',
    'dangle': '💫',
    'drop': '💧',
    'huggie': '🤗',
    'chandelier': '🕯️',
    'cluster': '✨',
    'halo': '⭕',
    'jhumanka': '🔔',
    'ear-climbers-crawlers': '🧗',
    'ear-cuffs': '🎧',
    'threader': '🧵',
    'jacket': '🧥'
  }
  return iconMap[style] || '👂'
}

// Helper function to get bracelet chain type icons
const getBraceletChainTypeIcon = (chainType: string) => {
  const iconMap: Record<string, string> = {
    'cable': '🔗',
    'rope': '🪢',
    'box': '📦',
    'curb': '⛓️',
    'figaro': '🔗',
    'snake': '🐍',
    'wheat': '🌾',
    'link': '🔗',
    'bangle': '⭕',
    'cuff': '💪',
    'tennis': '🎾',
    'charm': '🔮'
  }
  return iconMap[chainType] || '⛓️'
}

// Helper function to get accessory type icons
const getAccessoryTypeIcon = (accessoryType: string) => {
  const iconMap: Record<string, string> = {
    'maang-tikka': '👑',
    'nose-pin': '👃',
    'anklet': '👣',
    'charms': '🔮',
    'hair-pin': '📍',
    'cuff-links': '👔',
    'armlet': '💪',
    'brooch': '📌',
    'belly-chain': '⛓️',
    'belly-button-ring': '⭕',
    'toe-ring': '👣',
    'chatelaine': '🔑'
  }
  return iconMap[accessoryType] || '✨'
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
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        <NavigationUser />

        <div className="max-w-[1380px] container mx-auto px-6 pb-8 pt-4">
          {/* Search and Controls */}
        <div className="rounded-lg p-3 mb-2 shadow-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              <input
                type="text"
                placeholder="Search jewelry..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Sort */}
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg shadow border active:scale-95 transition"
                aria-label="Sort"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, var(--foreground) 12%, transparent)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--card)' }}
              >
                <ArrowUpDown className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
              </button>

              {/* Filter Button */}
              <button
                className="px-3 py-2 flex items-center gap-2 rounded-lg shadow border active:scale-95 transition"
                onClick={() => setShowFilters(true)}
                aria-label="Open filters"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, var(--foreground) 12%, transparent)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--card)' }}
              >
                <Filter className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Filters</span>
                {getTotalAppliedFilters() > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--status-warning) 15%, transparent)', color: 'var(--status-warning)' }}>
                    {getTotalAppliedFilters()}
                  </span>
                )}
              </button>

              {/* View Mode */}
              <div className="flex items-center shadow border rounded-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition`}
                  style={viewMode === 'grid' ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' } : { color: 'var(--muted-foreground)' }}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition`}
                  style={viewMode === 'list' ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' } : { color: 'var(--muted-foreground)' }}
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
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Active Filters:</span>
                  <button
                    onClick={clearFilters}
                    className="text-sm transition-colors"
                    style={{ color: 'var(--primary)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'color-mix(in srgb, var(--primary) 80%, black)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--primary)' }}
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Ring Types */}
                  {(filters.ringTypes || []).map(ringType => {
                    const ringTypeLabel = (categoryFilters.ringTypes as Array<{ value: string; label: string }> | undefined)?.find(r => r.value === ringType)?.label || ringType
                    return (
                      <span key={ringType} className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full border" style={{ backgroundColor: 'color-mix(in srgb, var(--status-warning) 15%, transparent)', color: 'var(--status-warning)', borderColor: 'color-mix(in srgb, var(--status-warning) 30%, transparent)' }}>
                        Ring: {ringTypeLabel}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleFilterChange('ringTypes', (filters.ringTypes || []).filter(r => r !== ringType))}
                        />
                      </span>
                    )
                  })}
                  {filters.metalType.map(metal => (
                    <span key={metal} className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full border" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)', color: 'var(--primary)', borderColor: 'color-mix(in srgb, var(--primary) 30%, transparent)' }}>
                      Metal: {metal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleFilterChange('metalType', filters.metalType.filter(m => m !== metal))}
                      />
                    </span>
                  ))}
                  {filters.style.map(style => (
                    <span key={style} className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full border" style={{ backgroundColor: 'color-mix(in srgb, var(--status-success) 15%, transparent)', color: 'var(--status-success)', borderColor: 'color-mix(in srgb, var(--status-success) 30%, transparent)' }}>
                      Style: {style}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleFilterChange('style', filters.style.filter(s => s !== style))}
                      />
                    </span>
                  ))}
                  {(filters.priceRange.min > 0 || filters.priceRange.max < 50000) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full border" style={{ backgroundColor: 'color-mix(in srgb, var(--chart-3) 15%, transparent)', color: 'var(--chart-3)', borderColor: 'color-mix(in srgb, var(--chart-3) 30%, transparent)' }}>
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
          <div className="mb-2 rounded-lg shadow-sm p-2 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-3 whitespace-nowrap">Filter by Brand:</span>
              </div>
              <div className="flex flex-nowrap gap-3 overflow-x-auto w-full scrollbar-hide">
                {/* All Brands Button */}
                <button
                  onClick={() => handleFilterChange('brands', [])}
                  className={`rounded-lg whitespace-nowrap px-4 py-2 h-auto transition-all duration-200`}
                  style={(!filters.brands || filters.brands.length === 0) ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)', borderStyle: 'solid' }}
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
                      className={`p-1 rounded-lg transition-all duration-200 flex items-center justify-center whitespace-nowrap h-auto border`}
                      style={isSelected ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
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
          <div className="mb-2 rounded-lg shadow-sm p-2 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-3 whitespace-nowrap">Filter by Ring Type:</span>
              </div>
              <div className="flex flex-nowrap gap-3 overflow-x-auto w-full scrollbar-hide">
                {/* All Ring Types Button */}
                <button
                  onClick={() => handleFilterChange('ringTypes', [])}
                  className={`rounded-lg whitespace-nowrap px-4 py-2 h-auto transition-all duration-200`}
                  style={(!filters.ringTypes || filters.ringTypes.length === 0) ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)', borderStyle: 'solid' }}
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
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap`}
                      style={isSelected ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
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

        {/* Necklace Chain Types Filter Bar - For necklaces category */}
        {category === 'necklaces' && Array.isArray(categoryFilters.chainTypes) && categoryFilters.chainTypes.length > 0 && (
          <div className="mb-2 rounded-lg shadow-sm p-2 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-3 whitespace-nowrap">Filter by Chain Type:</span>
              </div>
              <div className="flex flex-nowrap gap-3 overflow-x-auto w-full scrollbar-hide">
                {/* All Chain Types Button */}
                <button
                  onClick={() => handleFilterChange('chainTypes', [])}
                  className={`rounded-lg whitespace-nowrap px-4 py-2 h-auto transition-all duration-200`}
                  style={(!filters.chainTypes || filters.chainTypes.length === 0) ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)', borderStyle: 'solid' }}
                >
                  All Chain Types
                </button>
                
                {/* Chain Type Buttons */}
                {(categoryFilters.chainTypes as Array<{ value: string; label: string }> | undefined)?.map(chainType => {
                  const isSelected = filters.chainTypes?.includes(chainType.value) || false

                  return (
                    <button
                      key={chainType.value}
                      onClick={() => {
                        const currentChainTypes = filters.chainTypes || []
                        const newChainTypes = isSelected
                          ? currentChainTypes.filter(c => c !== chainType.value)
                          : [...currentChainTypes, chainType.value]
                        handleFilterChange('chainTypes', newChainTypes)
                      }}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap`}
                      style={isSelected ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    >
                      {/* Chain Type Icon */}
                      <span className="text-lg" role="img" aria-label={chainType.label}>
                        {getChainTypeIcon(chainType.value)}
                      </span>
                      {/* Chain Type Name */}
                      <span className="text-sm font-medium">
                        {chainType.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Earring Styles Filter Bar - For earrings category */}
        {category === 'earrings' && Array.isArray(categoryFilters.styles) && categoryFilters.styles.length > 0 && (
          <div className="mb-2 rounded-lg shadow-sm p-2 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-3 whitespace-nowrap">Filter by Style:</span>
              </div>
              <div className="flex flex-nowrap gap-3 overflow-x-auto w-full scrollbar-hide">
                {/* All Styles Button */}
                <button
                  onClick={() => handleFilterChange('style', [])}
                  className={`rounded-lg whitespace-nowrap px-4 py-2 h-auto transition-all duration-200`}
                  style={(!filters.style || filters.style.length === 0) ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)', borderStyle: 'solid' }}
                >
                  All Styles
                </button>
                
                {/* Earring Style Buttons - Show first 10 popular styles */}
                {(categoryFilters.styles as Array<{ value: string; label: string }> | undefined)?.slice(0, 10).map(style => {
                  const isSelected = filters.style?.includes(style.value) || false

                  return (
                    <button
                      key={style.value}
                      onClick={() => {
                        const currentStyles = filters.style || []
                        const newStyles = isSelected
                          ? currentStyles.filter(s => s !== style.value)
                          : [...currentStyles, style.value]
                        handleFilterChange('style', newStyles)
                      }}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap`}
                      style={isSelected ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    >
                      {/* Earring Style Icon */}
                      <span className="text-lg" role="img" aria-label={style.label}>
                        {getEarringStyleIcon(style.value)}
                      </span>
                      {/* Earring Style Name */}
                      <span className="text-sm font-medium">
                        {style.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bracelet Chain Types Filter Bar - For bracelets category */}
        {category === 'bracelets' && Array.isArray(categoryFilters.chainTypes) && categoryFilters.chainTypes.length > 0 && (
          <div className="mb-2 rounded-lg shadow-sm p-2 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-3 whitespace-nowrap">Filter by Chain Type:</span>
              </div>
              <div className="flex flex-nowrap gap-3 overflow-x-auto w-full scrollbar-hide">
                {/* All Chain Types Button */}
                <button
                  onClick={() => handleFilterChange('chainTypes', [])}
                  className={`rounded-lg whitespace-nowrap px-4 py-2 h-auto transition-all duration-200 border`}
                  style={(!filters.chainTypes || filters.chainTypes.length === 0) ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                >
                  All Chain Types
                </button>
                
                {/* Bracelet Chain Type Buttons */}
                {(categoryFilters.chainTypes as Array<{ value: string; label: string }> | undefined)?.map(chainType => {
                  const isSelected = filters.chainTypes?.includes(chainType.value) || false

                  return (
                    <button
                      key={chainType.value}
                      onClick={() => {
                        const currentChainTypes = filters.chainTypes || []
                        const newChainTypes = isSelected
                          ? currentChainTypes.filter(c => c !== chainType.value)
                          : [...currentChainTypes, chainType.value]
                        handleFilterChange('chainTypes', newChainTypes)
                      }}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap`}
                      style={isSelected ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    >
                      {/* Bracelet Chain Type Icon */}
                      <span className="text-lg" role="img" aria-label={chainType.label}>
                        {getBraceletChainTypeIcon(chainType.value)}
                      </span>
                      {/* Bracelet Chain Type Name */}
                      <span className="text-sm font-medium">
                        {chainType.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Chain Styles Filter Bar - For chains category */}
        {category === 'chains' && Array.isArray(categoryFilters.styles) && categoryFilters.styles.length > 0 && (
          <div className="mb-2 rounded-lg shadow-sm p-2 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-3 whitespace-nowrap">Filter by Chain Style:</span>
              </div>
              <div className="flex flex-nowrap gap-3 overflow-x-auto w-full scrollbar-hide">
                {/* All Chain Styles Button */}
                <button
                  onClick={() => handleFilterChange('style', [])}
                  className={`rounded-lg whitespace-nowrap px-4 py-2 h-auto transition-all duration-200 border`}
                  style={(!filters.style || filters.style.length === 0) ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                >
                  All Styles
                </button>
                
                {/* Chain Style Buttons */}
                {(categoryFilters.styles as Array<{ value: string; label: string }> | undefined)?.map(style => {
                  const isSelected = filters.style?.includes(style.value) || false

                  return (
                    <button
                      key={style.value}
                      onClick={() => {
                        const currentStyles = filters.style || []
                        const newStyles = isSelected
                          ? currentStyles.filter(s => s !== style.value)
                          : [...currentStyles, style.value]
                        handleFilterChange('style', newStyles)
                      }}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap`}
                      style={isSelected ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    >
                      {/* Chain Style Icon */}
                      <span className="text-lg" role="img" aria-label={style.label}>
                        {getChainTypeIcon(style.value)}
                      </span>
                      {/* Chain Style Name */}
                      <span className="text-sm font-medium">
                        {style.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Accessory Types Filter Bar - For accessories category */}
        {category === 'accessories' && Array.isArray(categoryFilters.accessoryTypes) && categoryFilters.accessoryTypes.length > 0 && (
          <div className="mb-2 rounded-lg shadow-sm p-2 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-3 whitespace-nowrap">Filter by Accessory Type:</span>
              </div>
              <div className="flex flex-nowrap gap-3 overflow-x-auto w-full scrollbar-hide">
                {/* All Accessory Types Button */}
                <button
                  onClick={() => handleFilterChange('accessoryTypes', [])}
                  className={`rounded-lg whitespace-nowrap px-4 py-2 h-auto transition-all duration-200 border`}
                  style={(!filters.accessoryTypes || filters.accessoryTypes.length === 0) ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                >
                  All Types
                </button>
                
                {/* Accessory Type Buttons */}
                {(categoryFilters.accessoryTypes as Array<{ value: string; label: string }> | undefined)?.map(accessoryType => {
                  const isSelected = filters.accessoryTypes?.includes(accessoryType.value) || false

                  return (
                    <button
                      key={accessoryType.value}
                      onClick={() => {
                        const currentAccessoryTypes = filters.accessoryTypes || []
                        const newAccessoryTypes = isSelected
                          ? currentAccessoryTypes.filter(a => a !== accessoryType.value)
                          : [...currentAccessoryTypes, accessoryType.value]
                        handleFilterChange('accessoryTypes', newAccessoryTypes)
                      }}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap`}
                      style={isSelected ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    >
                      {/* Accessory Type Icon */}
                      <span className="text-lg" role="img" aria-label={accessoryType.label}>
                        {getAccessoryTypeIcon(accessoryType.value)}
                      </span>
                      {/* Accessory Type Name */}
                      <span className="text-sm font-medium">
                        {accessoryType.label}
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
              <p style={{ color: 'var(--muted-foreground)' }}>
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
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--primary)' }} />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="mb-4" style={{ color: 'var(--destructive)' }}>{error}</p>
                <button
                  onClick={() => fetchJewelry(buildQueryParams())}
                  className="px-6 py-2.5 font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, var(--primary) 85%, black)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--primary)' }}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && jewelry.length === 0 && (
              <div className="text-center py-12">
                <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>No jewelry found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, var(--primary) 85%, black)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--primary)' }}
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
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'
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
                        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
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
                            className={`px-4 py-2 border rounded-lg`}
                            style={page === pagination.page ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          >
                            {page}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
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
          className={`fixed top-0 right-0 w-full max-w-md h-full z-[110] shadow-2xl p-0 flex flex-col transition-transform duration-300 ease-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}
          onTransitionEnd={() => {
            if (!drawerOpen) setDrawerVisible(false);
          }}
        >
          {/* Header */}
          <div className="border-b px-6 py-5 sticky top-0 z-10" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Filters</h2>
              <button
                className="p-1.5 rounded-full transition-all"
                style={{ color: 'var(--muted-foreground)' }}
                onClick={() => setShowFilters(false)}
                aria-label="Close filters"
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, var(--foreground) 10%, transparent)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              {getTotalAppliedFilters() > 0 ? (
                <>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    {getTotalAppliedFilters()} {getTotalAppliedFilters() === 1 ? 'filter' : 'filters'} applied
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-sm font-medium transition-colors"
                    style={{ color: 'var(--primary)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'color-mix(in srgb, var(--primary) 80%, black)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--primary)' }}
                  >
                    Clear all
                  </button>
                </>
              ) : (
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No filters applied</span>
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
              background: var(--border);
              border-radius: 3px;
            }
            .filter-scroll::-webkit-scrollbar-thumb:hover {
              background: var(--muted-foreground);
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
                  <div className="mb-4 flex justify-between text-sm font-medium" style={{ color: 'var(--foreground)' }}>
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
                    trackStyle={[{ backgroundColor: 'var(--status-warning)', height: '4px' }]}
                    handleStyle={[
                      { backgroundColor: 'var(--status-warning)', borderColor: 'var(--status-warning)', width: '16px', height: '16px', marginTop: '-6px' },
                      { backgroundColor: 'var(--status-warning)', borderColor: 'var(--status-warning)', width: '16px', height: '16px', marginTop: '-6px' }
                    ]}
                    railStyle={{ backgroundColor: 'var(--border)', height: '4px' }}
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

              {/* Necklace Chain Types - Show only for necklaces category */}
              {category === 'necklaces' && Array.isArray(categoryFilters.chainTypes) && categoryFilters.chainTypes.length > 0 && (
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

              {/* Necklace Styles - Show only for necklaces category */}
              {category === 'necklaces' && Array.isArray(categoryFilters.styles) && categoryFilters.styles.length > 0 && (
                <FilterSection 
                  title="Necklace Style" 
                  count={filters.style?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.styles}
                    selectedValues={filters.style || []}
                    onChange={(value) => handleFilterChange('style', value)}
                  />
                </FilterSection>
              )}

              {/* Necklace Lengths - Show only for necklaces category */}
              {category === 'necklaces' && Array.isArray(categoryFilters.lengths) && categoryFilters.lengths.length > 0 && (
                <FilterSection 
                  title="Length" 
                  count={filters.lengths?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.lengths}
                    selectedValues={filters.lengths || []}
                    onChange={(value) => handleFilterChange('lengths', value)}
                  />
                </FilterSection>
              )}

              {/* Earring Styles - Show only for earrings category */}
              {category === 'earrings' && Array.isArray(categoryFilters.styles) && categoryFilters.styles.length > 0 && (
                <FilterSection 
                  title="Earring Style" 
                  count={filters.style?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.styles}
                    selectedValues={filters.style || []}
                    onChange={(value) => handleFilterChange('style', value)}
                  />
                </FilterSection>
              )}

              {/* Bracelet Chain Types - Show only for bracelets category */}
              {category === 'bracelets' && Array.isArray(categoryFilters.chainTypes) && categoryFilters.chainTypes.length > 0 && (
                <FilterSection 
                  title="Bracelet Type" 
                  count={filters.chainTypes?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.chainTypes}
                    selectedValues={filters.chainTypes || []}
                    onChange={(value) => handleFilterChange('chainTypes', value)}
                  />
                </FilterSection>
              )}

              {/* Bracelet Lengths - Show only for bracelets category */}
              {category === 'bracelets' && Array.isArray(categoryFilters.lengths) && categoryFilters.lengths.length > 0 && (
                <FilterSection 
                  title="Length" 
                  count={filters.lengths?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.lengths}
                    selectedValues={filters.lengths || []}
                    onChange={(value) => handleFilterChange('lengths', value)}
                  />
                </FilterSection>
              )}

              {/* Chain Styles - Show only for chains category */}
              {category === 'chains' && Array.isArray(categoryFilters.styles) && categoryFilters.styles.length > 0 && (
                <FilterSection 
                  title="Chain Style" 
                  count={filters.style?.length || 0}
                >
                  <CheckboxGroup
                    options={categoryFilters.styles}
                    selectedValues={filters.style || []}
                    onChange={(value) => handleFilterChange('style', value)}
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

              {/* Watch Dial Color - Show only for watches category */}
              {category === 'watches' && Array.isArray(categoryFilters.dialColors) && categoryFilters.dialColors.length > 0 && (
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

              {/* Watch Case Shape - Show only for watches category */}
              {category === 'watches' && Array.isArray(categoryFilters.caseShapes) && categoryFilters.caseShapes.length > 0 && (
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

              {/* Watch Case Size - Show only for watches category */}
              {category === 'watches' && Array.isArray(categoryFilters.caseSizes) && categoryFilters.caseSizes.length > 0 && (
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

              {/* Watch Case Material - Show only for watches category */}
              {category === 'watches' && Array.isArray(categoryFilters.caseMaterials) && categoryFilters.caseMaterials.length > 0 && (
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

              {/* Watch Strap Material - Show only for watches category */}
              {category === 'watches' && Array.isArray(categoryFilters.strapMaterials) && categoryFilters.strapMaterials.length > 0 && (
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

              {/* Watch Strap Color - Show only for watches category */}
              {category === 'watches' && Array.isArray(categoryFilters.strapColors) && categoryFilters.strapColors.length > 0 && (
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

              {/* Watch Movement - Show only for watches category */}
              {category === 'watches' && Array.isArray(categoryFilters.movements) && categoryFilters.movements.length > 0 && (
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

              {/* Watch Water Resistance - Show only for watches category */}
              {category === 'watches' && Array.isArray(categoryFilters.waterResistance) && categoryFilters.waterResistance.length > 0 && (
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

              {/* Watch Features - Show only for watches category */}
              {category === 'watches' && Array.isArray(categoryFilters.features) && categoryFilters.features.length > 0 && (
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

              {/* Watch Dial Stones - Show only for watches category */}
              {category === 'watches' && Array.isArray(categoryFilters.dialStones) && categoryFilters.dialStones.length > 0 && (
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
          <div className="sticky bottom-0 border-t p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <button
              onClick={() => setShowFilters(false)}
              className="w-full py-3.5 font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, var(--primary) 85%, black)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--primary)' }}
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
        className="w-full flex items-center justify-between px-6 py-4 transition-colors group"
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, var(--foreground) 5%, transparent)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}
      >
        <h3 className="text-sm font-semibold transition-colors group-hover:text-[var(--primary)]" style={{ color: 'var(--foreground)' }}>
          {title}
          {count !== undefined && count > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--status-warning) 15%, transparent)', color: 'var(--status-warning)' }}>
              {count}
            </span>
          )}
        </h3>
        <ChevronDown
          className={`w-4 h-4 transition-all group-hover:text-[var(--primary)] ${
            isExpanded ? 'rotate-180' : ''
          }`}
          style={{ color: 'var(--muted-foreground)' }}
        />
      </button>

      {isExpanded && (
        <div className="px-6 pb-5 pt-3" style={{ backgroundColor: 'color-mix(in srgb, var(--foreground) 3%, transparent)' }}>
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
        <div className="mb-3 px-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-9 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted-foreground)' }} />
          </div>
        </div>
      )}

      {/* Options Container */}
      <div
        className="space-y-1 max-h-64 overflow-y-auto px-6"
        style={{ maxHeight: showAll ? maxHeight : 'auto' }}
      >
        {displayOptions.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <label
              key={option.value}
              className="flex items-center gap-2.5 p-2 rounded-lg transition-colors group cursor-pointer"
              onMouseEnter={(e) => { (e.currentTarget as HTMLLabelElement).style.backgroundColor = 'color-mix(in srgb, var(--foreground) 8%, transparent)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLLabelElement).style.backgroundColor = 'transparent' }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(option.value)}
                className="w-4 h-4 rounded focus:ring-ring focus:ring-2 cursor-pointer transition-all"
                style={{
                  accentColor: 'var(--primary)',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border)'
                }}
              />
              <span className="text-sm transition-colors flex-1" style={{ color: isSelected ? 'var(--foreground)' : 'var(--muted-foreground)' }}>{option.label}</span>
              {isSelected && (
                <span className="text-xs px-2 py-1 rounded" style={{ color: 'var(--primary)', backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)' }}>
                  ✓
                </span>
              )}
            </label>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {hasMoreOptions && !searchQuery && (
        <div className="px-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-sm py-2 border rounded-lg transition-colors"
            style={{ 
              color: 'var(--primary)', 
              borderColor: 'color-mix(in srgb, var(--primary) 20%, transparent)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, var(--primary) 5%, transparent)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}
          >
            {showAll ? 'Show Less' : `Show All (${filteredOptions.length})`}
          </button>
        </div>
      )}

      {/* No Results */}
      {searchQuery && filteredOptions.length === 0 && (
        <div className="text-center py-4 text-sm px-6" style={{ color: 'var(--muted-foreground)' }}>
          No options found for &quot;{searchQuery}&quot;
        </div>
      )}

      {/* Selected Count */}
      {selectedValues.length > 0 && (
        <div className="px-6">
          <div className="text-xs px-3 py-2 rounded-lg" style={{ color: 'var(--muted-foreground)', backgroundColor: 'color-mix(in srgb, var(--foreground) 5%, transparent)' }}>
            {selectedValues.length} selected
          </div>
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
        className="rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border group"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        onClick={handleCardClick}
      >
        <div className="flex gap-6">
          {/* Image Section */}
          <div className="w-40 h-40 rounded-xl flex-shrink-0 overflow-hidden relative group" style={{ backgroundColor: 'var(--card)' }}>
            <ImageCarousel
              images={[item.image1, item.image2, item.image3, item.image4, item.image5, item.image6]}
              alt={item.name || 'Jewelry item'}
              className="w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            {item.isOnAuction && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
                🔥 Auction
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1 transition-colors" style={{ color: 'var(--foreground)' }}>
                  {item.name}
                </h3>
                <p className="text-sm font-mono" style={{ color: 'var(--muted-foreground)' }}>{item.skuCode}</p>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <WishlistButton
                  productId={Number(item.id)}
                  productType="jewellery"
                  size="md"
                  variant="minimal"
                />
              </div>
            </div>

            {/* Details Row */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                ${item.totalPrice?.toLocaleString() || 'POA'}
              </span>

              {item.metalType && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium" style={{ backgroundColor: 'color-mix(in srgb, var(--status-warning) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--status-warning) 45%, transparent)', color: 'var(--status-warning)' }}>
                  {item.metalType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              )}

              {item.stones && item.stones.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  {item.stones.length} {item.stones.length === 1 ? 'Stone' : 'Stones'}
                </span>
              )}
            </div>

            {/* Footer - Actions */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2" style={{ color: 'var(--muted-foreground)' }}>
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-mono">Seller: {item.sellerId?.slice(-8) || 'N/A'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    // Quick view logic
                  }}
                  className="p-2.5 border-2 rounded-lg transition-all duration-200 group/icon"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  title="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    // Add to cart logic
                  }}
                  className="px-6 py-2.5 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, var(--primary) 85%, black)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--primary)' }}
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
      className="rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'var(--card)' }}>
        <ImageCarousel
          images={[item.image1, item.image2, item.image3, item.image4, item.image5, item.image6]}
          alt={item.name || 'Jewelry item'}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist Button - Top Right */}
        <div onClick={(e) => e.stopPropagation()} className="absolute top-3 right-3 z-10">
          <WishlistButton
            productId={Number(item.id)}
            productType="jewellery"
            size="md"
            className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white"
          />
        </div>

        {/* Auction Badge - Top Left */}
        {item.isOnAuction && (
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg animate-pulse">
            🔥 Live Auction
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title & SKU */}
        <div>
          <h3 className="font-semibold mb-1 line-clamp-2 text-base transition-colors" style={{ color: 'var(--foreground)' }}>
            {item.name}
          </h3>
          <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{item.skuCode}</p>
        </div>

        {/* Metal Type Badge */}
        {item.metalType && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium" style={{ backgroundColor: 'color-mix(in srgb, var(--status-warning) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--status-warning) 45%, transparent)', color: 'var(--status-warning)' }}>
              {item.metalType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        )}

        {/* Stones Info */}
        {item.stones && item.stones.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
            <span>{item.stones.length} {item.stones.length === 1 ? 'Stone' : 'Stones'}</span>
          </div>
        )}

        {/* Price Section */}
        <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Price</div>
              <span className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                ${item.totalPrice?.toLocaleString() || 'POA'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              <MapPin className="w-3 h-3" />
              <span className="font-mono">{item.sellerId?.slice(-6) || 'N/A'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation()
                // Add to cart logic
              }}
              className="flex-1 px-4 py-2.5 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, var(--primary) 85%, black)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--primary)' }}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                // Quick view logic
              }}
              className="p-2.5 border-2 rounded-lg transition-all duration-200 group/icon active:scale-95"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
