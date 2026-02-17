'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

// Import Services
import { watchService } from '@/services/watch.service';
import { bullionService } from '@/services/bullion.service';
import { jewelryService } from '@/services/jewelryService';
import { diamondService } from '@/services/diamondService';
import { gemstoneService } from '@/services/gemstoneService';

// Import Forms
import EditWatchForm from '@/components/seller/editDiamondForms/EditWatchForm';
import EditBullionForm from '@/components/seller/editDiamondForms/EditBullionForm';
import EditDiamondForm from '@/components/seller/editDiamondForms/EditDiamondForm';
import EditGemstoneForm from '@/components/seller/editDiamondForms/EditGemstoneForm';
import EditJewelryForm from '@/components/seller/editDiamondForms/EditJewelryForm';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = useMemo(() => Number(params?.id), [params]);
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  const [productType, setProductType] = useState<string | null>(null);

  const profile = useSelector((state: RootState) => state.seller.profile);
  const sellerType = profile && 'sellerType' in profile ? profile.sellerType : undefined;

  useEffect(() => {
    if (!id || Number.isNaN(id)) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Use sellerType to determine which service to call
        switch (sellerType) {
          case 'bullion':
            const bullionRes = await bullionService.getBullionById(id);
            setProductData(bullionRes.data || bullionRes);
            setProductType('bullion');
            break;
          case 'watch':
            const watchRes = await watchService.getWatchById(id);
            setProductData(watchRes.data || watchRes);
            setProductType('watch');
            break;
          case 'naturalDiamond':
          case 'labGrownDiamond':
            const diamondRes = await diamondService.getDiamondById(id);
            setProductData(diamondRes.data || diamondRes);
            setProductType('diamond');
            break;
          case 'gemstone':
            const gemstoneRes = await gemstoneService.getGemstoneById(id);
            setProductData(gemstoneRes.data || gemstoneRes);
            setProductType('gemstone');
            break;
          case 'jewellery':
            // For jewellery sellers, it could be jewelry or watch
            try {
              const jewelryRes = await jewelryService.getJewelryById(String(id));
              if (jewelryRes.success) {
                setProductData(jewelryRes.data);
                setProductType('jewellery');
                break;
              }
            } catch (err) {
              console.log('Not found in jewelry, trying watch');
            }
            
            try {
              const watchRes = await watchService.getWatchById(id);
              if (watchRes.data || watchRes) {
                setProductData(watchRes.data || watchRes);
                setProductType('watch');
              }
            } catch (err) {
              console.error('Failed to find product in jewelry or watch services');
              throw new Error('Product not found');
            }
            break;
          default:
            toast.error('Unknown seller type');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, sellerType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <p className="text-gray-600 mt-2">The product you are trying to edit does not exist or you don't have permission to edit it.</p>
      </div>
    );
  }

  // Render the appropriate form based on productType
  switch (productType) {
    case 'bullion':
      return <EditBullionForm initialData={productData} />;
    case 'watch':
      return <EditWatchForm initialData={productData} />;
    case 'diamond':
      return <EditDiamondForm initialData={productData} />;
    case 'gemstone':
      return <EditGemstoneForm initialData={productData} />;
    case 'jewellery':
      return <EditJewelryForm initialData={productData} />;
    default:
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">Unsupported product type</h2>
          <p className="text-gray-600 mt-2">We don't have a form for this type of product yet.</p>
        </div>
      );
  }
}
