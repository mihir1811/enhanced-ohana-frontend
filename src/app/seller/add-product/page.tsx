'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AddDiamondForm from '@/components/seller/addProductForms/AddDiamondForm';
import AddGemstoneForm from '@/components/seller/addProductForms/AddGemstoneForm';
import AddJewelryForm from '@/components/seller/addProductForms/AddJewelryForm';

// Helper function to get correct form
function renderAddProductForm(sellerType?: string) {
  const handleCancel = () => {
    // Handle cancel action - could navigate back or reset form
    console.log('Form cancelled');
  };

  switch (sellerType) {
    case 'naturalDiamond':
      return <AddDiamondForm />;
    case 'labGrownDiamond':
      return <AddDiamondForm />;
    case 'gemstone':
      return <AddGemstoneForm onCancel={handleCancel} />;
    case 'jewellery':
      return <AddJewelryForm />;
    default:
      return (
        <div className="text-red-500 font-medium">
          Please complete your seller profile to add products.
        </div>
      );
  }
}

export default function Page() {
  const profile = useSelector((state: RootState) => state.seller.profile);
  
  // Type guard to check if profile is SellerData with sellerType
  const sellerType = profile && 'sellerType' in profile ? profile.sellerType : undefined;

  return (
    <div>
      {renderAddProductForm(sellerType)}
    </div>
  );
}
