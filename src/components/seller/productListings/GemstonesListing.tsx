

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
import { Grid3X3, List } from 'lucide-react';
import ListingBulkActionBar from './ListingBulkActionBar';

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
  const [searchTerm, setSearchTerm] = useState('');
  const handleBulkFileSelect = () => {
    setBulkModalOpen(false);
    setRefreshKey((k) => k + 1);
  };
  const sellerId = useSelector((state: RootState) => state.seller.profile?.id) || 'default-seller-id';
  const filteredGemstones = gemstones.filter((g) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    const name = generateGemstoneName({
      process: g.process,
      color: g.color,
      shape: g.shape,
      gemsType: g.gemsType || g.gemType,
      subType: g.subType,
      carat: g.carat || g.caratWeight,
      quantity: g.quantity,
      clarity: g.clarity,
    }) || g.name || '';
    return `${name} ${g.gemsType || ''} ${g.subType || ''} ${g.color || ''} ${g.shape || ''}`.toLowerCase().includes(q);
  });
  const visibleIds = filteredGemstones.map((g) => Number(g.id)).filter((id) => Number.isFinite(id));
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

  const handleExportSelected = () => {
    const selected = filteredGemstones.filter((g) => selectedIds.has(Number(g.id)));
    if (selected.length === 0) {
      toast.error('Select at least one product to export');
      return;
    }
    const header = ['id', 'name', 'type', 'color', 'shape', 'price'];
    const rows = selected.map((g) => [
      String(g.id),
      `"${(g.name || '').replace(/"/g, '""')}"`,
      `"${(g.gemsType || g.gemType || '').replace(/"/g, '""')}"`,
      `"${(g.color || '').replace(/"/g, '""')}"`,
      `"${(g.shape || '').replace(/"/g, '""')}"`,
      String(g.totalPrice ?? g.price ?? ''),
    ]);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `gemstones-selected-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  useEffect(() => {
    const openBulkUpload = () => setBulkModalOpen(true);
    window.addEventListener('seller-products:bulk-upload', openBulkUpload);
    return () => window.removeEventListener('seller-products:bulk-upload', openBulkUpload);
  }, []);

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
      <BulkUploadModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onFileSelect={handleBulkFileSelect}
        productType="gemstone"
      />
      <div className="mb-4">
        <div
          className="flex items-center rounded-md border px-3 py-2"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, SKU, color..."
            className="w-full bg-transparent text-sm outline-none"
          />
          <span className="mr-3 text-xs text-muted-foreground">{filteredGemstones.length} Products</span>
          <button
            className="mr-1 rounded border p-1.5"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: view === 'grid' ? 'var(--primary)' : 'var(--card)',
              color: view === 'grid' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
            }}
            onClick={() => setView('grid')}
            type="button"
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            className="rounded border p-1.5"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: view === 'list' ? 'var(--primary)' : 'var(--card)',
              color: view === 'list' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
            }}
            onClick={() => setView('list')}
            type="button"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          {filteredGemstones.length === 0 ? (
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
                  {filteredGemstones.map((gem) => (
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
              {filteredGemstones.map((gem, idx) => (
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
          {selectedCount > 0 && (
            <div
              className="sticky bottom-4 z-20 mt-4 flex w-fit items-center gap-3 rounded-xl border px-3 py-2 text-sm shadow-sm"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
            >
              <span className="font-medium">{selectedCount} selected</span>
              <button
                type="button"
                onClick={() => setBulkDeleteOpen(true)}
                className="rounded-md px-2 py-1 text-sm"
                style={{ color: 'var(--destructive)' }}
              >
                Delete
              </button>
            </div>
          )}
          <ListingBulkActionBar
            selectedCount={selectedCount}
            onDelete={() => setBulkDeleteOpen(true)}
            onExport={handleExportSelected}
            onClear={() => setSelectedIds(new Set())}
            onSelectAll={() => setSelectedIds(new Set(visibleIds))}
            disableSelectAll={visibleIds.length === 0 || allVisibleSelected}
          />
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
