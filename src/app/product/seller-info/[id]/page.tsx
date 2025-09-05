"use client";

import React from "react";
import { useParams } from "next/navigation";
import NavigationUser from "@/components/Navigation/NavigationUser";
import Footer from "@/components/Footer";
import { SECTION_WIDTH } from "@/lib/constants";
import SellerProfilePage from "@/components/seller/SellerProfilePage";

export default function SellerInfoPage() {
  const params = useParams();
  const sellerId = params?.id as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationUser />
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        <SellerProfilePage sellerId={sellerId} />
      </div>
      <Footer />
    </div>
  );
}
