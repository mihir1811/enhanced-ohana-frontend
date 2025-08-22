import React, { useEffect, useState, useRef } from 'react';
import BulkUploadModal from './BulkUploadModal';
import { toast } from 'react-hot-toast';
import { diamondService } from '@/services/diamondService';
import DiamondProductCard, { DiamondProduct } from './DiamondProductCard';

const DiamondsListing = () => {
  const [diamonds, setDiamonds] = useState<DiamondProduct[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleBulkFileSelect = (file: File) => {
    // Called after successful upload in modal
    setBulkModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    setLoading(true);
    diamondService.getDiamonds({ page, limit })
      .then((res) => {
        const diamondsArr = (res?.data?.data || []).map((d: any) => ({
          ...d,
          image1: d.image1,
          image2: d.image2,
          image3: d.image3,
          image4: d.image4,
          image5: d.image5,
          image6: d.image6,
          stockNumber: d.stockNumber ?? d.stock_number ?? 0,
          color: d.color,
          clarity: d.clarity,
          cut: d.cut ?? '',
          shape: d.shape,
          isDeleted: d.isDeleted ?? false,
          updatedAt: d.updatedAt ?? d.updated_at ?? '',
          sellerSKU: d.sellerSKU ?? d.seller_sku ?? '',
          isOnAuction: d.isOnAuction,
          isSold: d.isSold,
        }));
        const totalCount = res?.data?.meta?.total || 0;
        setDiamonds(diamondsArr);
        setTotal(totalCount);
        setError(null);
      })
      .catch(() => {
        setError('Failed to load diamonds');
        setDiamonds([]);
      })
      .finally(() => setLoading(false));
  }, [page, limit, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Diamonds</h2>
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
            {/* List Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            {/* Tooltip */}
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap">
              List View
            </span>
          </button>
          {/* Grid View Icon Button */}
          <button
            className={`relative p-2 rounded border flex items-center justify-center transition-colors duration-150 group
              ${view === 'grid' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setView('grid')}
            aria-label="Grid View"
            type="button"
          >
            {/* Grid Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="14" y="4" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor" />
            </svg>
            {/* Tooltip */}
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
          {diamonds.length === 0 ? (
            <div>No diamonds found.</div>
          ) : view === 'list' ? (
            <div className="overflow-x-auto">
              {/* Table view implementation goes here */}
              <table className="min-w-full bg-white border rounded-lg shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Image</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Color</th>
                    <th className="px-4 py-2 text-left">Clarity</th>
                    <th className="px-4 py-2 text-left">Cut</th>
                    <th className="px-4 py-2 text-left">Shape</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {diamonds.map((diamond) => (
                    <tr key={diamond.id} className="border-t">
                      <td className="px-4 py-2">
                        <img
                          src={diamond.image1 || "https://media.istockphoto.com/id/1493089752/vector/box-and-package-icon-concept.jpg"}
                          alt={diamond.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-2">{diamond.name}</td>
                      <td className="px-4 py-2">${Number(diamond.price).toLocaleString()}</td>
                      <td className="px-4 py-2">{diamond.color}</td>
                      <td className="px-4 py-2">{diamond.clarity}</td>
                      <td className="px-4 py-2">{diamond.cut}</td>
                      <td className="px-4 py-2">{diamond.shape}</td>
                      <td className="px-4 py-2">{diamond.stockNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {diamonds.map((diamond) => (
                <DiamondProductCard
                  key={diamond.id}
                  product={diamond}
                  onDelete={() => {
                    setDiamonds((prev) => prev.filter((d) => d.id !== diamond.id));
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

export default DiamondsListing;
