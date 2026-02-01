"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { diamondService } from "@/services/diamondService";
import { gemstoneService } from "@/services/gemstoneService";
import { jewelryService } from "@/services/jewelryService";
import { bullionService } from "@/services/bullion.service";
import EditDiamondForm from "@/components/seller/editDiamondForms/EditDiamondForm";

// import EditJewelryForm from "@/components/seller/editJewelryForms/EditJewelryForm";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import EditGemstoneForm from "@/components/seller/editDiamondForms/EditGemstoneForm";
import EditJewelryForm from "@/components/seller/editDiamondForms/EditJewelryForm";
import EditBullionForm from "@/components/seller/editDiamondForms/EditBullionForm";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const profile = useSelector((state: RootState) => state.seller.profile);
  // Type guard to check if profile is SellerData with sellerType
  const sellerType = profile && 'sellerType' in profile ? profile.sellerType : undefined;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    let fetcher: Promise<unknown>;
    if (sellerType === 'gemstone') {
      fetcher = gemstoneService.getGemstoneById(id as string);
    } else if (sellerType === 'jewellery') {
      fetcher = jewelryService.getJewelryById(id as string);
    } else if (sellerType === 'bullion') {
      fetcher = bullionService.getBullionById(Number(id));
    } else {
      fetcher = diamondService.getDiamondById(id as string);
    }
    fetcher
      .then((res) => setProduct((res as { data?: unknown })?.data || null))
      .catch((err) => setError(err.message || "Failed to fetch product"))
      .finally(() => setLoading(false));
  }, [id, sellerType]);

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (error) return <div className="py-10 text-center text-red-600">{error}</div>;
  if (!product) return <div className="py-10 text-center">Product not found.</div>;

  function renderEditForm() {
    switch (sellerType) {
      case 'naturalDiamond':
      case 'labGrownDiamond':
        return <EditDiamondForm initialData={product as Parameters<typeof EditDiamondForm>[0]['initialData']} />;
      case 'gemstone':
        return <EditGemstoneForm initialData={product as Parameters<typeof EditGemstoneForm>[0]['initialData']} />;
      case 'jewellery':
        return <EditJewelryForm initialData={product as Parameters<typeof EditJewelryForm>[0]['initialData']} />;
      case 'bullion':
        return <EditBullionForm initialData={product as any} />;
      default:
        return <div className="text-red-500 font-medium">Please complete your seller profile to edit products.</div>;
    }
  }

  return (
    <div className="w-full mx-auto py-2">
      {/* <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Product</h1> */}
      {renderEditForm()}
    </div>
  );
}
