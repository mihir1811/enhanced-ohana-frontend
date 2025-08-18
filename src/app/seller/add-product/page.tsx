'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

// Placeholder forms for each seller type
function DiamondAddProductForm() {
  return <div>Diamond Add Product Form</div>;
}
function GemstoneAddProductForm() {
  return <div>Gemstone Add Product Form</div>;
}
function JewelryAddProductForm() {
  return <div>Jewelry Add Product Form</div>;
}

// Helper function to get correct form
function renderAddProductForm(sellerType?: string) {
  switch (sellerType) {
    case 'naturalDiamond':
      return <DiamondAddProductForm />;
    case 'labGrownDiamond':
      return <DiamondAddProductForm />;
    case 'gemstone':
      return <GemstoneAddProductForm />;
    case 'jewellery':
      return <JewelryAddProductForm />;
    default:
      return (
        <div className="text-red-500 font-medium">
          Please complete your seller profile to add products.
        </div>
      );
  }
}

export default function Page() {
  const sellerType = useSelector(
    (state: RootState) => state.seller.profile?.sellerType
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      {renderAddProductForm(sellerType)}
    </div>
  );
}
