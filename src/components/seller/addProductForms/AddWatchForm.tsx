import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  watchService,
  CreateWatchRequest,
  MovementType,
  DisplayType,
  Gender
} from '@/services/watch.service';

const AddWatchForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<{ [key: string]: File | null }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFiles(prev => ({ ...prev, [fieldName]: file }));
      setPreviewUrls(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
    }
  };

  const removeImage = (fieldName: string) => {
    setImageFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fieldName];
      return newFiles;
    });
    setPreviewUrls(prev => {
      const newUrls = { ...prev };
      if (newUrls[fieldName]) URL.revokeObjectURL(newUrls[fieldName]);
      delete newUrls[fieldName];
      return newUrls;
    });
  };

  const [formData, setFormData] = useState<Partial<CreateWatchRequest>>({
    stockNumber: '',
    brand: '',
    model: '',
    referenceNumber: '',
    dialColor: '',
    caseShape: '',
    caseSize: undefined,
    caseMaterial: '',
    caseBack: '',
    crownType: '',
    strapMaterial: '',
    strapColor: '',
    claspType: '',
    claspMaterial: '',
    movementType: MovementType.AUTOMATIC,
    movementDetails: '',
    calibre: '',
    powerReserve: undefined,
    waterResistance: '',
    glass: '',
    complications: '',
    features: '',
    stonesOnDial: undefined,
    bezelType: '',
    bezelMaterial: '',
    display: DisplayType.ANALOG,
    gender: Gender.unisex,
    collection: '',
    certification: '',
    modelYear: undefined,
    wristSizeFit: undefined,
    lugWidth: undefined,
    condition: '',
    price: undefined,
    warrantyCardIncluded: false,
    boxIncluded: false,
    papersIncluded: false,
    description: '',
    videoURL: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFillRandom = () => {
    const brands = ['Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'Cartier', 'Breitling', 'Tag Heuer'];
    const models = ['Submariner', 'Daytona', 'Speedmaster', 'Nautilus', 'Royal Oak', 'Tank', 'Navitimer', 'Carrera'];
    const materials = ['Stainless Steel', 'Gold', 'Titanium', 'Ceramic', 'Platinum', 'Rose Gold'];
    const colors = ['Black', 'Blue', 'White', 'Silver', 'Green', 'Champagne'];
    const shapes = ['Round', 'Square', 'Rectangular', 'Tonneau', 'Oval'];
    const glasses = ['Sapphire Crystal', 'Mineral Glass', 'Acrylic'];
    
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const randomModel = models[Math.floor(Math.random() * models.length)];

    setFormData({
      stockNumber: `WCH-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: randomBrand,
      model: randomModel,
      referenceNumber: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
      dialColor: colors[Math.floor(Math.random() * colors.length)],
      caseShape: shapes[Math.floor(Math.random() * shapes.length)],
      caseSize: Math.floor(36 + Math.random() * 10), // 36-46mm
      caseMaterial: materials[Math.floor(Math.random() * materials.length)],
      caseBack: Math.random() > 0.5 ? 'Solid' : 'Exhibition',
      crownType: Math.random() > 0.5 ? 'Screw-down' : 'Push-pull',
      strapMaterial: materials[Math.floor(Math.random() * materials.length)],
      strapColor: colors[Math.floor(Math.random() * colors.length)],
      claspType: Math.random() > 0.5 ? 'Deployant' : 'Buckle',
      claspMaterial: materials[Math.floor(Math.random() * materials.length)],
      movementType: Object.values(MovementType)[Math.floor(Math.random() * Object.values(MovementType).length)],
      movementDetails: 'In-house movement',
      calibre: `CAL-${Math.floor(100 + Math.random() * 900)}`,
      powerReserve: Math.floor(40 + Math.random() * 40), // 40-80 hours
      waterResistance: `${Math.floor(3 + Math.random() * 27) * 10}m`,
      glass: glasses[Math.floor(Math.random() * glasses.length)],
      complications: Math.random() > 0.5 ? 'Date, Chronograph' : 'Date',
      features: 'Luminous hands and markers',
      stonesOnDial: Math.random() > 0.8 ? Math.floor(Math.random() * 12) : 0,
      bezelType: Math.random() > 0.5 ? 'Fixed' : 'Rotating',
      bezelMaterial: materials[Math.floor(Math.random() * materials.length)],
      display: Object.values(DisplayType)[Math.floor(Math.random() * Object.values(DisplayType).length)],
      gender: Object.values(Gender)[Math.floor(Math.random() * Object.values(Gender).length)],
      collection: 'Classic Collection',
      certification: Math.random() > 0.5 ? 'COSC' : 'None',
      modelYear: Math.floor(1990 + Math.random() * 34),
      wristSizeFit: Number((15 + Math.random() * 5).toFixed(1)),
      lugWidth: Math.floor(18 + Math.random() * 6),
      condition: Math.random() > 0.7 ? 'New' : 'Used',
      price: Number((1000 + Math.random() * 49000).toFixed(2)),
      warrantyCardIncluded: Math.random() > 0.3,
      boxIncluded: Math.random() > 0.3,
      papersIncluded: Math.random() > 0.3,
      description: `Beautiful ${randomBrand} ${randomModel} in excellent condition.`,
      videoURL: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (!formData.brand || !formData.model || !formData.price || !formData.stockNumber) {
        throw new Error('Please fill in all required fields');
      }
      if (formData.videoURL && formData.videoURL.trim() !== '') {
        try {
          // eslint-disable-next-line no-new
          new URL(formData.videoURL);
        } catch {
          throw new Error('Please enter a valid Video URL');
        }
      }

      const payload: CreateWatchRequest = {
        stockNumber: formData.stockNumber!,
        brand: formData.brand!,
        model: formData.model!,
        referenceNumber: formData.referenceNumber,
        dialColor: formData.dialColor!,
        caseShape: formData.caseShape!,
        caseSize: Number(formData.caseSize),
        caseMaterial: formData.caseMaterial!,
        caseBack: formData.caseBack,
        crownType: formData.crownType,
        strapMaterial: formData.strapMaterial,
        strapColor: formData.strapColor,
        claspType: formData.claspType,
        claspMaterial: formData.claspMaterial,
        movementType: formData.movementType!,
        movementDetails: formData.movementDetails,
        calibre: formData.calibre,
        powerReserve: formData.powerReserve ? Number(formData.powerReserve) : undefined,
        waterResistance: formData.waterResistance,
        glass: formData.glass!,
        complications: formData.complications,
        features: formData.features,
        stonesOnDial: formData.stonesOnDial ? Number(formData.stonesOnDial) : undefined,
        bezelType: formData.bezelType,
        bezelMaterial: formData.bezelMaterial,
        display: formData.display!,
        gender: formData.gender!,
        collection: formData.collection,
        certification: formData.certification,
        modelYear: formData.modelYear ? Number(formData.modelYear) : undefined,
        wristSizeFit: formData.wristSizeFit ? Number(formData.wristSizeFit) : undefined,
        lugWidth: formData.lugWidth ? Number(formData.lugWidth) : undefined,
        condition: formData.condition!,
        price: Number(formData.price),
        warrantyCardIncluded: Boolean(formData.warrantyCardIncluded),
        boxIncluded: Boolean(formData.boxIncluded),
        papersIncluded: Boolean(formData.papersIncluded),
        description: formData.description,
        videoURL: formData.videoURL,
      };

      // Create FormData
      const data = new FormData();
      
      // Append text fields
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'videoURL' && typeof value === 'string' && value.trim() === '') return;
          data.append(key, String(value));
        }
      });

      // Append images
      Object.entries(imageFiles).forEach(([key, file]) => {
        if (file) {
          data.append(key, file);
        }
      });

      await watchService.createWatch(data);
      toast.success('Watch product created successfully');
      router.push('/seller/products');
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to create watch product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 mx-auto p-6 bg-card rounded-xl shadow-sm border border-border text-foreground">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-foreground">Add New Watch Product</h2>
        <button
          type="button"
          onClick={handleFillRandom}
          className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 text-sm font-medium transition-colors border border-accent"
        >
          Fill Random Data
        </button>
      </div>

      {/* Basic Information */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Stock Number *</label>
            <input
              type="text"
              name="stockNumber"
              required
              value={formData.stockNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Brand *</label>
            <input
              type="text"
              name="brand"
              required
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Model *</label>
            <input
              type="text"
              name="model"
              required
              value={formData.model}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Reference Number</label>
            <input
              type="text"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Gender *</label>
            <select
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {Object.values(Gender).map(g => (
                <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
              ))}
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-foreground mb-1">Model Year</label>
            <input
              type="number"
              name="modelYear"
              value={formData.modelYear || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Case & Dial Details */}
      <section className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground">Case & Dial Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Case Material *</label>
            <input
              type="text"
              name="caseMaterial"
              required
              value={formData.caseMaterial}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Case Size (mm) *</label>
            <input
              type="number"
              name="caseSize"
              required
              value={formData.caseSize || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Case Shape *</label>
            <input
              type="text"
              name="caseShape"
              required
              value={formData.caseShape}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-foreground mb-1">Dial Color *</label>
            <input
              type="text"
              name="dialColor"
              required
              value={formData.dialColor}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Glass *</label>
            <input
              type="text"
              name="glass"
              required
              value={formData.glass}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Case Back</label>
            <input
              type="text"
              name="caseBack"
              value={formData.caseBack}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Movement & Features */}
      <section className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground">Movement & Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div>
            <label className="block text-sm font-medium text-foreground mb-1">Movement Type *</label>
            <select
              name="movementType"
              required
              value={formData.movementType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {Object.values(MovementType).map(m => (
                <option key={m} value={m}>{m.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Display Type *</label>
             <select
              name="display"
              required
              value={formData.display}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {Object.values(DisplayType).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Calibre</label>
            <input
              type="text"
              name="calibre"
              value={formData.calibre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Power Reserve (hrs)</label>
            <input
              type="number"
              name="powerReserve"
              value={formData.powerReserve || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Water Resistance</label>
            <input
              type="text"
              name="waterResistance"
              value={formData.waterResistance}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-foreground mb-1">Complications</label>
            <input
              type="text"
              name="complications"
              value={formData.complications}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Strap & Clasp */}
      <section className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground">Strap & Clasp</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Strap Material</label>
            <input
              type="text"
              name="strapMaterial"
              value={formData.strapMaterial}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Strap Color</label>
            <input
              type="text"
              name="strapColor"
              value={formData.strapColor}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Clasp Type</label>
            <input
              type="text"
              name="claspType"
              value={formData.claspType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </section>

       {/* Pricing & Condition */}
      <section className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground">Pricing & Condition</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Price *</label>
            <input
              type="number"
              step="0.01"
              name="price"
              required
              value={formData.price || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Condition *</label>
            <input
              type="text"
              name="condition"
              required
              value={formData.condition}
              onChange={handleChange}
              placeholder="e.g. New, Used, Mint"
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-foreground">Includes</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="boxIncluded"
                  checked={formData.boxIncluded}
                  onChange={handleChange}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">Box</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="papersIncluded"
                  checked={formData.papersIncluded}
                  onChange={handleChange}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">Papers</span>
              </label>
               <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="warrantyCardIncluded"
                  checked={formData.warrantyCardIncluded}
                  onChange={handleChange}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">Warranty Card</span>
              </label>
            </div>
          </div>
        </div>
      </section>

       {/* Additional Info */}
      <section className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground">Product Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {['image1', 'image2', 'image3', 'image4', 'image5', 'image6'].map((field, index) => (
            <div key={field} className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Image {index + 1} {index === 0 && '(Main)'}
              </label>
              <div className="relative border-2 border-dashed border-border rounded-lg p-4 hover:bg-muted transition-colors text-center">
                {previewUrls[field] ? (
                  <div className="relative w-full aspect-square mb-2">
                    <img
                      src={previewUrls[field]}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-contain rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(field)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                     <p className="text-xs text-muted-foreground">Click to upload</p>
                  </div>
                )}
                <input
                  type="file"
                  name={field}
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, field)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={!!previewUrls[field]}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-6 border-t flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border rounded-lg bg-card border-border text-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg border border-primary hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Watch Product'}
        </button>
      </div>
    </form>
  );
};

export default AddWatchForm;
