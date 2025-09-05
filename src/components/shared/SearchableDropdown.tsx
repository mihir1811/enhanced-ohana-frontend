import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";

export interface Option {
  value: string;
  label: string;
}

export interface SearchableDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  name,
  placeholder = "Select an option",
  required = false,
  icon
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
    onChange(option.value);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="relative cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <Input
          ref={inputRef}
          type="text"
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 pr-10 py-2 text-sm
                     ring-offset-background file:border-0 file:bg-transparent 
                     file:text-sm file:font-medium placeholder:text-muted-foreground 
                     focus-visible:outline-none focus-visible:ring-2 
                     focus-visible:ring-ring focus-visible:ring-offset-2
                     disabled:cursor-not-allowed disabled:opacity-50
                     transition-all duration-200 ease-in-out
                     hover:border-primary/50
                     ${isOpen ? 'ring-2 ring-ring ring-offset-2 border-primary' : ''}
                     backdrop-blur-sm`}
          placeholder={placeholder}
          value={isOpen ? searchTerm : selectedOption?.label || ""}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onClick={(e) => e.stopPropagation()}
          onFocus={() => setIsOpen(true)}
          required={required}
          name={name}
        />
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 
                      transition-all duration-200 ease-in-out 
                      ${isOpen ? 'text-primary' : 'text-muted-foreground'}`}>
          <svg className={`w-4 h-4 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 rounded-md border bg-white bg-card text-card-foreground 
                       shadow-lg ring-1 ring-black/5 outline-none animate-in fade-in-0 zoom-in-95 
                       max-h-60 overflow-auto backdrop-blur-sm">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                className={`relative flex w-full cursor-pointer select-none items-center px-3 py-2 text-sm outline-none
                          transition-all duration-200 ease-in-out gap-2
                          hover:bg-accent hover:text-accent-foreground group
                          ${option.value === value ? 'bg-accent/90 text-accent-foreground font-medium' : ''}
                          ${index === 0 ? 'rounded-t-[5px]' : ''}
                          ${index === filteredOptions.length - 1 ? 'rounded-b-[5px]' : ''}`}
                onClick={() => handleSelect(option)}
              >
                <span className={`flex-1 truncate ${option.value === value ? 'font-medium' : ''}`}>
                  {option.label}
                </span>
                {option.value === value && (
                  <svg className="w-4 h-4 text-primary shrink-0 opacity-100 group-hover:text-white transition-colors duration-200" 
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              No matching options
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;