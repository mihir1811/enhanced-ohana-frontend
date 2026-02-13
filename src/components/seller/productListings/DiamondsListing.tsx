import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BulkUploadModal from './BulkUploadModal';
import { diamondService, DiamondData } from '@/services/diamondService';
import DiamondProductCard, { DiamondProduct } from './DiamondProductCard';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from 'react-hot-toast';

const DiamondsListing = ({ sellerId, stoneType }: { sellerId?: string, stoneType?: string }) => {
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

  const handleBulkFileSelect = () => {
    // Called after successful upload in modal
    setBulkModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    console.log(page, limit, "page, limit")
    setLoading(true);
    
    let fetchPromise;
    if (stoneType === 'labGrownDiamond') {
      fetchPromise = diamondService.getLabDiamonds({ page, limit, sellerId });
    } else if (stoneType === 'naturalDiamond') {
      fetchPromise = diamondService.getNaturalDiamonds({ page, limit, sellerId });
    } else {
      fetchPromise = sellerId 
        ? diamondService.getDiamondsBySeller(sellerId, { page, limit })
        : diamondService.getDiamonds({ page, limit });
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
            image1: (d.image1 as string | null | undefined) ?? (images[0] ?? null),
            image2: (d.image2 as string | null | undefined) ?? (images[1] ?? null),
            image3: (d.image3 as string | null | undefined) ?? (images[2] ?? null),
            image4: (d.image4 as string | null | undefined) ?? (images[3] ?? null),
            image5: (d.image5 as string | null | undefined) ?? (images[4] ?? null),
            image6: (d.image6 as string | null | undefined) ?? (images[5] ?? null),
            stockNumber: Number(d.stockNumber ?? 0),
            color: String(d.color ?? ''),
            clarity: String(d.clarity ?? ''),
            cut: String(d.cut ?? ''),
            shape: String(d.shape ?? ''),
            isDeleted: Boolean(d.isDeleted ?? false),
            updatedAt: String((d.updatedAt as string | undefined) ?? new Date().toISOString()),
            sellerSKU: String(d.sellerSKU ?? ''),
            isOnAuction: Boolean(d.isOnAuction ?? false),
            isSold: Boolean(d.isSold ?? false),
            auctionEndTime: (d.auctionEndTime as string | undefined) ?? undefined,
          };
        });

        const totalCount = typeof metaTotal === 'number' ? metaTotal : diamondsArr.length;

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
            className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition cursor-pointer"
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
              backgroundColor: view === 'list' ? 'var(--primary)' : 'var(--card)',
              color: view === 'list' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              borderColor: view === 'list' ? 'var(--primary)' : 'var(--border)'
            }}
            onClick={() => setView('list')}
            aria-label="List View"
            type="button"
          >
            {/* List Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            {/* Tooltip */}
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap" style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', border: '1px solid var(--border)' }}>
              List View
            </span>
          </button>
          {/* Grid View Icon Button */}
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
            {/* Grid Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="14" y="4" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor" />
            </svg>
            {/* Tooltip */}
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap" style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', border: '1px solid var(--border)' }}>
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
              {/* Table view */}
              <table
                className="min-w-full rounded-lg shadow border border-collapse"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <thead className="border-b" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                  <tr>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Image</th>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Name</th>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Price</th>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Color</th>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Clarity</th>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Cut</th>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Shape</th>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Stock</th>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {diamonds.map((diamond) => (
                    <tr key={diamond.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>
                        <Image
                          src={diamond.image1 || "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=2048x2048&w=is&k=20&c=dFWJz1EFJt7Tq2lA-hgTpSW119YywTWtS4EwU3fpKrE="}
                          alt={diamond.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.name}</td>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}>${Number(diamond.price).toLocaleString()}</td>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.color}</td>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.clarity}</td>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.cut}</td>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.shape}</td>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{diamond.stockNumber}</td>
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
                toast.success('Product deleted successfully!');
              } catch {
                toast.error('Failed to delete product.');
              }
            }}
            onNo={() => setDeleteId(null)}
          />
        </>
      )}
    </div>
  );
};

export default DiamondsListing;
