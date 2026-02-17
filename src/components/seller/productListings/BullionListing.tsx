import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BulkUploadModal from './BulkUploadModal';
import { bullionService, BullionProduct } from '@/services/bullion.service';
import BullionProductCard from './BullionProductCard';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from 'react-hot-toast';

const BullionListing = () => {
  const [bullions, setBullions] = useState<BullionProduct[]>([]);
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
    setLoading(true);
    bullionService.getBullions({ page, limit })
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

        const bullionsArr: BullionProduct[] = (list as unknown[]).map((item): BullionProduct => {
           // Type assertion and safe casting
           const d = item as any;
           return {
             id: d.id,
             stockNumber: d.stockNumber,
             metalTypeId: d.metalTypeId,
             metalShapeId: d.metalShapeId,
             metalFinenessId: d.metalFinenessId,
             metalWeight: d.metalWeight,
             price: d.price,
             quantity: d.quantity,
             design: d.design,
             demention: d.demention,
             condition: d.condition,
             mintMark: d.mintMark,
             mintYear: d.mintYear,
             isActive: d.isActive,
             isSold: d.isSold,
             createdAt: d.createdAt,
             updatedAt: d.updatedAt,
             metalType: d.metalType,
             metalShape: d.metalShape,
             metalFineness: d.metalFineness,
           };
        });

        const totalCount = typeof metaTotal === 'number' ? metaTotal : bullionsArr.length;

        setBullions(bullionsArr);
        setTotal(totalCount);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load bullions');
        setBullions([]);
      })
      .finally(() => setLoading(false));
  }, [page, limit, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Bullion</h2>
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
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          {bullions.length === 0 ? (
            <div>No bullion products found.</div>
          ) : view === 'list' ? (
            <div className="overflow-x-auto">
              <table
                className="min-w-full rounded-lg shadow border border-collapse"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <thead className="border-b" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                  <tr>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Image</th>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Type</th>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Price</th>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Shape</th>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Fineness</th>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Weight</th>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Stock #</th>
                    <th className="px-4 py-2 text-left border-r" style={{ borderColor: 'var(--border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bullions.map((bullion) => (
                    <tr key={bullion.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>
                         {/* Placeholder for image */}
                         <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                      </td>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{bullion.metalType?.name}</td>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}>${Number(bullion.price).toLocaleString()}</td>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{bullion.metalShape?.name}</td>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{bullion.metalFineness?.name}</td>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{bullion.metalWeight}</td>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>{bullion.stockNumber}</td>
                      <td className="px-4 py-2 border-r" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border text-xs"
                            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                            onClick={() => {
                              // TODO: View logic
                              console.log('View', bullion.id);
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
                              router.push(`/seller/products/${bullion.id}/edit`);
                            }}
                            aria-label="Edit product"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border text-xs"
                            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--destructive)' }}
                            onClick={() => setDeleteId(bullion.id)}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bullions.map((bullion) => (
                <BullionProductCard
                  key={bullion.id}
                  product={bullion}
                  onDelete={() => setDeleteId(bullion.id)}
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
                await bullionService.deleteBullion(idToDelete);
                setBullions((prev) => prev.filter((d) => d.id !== idToDelete));
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

export default BullionListing;