'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  watchService,
  CreateWatchRequest,
  MovementType,
  DisplayType,
  Gender,
  WatchProduct,
} from '@/services/watch.service';

import { Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface EditWatchFormProps {
  initialData: WatchProduct;
}

const EditWatchForm: React.FC<EditWatchFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateWatchRequest>>({});
  const [imageFiles, setImageFiles] = useState<{ [key: string]: File | null }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!initialData) return;
    setFormData({
      stockNumber: initialData.stockNumber,
      brand: initialData.brand,
      model: initialData.model,
      referenceNumber: initialData.referenceNumber,
      dialColor: initialData.dialColor,
      caseShape: initialData.caseShape,
      caseSize: initialData.caseSize,
      caseMaterial: initialData.caseMaterial,
      caseBack: initialData.caseBack,
      crownType: initialData.crownType,
      strapMaterial: initialData.strapMaterial,
      strapColor: initialData.strapColor,
      claspType: initialData.claspType,
      claspMaterial: initialData.claspMaterial,
      movementType: initialData.movementType,
      movementDetails: initialData.movementDetails,
      calibre: initialData.calibre,
      powerReserve: initialData.powerReserve,
      waterResistance: initialData.waterResistance,
      glass: initialData.glass,
      complications: initialData.complications,
      features: initialData.features,
      stonesOnDial: initialData.stonesOnDial,
      bezelType: initialData.bezelType,
      bezelMaterial: initialData.bezelMaterial,
      display: initialData.display,
      gender: initialData.gender,
      collection: initialData.collection,
      certification: initialData.certification,
      modelYear: initialData.modelYear,
      wristSizeFit: initialData.wristSizeFit ? Number(initialData.wristSizeFit) : undefined,
      lugWidth: initialData.lugWidth,
      condition: initialData.condition,
      price: Number(initialData.price),
      availabilityStatus: initialData.availabilityStatus,
      warrantyCardIncluded: initialData.warrantyCardIncluded,
      boxIncluded: initialData.boxIncluded,
      papersIncluded: initialData.papersIncluded,
      description: initialData.description,
      videoURL: initialData.videoURL,
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFiles((prev) => ({ ...prev, [fieldName]: file }));
      setPreviewUrls((prev) => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
    }
  };

  const removeImage = (fieldName: string) => {
    setImageFiles((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
    setPreviewUrls((prev) => {
      const next = { ...prev };
      if (next[fieldName]) URL.revokeObjectURL(next[fieldName]);
      delete next[fieldName];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (formData.videoURL && formData.videoURL.trim() !== '') {
        try {
          // eslint-disable-next-line no-new
          new URL(formData.videoURL);
        } catch {
          throw new Error('Please enter a valid Video URL');
        }
      }
      const payload: Partial<CreateWatchRequest> = {
        stockNumber: formData.stockNumber!,
        brand: formData.brand!,
        model: formData.model!,
        referenceNumber: formData.referenceNumber,
        dialColor: formData.dialColor!,
        caseShape: formData.caseShape!,
        caseSize: formData.caseSize ? Number(formData.caseSize) : undefined,
        caseMaterial: formData.caseMaterial!,
        caseBack: formData.caseBack,
        crownType: formData.crownType,
        strapMaterial: formData.strapMaterial,
        strapColor: formData.strapColor,
        claspType: formData.claspType,
        claspMaterial: formData.claspMaterial,
        movementType: formData.movementType as MovementType,
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
        display: formData.display as DisplayType,
        gender: formData.gender as Gender,
        collection: formData.collection,
        certification: formData.certification,
        modelYear: formData.modelYear ? Number(formData.modelYear) : undefined,
        wristSizeFit: formData.wristSizeFit ? Number(formData.wristSizeFit) : undefined,
        lugWidth: formData.lugWidth ? Number(formData.lugWidth) : undefined,
        condition: formData.condition!,
        price: formData.price ? Number(formData.price) : undefined,
        availabilityStatus: formData.availabilityStatus,
        warrantyCardIncluded: !!formData.warrantyCardIncluded,
        boxIncluded: !!formData.boxIncluded,
        papersIncluded: !!formData.papersIncluded,
        description: formData.description,
        videoURL: formData.videoURL,
      };

      const data = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) data.append(key, String(value));
      });
      if (payload.videoURL && typeof payload.videoURL === 'string' && payload.videoURL.trim() === '') {
        data.delete('videoURL');
      }
      Object.entries(imageFiles).forEach(([key, file]) => {
        if (file) data.append(key, file);
      });

      const res = await watchService.updateWatch(initialData.id, data);
      if (res?.success) {
        toast.success('Watch updated successfully');
        router.push('/seller/products');
      } else {
        toast.success('Watch updated successfully');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update watch');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);
      const res = await watchService.deleteWatch(initialData.id);
      if (res?.success) {
        toast.success('Watch deleted successfully');
        router.push('/seller/products');
      } else {
        toast.success('Watch deleted successfully');
        router.push('/seller/products');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete watch');
    } finally {
      setLoadingDelete(false);
      setShowDeleteModal(false);
    }
  };

  const imageFields = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6'] as const;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Watch</h2>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
          disabled={saving || loadingDelete}
        >
          <Trash2 className="w-4 h-4" />
          Delete Watch
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Brand</label>
            <input name="brand" value={formData.brand || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Model</label>
            <input name="model" value={formData.model || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Stock Number</label>
            <input name="stockNumber" value={formData.stockNumber || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Price</label>
            <input name="price" type="number" value={formData.price ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Condition</label>
            <input name="condition" value={formData.condition || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Glass</label>
            <input name="glass" value={formData.glass || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full border rounded px-3 py-2 h-28" />
        </div>

        <section className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-700">Product Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {imageFields.map((field, index) => {
              const existingUrl = (initialData as any)[field] as string | undefined;
              const previewUrl = previewUrls[field] || existingUrl || '';
              return (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Image {index + 1} {index === 0 && '(Main)'}
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors text-center">
                    {previewUrl ? (
                      <div className="relative w-full aspect-square mb-2">
                        <img src={previewUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-contain rounded-md" />
                        {previewUrls[field] && (
                          <button
                            type="button"
                            onClick={() => removeImage(field)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs text-gray-500">Click to upload</p>
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
              );
            })}
          </div>
        </section>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="px-4 py-2 border rounded"
            onClick={() => router.push('/seller/products')}
          >
            Cancel
          </button>
        </div>
      </form>

      <ConfirmModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Are you sure you want to delete this watch?"
        description="This action cannot be undone and will permanently remove the product."
        onYes={handleDelete}
        onNo={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default EditWatchForm;
