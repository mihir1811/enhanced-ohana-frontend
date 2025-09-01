'use client'

import React, { useState } from 'react';
import { sellerService } from '../../services/seller.service';
import { 
  Building, 
  MapPin, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff,
  ArrowRight,
  Star,
  Shield,
  Award,
  Users,
  Globe,
  FileText,
  Camera,
  X
} from 'lucide-react';
import { SECTION_WIDTH } from '@/lib/constants';

interface BecomeSellerFormProps {
  onSuccess?: () => void;
}

const BecomeSellerForm: React.FC<BecomeSellerFormProps> = ({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    companyName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    sellerType: 'naturalDiamond',
    companyLogo: undefined as File | undefined,
    businessEmail: '',
    phoneNumber: '',
    businessRegistration: '',
    yearsInBusiness: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const steps = [
    { id: 1, title: 'Company Information', icon: Building },
    { id: 2, title: 'Business Address', icon: MapPin },
    { id: 3, title: 'Verification', icon: Shield }
  ];

  const sellerTypes = [
    { value: 'naturalDiamond', label: 'Natural Diamonds', desc: 'Certified natural diamond dealer' },
    { value: 'labGrown', label: 'Lab-Grown Diamonds', desc: 'Synthetic diamond specialist' },
    { value: 'both', label: 'Both Natural & Lab-Grown', desc: 'Full spectrum dealer' },
    { value: 'wholesale', label: 'Wholesale Only', desc: 'B2B diamond supplier' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;
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
        return form.companyName && form.businessEmail && form.sellerType;
      case 2:
        return form.addressLine1 && form.city && form.state && form.country && form.zipCode;
      case 3:
        return form.businessRegistration && form.yearsInBusiness;
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
      const token = localStorage.getItem('token') || undefined;
      await sellerService.createSeller(form, token);
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your seller application has been received. We'll review your information and get back to you within 24-48 hours.
            </p>
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
              <p className="text-sm text-emerald-700">
                📧 Check your email for next steps and verification requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8`}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Become a Diamond Seller</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
            <div key={benefit.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-3 ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      currentStep >= step.id 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
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
                    <div className={`w-16 h-0.5 mx-4 transition-colors duration-300 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Information</h2>
                  <p className="text-gray-600">Tell us about your diamond business</p>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      label="Business Email"
                      name="businessEmail"
                      type="email"
                      value={form.businessEmail}
                      onChange={handleChange}
                      placeholder="business@company.com"
                      required
                    />
                    <FormField
                      label="Phone Number"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Seller Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {sellerTypes.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, sellerType: type.value }))}
                          className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                            form.sellerType === type.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
                          <p className="text-sm text-gray-600">{type.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <FormField
                    label="Business Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Tell us about your diamond business, experience, and specializations..."
                    multiline
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Business Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Address</h2>
                  <p className="text-gray-600">Where is your business located?</p>
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

            {/* Step 3: Verification */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Verification</h2>
                  <p className="text-gray-600">Help us verify your business credentials</p>
                </div>

                <div className="space-y-6">
                  <FormField
                    label="Business Registration Number"
                    name="businessRegistration"
                    value={form.businessRegistration}
                    onChange={handleChange}
                    placeholder="Business license or registration number"
                    required
                    icon={FileText}
                  />

                  <FormField
                    label="Years in Business"
                    name="yearsInBusiness"
                    type="number"
                    value={form.yearsInBusiness}
                    onChange={handleChange}
                    placeholder="How many years have you been in business?"
                    required
                  />

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Company Logo</label>
                    <div
                      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                        dragActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {logoPreview ? (
                        <div className="relative">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-32 h-32 object-contain mx-auto rounded-xl border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <p className="text-sm text-gray-600 mt-3 text-center">
                            Click to change or drag a new image
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Company Logo</h3>
                          <p className="text-gray-600 mb-4">
                            Drag and drop your logo here, or click to browse
                          </p>
                          <p className="text-sm text-gray-500">
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
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">Application Error</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                {steps.map(step => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      currentStep >= step.id ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !validateStep(3)}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
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
        <div className="mt-12 bg-gray-900 rounded-3xl p-8 text-white">
          <h3 className="text-xl font-bold text-center mb-6">Trusted by Diamond Professionals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-gray-300 text-sm">Active Sellers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">$50M+</div>
              <div className="text-gray-300 text-sm">Diamonds Sold</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">99.2%</div>
              <div className="text-gray-300 text-sm">Satisfaction Rate</div>
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
  icon?: React.ComponentType<any>;
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
  const [focused, setFocused] = useState(false);

  const inputClasses = `w-full px-4 py-3 ${Icon ? 'pl-12' : ''} bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-500`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
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
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BecomeSellerForm;