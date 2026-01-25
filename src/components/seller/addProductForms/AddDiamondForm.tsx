
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { diamondService } from '@/services/diamondService';
import { getCookie } from '@/lib/cookie-utils';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Gem, Layers } from 'lucide-react';
import { 
  diamondColors, 
  fancyColors, 
  fancyIntensities, 
  fancyOvertones, 
  cutGrades, 
  clarities, 
  shades, 
  shapes, 
  fluorescences,
  processes,
  treatments,
  certificateCompanies
} from '@/config/sellerConfigData';

const RequiredMark = ({ show = true }: { show?: boolean }) => (
  show ? <span className="text-destructive ml-0.5">*</span> : null
);

interface Option {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  name,
  placeholder = "Select an option",
  required = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    if (disabled) return;
    onChange(option.value);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="relative cursor-pointer group"
        onClick={() => {
          if (disabled) return;
          setIsOpen(!isOpen);
          if (!isOpen && inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            className={`flex h-10 w-full rounded-xl border bg-background px-3 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent 
                       file:text-sm file:font-medium placeholder:text-muted-foreground 
                       focus-visible:outline-none focus-visible:ring-2 
                       focus-visible:ring-primary focus-visible:ring-offset-2
                       disabled:cursor-not-allowed disabled:opacity-50
                       transition-all duration-200 ease-in-out
                       ${isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-input hover:border-primary/50'}
                       text-foreground`}
            placeholder={placeholder}
            value={isOpen ? searchTerm : selectedOption?.label || ""}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onClick={(e) => e.stopPropagation()}
            onFocus={() => setIsOpen(true)}
            disabled={disabled}
            required={required}
            name={name}
            autoComplete="off"
          />
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none 
                         transition-all duration-200 ease-in-out 
                         ${isOpen ? 'text-primary' : 'text-muted-foreground group-hover:text-primary/70'}`}>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 rounded-xl border border-border bg-popover text-popover-foreground 
                       shadow-xl ring-1 ring-black/5 outline-none animate-in fade-in-0 zoom-in-95 
                       max-h-60 overflow-auto bg-white p-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`relative flex w-full cursor-pointer select-none items-center px-3 py-2.5 text-sm outline-none
                          rounded-lg transition-all duration-200 ease-out gap-2
                          hover:bg-accent hover:text-accent-foreground group
                          ${option.value === value ? 'bg-primary/10 text-primary font-medium' : ''}`}
                onClick={() => handleSelect(option)}
              >
                <span className="flex-1 truncate">
                  {option.label}
                </span>
                {option.value === value && (
                  <svg className="w-4 h-4 text-primary shrink-0 transition-all duration-200"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-sm text-muted-foreground text-center flex flex-col items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};




type DiamondFormState = {
  name: string,
  stoneType: string,
  description: string,
  images: File[],
  videoURL: string,
  stockNumber: string,
  origin: string,
  rap: string,
  price: string,
  pricePerCarat: string,
  discount: string,
  color: string,
  colorFrom: string,
  colorTo: string,
  fancyColor: string,
  fancyColorFrom: string,
  fancyColorTo: string,
  fancyIntencity: string,
  fancyIntencityFrom: string,
  fancyIntencityTo: string,
  fancyOvertone: string,
  fancyOvertoneFrom: string,
  fancyOvertoneTo: string,
  caratWeight: string,
  cut: string,
  clarity: string,
  clarityFrom: string,
  clarityTo: string,
  shade: string,
  shape: string,
  polish: string,
  symmetry: string,
  fluorescence: string,
  treatment: string,
  process: string,
  measurement: string,
  diameter: string,
  diameterMin: string,
  diameterMax: string,
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
  totalPcs: string,
  sizeMin: string,
  sizeMax: string,
  sieveSizeMin: string,
  sieveSizeMax: string,
  certificateCompanyName: string,
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
  origin: '',
  rap: '',
  price: '',
  pricePerCarat: '',
  discount: '',
  color: '',
  colorFrom: '',
  colorTo: '',
  fancyColor: '',
  fancyColorFrom: '',
  fancyColorTo: '',
  fancyIntencity: '',
  fancyIntencityFrom: '',
  fancyIntencityTo: '',
  fancyOvertone: '',
  fancyOvertoneFrom: '',
  fancyOvertoneTo: '',
  caratWeight: '',
  cut: '',
  clarity: '',
  clarityFrom: '',
  clarityTo: '',
  shade: '',
  shape: '',
  polish: '',
  symmetry: '',
  fluorescence: '',
  treatment: '',
  process: '',
  measurement: '',
  diameter: '',
  diameterMin: '',
  diameterMax: '',
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
  totalPcs: '',
  sizeMin: '',
  sizeMax: '',
  sieveSizeMin: '',
  sieveSizeMax: '',
  certificateCompanyName: '',
  certificateNumber: '',
  inscription: '',
  certification: null,
  // end of initialState
};

function AddDiamondForm() {
  const [form, setForm] = useState<DiamondFormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState('Single');
  const isMelee = activeTab === 'Melee';

  const priceNumber = parseFloat(String(form.price || ''));
  const caratNumber = parseFloat(String(form.caratWeight || ''));
  const hasPriceCalculation = !isNaN(priceNumber) && !isNaN(caratNumber) && caratNumber > 0;
  const displayTotalPrice = hasPriceCalculation ? priceNumber.toFixed(2) : '';
  const displayPricePerCarat = hasPriceCalculation ? (priceNumber / caratNumber).toFixed(2) : '';

  useEffect(() => {
    if (isMelee) {
      const piecesPart = form.totalPcs && String(form.totalPcs).trim() !== '' ? `${form.totalPcs} Pcs` : '';
      const caratPart = form.caratWeight && String(form.caratWeight).trim() !== '' ? `${form.caratWeight}ct` : '';
      const shapePart = form.shape && String(form.shape).trim() !== '' ? form.shape : '';
      const colorRange = form.colorFrom && form.colorTo
        ? `${form.colorFrom}-${form.colorTo}`
        : form.color && String(form.color).trim() !== ''
          ? String(form.color)
          : '';
      const clarityRange = form.clarityFrom && form.clarityTo
        ? `${form.clarityFrom}-${form.clarityTo}`
        : form.clarity && String(form.clarity).trim() !== ''
          ? String(form.clarity)
          : '';
      const colorPart = colorRange ? `Color ${colorRange}` : '';
      const clarityPart = clarityRange ? `Clarity ${clarityRange}` : '';
      const parts = [piecesPart, caratPart, shapePart, colorPart, clarityPart].filter((p) => p && String(p).trim() !== '');
      const newName = parts.join(' ');
      if (newName && form.name !== newName) {
        setForm((prev) => ({ ...prev, name: newName }));
      }
    } else {
      const caratPart = form.caratWeight && String(form.caratWeight).trim() !== '' ? `${form.caratWeight} Carat` : '';
      const shapePart = form.shape && String(form.shape).trim() !== '' ? form.shape : '';
      const colorToken = form.fancyColor && String(form.fancyColor).trim() !== '' ? form.fancyColor : form.color;
      const clarityPart = form.clarity && String(form.clarity).trim() !== '' ? form.clarity : '';
      const parts = [caratPart, shapePart, colorToken, clarityPart].filter((p) => p && String(p).trim() !== '');
      const newName = parts.join(' ');
      if (form.name !== newName) {
        setForm((prev) => ({ ...prev, name: newName }));
      }
    }
  }, [
    isMelee,
    form.totalPcs,
    form.caratWeight,
    form.shape,
    form.color,
    form.fancyColor,
    form.clarity,
    form.colorFrom,
    form.colorTo,
    form.clarityFrom,
    form.clarityTo,
    form.name,
  ]);

  useEffect(() => {
    if (isMelee) {
      const order = diamondColors.map((o) => o.value);
      let from = form.colorFrom;
      let to = form.colorTo;
      if (from && to) {
        const fi = order.indexOf(from);
        const ti = order.indexOf(to);
        if (fi !== -1 && ti !== -1 && fi > ti) {
          from = form.colorTo;
          to = form.colorFrom;
          setForm((prev) => ({ ...prev, colorFrom: from, colorTo: to }));
        }
      }
      const range = [from, to].filter((v) => v && String(v).trim() !== '').join('-');
      if (range !== form.color) setForm((prev) => ({ ...prev, color: range }));
    }
  }, [isMelee, form.colorFrom, form.colorTo]);

  useEffect(() => {
    if (isMelee) {
      const min = parseFloat(String(form.sizeMin || ''));
      const max = parseFloat(String(form.sizeMax || ''));
      if (!isNaN(min) && !isNaN(max) && min > max) {
        setForm((prev) => ({ ...prev, sizeMin: String(max), sizeMax: String(min) }));
      }
    }
  }, [isMelee, form.sizeMin, form.sizeMax]);

  useEffect(() => {
    if (isMelee) {
      const order = fancyIntensities.map((o) => o.value);
      let from = form.fancyIntencityFrom;
      let to = form.fancyIntencityTo;
      if (from && to) {
        const fi = order.indexOf(from);
        const ti = order.indexOf(to);
        if (fi !== -1 && ti !== -1 && fi > ti) {
          from = form.fancyIntencityTo;
          to = form.fancyIntencityFrom;
          setForm((prev) => ({ ...prev, fancyIntencityFrom: from, fancyIntencityTo: to }));
        }
      }
      const range = [from, to].filter((v) => v && String(v).trim() !== '').join('-');
      if (range !== form.fancyIntencity) setForm((prev) => ({ ...prev, fancyIntencity: range }));
    }
  }, [isMelee, form.fancyIntencityFrom, form.fancyIntencityTo]);

  useEffect(() => {
    if (isMelee) {
      const list = fancyOvertones.map((o) => o.value);
      let from = form.fancyOvertoneFrom;
      let to = form.fancyOvertoneTo;
      if (from && to) {
        const fi = list.indexOf(from);
        const ti = list.indexOf(to);
        if (fi !== -1 && ti !== -1 && fi > ti) {
          from = form.fancyOvertoneTo;
          to = form.fancyOvertoneFrom;
          setForm((prev) => ({ ...prev, fancyOvertoneFrom: from, fancyOvertoneTo: to }));
        }
      }
      const range = [from, to].filter((v) => v && String(v).trim() !== '').join('-');
      if (range !== form.fancyOvertone) setForm((prev) => ({ ...prev, fancyOvertone: range }));
    }
  }, [isMelee, form.fancyOvertoneFrom, form.fancyOvertoneTo]);

  useEffect(() => {
    if (isMelee) {
      const list = fancyColors.map((o) => o.value);
      let from = form.fancyColorFrom;
      let to = form.fancyColorTo;
      if (from && to) {
        const fi = list.indexOf(from);
        const ti = list.indexOf(to);
        if (fi !== -1 && ti !== -1 && fi > ti) {
          from = form.fancyColorTo;
          to = form.fancyColorFrom;
          setForm((prev) => ({ ...prev, fancyColorFrom: from, fancyColorTo: to }));
        }
      }
      const range = [from, to].filter((v) => v && String(v).trim() !== '').join('-');
      if (range !== form.fancyColor) setForm((prev) => ({ ...prev, fancyColor: range }));
    }
  }, [isMelee, form.fancyColorFrom, form.fancyColorTo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setForm(prev => {
      // For financial/precision fields, keep as string to avoid input cursor/formatting issues
      const isPrecisionField = ['price', 'caratWeight', 'pricePerCarat', 'discount', 'rap'].includes(name);
      const valToSet = (type === 'number' && !isPrecisionField) ? Number(value) : value;
      
      const updates: any = { [name]: valToSet };

      if (name === 'price') {
        const p = parseFloat(value);
        const c = parseFloat(String(prev.caratWeight));
        if (!isNaN(p) && !isNaN(c) && c > 0) {
          updates.pricePerCarat = (p / c).toFixed(2);
        }
      } else if (name === 'caratWeight') {
        const c = parseFloat(value);
        const p = parseFloat(String(prev.price));
        if (!isNaN(p) && !isNaN(c) && c > 0) {
          updates.pricePerCarat = (p / c).toFixed(2);
        }
      } else if (name === 'pricePerCarat') {
        const ppc = parseFloat(value);
        const c = parseFloat(String(prev.caratWeight));
        if (!isNaN(ppc) && !isNaN(c) && c > 0) {
          updates.price = (ppc * c).toFixed(2);
        }
      }

      return { ...prev, ...updates };
    });

    if (name === 'stockNumber') {
      let message = '';
      if (value === '') {
        message = 'Stock number is required';
      } else {
        const num = Number(value);
        if (!Number.isInteger(num) || num <= 0) {
          message = 'Enter a valid positive whole number';
        }
      }
      setFieldErrors(prev => ({ ...prev, stockNumber: message }));
    }

    if (name === 'price') {
      let message = '';
      if (value === '') {
        message = 'Price is required';
      } else {
        const num = Number(value);
        if (isNaN(num) || num <= 0) {
          message = 'Enter a valid positive amount';
        }
      }
      setFieldErrors(prev => ({ ...prev, price: message }));
    }

    if (name === 'caratWeight') {
      let message = '';
      if (value === '') {
        message = 'Carat weight is required';
      } else {
        const num = Number(value);
        if (isNaN(num) || num <= 0) {
          message = 'Enter a valid positive carat weight';
        }
      }
      setFieldErrors(prev => ({ ...prev, caratWeight: message }));
    }

    if (name === 'discount') {
      let message = '';
      if (value !== '') {
        const num = Number(value);
        if (isNaN(num) || num < 0 || num > 100) {
          message = 'Discount must be between 0 and 100';
        }
      }
      setFieldErrors(prev => ({ ...prev, discount: message }));
    }

    if (name === 'totalPcs') {
      let message = '';
      if (value === '') {
        message = 'Total pieces is required';
      } else {
        const num = Number(value);
        if (!Number.isInteger(num) || num <= 0) {
          message = 'Enter a valid positive whole number';
        }
      }
      setFieldErrors(prev => ({ ...prev, totalPcs: message }));
    }
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

  // Schema-based validation helper
  const isColorRequired = () => !isMelee && !form.fancyColor;
  const isFancyColorRequired = () => !isMelee && !form.color;
  const isFancyIntensityRequired = () => !isMelee && !!form.fancyColor;
  const isFancyOvertoneRequired = () => !isMelee && !!form.fancyColor;

  const stoneTypes = [
    { value: 'naturalDiamond', label: 'Natural' },
    { value: 'labGrownDiamond', label: 'Lab Grown' },
  ];

  const fillRandomData = () => {
    const getRandom = (arr: Option[]) => arr[Math.floor(Math.random() * arr.length)].value;
    const getRandomFloat = (min: number, max: number, decimals: number = 2) => 
      (Math.random() * (max - min) + min).toFixed(decimals);
    const getRandomInt = (min: number, max: number) => 
      Math.floor(Math.random() * (max - min + 1)) + min;

    const randomStoneType = stoneTypes[Math.floor(Math.random() * stoneTypes.length)].value;
    const randomShape = getRandom(shapes);
    const randomPrice = getRandomInt(1000, 50000).toString();
    const randomStock = getRandomInt(10000, 99999).toString();

    // Common Random Data
    const randomShade = getRandom(shades);
    const randomTreatment = getRandom(treatments);
    const randomProcess = getRandom(processes);

    if (isMelee) {
      // Melee Random Data
      const colorStartIdx = Math.floor(Math.random() * (diamondColors.length - 2));
      const colorEndIdx = colorStartIdx + Math.floor(Math.random() * 2) + 1;
      const colorFrom = diamondColors[colorStartIdx].value;
      const colorTo = diamondColors[colorEndIdx]?.value || diamondColors[colorStartIdx].value;

      const clarityStartIdx = Math.floor(Math.random() * (clarities.length - 2));
      const clarityEndIdx = clarityStartIdx + Math.floor(Math.random() * 2) + 1;
      const clarityFrom = clarities[clarityStartIdx].value;
      const clarityTo = clarities[clarityEndIdx]?.value || clarities[clarityStartIdx].value;
      
      const sieveMin = getRandomFloat(1.0, 3.0, 1);
      const sieveMax = (parseFloat(sieveMin) + 0.5).toFixed(1);

      const diaMin = getRandomFloat(1.0, 3.0, 1);
      const diaMax = (parseFloat(diaMin) + 0.5).toFixed(1);

      setForm(prev => ({
        ...initialState, 
        name: '', 
        description: 'Randomly generated melee parcel for testing.',
        stockNumber: randomStock,
        origin: 'Botswana',
        price: randomPrice,
        discount: getRandomFloat(0, 10),
        totalPcs: getRandomInt(10, 100).toString(),
        caratWeight: getRandomFloat(1.0, 20.0),
        shape: randomShape,
        colorFrom,
        colorTo,
        clarityFrom,
        clarityTo,
        cut: getRandom(cutGrades),
        polish: getRandom(cutGrades),
        symmetry: getRandom(cutGrades),
        fluorescence: getRandom(fluorescences),
        sieveSizeMin: sieveMin,
        sieveSizeMax: sieveMax,
        diameterMin: diaMin,
        diameterMax: diaMax,
        measurement: `${diaMin}-${diaMax} mm`,
        stoneType: randomStoneType,
        certificateCompanyName: certificateCompanies[0]?.value || 'GIA', 
        videoURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        shade: randomShade,
        treatment: randomTreatment,
        process: randomProcess,
        sizeMin: diaMin,
        sizeMax: diaMax,
      }));
    } else {
      // Single Random Data
      const randomCarat = getRandomFloat(0.3, 5.0);
      const isFancy = Math.random() < 0.2; // 20% chance of fancy color
      
      const baseData = {
        ...initialState,
        name: '', 
        description: 'Randomly generated single diamond for testing.',
        stockNumber: randomStock,
        origin: 'Russia',
        rap: (parseInt(randomPrice) * 1.2).toFixed(0),
        price: randomPrice,
        discount: getRandomFloat(0, 5),
        caratWeight: randomCarat,
        shape: randomShape,
        clarity: getRandom(clarities),
        cut: getRandom(cutGrades),
        polish: getRandom(cutGrades),
        symmetry: getRandom(cutGrades),
        fluorescence: getRandom(fluorescences),
        table: getRandomInt(54, 62).toString(),
        depth: getRandomFloat(59, 63, 1),
        ratio: getRandomFloat(1.0, 1.5),
        measurement: '6.50 x 6.50 x 4.00',
        stoneType: randomStoneType,
        certificateCompanyName: certificateCompanies[0]?.value || 'GIA',
        certificateNumber: getRandomInt(10000000, 99999999).toString(),
        videoURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        shade: randomShade,
        treatment: randomTreatment,
        process: randomProcess,
        inscription: `GIA ${getRandomInt(10000000, 99999999)}`,
        gridleMin: getRandomFloat(0.5, 2.0, 1),
        gridleMax: getRandomFloat(2.1, 4.0, 1),
        gridlePercentage: getRandomFloat(1.0, 5.0, 1),
        crownHeight: getRandomFloat(10, 16, 1),
        crownAngle: getRandomFloat(30, 40, 1),
        pavilionAngle: getRandomFloat(40, 42, 1),
        pavilionDepth: getRandomFloat(40, 45, 1),
        culetSize: getRandomFloat(0, 1, 1),
      };

      if (isFancy) {
         setForm({
            ...baseData,
            color: '', 
            fancyColor: getRandom(fancyColors),
            fancyIntencity: getRandom(fancyIntensities),
            fancyOvertone: getRandom(fancyOvertones),
         });
      } else {
         setForm({
            ...baseData,
            color: getRandom(diamondColors),
            fancyColor: '',
            fancyIntencity: '',
            fancyOvertone: '',
         });
      }
    }
    
    toast.success('Random data filled!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formElement = e.currentTarget as HTMLFormElement;
    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      setLoading(false);
      return;
    }

    // Schema-based validation before submission
    if (!isMelee) {
      // Single Diamond: Color OR Fancy Color is required
      if (!form.color && !form.fancyColor) {
        setError('Please provide either Color or Fancy Color for the diamond.');
        setLoading(false);
        toast.error('Please provide either Color or Fancy Color.');
        return;
      }
      // If Fancy Color is set, Intensity and Overtone are required
      if (form.fancyColor && (!form.fancyIntencity || !form.fancyOvertone)) {
        setError('Fancy Intensity and Fancy Overtone are required when Fancy Color is selected.');
        setLoading(false);
        toast.error('Fancy Intensity and Fancy Overtone are required.');
        return;
      }
    } else {
      if (!form.name || String(form.name).trim() === '') {
        setError('Title is required for Melee diamonds.');
        setLoading(false);
        toast.error('Title is required.');
        return;
      }
      // Melee Diamond: Ensure required range fields
      if (!form.totalPcs || Number(form.totalPcs) <= 0) {
        setError('Total Pieces is required for Melee diamonds.');
        setLoading(false);
        toast.error('Total Pieces is required.');
        return;
      }
      if (!form.stockNumber) {
        setError('Stock Number is required.');
        setLoading(false);
        toast.error('Stock Number is required.');
        return;
      }
      if (!form.price || Number(form.price) <= 0) {
        setError('Total Price is required.');
        setLoading(false);
        toast.error('Total Price is required.');
        return;
      }
      if (!form.caratWeight || Number(form.caratWeight) <= 0) {
        setError('Total Carat Weight is required.');
        setLoading(false);
        toast.error('Total Carat Weight is required.');
        return;
      }
      if (!form.certificateCompanyName) {
        setError('Certificate Company is required for Melee diamonds.');
        setLoading(false);
        toast.error('Certificate Company is required.');
        return;
      }
      if (!form.colorFrom || !form.colorTo) {
        setError('Color range (From and To) is required for Melee diamonds.');
        setLoading(false);
        toast.error('Color range is required.');
        return;
      }
      if (!form.clarityFrom || !form.clarityTo) {
        setError('Clarity range (From and To) is required for Melee diamonds.');
        setLoading(false);
        toast.error('Clarity range is required.');
        return;
      }
      if (!form.sieveSizeMin || !form.sieveSizeMax) {
        setError('Sieve size range is required for Melee diamonds.');
        setLoading(false);
        toast.error('Sieve size range is required.');
        return;
      }
      if (!form.diameterMin || !form.diameterMax) {
        setError('Diameter range is required for Melee diamonds.');
        setLoading(false);
        toast.error('Diameter range is required.');
        return;
      }

    }

    try {
      const formData = new FormData();

      // Calculate derived price fields
      const priceVal = parseFloat(form.price);
      const caratVal = parseFloat(form.caratWeight);
      const piecesVal = parseFloat(form.totalPcs);

      let totalPrice = form.price;
      let pricePerCarat = form.price; // Default fallback
      let pricePerPcs = '';
      let caratWeightPerPcs = '';

      if (!isNaN(priceVal) && !isNaN(caratVal) && caratVal > 0) {
        // Assuming user enters Total Price in the 'price' field
        totalPrice = priceVal.toFixed(2);
        pricePerCarat = (priceVal / caratVal).toFixed(2);
      }

      if (isMelee && !isNaN(piecesVal) && piecesVal > 0) {
        if (!isNaN(priceVal)) {
          pricePerPcs = (priceVal / piecesVal).toFixed(2);
        }
        if (!isNaN(caratVal)) {
          caratWeightPerPcs = (caratVal / piecesVal).toFixed(2);
        }
      }

      // Explicitly map DTO fields based on type
      let dtoFields: { key: keyof DiamondFormState, backendKey?: string }[] = [];

      if (isMelee) {
        dtoFields = [
          // { key: 'name' }, // Removed: Not in backend DTO
          { key: 'description' },
          { key: 'origin' },
          { key: 'totalPcs' },
          { key: 'stockNumber' },
          { key: 'clarityFrom', backendKey: 'clarityMin' },
          { key: 'clarityTo', backendKey: 'clarityMax' },
          { key: 'colorFrom' },
          { key: 'colorTo' },
          { key: 'fluorescence', backendKey: 'fluoreScenceFrom' },
          { key: 'sieveSizeMin' },
          { key: 'sieveSizeMax' },
          { key: 'polish', backendKey: 'polishFrom' },
          { key: 'shape' },
          { key: 'sizeMin', backendKey: 'measurementMin' },
          { key: 'sizeMax', backendKey: 'measurementMax' },
          { key: 'discount' },
          { key: 'stoneType' },
          { key: 'videoURL' },
          { key: 'caratWeight', backendKey: 'totalCaratWeight' },
          { key: 'cut', backendKey: 'cutFrom' },
          { key: 'symmetry', backendKey: 'symmetryFrom' },
          { key: 'shade', backendKey: 'shadeFrom' },
          { key: 'treatment' },
          // { key: 'process' }, // Removed: Not in backend DTO
          { key: 'certificateNumber' },
          { key: 'fancyColorFrom' },
          { key: 'fancyColorTo' },
          { key: 'fancyIntencityFrom' },
          { key: 'fancyIntencityTo' },
          { key: 'fancyOvertone' },
          { key: 'ratio' },
        ];
      } else {
        // SINGLE DIAMOND DTO MAPPING (CreateDiamondDto)
        dtoFields = [
          { key: 'stockNumber' },
          { key: 'description', backendKey: 'comment' }, // Single maps description -> comment
          { key: 'origin' },
          { key: 'rap' },
          { key: 'discount' },
          { key: 'caratWeight' },
          { key: 'cut' },
          { key: 'color' },
          { key: 'shade' },
          { key: 'fancyColor' },
          { key: 'fancyIntencity' },
          { key: 'fancyOvertone' },
          { key: 'shape' },
          { key: 'symmetry' },
          { key: 'clarity' },
          { key: 'fluorescence' },
          { key: 'measurement' },
          { key: 'ratio' },
          { key: 'table' },
          { key: 'depth' },
          { key: 'gridleMin' },
          { key: 'gridleMax' },
          { key: 'gridlePercentage' },
          { key: 'crownHeight' },
          { key: 'crownAngle' },
          { key: 'pavilionAngle' },
          { key: 'pavilionDepth' },
          { key: 'culetSize' },
          { key: 'polish' },
          { key: 'treatment' },
          { key: 'inscription' },
          { key: 'certificateNumber' },
          { key: 'stoneType' },
          { key: 'videoURL' },
        ];
      }


      // Add standard fields
      dtoFields.forEach(({ key, backendKey }) => {
        const val = form[key];
        if (typeof val !== 'undefined' && val !== null && val !== '') {
          formData.append(backendKey || key, String(val));
        }
      });

      // Add Calculated Prices
      formData.append('totalPrice', totalPrice);
      formData.append('pricePerCarat', pricePerCarat);
      if (isMelee) {
        if (pricePerPcs) formData.append('pricePerPcs', pricePerPcs);
        if (caratWeightPerPcs) formData.append('caratWeightPerpcs', caratWeightPerPcs);
      }
      formData.append('available', 'true'); // Default to available

      // Certificate Company Logic
      if (form.certificateCompanyName && form.certificateCompanyName !== '') {
        formData.append('certificateCompanyName', form.certificateCompanyName);
      }

      // Certification File
      if (form.certification) {
        formData.append('certification', form.certification);
      }

      // Images
      if (form.images && form.images.length > 0) {
        form.images.forEach((image, index) => {
          if (index < 6) {
            formData.append(`image${index + 1}`, image);
          }
        });
      }

      const token = getCookie('token');
      if (!token) throw new Error('User not authenticated');

      const response = isMelee
        ? await diamondService.addMeleeDiamond(formData, token)
        : await diamondService.addDiamond(formData, token);

      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to add diamond');
      }

      toast.success('Diamond added successfully!');

      // Reset form but keep some defaults if needed, or clear all
      setForm(initialState);
      setFieldErrors({});
      window.scrollTo(0, 0);

    } catch (err: unknown) {
      console.error('Submit Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full max-w-[1200px] mx-auto flex flex-col gap-8 pb-32" onSubmit={handleSubmit}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Add Diamond</h2>
          <p className="text-muted-foreground">Fill in the details below to add a new diamond to your inventory.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={fillRandomData} className="gap-2">
            <span className="text-lg">🎲</span> Fill Random Data
          </Button>

          {/* Modern Segmented Control */}
        <div className="inline-flex p-1 bg-muted rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setActiveTab('Single')}
            className={`relative flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${activeTab === 'Single'
              ? 'bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/5'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Gem className={`w-4 h-4 ${activeTab === 'Single' ? 'text-primary' : ''}`} />
            Single Diamond
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Melee')}
            className={`relative flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${activeTab === 'Melee'
              ? 'bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/5'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Layers className={`w-4 h-4 ${activeTab === 'Melee' ? 'text-primary' : ''}`} />
            Melee Parcel
          </button>
        </div>
      </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Basic Information Card */}
        <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full"></div>
            <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="stoneType" className="text-sm font-medium text-foreground">
                Stone Type<RequiredMark />
              </Label>
              <SearchableDropdown
                name="stoneType"
                value={form.stoneType}
                onChange={(value) => setForm(prev => ({ ...prev, stoneType: value }))}
                options={[
                  { value: 'naturalDiamond', label: 'Natural' },
                  { value: 'labGrownDiamond', label: 'Lab Grown' },
                ]}
                placeholder="Select stone type..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Title
              </Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled
                placeholder={isMelee
                  ? "Auto-generated (e.g. 50 Pcs 0.50ct Round Color G-H Clarity VS-SI)"
                  : "Auto-generated (e.g. 1.50 Carat Round D VS1)"}
                className="bg-muted text-muted-foreground border-transparent"
              />
              <p className="text-xs text-muted-foreground">
                {isMelee
                  ? 'This title is automatically generated from pieces, carat, shape, color and clarity range.'
                  : 'This title is automatically generated from carat, shape, color and clarity.'}
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter detailed description..."
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-background"
              />
            </div>
          </div>
        </section>


        {/* Media Card */}
        <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full"></div>
            <h3 className="text-lg font-semibold text-foreground">Media</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Upload */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="font-medium text-foreground">
                  Product Images<RequiredMark show={isMelee} />
                </Label>
                <span className="text-xs text-muted-foreground">{form.images.length}/6 uploaded</span>
              </div>

              <div className="mt-2">
                <label
                  htmlFor="images"
                  className={`group relative flex flex-col items-center justify-center w-full min-h-[240px]
                  border-2 border-dashed rounded-xl cursor-pointer 
                  bg-muted/30 hover:bg-muted/60 
                  border-border hover:border-primary/50
                  transition-all duration-300 ease-in-out
                  overflow-hidden
                  ${form.images.length === 0 ? 'p-8' : 'p-4'}`}
                >
                  {form.images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground dark:text-foreground">Drop images here</p>
                        <p className="text-sm text-muted-foreground mt-1">supports JPG, PNG, WEBP up to 5MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="grid grid-cols-3 gap-3">
                        {form.images.map((image, idx) => {
                          const url = URL.createObjectURL(image);
                          return (
                            <div key={idx} className="relative group/img aspect-square rounded-lg overflow-hidden border border-border bg-background">
                              <Image
                                src={url}
                                alt={`Product ${idx + 1}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover/img:scale-105"
                                onLoad={() => URL.revokeObjectURL(url)}
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                                {idx === 0 && (
                                  <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-sm font-medium">Main</span>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveImage(idx);
                                  }}
                                  className="p-1.5 bg-destructive text-destructive-foreground rounded-full hover:scale-110 transition-transform"
                                  title="Remove image"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        {form.images.length < 6 && (
                          <div className="aspect-square flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-all">
                            <span className="text-xs text-muted-foreground font-medium text-center px-1">
                              + Add More
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <Input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    // required // Can be handled by validation state instead for better UX
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                    disabled={form.images.length >= 6}
                  />
                </label>
              </div>
              {error && (
                <p className="text-sm font-medium text-destructive flex items-center gap-1.5 bg-destructive/10 p-2 rounded-lg">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  {error}
                </p>
              )}
            </div>

            <div className="space-y-6">
              {/* Certification Upload */}
              {activeTab !== 'Melee' && (
                <div className="space-y-2">
                  <Label htmlFor="certification" className="font-medium text-foreground">
                    Certification Document
                  </Label>
                  <label
                    htmlFor="certification"
                    className={`relative flex flex-col items-center justify-center w-full min-h-[160px]
                    border-2 border-dashed rounded-xl cursor-pointer 
                    bg-muted/30 hover:bg-muted/60 
                    border-border hover:border-primary/50
                    transition-all duration-200
                    p-6`}
                  >
                    {!form.certification ? (
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-sm text-foreground">Upload Certificate</p>
                          <p className="text-xs text-muted-foreground">PDF or Image (max 4MB)</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 w-full">
                        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-border bg-background max-h-[140px]">
                          {form.certification && form.certification.type.startsWith('image/') ? (
                            <Image
                              src={URL.createObjectURL(form.certification)}
                              alt="Certificate Preview"
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <span className="text-muted-foreground font-medium">PDF Document</span>
                            </div>
                          )}
                          <button
                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              setForm(prev => ({ ...prev, certification: null }));
                            }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                        <p className="text-xs text-foreground font-medium truncate max-w-full px-2">
                          {form.certification?.name}
                        </p>
                      </div>
                    )}
                    <Input
                      id="certification"
                      name="certification"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      // required
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Video URL */}
              <div className="space-y-2">
                <Label htmlFor="videoURL" className="font-medium text-foreground">
                  Video URL
                </Label>
                <div className="relative">
                  <Input
                    name="videoURL"
                    value={form.videoURL}
                    onChange={handleChange}
                    className="pl-9 bg-background"
                    placeholder="https://youtu.be/..."
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Diamond Grading Card */}
        <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full"></div>
            <h3 className="text-lg font-semibold text-foreground">Diamond Grading</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="shape" className="font-medium">
                Shape<RequiredMark />
              </Label>
              <SearchableDropdown
                name="shape"
                value={form.shape}
                onChange={(value) => setForm(prev => ({ ...prev, shape: value }))}
                options={shapes}
                placeholder="Select shape..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="caratWeight" className="font-medium">
                Carat Weight<RequiredMark />
              </Label>
              <Input
                id="caratWeight"
                name="caratWeight"
                type="number"
                value={form.caratWeight}
                onChange={handleChange}
                min={0}
                step="0.01"
                required
                placeholder="e.g. 1.25"
                className="bg-background"
              />
              {fieldErrors.caratWeight && (
                <p className="text-xs text-destructive">{fieldErrors.caratWeight}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cut" className="font-medium">
                Cut Grade
              </Label>
              <SearchableDropdown
                name="cut"
                value={form.cut}
                onChange={(value) => setForm(prev => ({ ...prev, cut: value }))}
                options={cutGrades}
                placeholder="Select cut grade..."
              />
            </div>

            {!isMelee ? (
              <div className="space-y-2">
                <Label htmlFor="color" className="font-medium">
                  Color<RequiredMark show={isColorRequired()} />
                </Label>
                <SearchableDropdown
                  name="color"
                  value={form.color}
                  onChange={(value) => setForm(prev => ({ ...prev, color: value }))}
                  options={diamondColors}
                  placeholder="Select color..."
                  required={isColorRequired()}
                  disabled={!!form.fancyColor}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="colorFrom" className="font-medium">
                  Color Range<RequiredMark />
                </Label>
                <div className="flex items-center gap-2">
                  <SearchableDropdown
                    name="colorFrom"
                    value={form.colorFrom}
                    onChange={(value) => setForm(prev => ({ ...prev, colorFrom: value }))}
                    options={diamondColors}
                    placeholder="From"
                    required
                  />
                  <span className="text-muted-foreground">-</span>
                  <SearchableDropdown
                    name="colorTo"
                    value={form.colorTo}
                    onChange={(value) => setForm(prev => ({ ...prev, colorTo: value }))}
                    options={diamondColors}
                    placeholder="To"
                    required
                  />
                </div>
              </div>
            )}

            {!isMelee ? (
              <div className="space-y-2">
                <Label htmlFor="clarity" className="font-medium">
                  Clarity<RequiredMark />
                </Label>
                <SearchableDropdown
                  name="clarity"
                  value={form.clarity}
                  onChange={(value) => setForm(prev => ({ ...prev, clarity: value }))}
                  options={clarities}
                  placeholder="Select clarity..."
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="clarityFrom" className="font-medium">
                  Clarity Range<RequiredMark />
                </Label>
                <div className="flex items-center gap-2">
                  <SearchableDropdown
                    name="clarityFrom"
                    value={form.clarityFrom}
                    onChange={(value) => setForm(prev => ({ ...prev, clarityFrom: value }))}
                    options={clarities}
                    placeholder="From"
                    required
                  />
                  <span className="text-muted-foreground">-</span>
                  <SearchableDropdown
                    name="clarityTo"
                    value={form.clarityTo}
                    onChange={(value) => setForm(prev => ({ ...prev, clarityTo: value }))}
                    options={clarities}
                    placeholder="To"
                    required
                  />
                </div>
              </div>
            )}
            
            {/* Fancy Color Options Group */}
            {!isMelee ? (
              <>
                 <div className="space-y-2">
                  <Label htmlFor="fancyColor" className="font-medium">
                    Fancy Color<RequiredMark show={isFancyColorRequired()} />
                  </Label>
                  <SearchableDropdown
                    name="fancyColor"
                    value={form.fancyColor}
                    onChange={(value) => setForm(prev => ({ ...prev, fancyColor: value }))}
                    options={fancyColors}
                    placeholder="Select fancy color..."
                    required={isFancyColorRequired()}
                    disabled={!!form.color}
                  />
                </div>
                {form.fancyColor && (
                  <>
                  <div className="space-y-2">
                    <Label htmlFor="fancyIntencity" className="font-medium">
                      Fancy Intensity<RequiredMark show={isFancyIntensityRequired()} />
                    </Label>
                    <SearchableDropdown
                      name="fancyIntencity"
                      value={form.fancyIntencity}
                      onChange={(value) => setForm(prev => ({ ...prev, fancyIntencity: value }))}
                      options={fancyIntensities}
                      placeholder="Select intensity..."
                      required={isFancyIntensityRequired()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fancyOvertone" className="font-medium">
                      Fancy Overtone<RequiredMark show={isFancyOvertoneRequired()} />
                    </Label>
                    <SearchableDropdown
                      name="fancyOvertone"
                      value={form.fancyOvertone}
                      onChange={(value) => setForm(prev => ({ ...prev, fancyOvertone: value }))}
                      options={fancyOvertones}
                      placeholder="Select overtone..."
                      required={isFancyOvertoneRequired()}
                    />
                  </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fancyColorFrom" className="font-medium">
                    Fancy Color Range
                  </Label>
                  <div className="flex items-center gap-2">
                    <SearchableDropdown
                      name="fancyColorFrom"
                      value={form.fancyColorFrom}
                      onChange={(value) => setForm(prev => ({ ...prev, fancyColorFrom: value }))}
                      options={fancyColors}
                      placeholder="From"
                    />
                    <span className="text-muted-foreground">-</span>
                    <SearchableDropdown
                      name="fancyColorTo"
                      value={form.fancyColorTo}
                      onChange={(value) => setForm(prev => ({ ...prev, fancyColorTo: value }))}
                      options={fancyColors}
                      placeholder="To"
                    />
                  </div>
                </div>
                 {/* Simplified Fancy Range for Melee to avoid clutter unless needed - kept consistent */}
                 <div className="space-y-2">
                  <Label htmlFor="fancyIntencityFrom" className="font-medium">
                    Fancy Intensity Range
                  </Label>
                  <div className="flex items-center gap-2">
                    <SearchableDropdown
                      name="fancyIntencityFrom"
                      value={form.fancyIntencityFrom}
                      onChange={(value) => setForm(prev => ({ ...prev, fancyIntencityFrom: value }))}
                      options={fancyIntensities}
                      placeholder="From"
                    />
                    <span className="text-muted-foreground">-</span>
                    <SearchableDropdown
                      name="fancyIntencityTo"
                      value={form.fancyIntencityTo}
                      onChange={(value) => setForm(prev => ({ ...prev, fancyIntencityTo: value }))}
                      options={fancyIntensities}
                      placeholder="To"
                    />
                  </div>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="fancyOvertoneFrom" className="font-medium">
                    Fancy Overtone Range
                  </Label>
                  <div className="flex items-center gap-2">
                    <SearchableDropdown
                      name="fancyOvertoneFrom"
                      value={form.fancyOvertoneFrom}
                      onChange={(value) => setForm(prev => ({ ...prev, fancyOvertoneFrom: value }))}
                      options={fancyOvertones}
                      placeholder="From"
                    />
                    <span className="text-muted-foreground">-</span>
                    <SearchableDropdown
                      name="fancyOvertoneTo"
                      value={form.fancyOvertoneTo}
                      onChange={(value) => setForm(prev => ({ ...prev, fancyOvertoneTo: value }))}
                      options={fancyOvertones}
                      placeholder="To"
                    />
                  </div>
                </div>
              </>
            )}

          </div>
        </section>

        {/* Finish & Treatments Card */}
        <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full"></div>
            <h3 className="text-lg font-semibold text-foreground">Finish & Treatments</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="polish" className="font-medium">
                Polish
              </Label>
              <SearchableDropdown
                name="polish"
                value={form.polish}
                onChange={(value) => setForm(prev => ({ ...prev, polish: value }))}
                options={cutGrades}
                placeholder="Select polish..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symmetry" className="font-medium">
                Symmetry
              </Label>
              <SearchableDropdown
                name="symmetry"
                value={form.symmetry}
                onChange={(value) => setForm(prev => ({ ...prev, symmetry: value }))}
                options={cutGrades}
                placeholder="Select symmetry..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fluorescence" className="font-medium">
                Fluorescence<RequiredMark show={isMelee} />
              </Label>
              <SearchableDropdown
                name="fluorescence"
                value={form.fluorescence}
                onChange={(value) => setForm(prev => ({ ...prev, fluorescence: value }))}
                options={fluorescences}
                placeholder="Select fluorescence..."
                required={isMelee}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shade" className="font-medium">
                Shade
              </Label>
              <SearchableDropdown
                name="shade"
                value={form.shade}
                onChange={(value) => setForm(prev => ({ ...prev, shade: value }))}
                options={shades}
                placeholder="Select shade..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="treatment" className="font-medium">
                Treatment
              </Label>
              <SearchableDropdown
                name="treatment"
                value={form.treatment}
                onChange={(value) => setForm(prev => ({ ...prev, treatment: value }))}
                options={treatments}
                placeholder="Select treatment..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="process" className="font-medium">
                Process
              </Label>
              <SearchableDropdown
                name="process"
                value={form.process}
                onChange={(value) => setForm(prev => ({ ...prev, process: value }))}
                options={processes}
                placeholder="Select process..."
              />
            </div>
          </div>
        </section>

        {/* Melee Parcel Card */}
        {isMelee && (
          <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-1 bg-primary rounded-full"></div>
              <h3 className="text-lg font-semibold text-foreground">Melee Parcel Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="certificateCompanyName" className="font-medium">
                  Certificate Company<RequiredMark />
                </Label>
                <SearchableDropdown
                  name="certificateCompanyName"
                  value={form.certificateCompanyName}
                  onChange={(value) => setForm(prev => ({ ...prev, certificateCompanyName: value }))}
                  options={certificateCompanies}
                  placeholder="Select company..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalPcs" className="font-medium">
                  Total Pieces<RequiredMark />
                </Label>
                <Input
                  id="totalPcs"
                  name="totalPcs"
                  type="number"
                  value={form.totalPcs}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 150"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sizeMin" className="font-medium">
                  Average Size (mm)<RequiredMark />
                </Label>
                <Input
                  id="sizeMin"
                  name="sizeMin"
                  value={form.sizeMin}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 1.0"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-medium">
                  Sieve Size Range<RequiredMark />
                </Label>
                <div className="flex gap-2">
                  <Input
                    name="sieveSizeMin"
                    value={form.sieveSizeMin}
                    onChange={handleChange}
                    required
                    placeholder="Min"
                    className="bg-background"
                  />
                  <div className="flex items-center text-muted-foreground">-</div>
                  <Input
                    name="sieveSizeMax"
                    value={form.sieveSizeMax}
                    onChange={handleChange}
                    required
                    placeholder="Max"
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-medium">
                  Diameter Range (mm)<RequiredMark />
                </Label>
                <div className="flex gap-2">
                  <Input
                    name="diameterMin"
                    value={form.diameterMin}
                    onChange={handleChange}
                    type="number"
                    step="0.01"
                    required
                    placeholder="Min"
                    className="bg-background"
                  />
                  <div className="flex items-center text-muted-foreground">-</div>
                  <Input
                    name="diameterMax"
                    value={form.diameterMax}
                    onChange={handleChange}
                    type="number"
                    step="0.01"
                    required
                    placeholder="Max"
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="measurement" className="font-medium">
                  Measurement (mm)<RequiredMark />
                </Label>
                <Input
                  id="measurement"
                  name="measurement"
                  value={form.measurement}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 1.00 x 1.00 x 0.65"
                  className="bg-background"
                />
              </div>
            </div>
          </section>
        )}
        {/* Measurements Card */}
        {!isMelee && (
          <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-1 bg-primary rounded-full"></div>
              <h3 className="text-lg font-semibold text-foreground">Measurements & Proportions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="measurement" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Measurement<RequiredMark />
                </Label>
                <div className="relative">
                  <Input
                    id="measurement"
                    name="measurement"
                    value={form.measurement}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 5.00 x 5.00 x 3.00"
                    className="bg-background pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">mm</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ratio" className="font-medium">
                    Ratio
                </Label>
                <Input
                  id="ratio"
                  name="ratio"
                  value={form.ratio}
                  onChange={handleChange}
                  placeholder="e.g. 1.00"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="table" className="font-medium">
                    Table
                </Label>
                <div className="relative">
                  <Input
                    id="table"
                    name="table"
                    value={form.table}
                    onChange={handleChange}
                    placeholder="e.g. 57"
                    className="bg-background pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="depth" className="font-medium">
                    Depth
                </Label>
                <div className="relative">
                  <Input
                    id="depth"
                    name="depth"
                    value={form.depth}
                    onChange={handleChange}
                    placeholder="e.g. 62.3"
                    className="bg-background pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gridleMin" className="font-medium">
                    Girdle Min
                </Label>
                <div className="relative">
                  <Input
                    id="gridleMin"
                    name="gridleMin"
                    type="number"
                    value={form.gridleMin}
                    onChange={handleChange}
                    placeholder="e.g. 1.0"
                    className="bg-background pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">mm</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gridleMax" className="font-medium">
                    Girdle Max
                </Label>
                <div className="relative">
                  <Input
                    id="gridleMax"
                    name="gridleMax"
                    type="number"
                    value={form.gridleMax}
                    onChange={handleChange}
                    placeholder="e.g. 2.0"
                    className="bg-background pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">mm</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gridlePercentage" className="font-medium">
                    Girdle %
                </Label>
                <div className="relative">
                  <Input
                    id="gridlePercentage"
                    name="gridlePercentage"
                    type="number"
                    value={form.gridlePercentage}
                    onChange={handleChange}
                    placeholder="e.g. 1.5"
                    className="bg-background pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="crownHeight" className="font-medium">
                    Crown Height
                </Label>
                <div className="relative">
                  <Input
                    id="crownHeight"
                    name="crownHeight"
                    type="number"
                    value={form.crownHeight}
                    onChange={handleChange}
                    placeholder="e.g. 15.0"
                    className="bg-background pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="crownAngle" className="font-medium">
                    Crown Angle
                </Label>
                <div className="relative">
                  <Input
                    id="crownAngle"
                    name="crownAngle"
                    type="number"
                    value={form.crownAngle}
                    onChange={handleChange}
                    placeholder="e.g. 34.5"
                    className="bg-background pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">°</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pavilionAngle" className="font-medium">
                    Pavilion Angle
                </Label>
                <div className="relative">
                  <Input
                    id="pavilionAngle"
                    name="pavilionAngle"
                    type="number"
                    value={form.pavilionAngle}
                    onChange={handleChange}
                    placeholder="e.g. 40.8"
                    className="bg-background pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">°</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pavilionDepth" className="font-medium">
                    Pavilion Depth
                </Label>
                <div className="relative">
                  <Input
                    id="pavilionDepth"
                    name="pavilionDepth"
                    type="number"
                    value={form.pavilionDepth}
                    onChange={handleChange}
                    placeholder="e.g. 43.0"
                    className="bg-background pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="culetSize" className="font-medium">
                    Culet Size
                </Label>
                <div className="relative">
                  <Input
                    id="culetSize"
                    name="culetSize"
                    type="number"
                    value={form.culetSize}
                    onChange={handleChange}
                    placeholder="e.g. 0.5"
                    className="bg-background pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">mm</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Certification Card */}
        {activeTab !== 'Melee' && (
          <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-1 bg-primary rounded-full"></div>
              <h3 className="text-lg font-semibold text-foreground">Certification</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative group space-y-2">
                <Label htmlFor="certificateCompanyName" className="font-medium text-foreground">
                  Certificate Company
                </Label>
                <SearchableDropdown
                  name="certificateCompanyName"
                  value={form.certificateCompanyName}
                  onChange={(value) => setForm(prev => ({ ...prev, certificateCompanyName: value }))}
                  options={certificateCompanies}
                  placeholder="Select company..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certificateNumber" className="font-medium text-foreground">
                  Certificate Number
                </Label>
                <Input
                  id="certificateNumber"
                  name="certificateNumber"
                  value={form.certificateNumber}
                  onChange={handleChange}
                  placeholder="e.g. 123456789"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inscription" className="font-medium text-foreground">
                  Inscription
                </Label>
                <Input
                  id="inscription"
                  name="inscription"
                  value={form.inscription}
                  onChange={handleChange}
                  placeholder="e.g. GIA123456"
                  className="bg-background"
                />
              </div>
            </div>
          </section>
        )}

        {/* Pricing & Details Card */}
        <section className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full"></div>
            <h3 className="text-lg font-semibold text-foreground">Pricing & Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="stockNumber" className="font-medium">
                Stock Number<RequiredMark />
              </Label>
              <Input
                id="stockNumber"
                name="stockNumber"
                type="number"
                value={form.stockNumber}
                onChange={handleChange}
                min={1}
                step={1}
                required
                placeholder="e.g. 1001"
                className="bg-background"
              />
              {fieldErrors.stockNumber && (
                <p className="text-xs text-destructive">{fieldErrors.stockNumber}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin" className="font-medium">
                Origin
              </Label>
              <Input
                id="origin"
                name="origin"
                value={form.origin}
                onChange={handleChange}
                placeholder="e.g. South Africa"
                className="bg-background"
              />
            </div>

            {
              activeTab !== 'Melee' && (
                <div className="space-y-2">
                  <Label htmlFor="rap" className="font-medium">
                    RAP Price
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="rap"
                      name="rap"
                      type="number"
                      value={form.rap}
                      onChange={handleChange}
                      placeholder="5000"
                      className="pl-6 bg-background"
                    />
                  </div>
                </div>
              )}
            <div className="space-y-2">
              <Label htmlFor="price" className="font-medium">
                Total Price ($)<RequiredMark />
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  min={0}
                  step="0.01"
                  required
                  placeholder="4500"
                  className="pl-6 bg-background"
                />
              </div>
              {fieldErrors.price && (
                <p className="text-xs text-destructive">{fieldErrors.price}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerCarat" className="font-medium">
                Price Per Carat ($)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="pricePerCarat"
                  name="pricePerCarat"
                  type="number"
                  value={form.pricePerCarat}
                  onChange={handleChange}
                  min={0}
                  step="0.01"
                  placeholder="e.g. 3600"
                  className="pl-6 bg-background"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount" className="font-medium">
                Discount (%)
              </Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                value={form.discount}
                onChange={handleChange}
                min={0}
                max={100}
                step="0.01"
                placeholder="e.g. 10"
                className="bg-background"
              />
              {fieldErrors.discount && (
                <p className="text-xs text-destructive">{fieldErrors.discount}</p>
              )}
            </div>
          </div>
        </section>

        {/* Error Display */}
        {error && (
            <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {error}
            </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
           <div className="hidden md:flex items-center text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                Unsaved Changes
              </span>
           </div>
           <div className="flex items-center gap-4">
          <Button
            type="reset"
            variant="outline"
            onClick={() => {
              setForm(initialState);
              setFieldErrors({});
              setError('');
            }}
            disabled={loading}
            className="min-w-[120px] rounded-xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[160px] rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Add Diamond'
            )}
          </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default AddDiamondForm;

