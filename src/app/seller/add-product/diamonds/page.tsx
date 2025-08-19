"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export default function AddDiamondsPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const sellerType = user?.sellerData?.sellerType || "";

//   useEffect(() => {
//     if (!['naturalDiamond', 'labGrown', 'diamonds'].includes(sellerType)) {
//       router.replace("/seller/products");
//     }
//   }, [sellerType, router]);

//   if (!['naturalDiamond', 'labGrown', 'diamonds'].includes(sellerType)) {
//     return (
//       <div className="p-8 text-center text-red-600 font-semibold">
//         You are not allowed to add diamonds.
//       </div>
//     );
//   }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add Diamonds</h1>
      {/* Add Diamonds form goes here */}
      <p>Diamond product form will be implemented here.</p>
    </div>
  );
}
