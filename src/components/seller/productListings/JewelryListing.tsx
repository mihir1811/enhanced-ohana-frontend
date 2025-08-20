

import React, { useEffect, useState } from 'react';
import BulkUploadModal from './BulkUploadModal';
import { toast } from 'react-hot-toast';
import JewelryProductCard, { JewelryProduct } from './JewelryProductCard';
import { jewelryService } from '@/services/jewelryService';
import { useSelector } from 'react-redux';

const JewelryListing = () => {
  const [jewelry, setJewelry] = useState<JewelryProduct[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  const handleBulkFileSelect = (file: File) => {
    // TODO: Implement actual upload logic (API call or client-side parse)
    toast.success(`Selected file: ${file.name}`);
    setBulkModalOpen(false);
  };
  const sellerId = useSelector((state: any) => state.seller.profile?.id) || 'default-seller-id'; // Replace with actual sellerId from auth/user context

  useEffect(() => {
    setLoading(true);
    jewelryService.getJewelriesBySeller({ sellerId, page, limit })
      .then((res) => {
        const items: JewelryProduct[] = (res?.data?.data || []).map((j: any) => ({
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
  }, [sellerId, page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Jewelry</h2>
        <div className="flex gap-2 items-center relative">
          {/* Bulk Upload Button */}
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
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
            className={`relative p-2 rounded border flex items-center justify-center transition-colors duration-150 group
              ${view === 'list' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setView('list')}
            aria-label="List View"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap">
              List View
            </span>
          </button>
          <button
            className={`relative p-2 rounded border flex items-center justify-center transition-colors duration-150 group
              ${view === 'grid' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setView('grid')}
            aria-label="Grid View"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="14" y="4" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor" />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap">
              Grid View
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
              <table className="min-w-full bg-white border rounded-lg shadow">
                <thead>
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
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-2">
                        <img
                          src={item.image1 || "https://media.istockphoto.com/id/1493089752/vector/box-and-package-icon-concept.jpg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.skuCode}</td>
                      <td className="px-4 py-2">{item.category}</td>
                      <td className="px-4 py-2">{item.attributes?.style}</td>
                      <td className="px-4 py-2">{item.metalType}</td>
                      <td className="px-4 py-2">{item.metalPurity}</td>
                      <td className="px-4 py-2">${item.basePrice?.toLocaleString()}</td>
                      <td className="px-4 py-2">${item.totalPrice?.toLocaleString()}</td>
                      <td className="px-4 py-2">{item.stockNumber}</td>
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
