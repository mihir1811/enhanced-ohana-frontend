"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GenericProduct } from "@/components/products/GenericProductResults";

const allowedTypes = ["diamonds", "jewelry", "gemstones"];

export default function ProductTypeListingPage() {
  const params = useParams();
  const router = useRouter();
  const type = typeof params.type === 'string' ? params.type : Array.isArray(params.type) ? params.type[0] : '';
  const [products, setProducts] = useState<GenericProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!allowedTypes.includes(type)) {
      router.replace("/products");
      return;
    }
    // Simulate fetching products by type
    setLoading(true);
    setTimeout(() => {
      setProducts([
        { 
          id: "1", 
          name: `${type} Product 1`, 
          price: 1000, 
          images: [], 
          category: type,
          type: "standard"
        },
        { 
          id: "2", 
          name: `${type} Product 2`, 
          price: 2000, 
          images: [], 
          category: type,
          type: "premium"
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [type, router]);

  if (!allowedTypes.includes(type)) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Invalid product type.
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{type.charAt(0).toUpperCase() + type.slice(1)} Products</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product.id} className="border rounded p-4 bg-white dark:bg-[#18181b]">
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
