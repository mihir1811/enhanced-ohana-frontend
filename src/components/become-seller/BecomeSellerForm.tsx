'use client'

import React, { useState } from 'react';
import { SellerType, sellerService, type SellerTypeValue } from '../../services/seller.service';
import Image from 'next/image';
import {
  Building,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Shield,
  Award,
  Users,
  Globe,
  Camera,
  X
} from 'lucide-react';
import { SECTION_WIDTH } from '@/lib/constants';
import { getCookie } from '@/lib/cookie-utils';

interface BecomeSellerFormProps {
  onSuccess?: () => void;
}

const BecomeSellerForm: React.FC<BecomeSellerFormProps> = ({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<{
    companyName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    sellerType: SellerTypeValue;
    companyLogo: File | undefined;
  }>({
    companyName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    sellerType: SellerType.naturalDiamond,
    companyLogo: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const steps = [
    { id: 1, title: 'Company Information', icon: Building },
    { id: 2, title: 'Business Address', icon: MapPin },
    { id: 3, title: 'Company Logo', icon: Camera }
  ];

  const sellerTypes = [
    { value: SellerType.naturalDiamond, label: 'Natural Diamonds', desc: 'Certified natural diamond dealer' },
    { value: SellerType.labGrownDiamond, label: 'Lab-Grown Diamonds', desc: 'Synthetic diamond specialist' },
    { value: SellerType.jewellery, label: 'Jewelry', desc: 'Fine jewelry and accessories' },
    { value: SellerType.gemstone, label: 'Gemstones', desc: 'Precious and semi-precious stones' },
    { value: SellerType.bullion, label: 'Bullion', desc: 'Gold, silver, and other precious metals' },
    { value: SellerType.watch, label: 'Watch', desc: 'Luxury and premium watches' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement;
    const { name, value, files } = target;
    if (name === 'companyLogo' && files && files[0]) {
      const file = files[0];
      setForm(f => ({ ...f, companyLogo: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setForm(f => ({ ...f, companyLogo: file }));

        const reader = new FileReader();
        reader.onload = (e) => setLogoPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const removeLogo = () => {
    setForm(f => ({ ...f, companyLogo: undefined }));
    setLogoPreview(null);
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return form.companyName && form.sellerType;
      case 2:
        return form.addressLine1 && form.city && form.state && form.country && form.zipCode;
      case 3:
        return true; // No additional validation needed for step 3
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const token = getCookie('token') || undefined;
      await sellerService.createSeller(form, token);
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-card rounded-3xl shadow-2xl p-8 border border-border">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-card-foreground mb-4">Application Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Your seller application has been received. We&apos;ll review your information and get back to you within 24-48 hours.
            </p>
            <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                📧 Check your email for next steps and verification requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8`}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Become a Diamond Seller</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our premium marketplace and connect with buyers worldwide. Start selling certified diamonds today.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Users, title: 'Global Reach', desc: 'Access to worldwide buyer network' },
            { icon: Shield, title: 'Secure Platform', desc: 'Protected transactions & payments' },
            { icon: Award, title: 'Premium Listing', desc: 'Professional showcase for your diamonds' }
          ].map(benefit => (
            <div key={benefit.title} className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:border-blue-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Progress Steps */}
        <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden">
          <div className="bg-muted px-8 py-6 border-b border-border">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-3 ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= step.id
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-card border-border text-muted-foreground'
                      }`}>
                      {currentStep > step.id ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className="font-medium hidden sm:inline">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 transition-colors duration-300 ${currentStep > step.id ? 'bg-primary' : 'bg-border'
                      }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Company Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="2xl font-bold text-foreground mb-2">Company Information</h2>
                  <p className="text-muted-foreground">Tell us about your diamond business</p>
                </div>

                <div className="space-y-6">
                  <FormField
                    label="Company Name"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                    required
                    icon={Building}
                  />

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">Seller Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {sellerTypes.map(type => {
                        const isSelected = form.sellerType === type.value;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, sellerType: type.value }))}
                            className={`relative p-4 rounded-2xl border-2 transition-all duration-200 text-left group ${isSelected
                                ? 'border-primary bg-primary/5 dark:bg-primary/20 ring-2 ring-primary/20'
                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                              }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h3 className={`font-semibold transition-colors ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'
                                  }`}>
                                  {type.label}
                                </h3>
                                <p className="text-sm text-muted-foreground">{type.desc}</p>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected
                                  ? 'border-primary bg-primary text-primary-foreground scale-100 opacity-100'
                                  : 'border-border group-hover:border-primary/50 scale-90 opacity-0'
                                }`}>
                                {isSelected && <CheckCircle className="w-4 h-4" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
                    <p className="text-sm text-muted-foreground">
                      Jewelry sellers can add watch products. Watch sellers cannot list jewelry products.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Business Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Business Address</h2>
                  <p className="text-muted-foreground">Where is your business located?</p>
                </div>

                <div className="space-y-6">
                  <FormField
                    label="Address Line 1"
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleChange}
                    placeholder="Street address"
                    required
                    icon={MapPin}
                  />

                  <FormField
                    label="Address Line 2"
                    name="addressLine2"
                    value={form.addressLine2}
                    onChange={handleChange}
                    placeholder="Suite, unit, building (optional)"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      label="City"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                    />
                    <FormField
                      label="State/Province"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State or Province"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      label="Country"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="Country"
                      required
                      icon={Globe}
                    />
                    <FormField
                      label="ZIP/Postal Code"
                      name="zipCode"
                      value={form.zipCode}
                      onChange={handleChange}
                      placeholder="ZIP or Postal Code"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Company Logo */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Company Logo</h2>
                  <p className="text-muted-foreground">Upload your company logo (optional)</p>
                </div>

                <div className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">Company Logo</label>
                    <div
                      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${dragActive
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground/50'
                        }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {logoPreview ? (
                        <div className="relative">
                          <Image
                            src={logoPreview}
                            alt="Logo preview"
                            width={128}
                            height={128}
                            className="w-32 h-32 object-contain mx-auto rounded-xl border border-border bg-background"
                          />
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full flex items-center justify-center transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <p className="text-sm text-muted-foreground mt-3 text-center">
                            Click to change or drag a new image
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-foreground mb-2">Upload Company Logo</h3>
                          <p className="text-muted-foreground mb-4">
                            Drag and drop your logo here, or click to browse
                          </p>
                          <p className="text-sm text-muted-foreground/70">
                            Supports: JPG, PNG, SVG up to 5MB
                          </p>
                        </div>
                      )}

                      <input
                        type="file"
                        name="companyLogo"
                        accept="image/*"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-destructive">Application Error</h4>
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-border mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 text-muted-foreground hover:text-foreground font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                {steps.map(step => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${currentStep >= step.id ? 'bg-primary' : 'bg-muted'
                      }`}
                  />
                ))}
              </div>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-md hover:shadow-lg disabled:shadow-none"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-muted disabled:to-muted disabled:text-muted-foreground text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 bg-card border border-border rounded-3xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-center mb-6 text-foreground">Trusted by Diamond Professionals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2 text-primary">500+</div>
              <div className="text-muted-foreground text-sm">Active Sellers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2 text-primary">$50M+</div>
              <div className="text-muted-foreground text-sm">Diamonds Sold</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2 text-primary">99.2%</div>
              <div className="text-muted-foreground text-sm">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Form Field Component
interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  multiline?: boolean;
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  icon: Icon,
  multiline = false,
  rows = 3
}) => {
  const inputClasses = `w-full px-4 py-3 ${Icon ? 'pl-12' : ''} bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/50 text-foreground`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        )}
        {multiline ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={inputClasses}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={inputClasses}
          />
        )}
      </div>
    </div>
  );
};

export default BecomeSellerForm;
