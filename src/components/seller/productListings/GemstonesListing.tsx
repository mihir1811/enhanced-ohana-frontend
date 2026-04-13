

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import BulkUploadModal from './BulkUploadModal';
import { gemstoneService } from '@/services/gemstoneService';
import GemstoneProductCard, { GemstoneProduct } from './GemstoneProductCard';
import { generateGemstoneName } from '@/utils/gemstoneUtils';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from 'react-hot-toast';
import { getCookie } from '@/lib/cookie-utils';

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
  const shouldReduceMotion = useReducedMotion();
  const [gemstones, setGemstones] = useState<GemstoneProduct[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const handleBulkFileSelect = () => {
    setBulkModalOpen(false);
    setRefreshKey((k) => k + 1);
  };
  const sellerId = useSelector((state: RootState) => state.seller.profile?.id) || 'default-seller-id';
  const visibleIds = gemstones.map((g) => Number(g.id)).filter((id) => Number.isFinite(id));
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  const selectedCount = selectedIds.size;

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  useEffect(() => {
    setLoading(true);
    gemstoneService.getSingleGemstonesBySeller({ sellerId, page, limit })
      .then((res: ApiResponse<GemstoneApiResponse>) => {
        const gems = res?.data?.data || [];
        setGemstones(gems);
        const totalCount = res?.data?.meta?.total || 0;
        setTotal(totalCount || 0);
        setError(null);
        setSelectedIds(new Set());
      })
      .catch(() => {
        setError('Failed to load gemstones');
        setGemstones([]);
      })
      .finally(() => setLoading(false));
  }, [page, limit, sellerId, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const buttonMotion = !shouldReduceMotion ? { whileHover: { y: -1, scale: 1.01 }, whileTap: { scale: 0.99 } } : {};
  const sectionMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <motion.div {...sectionMotion}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Single Gemstones</h2>
        <div className="flex gap-2 items-center relative">
          {/* Bulk Upload Button */}
          <motion.button
            className="cursor-pointer px-4 py-2 rounded font-semibold transition"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            onClick={() => setBulkModalOpen(true)}
            type="button"
            {...buttonMotion}
          >
            Bulk Upload
          </motion.button>
          <motion.button
            type="button"
            disabled={visibleIds.length === 0 || allVisibleSelected}
            onClick={() => setSelectedIds(new Set(visibleIds))}
            className="px-4 py-2 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
            {...buttonMotion}
          >
            Select All
          </motion.button>
          <motion.button
            type="button"
            disabled={selectedCount === 0}
            onClick={() => setSelectedIds(new Set())}
            className="px-4 py-2 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
            {...buttonMotion}
          >
            Deselect All
          </motion.button>
          <motion.button
            type="button"
            disabled={selectedCount === 0}
            onClick={() => setBulkDeleteOpen(true)}
            className="px-4 py-2 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--destructive)', color: 'white' }}
            {...buttonMotion}
          >
            Delete Selected ({selectedCount})
          </motion.button>
          <BulkUploadModal
            open={bulkModalOpen}
            onClose={() => setBulkModalOpen(false)}
            onFileSelect={handleBulkFileSelect}
            productType="gemstone"
          />
          <motion.button
            className={"cursor-pointer relative p-2 rounded border flex items-center justify-center transition-colors duration-150 group"}
            style={{
              backgroundColor: view === 'grid' ? 'var(--primary)' : 'var(--card)',
              color: view === 'grid' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              borderColor: view === 'grid' ? 'var(--primary)' : 'var(--border)'
            }}
            onClick={() => setView('grid')}
            aria-label="Grid View"
            type="button"
            {...buttonMotion}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap" style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', border: '1px solid var(--border)' }}>
              Grid View
            </span>
          </motion.button>
          <motion.button
            className={"cursor-pointer relative p-2 rounded border flex items-center justify-center transition-colors duration-150 group"}
            style={{
              backgroundColor: view === 'list' ? 'var(--primary)' : 'var(--card)',
              color: view === 'list' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              borderColor: view === 'list' ? 'var(--primary)' : 'var(--border)'
            }}
            onClick={() => setView('list')}
            aria-label="List View"
            type="button"
            {...buttonMotion}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap" style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', border: '1px solid var(--border)' }}>
              List View
            </span>
          </motion.button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          {gemstones.length === 0 ? (
            <div className="rounded-xl border p-12 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="text-lg font-medium mb-2" style={{ color: 'var(--foreground)' }}>No single gemstones yet</p>
              <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>Add your first gemstone with Bulk Upload to get started.</p>
              <motion.button
                type="button"
                className="px-4 py-2 rounded font-medium transition"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                onClick={() => setBulkModalOpen(true)}
                {...buttonMotion}
              >
                Bulk Upload
              </motion.button>
            </div>
          ) : view === 'list' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full rounded-lg shadow border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <thead className="border-b" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                  <tr>
                    <th className="px-4 py-2 text-left">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAllVisible}
                        aria-label="Select all gemstones"
                      />
                    </th>
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
                        <input
                          type="checkbox"
                          checked={selectedIds.has(Number(gem.id))}
                          onChange={() => toggleSelectOne(Number(gem.id))}
                          aria-label={`Select ${gem.name || gem.gemsType || 'gemstone'}`}
                        />
                      </td>
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
              {gemstones.map((gem, idx) => (
                <motion.div
                  key={gem.id}
                  className="relative"
                  initial={!shouldReduceMotion ? { opacity: 0, y: 10 } : undefined}
                  animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
                  transition={!shouldReduceMotion ? { duration: 0.25, delay: Math.min(idx * 0.03, 0.18) } : undefined}
                >
                  <label className="absolute z-10 top-3 right-14 h-6 w-6 rounded bg-white/90 border border-gray-300 flex items-center justify-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(Number(gem.id))}
                      onChange={() => toggleSelectOne(Number(gem.id))}
                      aria-label={`Select ${gem.name || gem.gemsType || 'gemstone'}`}
                    />
                  </label>
                  <GemstoneProductCard
                    product={gem}
                    onDelete={() => {
                      setGemstones((prev) => prev.filter((g) => g.id !== gem.id));
                      setTotal((prev) => Math.max(0, prev - 1));
                      setSelectedIds((prev) => {
                        const next = new Set(prev);
                        next.delete(Number(gem.id));
                        return next;
                      });
                    }}
                    onUpdateProduct={(updatedProduct) => {
                      setGemstones((prev) => prev.map((g) =>
                        g.id === updatedProduct.id ? updatedProduct : g
                      ));
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
          {/* Pagination Controls */}
          <div className="flex gap-2 mt-4">
            <motion.button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
              {...buttonMotion}
            >
              Prev
            </motion.button>
            <span>Page {page} of {totalPages}</span>
            <motion.button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
              {...buttonMotion}
            >
              Next
            </motion.button>
          </div>
        </>
      )}
      <ConfirmModal
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title="Delete selected gemstones?"
        description={`This will permanently delete ${selectedCount} selected gemstone(s).`}
        onYes={async () => {
          try {
            const token = getCookie('token');
            if (!token) throw new Error('User not authenticated');
            const ids = Array.from(selectedIds)
              .map((id) => Number(id))
              .filter((id) => Number.isInteger(id) && id > 0);
            if (ids.length === 0) throw new Error('Please select at least one gemstone');
            await gemstoneService.bulkDeleteGemstones(ids, token);
            setGemstones((prev) => prev.filter((g) => !selectedIds.has(Number(g.id))));
            setTotal((prev) => Math.max(0, prev - ids.length));
            setSelectedIds(new Set());
            setBulkDeleteOpen(false);
            toast.success('Selected gemstones deleted successfully');
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to delete selected gemstones';
            toast.error(message);
          }
        }}
        onNo={() => setBulkDeleteOpen(false)}
      />
    </motion.div>
  );
};

export default GemstonesListing;
