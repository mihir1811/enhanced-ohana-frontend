"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

const allowedTypes: Record<string, string[]> = {
  diamonds: ["diamonds", "naturalDiamond", "labGrown"],
  jewelry: ["jewelry", "jewelries"],
  gemstones: ["gemstones"],
};

export default function AddProductTypePage() {
  const router = useRouter();
  const params = useParams();
  const type = typeof params.type === 'string' ? params.type : Array.isArray(params.type) ? params.type[0] : '';
  const user = useAppSelector((state) => state.auth.user);
  const sellerType = user?.sellerData?.sellerType || "";

  useEffect(() => { 
    if (!allowedTypes[type] || !allowedTypes[type].includes(sellerType)) {
      router.replace("/seller/products");
    }
  }, [type, sellerType, router]);

  if (!allowedTypes[type] || !allowedTypes[type].includes(sellerType)) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        You are not allowed to add products of this type.
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
      {/* Add {type} form goes here */}
      <p>{type.charAt(0).toUpperCase() + type.slice(1)} product form will be implemented here.</p>
    </div>
  );
}
