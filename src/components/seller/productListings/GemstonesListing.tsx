

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BulkUploadModal from './BulkUploadModal';
import { gemstoneService } from '@/services/gemstoneService';
import GemstoneProductCard, { GemstoneProduct } from './GemstoneProductCard';

// API response type
import { ApiResponse } from '@/services/api';
import { useSelector } from 'react-redux';

// Redux state interface
interface RootState {
  seller: {
    profile?: {
      id: string;
    };
  };
}

type GemstoneApiResponse = {
  data: GemstoneProduct[];
  meta?: {
    total?: number;
    [key: string]: unknown;
  };
};



const GemstonesListing = () => {
  const [gemstones, setGemstones] = useState<GemstoneProduct[]>([]);
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

  // TODO: Replace with actual sellerId from auth/user context

  useEffect(() => {
    setLoading(true);
    gemstoneService.getGemstonesBySeller({ sellerId, page, limit })
      .then((res: ApiResponse<GemstoneApiResponse>) => {
        const gems = res?.data?.data || [];
        setGemstones(gems);
        const totalCount = res?.data?.meta?.total || 0;
        setTotal(totalCount || 0);
        setError(null);
      })
      .catch(() => {
        setError('Failed to load gemstones');
        setGemstones([]);
      })
      .finally(() => setLoading(false));
  }, [page, limit, sellerId, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gemstones</h2>
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
          {/* <ViewToggle value={view} onChange={setView} /> */}
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          {gemstones.length === 0 ? (
            <div>No gemstones found.</div>
          ) : view === 'list' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full rounded-lg shadow border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <thead className="border-b" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                  <tr>
                    <th className="px-4 py-2 text-left">Image</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Color</th>
                    <th className="px-4 py-2 text-left">Shape</th>
                  </tr>
                </thead>
                <tbody>
                  {gemstones.map((gem) => (
                    <tr key={gem.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-2">
                        <Image
                          src={gem.image1 || 'https://media.istockphoto.com/id/1493089752/vector/box-and-package-icon-concept.jpg'}
                          alt={gem.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-2">{gem.name}</td>
                      <td className="px-4 py-2" style={{ color: 'var(--primary)' }}>${gem.price?.toLocaleString() || '-'}</td>
                      <td className="px-4 py-2">{gem.color}</td>
                      <td className="px-4 py-2">{gem.shape}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gemstones.map((gem) => (
                <GemstoneProductCard
                  key={gem.id}
                  product={gem}
                  onDelete={() => {
                    setGemstones((prev) => prev.filter((g) => g.id !== gem.id));
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

export default GemstonesListing;
