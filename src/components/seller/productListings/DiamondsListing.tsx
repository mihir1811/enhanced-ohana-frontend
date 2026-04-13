import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import BulkUploadModal from './BulkUploadModal';
import { diamondService } from '@/services/diamondService';
import DiamondProductCard, { DiamondProduct } from './DiamondProductCard';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from 'react-hot-toast';
import { getCookie } from '@/lib/cookie-utils';
import { SellerTableColumnPicker } from './SellerTableColumnPicker';
import {
  DEFAULT_NATURAL_DIAMOND_VISIBILITY,
  NATURAL_DIAMOND_COLUMNS,
  type NaturalDiamondColumnId,
  loadNaturalDiamondColumnVisibility,
  saveNaturalDiamondColumnVisibility,
} from './sellerTableColumnPreferences';
import {
  SellerListingToolbarGroup,
  SellerProductListingHeader,
} from './SellerProductListingHeader';
import ListingBulkActionBar from './ListingBulkActionBar';

const DiamondsListing = ({ sellerId, stoneType }: { sellerId?: string, stoneType?: string }) => {
  const shouldReduceMotion = useReducedMotion();
  const fallbackImage =
    'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=2048x2048&w=is&k=20&c=dFWJz1EFJt7Tq2lA-hgTpSW119YywTWtS4EwU3fpKrE=';
  const normalizeImageSrc = (src?: string | null) => {
    const raw = String(src || '').trim();
    if (!raw) return fallbackImage;
    if (/^https?:\/\//i.test(raw) || raw.startsWith('/')) return raw;
    return `/${raw.replace(/^\.?\/*/, '')}`;
  };
  const toSafeNumber = (value: unknown, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const [diamonds, setDiamonds] = useState<DiamondProduct[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] =
    useState<Record<NaturalDiamondColumnId, boolean>>(DEFAULT_NATURAL_DIAMOND_VISIBILITY);
  const skipInitialColumnSave = useRef(true);

  useEffect(() => {
    setColumnVisibility(loadNaturalDiamondColumnVisibility());
  }, []);

  useEffect(() => {
    if (skipInitialColumnSave.current) {
      skipInitialColumnSave.current = false;
      return;
    }
    saveNaturalDiamondColumnVisibility(columnVisibility);
  }, [columnVisibility]);

  const showCol = (id: NaturalDiamondColumnId) => columnVisibility[id];

  const formatShortDate = (iso: string) => {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '—';
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return '—';
    }
  };

  const handleUpdateProduct = (updated: DiamondProduct) => {
    setDiamonds((prev) =>
      prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d)),
    );
  };
  const visibleIds = diamonds.map((d) => d.id);
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

  const handleBulkFileSelect = () => {
    // Called after successful upload in modal
    setBulkModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    setLoading(true);
    
    let fetchPromise;
    if (sellerId) {
      // For seller-side tabs, use seller filter without hard stoneType filter to avoid enum/value drift.
      fetchPromise = diamondService.getDiamonds({ page, limit, sellerId });
    } else if (stoneType === 'labGrownDiamond') {
      fetchPromise = diamondService.getLabDiamonds({ page, limit });
    } else if (stoneType === 'naturalDiamond') {
      fetchPromise = diamondService.getNaturalDiamonds({ page, limit });
    } else {
      fetchPromise = diamondService.getDiamonds({ page, limit });
    }

    fetchPromise
      .then((res) => {
        const topLevel = res as unknown;

        const getListAndMeta = (input: unknown): { list: unknown[]; metaTotal?: number } => {
          if (typeof input === 'object' && input !== null) {
            const obj = input as Record<string, unknown>;
            const dataProp = obj.data as unknown;
            const metaProp = obj.meta as unknown;

            if (Array.isArray(dataProp)) {
              const metaPagination = (metaProp as { pagination?: { total?: number } } | undefined)?.pagination;
              return { list: dataProp, metaTotal: metaPagination?.total };
            }

            if (typeof dataProp === 'object' && dataProp !== null) {
              const nested = dataProp as Record<string, unknown>;
              const nestedData = nested.data as unknown;
              const nestedMeta = nested.meta as { total?: number } | undefined;
              if (Array.isArray(nestedData)) {
                return { list: nestedData, metaTotal: nestedMeta?.total };
              }
            }
          }
          return { list: [] };
        };

        const { list, metaTotal } = getListAndMeta(topLevel);

        const diamondsArr: DiamondProduct[] = (list as unknown[]).map((item): DiamondProduct => {
          const d = item as Record<string, unknown>;
          const images = Array.isArray(d.images) ? (d.images as unknown[]).map((v) => String(v)) : [];
          const idRaw = d.id as string | number | undefined;
          const idNum = typeof idRaw === 'string' ? parseInt(idRaw, 10) : Number(idRaw ?? 0);
          return {
            id: isNaN(idNum) ? 0 : idNum,
            name:
              (d.name as string | undefined)
              || `${String(d.shape ?? '')} ${String(d.color ?? '')} ${String(d.clarity ?? '')} Diamond - ${String((d as Record<string, unknown>).carat ?? (d as Record<string, unknown>).caratWeight ?? '')}ct`,
            price: String((d.price as number | string | undefined) ?? (d.totalPrice as number | string | undefined) ?? 0),
            image1: normalizeImageSrc((d.image1 as string | null | undefined) ?? (images[0] ?? null)),
            image2: normalizeImageSrc((d.image2 as string | null | undefined) ?? (images[1] ?? null)),
            image3: normalizeImageSrc((d.image3 as string | null | undefined) ?? (images[2] ?? null)),
            image4: normalizeImageSrc((d.image4 as string | null | undefined) ?? (images[3] ?? null)),
            image5: normalizeImageSrc((d.image5 as string | null | undefined) ?? (images[4] ?? null)),
            image6: normalizeImageSrc((d.image6 as string | null | undefined) ?? (images[5] ?? null)),
            stockNumber: toSafeNumber(d.stockNumber, 0),
            color: String(d.color ?? ''),
            clarity: String(d.clarity ?? ''),
            cut: String(d.cut ?? ''),
            shape: String(d.shape ?? ''),
            isDeleted: Boolean(d.isDeleted ?? false),
            updatedAt: String((d.updatedAt as string | undefined) ?? new Date().toISOString()),
            isOnAuction: Boolean(d.isOnAuction ?? false),
            isSold: Boolean(d.isSold ?? false),
            auctionId: typeof d.auctionId === 'number' ? d.auctionId : undefined,
            auctionEndTime: (d.auctionEndTime as string | undefined) ?? undefined,
          };
        });

        const totalCount = typeof metaTotal === 'number' ? metaTotal : diamondsArr.length;

        setDiamonds(diamondsArr);
        setTotal(totalCount);
        setError(null);
        setSelectedIds(new Set());
      })
      .catch(() => {
        setError('Failed to load diamonds');
        setDiamonds([]);
      })
      .finally(() => setLoading(false));
  }, [page, limit, refreshKey, sellerId, stoneType]);

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
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <motion.div {...sectionMotion}>
      <SellerProductListingHeader
        title="Diamonds"
        subtitle="Switch between table and grid; columns can be customized in table view."
        actions={
          <>
            <BulkUploadModal
              open={bulkModalOpen}
              onClose={() => setBulkModalOpen(false)}
              onFileSelect={handleBulkFileSelect}
              productType={stoneType === 'labGrownDiamond' ? 'labGrownDiamond' : 'naturalDiamond'}
            />
            <SellerListingToolbarGroup>
              <button
                className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors duration-150 group"
                style={{
                  backgroundColor: view === 'list' ? 'var(--primary)' : 'transparent',
                  color: view === 'list' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                }}
                onClick={() => setView('list')}
                aria-label="Table view"
                aria-pressed={view === 'list'}
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
                <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded border px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderColor: 'var(--border)' }}>
                  Table
                </span>
              </button>
              <button
                className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors duration-150 group"
                style={{
                  backgroundColor: view === 'grid' ? 'var(--primary)' : 'transparent',
                  color: view === 'grid' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                }}
                onClick={() => setView('grid')}
                aria-label="Grid view"
                aria-pressed={view === 'grid'}
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor" />
                  <rect x="14" y="4" width="6" height="6" rx="1" fill="currentColor" />
                  <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor" />
                  <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor" />
                </svg>
                <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded border px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderColor: 'var(--border)' }}>
                  Grid
                </span>
              </button>
              {view === 'list' && (
                <SellerTableColumnPicker
                  variant="toolbar"
                  columns={NATURAL_DIAMOND_COLUMNS}
                  visible={columnVisibility}
                  title="Diamond table columns"
                  onToggle={(id, checked) => {
                    setColumnVisibility((prev) => ({
                      ...prev,
                      [id as NaturalDiamondColumnId]: checked,
                    }));
                  }}
                />
              )}
            </SellerListingToolbarGroup>
          </>
        }
      />
      {loading && (
        <div
          className="flex items-center gap-3 rounded-lg border px-4 py-6"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--muted-foreground)' }}
        >
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
          <span className="text-sm">Loading diamonds…</span>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          {diamonds.length === 0 ? (
            <div className="rounded-xl border p-12 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="text-lg font-medium mb-2" style={{ color: 'var(--foreground)' }}>No diamonds yet</p>
              <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>Add your first diamond with Bulk Upload to get started.</p>
              <button
                type="button"
                className="px-4 py-2 rounded font-medium transition"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                onClick={() => setBulkModalOpen(true)}
              >
                Bulk Upload
              </button>
            </div>
          ) : view === 'list' ? (
            <div className="overflow-x-auto rounded-xl border shadow-sm" style={{ borderColor: 'var(--border)' }}>
              {/* Table view */}
              <table
                className="min-w-full border-collapse text-sm"
                style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
              >
                <thead className="border-b" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                  <tr>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAllVisible}
                        aria-label="Select all diamonds"
                      />
                    </th>
                    {showCol('image') && (
                      <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Image</th>
                    )}
                    {showCol('name') && (
                      <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Name</th>
                    )}
                    {showCol('price') && (
                      <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Price</th>
                    )}
                    {showCol('color') && (
                      <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Color</th>
                    )}
                    {showCol('clarity') && (
                      <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Clarity</th>
                    )}
                    {showCol('cut') && (
                      <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Cut</th>
                    )}
                    {showCol('shape') && (
                      <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Shape</th>
                    )}
                    {showCol('stock') && (
                      <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Stock</th>
                    )}
                    {showCol('updated') && (
                      <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Updated</th>
                    )}
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {diamonds.map((diamond) => (
                    <tr key={diamond.id} className="border-t transition-colors hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(diamond.id)}
                          onChange={() => toggleSelectOne(diamond.id)}
                          aria-label={`Select ${diamond.name}`}
                        />
                      </td>
                      {showCol('image') && (
                        <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>
                          <Image
                            src={normalizeImageSrc(diamond.image1)}
                            alt={diamond.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                      )}
                      {showCol('name') && (
                        <td
                          className="max-w-[min(22rem,40vw)] px-4 py-2 border-r"
                          style={{ borderColor: 'var(--border)' }}
                          title={diamond.name}
                        >
                          <span className="line-clamp-2 font-medium leading-snug">{diamond.name}</span>
                        </td>
                      )}
                      {showCol('price') && (
                        <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}>${Number(diamond.price).toLocaleString()}</td>
                      )}
                      {showCol('color') && (
                        <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.color}</td>
                      )}
                      {showCol('clarity') && (
                        <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.clarity}</td>
                      )}
                      {showCol('cut') && (
                        <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.cut}</td>
                      )}
                      {showCol('shape') && (
                        <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.shape}</td>
                      )}
                      {showCol('stock') && (
                        <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.stockNumber}</td>
                      )}
                      {showCol('updated') && (
                        <td className="px-4 py-2 border-r text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                          {formatShortDate(diamond.updatedAt)}
                        </td>
                      )}
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border text-xs"
                            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                            onClick={() => {
                              if (typeof window !== 'undefined') {
                                window.open(`/diamonds/${diamond.id}`, '_blank');
                              }
                            }}
                            aria-label="View product"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border text-xs"
                            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                            onClick={() => {
                              if (typeof window !== 'undefined') {
                                window.location.href = `/seller/products/${diamond.id}/edit`;
                              }
                            }}
                            aria-label="Edit product"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border text-xs"
                            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--destructive)' }}
                            onClick={() => setDeleteId(diamond.id)}
                            aria-label="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {diamonds.map((diamond, idx) => (
                <motion.div
                  key={diamond.id}
                  className="relative"
                  initial={!shouldReduceMotion ? { opacity: 0, y: 10 } : undefined}
                  animate={!shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
                  transition={!shouldReduceMotion ? { duration: 0.25, delay: Math.min(idx * 0.03, 0.18) } : undefined}
                >
                  <label
                    className="absolute z-10 top-3 left-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border shadow-sm backdrop-blur-sm"
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer accent-[var(--primary)]"
                      checked={selectedIds.has(diamond.id)}
                      onChange={() => toggleSelectOne(diamond.id)}
                      aria-label={`Select ${diamond.name}`}
                    />
                  </label>
                  <DiamondProductCard
                    product={diamond}
                    onDelete={() => {
                      setDiamonds((prev) => prev.filter((d) => d.id !== diamond.id));
                      setTotal((prev) => Math.max(0, prev - 1));
                      setSelectedIds((prev) => {
                        const next = new Set(prev);
                        next.delete(diamond.id);
                        return next;
                      });
                    }}
                    onUpdateProduct={handleUpdateProduct}
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
          <ListingBulkActionBar
            selectedCount={selectedCount}
            onDelete={() => setBulkDeleteOpen(true)}
            onExport={() => toast('Export can be added here')}
            onClear={() => setSelectedIds(new Set())}
            onSelectAll={() => setSelectedIds(new Set(visibleIds))}
            disableSelectAll={visibleIds.length === 0 || allVisibleSelected}
          />
          <ConfirmModal
            open={deleteId !== null}
            onOpenChange={(open) => {
              if (!open) setDeleteId(null);
            }}
            title="Are you sure you want to delete this product?"
            description="This action cannot be undone."
            onYes={async () => {
              if (deleteId === null) return;
              const idToDelete = deleteId;
              setDeleteId(null);
              try {
                const token = typeof window !== 'undefined' ? (document.cookie.match(/token=([^;]+)/)?.[1] || '') : '';
                await diamondService.deleteDiamond(idToDelete, token);
                setDiamonds((prev) => prev.filter((d) => d.id !== idToDelete));
                setTotal((prev) => Math.max(0, prev - 1));
                setSelectedIds((prev) => {
                  const next = new Set(prev);
                  next.delete(idToDelete);
                  return next;
                });
                toast.success('Product deleted successfully!');
              } catch {
                toast.error('Failed to delete product.');
              }
            }}
            onNo={() => setDeleteId(null)}
          />
          <ConfirmModal
            open={bulkDeleteOpen}
            onOpenChange={setBulkDeleteOpen}
            title="Delete selected diamonds?"
            description={`This will permanently delete ${selectedCount} selected diamond(s).`}
            onYes={async () => {
              try {
                const token = getCookie('token') || '';
                const ids = Array.from(selectedIds);
                await diamondService.bulkDeleteDiamonds(ids, token);
                setDiamonds((prev) => prev.filter((d) => !selectedIds.has(d.id)));
                setTotal((prev) => Math.max(0, prev - ids.length));
                setSelectedIds(new Set());
                setBulkDeleteOpen(false);
                toast.success('Selected diamonds deleted successfully');
              } catch {
                toast.error('Failed to delete selected diamonds');
              }
            }}
            onNo={() => setBulkDeleteOpen(false)}
          />
        </>
      )}
    </motion.div>
  );
};

export default DiamondsListing;
