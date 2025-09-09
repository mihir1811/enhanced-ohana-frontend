'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Filter, Grid, List, Search, X, Heart, ShoppingCart,
  Eye, MapPin, Star, Loader2, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight
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
  name: string;
  skuCode: string;
  totalPrice?: number;
  metalType?: string;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  image5?: string | null;
  image6?: string | null;
  sellerId: string;
  stones?: any[];
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

const CERTIFICATION_OPTIONS = ['GIA', 'AGS', 'SSEF', 'Gübelin', 'AGL']

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

  // State
  const [jewelry, setJewelry] = useState<JewelryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
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

  // Get category-specific filter options with proper typing
  const getCategoryFilters = () => {
    const categoryKey = category as keyof typeof CATEGORY_FILTERS
    const filters = CATEGORY_FILTERS[categoryKey] || {}
    return filters as any // Type assertion to avoid complex union type issues
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
    debounce((newPriceRange: { min: number; max: number }) => {
      setFilters(prev => ({
        ...prev,
        priceRange: newPriceRange
      }))
      setPagination(prev => ({ ...prev, page: 1 }))
    }, 500), // 500ms delay
    []
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

  // Helper function to check if current category is watches
  const isWatchesCategory = () => category === 'watches'

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
  }, [category, searchQuery, pagination.page, pagination.limit, filters])

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
  const handleFilterChange = (filterType: keyof JewelryFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categoryTitle = JEWELRY_CATEGORIES[category as keyof typeof JEWELRY_CATEGORIES] || category

  return (
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
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex border border-slate-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
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
                    const ringTypeLabel = categoryFilters.ringTypes?.find((r: any) => r.value === ringType)?.label || ringType
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
        {isWatchesCategory() && categoryFilters.brands && (
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
                {categoryFilters.brands.map((brand: any) => {
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
        {category === 'rings' && categoryFilters.ringTypes && (
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Ring Types</h3>
            <div className="relative">
              <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-2">
                {categoryFilters.ringTypes.map((ringType: any) => {
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
                      className={`flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 min-w-[120px] hover:shadow-md ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      {/* Ring Type Icon */}
                      <div className="w-12 h-12 mb-2 flex items-center justify-center">
                        <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center ${
                          isSelected ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-gray-50'
                        }`}>
                          {getRingTypeIcon(ringType.value)}
                        </div>
                      </div>

                      {/* Ring Type Name */}
                      <span className={`text-sm font-medium text-center leading-tight ${
                        isSelected ? 'text-blue-700' : 'text-slate-700'
                      }`}>
                        {ringType.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Scroll indicators */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none opacity-50" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none opacity-50" />
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {true && (
            <div className="w-80 bg-white rounded-lg p-6 shadow-sm h-fit">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <FilterSection title="Price Range" isOpen={true}>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-600 mb-1">Min Price</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={localPriceRange.min || ''}
                        onChange={(e) => {
                          const value = Number(e.target.value) || 0
                          handlePriceRangeChange({
                            min: value,
                            max: localPriceRange.max
                          })
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-600 mb-1">Max Price</label>
                      <input
                        type="number"
                        placeholder="50000"
                        value={localPriceRange.max === 50000 ? '' : localPriceRange.max}
                        onChange={(e) => {
                          const value = Number(e.target.value) || 50000
                          handlePriceRangeChange({
                            min: localPriceRange.min,
                            max: value
                          })
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Dual Range Slider */}
                  <div className="px-1 py-4">
                    <Slider
                      range
                      min={0}
                      max={50000}
                      step={100}
                      value={[localPriceRange.min, localPriceRange.max]}
                      onChange={(values) => {
                        if (Array.isArray(values)) {
                          handlePriceRangeChange({
                            min: values[0],
                            max: values[1]
                          })
                        }
                      }}
                      trackStyle={[{ backgroundColor: '#3b82f6', height: 4 }]}
                      handleStyle={[
                        {
                          borderColor: '#3b82f6',
                          height: 20,
                          width: 20,
                          marginTop: -8,
                          backgroundColor: '#3b82f6',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
                        },
                        {
                          borderColor: '#3b82f6',
                          height: 20,
                          width: 20,
                          marginTop: -8,
                          backgroundColor: '#3b82f6',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
                        }
                      ]}
                      railStyle={{ backgroundColor: '#e2e8f0', height: 4 }}
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>${localPriceRange.min.toLocaleString()}</span>
                      <span>${localPriceRange.max.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Quick preset buttons */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Under $1K', min: 0, max: 1000 },
                      { label: '$1K-$5K', min: 1000, max: 5000 },
                      { label: '$5K-$10K', min: 5000, max: 10000 },
                      { label: '$10K+', min: 10000, max: 50000 }
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => handlePriceRangeChange({ min: preset.min, max: preset.max })}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${localPriceRange.min === preset.min && localPriceRange.max === preset.max
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-blue-300 hover:text-blue-600'
                          }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </FilterSection>

              {/* Category-specific filters */}
              {/* Ring Types for Rings */}
              {category === 'rings' && categoryFilters.ringTypes && (
                <FilterSection title="Ring Types">
                  <CheckboxGroup
                    options={categoryFilters.ringTypes}
                    selectedValues={filters.ringTypes || []}
                    onChange={(values) => handleFilterChange('ringTypes', values)}
                  />
                </FilterSection>
              )}

              {/* Ring Settings for Rings */}
              {category === 'rings' && categoryFilters.ringSettings && (
                <FilterSection title="Ring Settings">
                  <CheckboxGroup
                    options={categoryFilters.ringSettings}
                    selectedValues={filters.ringSettings || []}
                    onChange={(values) => handleFilterChange('ringSettings', values)}
                  />
                </FilterSection>
              )}

              {/* Watch Brands for Watches */}
              {category === 'watches' && categoryFilters.brands && (
                <FilterSection title="Watch Brands">
                  <CheckboxGroup
                    options={categoryFilters.brands}
                    selectedValues={filters.brands || []}
                    onChange={(values) => handleFilterChange('brands', values)}
                  />
                </FilterSection>
              )}

              {/* Watch Models for Watches */}
              {category === 'watches' && categoryFilters.models && (
                <FilterSection title="Watch Models">
                  <CheckboxGroup
                    options={categoryFilters.models}
                    selectedValues={filters.models || []}
                    onChange={(values) => handleFilterChange('models', values)}
                  />
                </FilterSection>
              )}

              {/* Chain Types for Necklaces/Bracelets/Chains */}
              {(category === 'necklaces' || category === 'bracelets' || category === 'chains') && categoryFilters.chainTypes && (
                <FilterSection title="Chain Types">
                  <CheckboxGroup
                    options={categoryFilters.chainTypes}
                    selectedValues={filters.chainTypes || []}
                    onChange={(values) => handleFilterChange('chainTypes', values)}
                  />
                </FilterSection>
              )}

              {/* Styles - Common for most categories */}
              {categoryFilters.styles && (
                <FilterSection title={`${categoryTitle} Styles`}>
                  <CheckboxGroup
                    options={categoryFilters.styles}
                    selectedValues={filters.style}
                    onChange={(values) => handleFilterChange('style', values)}
                  />
                </FilterSection>
              )}

              {/* Earring Settings for Earrings */}
              {category === 'earrings' && categoryFilters.settings && (
                <FilterSection title="Earring Settings">
                  <CheckboxGroup
                    options={categoryFilters.settings}
                    selectedValues={filters.settings || []}
                    onChange={(values) => handleFilterChange('settings', values)}
                  />
                </FilterSection>
              )}

              {/* Accessory Types for Accessories */}
              {category === 'accessories' && categoryFilters.accessoryTypes && (
                <FilterSection title="Accessory Types">
                  <CheckboxGroup
                    options={categoryFilters.accessoryTypes}
                    selectedValues={filters.accessoryTypes || []}
                    onChange={(values) => handleFilterChange('accessoryTypes', values)}
                  />
                </FilterSection>
              )}

              {/* Metal Type - Common for most categories */}
              {categoryFilters.metalTypes && (
                <FilterSection title="Metal Type">
                  <CheckboxGroup
                    options={categoryFilters.metalTypes}
                    selectedValues={filters.metalType}
                    onChange={(values) => handleFilterChange('metalType', values)}
                  />
                </FilterSection>
              )}

              {/* Metal Purity - Common for jewelry categories */}
              {categoryFilters.metalPurity && (
                <FilterSection title="Metal Purity">
                  <CheckboxGroup
                    options={categoryFilters.metalPurity}
                    selectedValues={filters.purity}
                    onChange={(values) => handleFilterChange('purity', values)}
                  />
                </FilterSection>
              )}

              {/* Diamond Shapes - Common for jewelry categories */}
              {categoryFilters.diamondShapes && (
                <FilterSection title="Diamond Shapes">
                  <CheckboxGroup
                    options={categoryFilters.diamondShapes}
                    selectedValues={filters.diamondShapes || []}
                    onChange={(values) => handleFilterChange('diamondShapes', values)}
                  />
                </FilterSection>
              )}

              {/* Gemstones - Common for jewelry categories */}
              {categoryFilters.gemstones && (
                <FilterSection title="Gemstones">
                  <CheckboxGroup
                    options={categoryFilters.gemstones}
                    selectedValues={filters.gemstones || []}
                    onChange={(values) => handleFilterChange('gemstones', values)}
                  />
                </FilterSection>
              )}

              {/* Watch-specific filters */}
              {category === 'watches' && (
                <>
                  {categoryFilters.dialColors && (
                    <FilterSection title="Dial Color">
                      <CheckboxGroup
                        options={categoryFilters.dialColors}
                        selectedValues={filters.dialColors || []}
                        onChange={(values) => handleFilterChange('dialColors', values)}
                      />
                    </FilterSection>
                  )}

                  {categoryFilters.caseShapes && (
                    <FilterSection title="Case Shape">
                      <CheckboxGroup
                        options={categoryFilters.caseShapes}
                        selectedValues={filters.caseShapes || []}
                        onChange={(values) => handleFilterChange('caseShapes', values)}
                      />
                    </FilterSection>
                  )}

                  {categoryFilters.caseSizes && (
                    <FilterSection title="Case Size">
                      <CheckboxGroup
                        options={categoryFilters.caseSizes}
                        selectedValues={filters.caseSizes || []}
                        onChange={(values) => handleFilterChange('caseSizes', values)}
                      />
                    </FilterSection>
                  )}

                  {categoryFilters.caseMaterials && (
                    <FilterSection title="Case Material">
                      <CheckboxGroup
                        options={categoryFilters.caseMaterials}
                        selectedValues={filters.caseMaterials || []}
                        onChange={(values) => handleFilterChange('caseMaterials', values)}
                      />
                    </FilterSection>
                  )}

                  {categoryFilters.strapMaterials && (
                    <FilterSection title="Strap Material">
                      <CheckboxGroup
                        options={categoryFilters.strapMaterials}
                        selectedValues={filters.strapMaterials || []}
                        onChange={(values) => handleFilterChange('strapMaterials', values)}
                      />
                    </FilterSection>
                  )}

                  {categoryFilters.strapColors && (
                    <FilterSection title="Strap Color">
                      <CheckboxGroup
                        options={categoryFilters.strapColors}
                        selectedValues={filters.strapColors || []}
                        onChange={(values) => handleFilterChange('strapColors', values)}
                      />
                    </FilterSection>
                  )}

                  {categoryFilters.movements && (
                    <FilterSection title="Movement">
                      <CheckboxGroup
                        options={categoryFilters.movements}
                        selectedValues={filters.movements || []}
                        onChange={(values) => handleFilterChange('movements', values)}
                      />
                    </FilterSection>
                  )}

                  {categoryFilters.waterResistance && (
                    <FilterSection title="Water Resistance">
                      <CheckboxGroup
                        options={categoryFilters.waterResistance}
                        selectedValues={filters.waterResistance || []}
                        onChange={(values) => handleFilterChange('waterResistance', values)}
                      />
                    </FilterSection>
                  )}

                  {categoryFilters.features && (
                    <FilterSection title="Features">
                      <CheckboxGroup
                        options={categoryFilters.features}
                        selectedValues={filters.features || []}
                        onChange={(values) => handleFilterChange('features', values)}
                      />
                    </FilterSection>
                  )}

                  {categoryFilters.dialStones && (
                    <FilterSection title="Dial Stones">
                      <CheckboxGroup
                        options={categoryFilters.dialStones}
                        selectedValues={filters.dialStones || []}
                        onChange={(values) => handleFilterChange('dialStones', values)}
                      />
                    </FilterSection>
                  )}
                </>
              )}

              {/* Size/Length filters for applicable categories */}
              {category === 'rings' && categoryFilters.sizes && (
                <FilterSection title="Ring Size">
                  <CheckboxGroup
                    options={categoryFilters.sizes}
                    selectedValues={filters.sizes || []}
                    onChange={(values) => handleFilterChange('sizes', values)}
                  />
                </FilterSection>
              )}

              {((category === 'necklaces' || category === 'bracelets') && categoryFilters.lengths) && (
                <FilterSection title="Length">
                  <CheckboxGroup
                    options={categoryFilters.lengths}
                    selectedValues={filters.lengths || []}
                    onChange={(values) => handleFilterChange('lengths', values)}
                  />
                </FilterSection>
              )}

              {/* General Certification Filter - applies to all jewelry */}
              {/* Removed from here since it's not category-specific */}
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
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
    </div>
  )
}

// Helper Components
interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, isOpen = false, children }) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  return (
    <div className="border-b border-slate-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left py-2"
      >
        <span className="font-medium text-slate-900">{title}</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isExpanded && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
};

interface FilterOption {
  label: string;
  value: string;
}

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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${options.length} options...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Options Container */}
      <div
        className="space-y-2 overflow-y-auto pr-1"
        style={{ maxHeight: showAll ? maxHeight : 'auto' }}
      >
        {displayOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-slate-700 flex-1">{option.label}</span>
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
          No options found for "{searchQuery}"
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

// Enhanced Range Component
interface RangeInputProps {
  title: string;
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
  currency?: string;
  step?: number;
}

const RangeInput: React.FC<RangeInputProps> = ({
  title,
  min,
  max,
  value,
  onChange,
  currency = '$',
  step = 1
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInputChange = (type: 'min' | 'max', inputValue: string) => {
    const numValue = Number(inputValue) || 0;
    const newValue = {
      ...localValue,
      [type]: numValue
    };
    setLocalValue(newValue);
  };

  const handleBlur = () => {
    // Ensure min doesn't exceed max and vice versa
    const correctedValue = {
      min: Math.min(localValue.min, localValue.max),
      max: Math.max(localValue.min, localValue.max)
    };
    onChange(correctedValue);
  };

  const handleRangeChange = (type: 'min' | 'max', rangeValue: string) => {
    const numValue = Number(rangeValue);
    const newValue = {
      ...localValue,
      [type]: numValue
    };

    // Auto-correct ranges
    if (type === 'min' && numValue > localValue.max) {
      newValue.max = numValue;
    }
    if (type === 'max' && numValue < localValue.min) {
      newValue.min = numValue;
    }

    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Min {title}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
              {currency}
            </span>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={localValue.min === min ? '' : localValue.min}
              onChange={(e) => handleInputChange('min', e.target.value)}
              onBlur={handleBlur}
              placeholder={min.toString()}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Max {title}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
              {currency}
            </span>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={localValue.max === max ? '' : localValue.max}
              onChange={(e) => handleInputChange('max', e.target.value)}
              onBlur={handleBlur}
              placeholder={max.toString()}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Range Sliders */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue.min}
            onChange={(e) => handleRangeChange('min', e.target.value)}
            className="absolute w-full h-2 bg-transparent range-slider z-10"
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue.max}
            onChange={(e) => handleRangeChange('max', e.target.value)}
            className="absolute w-full h-2 bg-transparent range-slider"
          />

          {/* Range Track */}
          <div className="relative h-2 bg-slate-200 rounded-lg">
            <div
              className="absolute h-2 bg-blue-500 rounded-lg"
              style={{
                left: `${((localValue.min - min) / (max - min)) * 100}%`,
                width: `${((localValue.max - localValue.min) / (max - min)) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Range Display */}
        <div className="flex justify-between text-xs text-slate-600">
          <span>{currency}{localValue.min.toLocaleString()}</span>
          <span>{currency}{localValue.max.toLocaleString()}</span>
        </div>
      </div>

      {/* Quick Selection Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Under 1K', min: 0, max: 1000 },
          { label: '1K-5K', min: 1000, max: 5000 },
          { label: '5K-10K', min: 5000, max: 10000 },
          { label: '10K+', min: 10000, max: 50000 }
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => onChange({ min: preset.min, max: preset.max })}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${localValue.min === preset.min && localValue.max === preset.max
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-slate-600 border-slate-300 hover:border-blue-300 hover:text-blue-600'
              }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
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
      <img
        src={validImages[currentImageIndex]}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300"
        onError={(e) => {
          // Fallback to next image if current one fails
          const target = e.target as HTMLImageElement;
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
              alt={item.name}
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
                <span className="text-sm">Seller ID: {item.sellerId.slice(-8)}</span>
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
          alt={item.name}
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
            <span>ID: {item.sellerId.slice(-8)}</span>
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
