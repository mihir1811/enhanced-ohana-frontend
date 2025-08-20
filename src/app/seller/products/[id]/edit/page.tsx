"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { diamondService } from "@/services/diamondService";
import { gemstoneService } from "@/services/gemstoneService";
import { jewelryService } from "@/services/jewelryService";
import EditDiamondForm from "@/components/seller/editDiamondForms/EditDiamondForm";

// import EditJewelryForm from "@/components/seller/editJewelryForms/EditJewelryForm";
import { useAppSelector } from '@/store/hooks';
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import EditGemstoneForm from "@/components/seller/editDiamondForms/EditGemstoneForm";
import EditJewelryForm from "@/components/seller/editDiamondForms/EditJewelryForm";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const sellerType = useSelector(
    (state: RootState) => state.seller.profile?.sellerType
  );

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    let fetcher: Promise<any>;
    if (sellerType === 'gemstone') {
      fetcher = gemstoneService.getGemstoneById(id as string);
    } else if (sellerType === 'jewellery') {
      fetcher = jewelryService.getJewelryById(id as string);
    } else {
      fetcher = diamondService.getDiamondById(id as string);
    }
    fetcher
      .then((res) => setProduct(res?.data || null))
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
        return <EditDiamondForm initialData={product} />;
      case 'gemstone':
        return <EditGemstoneForm initialData={product} />;
      case 'jewellery':
        return <EditJewelryForm initialData={product} />;
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
