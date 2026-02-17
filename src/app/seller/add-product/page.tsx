'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AddDiamondForm from '@/components/seller/addProductForms/AddDiamondForm';
import AddGemstoneForm from '@/components/seller/addProductForms/AddGemstoneForm';
import AddJewelryForm from '@/components/seller/addProductForms/AddJewelryForm';
import AddBullionForm from '@/components/seller/addProductForms/AddBullionForm';
import AddWatchForm from '@/components/seller/addProductForms/AddWatchForm';

export default function Page() {
  const profile = useSelector((state: RootState) => state.seller.profile);
  const [selectedType, setSelectedType] = useState<'jewellery' | 'watch'>('jewellery');

  // Type guard to check if profile is SellerData with sellerType
  const sellerType = profile && 'sellerType' in profile ? profile.sellerType : undefined;

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  const renderForm = () => {
    // If it's a jewelry seller, they can switch between Jewelry and Watch
    if (sellerType === 'jewellery') {
      return (
        <div className="space-y-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <div className="flex gap-4 border-b">
              <button
                onClick={() => setSelectedType('jewellery')}
                className={`pb-4 px-6 font-medium transition-all ${
                  selectedType === 'jewellery'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Jewelry
              </button>
              <button
                onClick={() => setSelectedType('watch')}
                className={`pb-4 px-6 font-medium transition-all ${
                  selectedType === 'watch'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Watch
              </button>
            </div>
          </div>
          {selectedType === 'jewellery' ? <AddJewelryForm /> : <AddWatchForm />}
        </div>
      );
    }

    // Default behavior for other seller types
    switch (sellerType) {
      case 'naturalDiamond':
      case 'labGrownDiamond':
        return <AddDiamondForm />;
      case 'gemstone':
        return <AddGemstoneForm onCancel={handleCancel} />;
      case 'jewellery':
        return <AddJewelryForm />;
      case 'bullion':
        return <AddBullionForm />;
      case 'watch':
        return <AddWatchForm />;
      default:
        return (
          <div className="text-red-500 font-medium p-8 text-center">
            Please complete your seller profile to add products.
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto py-8">
      {renderForm()}
    </div>
  );
}
