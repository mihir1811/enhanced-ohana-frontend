

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BulkUploadModal from './BulkUploadModal';
import { gemstoneService } from '@/services/gemstoneService';
import GemstoneProductCard, { GemstoneProduct } from './GemstoneProductCard';
import { generateGemstoneName } from '@/utils/gemstoneUtils';

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
  const sellerId = useSelector((state: RootState) => state.seller.profile?.id) || 'default-seller-id';

  useEffect(() => {
    setLoading(true);
    gemstoneService.getSingleGemstonesBySeller({ sellerId, page, limit })
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
        <h2 className="text-xl font-bold">Single Gemstones</h2>
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
            productType="gemstone"
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
                          alt={generateGemstoneName({
                            process: gem.process,
                            color: gem.color,
                            shape: gem.shape,
                            gemsType: gem.gemsType || gem.gemType,
                            subType: gem.subType,
                            carat: gem.carat || gem.caratWeight,
                            quantity: gem.quantity,
                            clarity: gem.clarity
                          }) || gem.name || gem.gemsType || gem.gemType}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-2 capitalize">
                        {generateGemstoneName({
                          process: gem.process,
                          color: gem.color,
                          shape: gem.shape,
                          gemsType: gem.gemsType || gem.gemType,
                          subType: gem.subType,
                          carat: gem.carat || gem.caratWeight,
                          quantity: gem.quantity,
                          clarity: gem.clarity
                        }) || gem.name || 'Unnamed Gemstone'}
                      </td>
                      <td className="px-4 py-2" style={{ color: 'var(--primary)' }}>${(gem.totalPrice ? Number(gem.totalPrice) : gem.price)?.toLocaleString() || '-'}</td>
                      <td className="px-4 py-2">{gem.color}</td>
                      <td className="px-4 py-2">{gem.shape}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {gemstones.map((gem) => (
                <GemstoneProductCard
                  key={gem.id}
                  product={gem}
                  onDelete={() => {
                    setGemstones((prev) => prev.filter((g) => g.id !== gem.id));
                    setTotal((prev) => Math.max(0, prev - 1));
                  }}
                  onUpdateProduct={(updatedProduct) => {
                    setGemstones((prev) => prev.map((g) =>
                      g.id === updatedProduct.id ? updatedProduct : g
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

export default GemstonesListing;
