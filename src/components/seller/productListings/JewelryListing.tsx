

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BulkUploadModal from './BulkUploadModal';
// import ViewToggle from '@/components/seller/ViewToggle';
import JewelryProductCard, { JewelryProduct } from './JewelryProductCard';
import { jewelryService } from '@/services/jewelryService';
import { useSelector } from 'react-redux';

// Redux state interface
interface RootState {
  seller: {
    profile?: {
      id: string;
    };
  };
}

// API response interface for jewelry data
interface JewelryApiData {
  id: string | number;
  name: string;
  skuCode: string;
  category: string;
  subcategory: string;
  collection: string;
  gender: string;
  occasion: string;
  metalType: string;
  metalPurity: string;
  metalWeight: number;
  basePrice: number;
  makingCharge: number;
  tax: number;
  totalPrice: number;
  attributes: {
    style?: string;
    [key: string]: unknown;
  };
  description: string;
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  videoURL?: string;
  sellerId: string;
  isOnAuction: boolean;
  isSold: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  stones: unknown[];
  auctionStartTime?: string;
  auctionEndTime?: string;
  auctionId?: string;
}

const JewelryListing = () => {
  const [jewelry, setJewelry] = useState<JewelryProduct[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleBulkFileSelect = () => {
    setBulkModalOpen(false);
    setRefreshKey((k) => k + 1);
  };
  const sellerId = useSelector((state: RootState) => state.seller.profile?.id) || 'default-seller-id'; // Replace with actual sellerId from auth/user context

  useEffect(() => {
    setLoading(true);
    jewelryService.getJewelriesBySeller({ sellerId, page, limit })
      .then((res) => {
        const items: JewelryProduct[] = (res?.data?.data || []).map((j: JewelryApiData) => ({
          id: String(j.id),
          name: j.name,
          skuCode: j.skuCode,
          category: j.category,
          subcategory: j.subcategory,
          collection: j.collection,
          gender: j.gender,
          occasion: j.occasion,
          metalType: j.metalType,
          metalPurity: j.metalPurity,
          metalWeight: j.metalWeight,
          basePrice: j.basePrice,
          makingCharge: j.makingCharge,
          tax: j.tax,
          totalPrice: j.totalPrice,
          attributes: j.attributes,
          description: j.description,
          image1: j.image1,
          image2: j.image2,
          image3: j.image3,
          image4: j.image4,
          image5: j.image5,
          image6: j.image6,
          videoURL: j.videoURL,
          sellerId: j.sellerId,
          isOnAuction: j.isOnAuction,
          isSold: j.isSold,
          createdAt: j.createdAt,
          updatedAt: j.updatedAt,
          isDeleted: j.isDeleted,
          stones: j.stones,
          auctionStartTime: j.auctionStartTime,
          auctionEndTime: j.auctionEndTime,
          auctionId: j.auctionId,
        }));
        setJewelry(items);
        setTotal(res?.data?.meta?.total || items.length);
        setError(null);
      })
      .catch(() => {
        setError('Failed to load jewelry');
        setJewelry([]);
      })
      .finally(() => setLoading(false));
  }, [sellerId, page, limit, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Jewelry</h2>
        <div className="flex gap-2 items-center relative">
          {/* Bulk Upload Button */}
          <button
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
            onClick={() => setBulkModalOpen(true)}
            type="button"
          >
            Bulk Upload
          </button>
          <BulkUploadModal
            open={bulkModalOpen}
            onClose={() => setBulkModalOpen(false)}
            onFileSelect={handleBulkFileSelect}
          />
          <button
            className={"cursor-pointer relative p-2 rounded border flex items-center justify-center transition-colors duration-150 group"}
            style={{
              backgroundColor: view === 'grid' ? 'var(--primary)' : 'var(--card)',
              color: view === 'grid' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              borderColor: view === 'grid' ? 'var(--primary)' : 'var(--border)'
            }}
            onClick={() => setView('grid')}
            aria-label="Grid View"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap" style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', border: '1px solid var(--border)' }}>
              Grid View
            </span>
          </button>
          <button
            className={"cursor-pointer relative p-2 rounded border flex items-center justify-center transition-colors duration-150 group"}
            style={{
              backgroundColor: view === 'list' ? 'var(--primary)' : 'var(--card)',
              color: view === 'list' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              borderColor: view === 'list' ? 'var(--primary)' : 'var(--border)'
            }}
            onClick={() => setView('list')}
            aria-label="List View"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap" style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', border: '1px solid var(--border)' }}>
              List View
            </span>
          </button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          {jewelry.length === 0 ? (
            <div>No jewelry found.</div>
          ) : view === 'list' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full rounded-lg shadow border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <thead className="border-b" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                  <tr>
                    <th className="px-4 py-2 text-left">Image</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">SKU</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Style</th>
                    <th className="px-4 py-2 text-left">Metal</th>
                    <th className="px-4 py-2 text-left">Purity</th>
                    <th className="px-4 py-2 text-left">Base Price</th>
                    <th className="px-4 py-2 text-left">Total Price</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {jewelry.map((item) => (
                    <tr key={item.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-2">
                        <Image
                          src={item.image1 || "https://media.istockphoto.com/id/1493089752/vector/box-and-package-icon-concept.jpg"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.skuCode}</td>
                      <td className="px-4 py-2">{item.category}</td>
                      <td className="px-4 py-2">{item.attributes?.style}</td>
                      <td className="px-4 py-2">{item.metalType}</td>
                      <td className="px-4 py-2">{item.metalPurity}</td>
                      <td className="px-4 py-2" style={{ color: 'var(--primary)' }}>${(item.basePrice ?? 0).toLocaleString()}</td>
                      <td className="px-4 py-2" style={{ color: 'var(--primary)' }}>${(item.totalPrice ?? 0).toLocaleString()}</td>
                      <td className="px-4 py-2">{item.stockNumber ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {jewelry.map((item) => (
                <JewelryProductCard
                  key={item.id}
                  product={item}
                  onDelete={() => {
                    setJewelry((prev) => prev.filter((j) => j.id !== item.id));
                    setTotal((prev) => Math.max(0, prev - 1));
                  }}
                  onUpdateProduct={(updatedProduct) => {
                    setJewelry((prev) => prev.map((j) => 
                      j.id === updatedProduct.id ? updatedProduct : j
                    ));
                  }}
                />
              ))}
            </div>
          )}
          {/* Pagination Controls */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default JewelryListing;
