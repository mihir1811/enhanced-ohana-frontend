'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ChevronLeft, PlusCircle } from 'lucide-react';
import AddDiamondForm from '@/components/seller/addProductForms/AddDiamondForm';
import AddGemstoneForm from '@/components/seller/addProductForms/AddGemstoneForm';
import AddJewelryForm from '@/components/seller/addProductForms/AddJewelryForm';
import AddBullionForm from '@/components/seller/addProductForms/AddBullionForm';
import AddWatchForm from '@/components/seller/addProductForms/AddWatchForm';

export default function Page() {
  const profile = useSelector((state: RootState) => state.seller.profile);

  // Type guard to check if profile is SellerData with sellerType
  const sellerType = profile && 'sellerType' in profile ? profile.sellerType : undefined;

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  const renderForm = () => {
    // Jewellery sellers can add only jewelry products
    if (sellerType === 'jewellery') {
      return (
        <div className="space-y-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Add New Product</h1>
          </div>
          <AddJewelryForm />
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
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6">
      <div
        className="rounded-2xl border p-4 md:p-6"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="mb-5 flex items-start justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
              <PlusCircle className="h-5 w-5" />
              Add Product
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Create a new listing with complete product details.
            </p>
          </div>
          <Link
            href="/seller/products"
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition hover:bg-muted"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
        {renderForm()}
      </div>
    </div>
  );
}
