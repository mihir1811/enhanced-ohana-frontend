import React, { useEffect, useRef, useState } from 'react';
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
  DEFAULT_MELEE_DIAMOND_VISIBILITY,
  MELEE_DIAMOND_COLUMNS,
  type MeleeDiamondColumnId,
  loadMeleeDiamondColumnVisibility,
  saveMeleeDiamondColumnVisibility,
} from './sellerTableColumnPreferences';

const MeleeDiamondsListing = ({ sellerId, stoneType }: { sellerId?: string, stoneType?: string }) => {
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
  const normalizeCode = (value: unknown) => String(value ?? '').trim().toUpperCase();
  const formatRange = (fromValue: unknown, toValue: unknown, singleValue?: unknown) => {
    const from = normalizeCode(fromValue);
    const to = normalizeCode(toValue);
    const single = normalizeCode(singleValue);
    if (from && to) return from === to ? from : `${from} - ${to}`;
    if (from) return from;
    if (to) return to;
    return single;
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
    useState<Record<MeleeDiamondColumnId, boolean>>(DEFAULT_MELEE_DIAMOND_VISIBILITY);
  const skipInitialColumnSave = useRef(true);

  useEffect(() => {
    setColumnVisibility(loadMeleeDiamondColumnVisibility());
  }, []);

  useEffect(() => {
    if (skipInitialColumnSave.current) {
      skipInitialColumnSave.current = false;
      return;
    }
    saveMeleeDiamondColumnVisibility(columnVisibility);
  }, [columnVisibility]);

  const showCol = (id: MeleeDiamondColumnId) => columnVisibility[id];

  const formatShortDate = (iso: string) => {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '—';
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return '—';
    }
  };

  const handleBulkFileSelect = () => {
    setBulkModalOpen(false);
    setRefreshKey((k) => k + 1);
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

  useEffect(() => {
    setLoading(true);
    const fetchPromise = sellerId
      ? diamondService.getMeleeDiamondsBySeller(sellerId, { page, limit })
      : diamondService.getMeleeDiamonds({ page, limit });

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
          const colorRange = formatRange(d.colorFrom, d.colorTo, d.color);
          const clarityRange = formatRange(d.clarityMin, d.clarityMax, d.clarity);
          const cutRange = formatRange(d.cutFrom, d.cutTo, d.cut);
          const totalPcs = toSafeNumber(d.totalPcs ?? d.stockNumber, 0);
          const caratWeightPerpcs = String(d.caratWeightPerpcs ?? d.caratWeightPerPiece ?? '').trim();
          const totalCaratWeight = String(d.totalCaratWeight ?? d.caratWeight ?? d.totalCarat ?? '').trim();
          return {
            id: isNaN(idNum) ? 0 : idNum,
            name:
              (d.name as string | undefined)
              || `Melee Parcel ${colorRange || '-'} ${clarityRange || '-'} ${cutRange ? `(${cutRange})` : ''} - ${totalCaratWeight || String(d.caratWeight ?? d.carat ?? '')}ct`,
            price: String((d.price as number | string | undefined) ?? (d.totalPrice as number | string | undefined) ?? 0),
            image1: normalizeImageSrc((d.image1 as string | null | undefined) ?? (images[0] ?? null)),
            image2: normalizeImageSrc((d.image2 as string | null | undefined) ?? (images[1] ?? null)),
            image3: normalizeImageSrc((d.image3 as string | null | undefined) ?? (images[2] ?? null)),
            image4: normalizeImageSrc((d.image4 as string | null | undefined) ?? (images[3] ?? null)),
            image5: normalizeImageSrc((d.image5 as string | null | undefined) ?? (images[4] ?? null)),
            image6: normalizeImageSrc((d.image6 as string | null | undefined) ?? (images[5] ?? null)),
            stockNumber: totalPcs,
            color: colorRange,
            clarity: clarityRange,
            cut: cutRange,
            shape: String(d.shape ?? ''),
            totalPcs,
            caratWeightPerpcs,
            totalCaratWeight,
            isDeleted: Boolean(d.isDeleted ?? false),
            updatedAt: String((d.updatedAt as string | undefined) ?? new Date().toISOString()),
            isOnAuction: Boolean(d.isOnAuction ?? false),
            isSold: Boolean(d.isSold ?? false),
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
        setError('Failed to load melee diamonds');
        setDiamonds([]);
      })
      .finally(() => setLoading(false));
  }, [page, limit, refreshKey, sellerId]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Melee Diamond Parcels</h2>
        <div className="flex gap-2 items-center relative">
          <button
            className="px-4 py-2 rounded font-semibold transition cursor-pointer"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            onClick={() => setBulkModalOpen(true)}
            type="button"
          >
            Bulk Upload
          </button>
          <button
            type="button"
            disabled={selectedCount === 0}
            onClick={() => setBulkDeleteOpen(true)}
            className="px-4 py-2 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--destructive)', color: 'white' }}
          >
            Delete Selected ({selectedCount})
          </button>
          <BulkUploadModal
            open={bulkModalOpen}
            onClose={() => setBulkModalOpen(false)}
            onFileSelect={handleBulkFileSelect}
            productType="meleeDiamond"
          />
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
              <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="14" y="4" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor" />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap" style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', border: '1px solid var(--border)' }}>
              Grid View
            </span>
          </button>
          {view === 'list' && (
            <SellerTableColumnPicker
              columns={MELEE_DIAMOND_COLUMNS}
              visible={columnVisibility}
              title="Melee table columns"
              onToggle={(id, checked) => {
                setColumnVisibility((prev) => ({
                  ...prev,
                  [id as MeleeDiamondColumnId]: checked,
                }));
              }}
            />
          )}
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <>
          {diamonds.length === 0 ? (
            <div className="rounded-xl border p-12 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="text-lg font-medium mb-2" style={{ color: 'var(--foreground)' }}>No melee parcels yet</p>
              <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>Add your first parcel with Bulk Upload to get started.</p>
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
            <div className="overflow-x-auto">
              <table
                className="min-w-full rounded-lg shadow border border-collapse"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <thead className="border-b" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                  <tr>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAllVisible}
                        aria-label="Select all melee diamonds"
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
                    {showCol('totalPcs') && (
                      <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Total Pcs</th>
                    )}
                    {showCol('caratWeightPerpcs') && (
                      <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Carat/Pcs</th>
                    )}
                    {showCol('totalCaratWeight') && (
                      <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Total Carat</th>
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
                    <tr key={diamond.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
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
                          <div className="w-12 h-12 relative rounded overflow-hidden">
                            <Image
                              src={normalizeImageSrc(diamond.image1)}
                              alt={diamond.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </td>
                      )}
                      {showCol('name') && (
                        <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.name}</td>
                      )}
                      {showCol('price') && (
                        <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>${Number(diamond.price).toLocaleString()}</td>
                      )}
                      {showCol('color') && (
                        <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.color}</td>
                      )}
                      {showCol('clarity') && (
                        <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.clarity}</td>
                      )}
                      {showCol('cut') && (
                        <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.cut || '-'}</td>
                      )}
                      {showCol('totalPcs') && (
                        <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.totalPcs ?? '-'}</td>
                      )}
                      {showCol('caratWeightPerpcs') && (
                        <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>
                          {diamond.caratWeightPerpcs ? `${diamond.caratWeightPerpcs} ct` : '-'}
                        </td>
                      )}
                      {showCol('totalCaratWeight') && (
                        <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>
                          {diamond.totalCaratWeight ? `${diamond.totalCaratWeight} ct` : '-'}
                        </td>
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
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="p-1 hover:opacity-80 transition-colors"
                            style={{ color: 'var(--primary)' }}
                            title="View"
                            onClick={() => typeof window !== 'undefined' && window.open(`/diamonds/melee/${diamond.id}`, '_blank')}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            className="p-1 hover:opacity-80 transition-colors"
                            style={{ color: 'var(--primary)' }}
                            title="Edit"
                            onClick={() => typeof window !== 'undefined' && (window.location.href = `/seller/products/${diamond.id}/edit`)}
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button 
                            className="p-1 hover:text-red-500 transition-colors" 
                            title="Delete"
                            onClick={() => setDeleteId(diamond.id)}
                          >
                            <Trash2 className="w-5 h-5" />
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
              {diamonds.map((diamond) => (
            <div key={diamond.id} className="relative">
              <label className="absolute z-10 top-3 left-3 h-6 w-6 rounded bg-white/90 border border-gray-300 flex items-center justify-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.has(diamond.id)}
                  onChange={() => toggleSelectOne(diamond.id)}
                  aria-label={`Select ${diamond.name}`}
                />
              </label>
              <DiamondProductCard
                product={diamond}
                isMelee={true}
                onDelete={(p) => {
                  setDiamonds((prev) => prev.filter((d) => d.id !== p.id));
                  setTotal((prev) => Math.max(0, prev - 1));
                  setSelectedIds((prev) => {
                    const next = new Set(prev);
                    next.delete(p.id);
                    return next;
                  });
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border font-medium disabled:opacity-50 disabled:cursor-not-allowed
                     bg-card text-card-foreground border-border hover:bg-muted transition"
          >
            Previous
          </button>
          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border font-medium disabled:opacity-50 disabled:cursor-not-allowed
                     bg-card text-card-foreground border-border hover:bg-muted transition"
          >
            Next
          </button>
        </div>
      )}
    </>
  )}

  <ConfirmModal
    open={deleteId !== null}
    onOpenChange={(open) => {
      if (!open) setDeleteId(null);
    }}
    onYes={async () => {
      if (deleteId !== null) {
        const idToDelete = deleteId;
        setDeleteId(null);
        try {
          const token = getCookie('token') || '';
          await diamondService.deleteMeleeDiamond(idToDelete, token);
          setDiamonds((prev) => prev.filter((d) => d.id !== idToDelete));
          setTotal((prev) => Math.max(0, prev - 1));
          setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(idToDelete);
            return next;
          });
          toast.success('Melee parcel deleted successfully');
        } catch (err) {
          toast.error('Failed to delete melee parcel');
        }
      }
    }}
    onNo={() => setDeleteId(null)}
    title="Delete Melee Parcel"
    description="Are you sure you want to delete this melee parcel? This action cannot be undone."
  />
  <ConfirmModal
    open={bulkDeleteOpen}
    onOpenChange={setBulkDeleteOpen}
    title="Delete selected melee parcels?"
    description={`This will permanently delete ${selectedCount} selected melee parcel(s).`}
    onYes={async () => {
      try {
        const token = getCookie('token') || '';
        const ids = Array.from(selectedIds);
        await diamondService.bulkDeleteMeleeDiamonds(ids, token);
        setDiamonds((prev) => prev.filter((d) => !selectedIds.has(d.id)));
        setTotal((prev) => Math.max(0, prev - ids.length));
        setSelectedIds(new Set());
        setBulkDeleteOpen(false);
        toast.success('Selected melee parcels deleted successfully');
      } catch {
        toast.error('Failed to delete selected melee parcels');
      }
    }}
    onNo={() => setBulkDeleteOpen(false)}
  />
    </div>
  );
};

export default MeleeDiamondsListing;
