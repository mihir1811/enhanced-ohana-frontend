

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import BulkUploadModal from './BulkUploadModal';
// import ViewToggle from '@/components/seller/ViewToggle';
import JewelryProductCard, { JewelryProduct } from './JewelryProductCard';
import { jewelryService } from '@/services/jewelryService';
import { useSelector } from 'react-redux';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from 'react-hot-toast';
import { getCookie } from '@/lib/cookie-utils';

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
  productTitle?: string;
  skuCode: string;
  category: string;
  subcategory: string;
  collection: string;
  collectionName?: string;
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
  const shouldReduceMotion = useReducedMotion();
  const categoryTabs = ['All', 'Rings', 'Necklaces', 'Chains', 'Earrings', 'Bracelets', 'Watches', 'Accessories'] as const;
  const [jewelry, setJewelry] = useState<JewelryProduct[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [activeCategory, setActiveCategory] = useState<(typeof categoryTabs)[number]>('All');
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
  const sellerId = useSelector((state: RootState) => state.seller.profile?.id) || 'default-seller-id'; // Replace with actual sellerId from auth/user context
  const visibleIds = jewelry.map((j) => Number(j.id)).filter((id) => Number.isFinite(id));
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
    jewelryService.getJewelriesBySeller({
      sellerId,
      page,
      limit,
      category: activeCategory === 'All' ? undefined : activeCategory,
    })
      .then((res) => {
        const items: JewelryProduct[] = (res?.data?.data || []).map((j: JewelryApiData) => ({
          id: String(j.id),
          name: j.name || j.productTitle || '-',
          skuCode: j.skuCode,
          category: j.category,
          subcategory: j.subcategory,
          collection: j.collection || j.collectionName,
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
        setSelectedIds(new Set());
      })
      .catch(() => {
        setError('Failed to load jewelry');
        setJewelry([]);
      })
      .finally(() => setLoading(false));
  }, [sellerId, page, limit, refreshKey, activeCategory]);

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
        <h2 className="text-xl font-bold">Jewelry</h2>
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
      <div className="mb-4 overflow-x-auto">
        <div className="inline-flex gap-2 min-w-max">
          {categoryTabs.map((category) => {
            const active = activeCategory === category;
            return (
              <motion.button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-full border text-sm font-medium transition"
                style={{
                  backgroundColor: active ? 'var(--primary)' : 'var(--card)',
                  color: active ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  borderColor: active ? 'var(--primary)' : 'var(--border)',
                }}
                {...buttonMotion}
              >
                {category}
              </motion.button>
            );
          })}
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          {jewelry.length === 0 ? (
            <div className="rounded-xl border p-12 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="text-lg font-medium mb-2" style={{ color: 'var(--foreground)' }}>No jewelry items yet</p>
              <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>Add your first piece from the Add Product page to get started.</p>
              <motion.button
                type="button"
                className="px-4 py-2 rounded font-medium transition"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                onClick={() => typeof window !== 'undefined' && (window.location.href = '/seller/add-product')}
                {...buttonMotion}
              >
                Add Product
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
                        aria-label="Select all jewelry"
                      />
                    </th>
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
                        <input
                          type="checkbox"
                          checked={selectedIds.has(Number(item.id))}
                          onChange={() => toggleSelectOne(Number(item.id))}
                          aria-label={`Select ${item.name}`}
                        />
                      </td>
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
              {jewelry.map((item, idx) => (
                <motion.div
                  key={item.id}
                  className="relative"
                  initial={!shouldReduceMotion ? { opacity: 0, y: 10 } : undefined}
                  animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
                  transition={!shouldReduceMotion ? { duration: 0.25, delay: Math.min(idx * 0.03, 0.18) } : undefined}
                >
                  <label className="absolute z-10 top-3 right-14 h-6 w-6 rounded bg-white/90 border border-gray-300 flex items-center justify-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(Number(item.id))}
                      onChange={() => toggleSelectOne(Number(item.id))}
                      aria-label={`Select ${item.name}`}
                    />
                  </label>
                  <JewelryProductCard
                    product={item}
                    onDelete={() => {
                      setJewelry((prev) => prev.filter((j) => j.id !== item.id));
                      setTotal((prev) => Math.max(0, prev - 1));
                      setSelectedIds((prev) => {
                        const next = new Set(prev);
                        next.delete(Number(item.id));
                        return next;
                      });
                    }}
                    onUpdateProduct={(updatedProduct) => {
                      setJewelry((prev) => prev.map((j) =>
                        j.id === updatedProduct.id ? updatedProduct : j
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
        title="Delete selected jewelry?"
        description={`This will permanently delete ${selectedCount} selected jewelry product(s).`}
        onYes={async () => {
          try {
            const token = getCookie('token');
            if (!token) throw new Error('User not authenticated');
            const ids = Array.from(selectedIds)
              .map((id) => Number(id))
              .filter((id) => Number.isInteger(id) && id > 0);
            if (ids.length === 0) throw new Error('Please select at least one jewelry item');
            await jewelryService.bulkDeleteJewelry(ids, token);
            setJewelry((prev) => prev.filter((j) => !selectedIds.has(Number(j.id))));
            setTotal((prev) => Math.max(0, prev - ids.length));
            setSelectedIds(new Set());
            setBulkDeleteOpen(false);
            toast.success('Selected jewelry deleted successfully');
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to delete selected jewelry';
            toast.error(message);
          }
        }}
        onNo={() => setBulkDeleteOpen(false)}
      />
    </motion.div>
  );
};

export default JewelryListing;
