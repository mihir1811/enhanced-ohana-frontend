import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BulkUploadModal from './BulkUploadModal';
import { gemstoneService } from '@/services/gemstoneService';
import GemstoneProductCard, { GemstoneProduct } from './GemstoneProductCard';
import { generateGemstoneName } from '@/utils/gemstoneUtils';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { ApiResponse } from '@/services/api';

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

const MeleeGemstonesListing = () => {
  const [gemstones, setGemstones] = useState<GemstoneProduct[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  const sellerId = useSelector((state: RootState) => state.seller.profile?.id) || 'default-seller-id';

  const handleBulkFileSelect = () => {
    setBulkModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    setLoading(true);
    gemstoneService.getMeleeGemstonesBySeller({ sellerId, page, limit })
      .then((res: ApiResponse<GemstoneApiResponse>) => {
        const gems = res?.data?.data || [];
        setGemstones(gems);
        const totalCount = res?.data?.meta?.total || 0;
        setTotal(totalCount || 0);
        setError(null);
      })
      .catch(() => {
        setError('Failed to load melee gemstones');
        setGemstones([]);
      })
      .finally(() => setLoading(false));
  }, [page, limit, sellerId, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Melee Gemstone Parcels</h2>
        <div className="flex gap-2 items-center relative">
          <button
            className="cursor-pointer px-4 py-2 rounded font-semibold transition"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            onClick={() => setBulkModalOpen(true)}
            type="button"
          >
            Bulk Upload
          </button>
          <BulkUploadModal
            open={bulkModalOpen}
            onClose={() => setBulkModalOpen(false)}
            onFileSelect={handleBulkFileSelect}
            productType="melee-gemstone"
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
            <div className="rounded-xl border p-12 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="text-lg font-medium mb-2" style={{ color: 'var(--foreground)' }}>No melee gemstone parcels yet</p>
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
              <table className="min-w-full rounded-lg shadow border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <thead className="border-b" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                  <tr>
                    <th className="px-4 py-2 text-left">Image</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Color</th>
                    <th className="px-4 py-2 text-left">Shape</th>
                    <th className="px-4 py-2 text-left">Actions</th>
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
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded"
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
                        }) || gem.name || `${gem.subType || ''} ${gem.gemsType || gem.gemType || ''}`.trim()}
                      </td>
                      <td className="px-4 py-2" style={{ color: 'var(--primary)' }}>${(gem.totalPrice ? Number(gem.totalPrice) : gem.price)?.toLocaleString() || '-'}</td>
                      <td className="px-4 py-2">{gem.color}</td>
                      <td className="px-4 py-2">{gem.shape}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="p-1 hover:opacity-80 transition-colors"
                            style={{ color: 'var(--primary)' }}
                            title="View"
                            onClick={() => typeof window !== 'undefined' && window.open(`/gemstones/melee/${gem.id}`, '_blank')}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            className="p-1 hover:opacity-80 transition-colors"
                            style={{ color: 'var(--primary)' }}
                            title="Edit"
                            onClick={() => typeof window !== 'undefined' && (window.location.href = `/seller/products/${gem.id}/edit`)}
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button 
                            className="p-1 hover:text-red-500 transition-colors" 
                            title="Delete"
                            onClick={() => setDeleteId(gem.id)}
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
              {gemstones.map((gem) => (
                <GemstoneProductCard
                  key={gem.id}
                  product={gem}
                  isMelee
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
          {totalPages > 1 && (
            <div className="flex gap-2 mt-4 justify-center items-center">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-muted transition"
              >
                Prev
              </button>
              <span className="text-sm font-medium">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-muted transition"
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
              const token = typeof window !== 'undefined' ? (document.cookie.match(/token=([^;]+)/)?.[1] || '') : '';
              await gemstoneService.deleteGemstone(idToDelete, token);
              setGemstones((prev) => prev.filter((g) => g.id !== idToDelete));
              setTotal((prev) => Math.max(0, prev - 1));
              toast.success('Melee gemstone parcel deleted successfully');
            } catch (err) {
              toast.error('Failed to delete melee gemstone parcel');
            }
          }
        }}
        onNo={() => setDeleteId(null)}
        title="Delete Melee Gemstone Parcel"
        description="Are you sure you want to delete this melee gemstone parcel? This action cannot be undone."
      />
    </div>
  );
};

export default MeleeGemstonesListing;
