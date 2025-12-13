import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BulkUploadModal from './BulkUploadModal';
import { diamondService, DiamondData } from '@/services/diamondService';
import DiamondProductCard, { DiamondProduct } from './DiamondProductCard';

// Extended interface for DiamondData with additional optional properties
interface ExtendedDiamondData extends DiamondData {
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  image5?: string | null;
  image6?: string | null;
  stockNumber?: number;
  isDeleted?: boolean;
  updatedAt?: string;
  sellerSKU?: string;
  isOnAuction?: boolean;
  isSold?: boolean;
}

const DiamondsListing = () => {
  const [diamonds, setDiamonds] = useState<DiamondProduct[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleBulkFileSelect = () => {
    // Called after successful upload in modal
    setBulkModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    console.log(page, limit, "page, limit")
    setLoading(true);
    diamondService.getDiamonds({ page, limit })
      .then((res) => {
        const raw = Array.isArray((res as any)?.data)
          ? (res as any).data
          : (res as any)?.data?.data ?? [];
        const meta = (res as any)?.data?.meta
          || (res as any)?.meta?.pagination
          || (res as any)?.meta;
        const diamondsArr = (raw as any[]).map((d: any): DiamondProduct => ({
          id: typeof d?.id === 'string' ? parseInt(d.id, 10) : Number(d?.id ?? 0),
          name:
            d?.name
            || `${String(d?.shape ?? '')} ${String(d?.color ?? '')} ${String(d?.clarity ?? '')} Diamond - ${String(d?.carat ?? d?.caratWeight ?? '')}ct`,
          price: String(d?.price ?? d?.totalPrice ?? 0),
          image1: d?.image1 ?? (Array.isArray(d?.images) ? d.images[0] : null) ?? null,
          image2: d?.image2 ?? (Array.isArray(d?.images) ? d.images[1] : null) ?? null,
          image3: d?.image3 ?? (Array.isArray(d?.images) ? d.images[2] : null) ?? null,
          image4: d?.image4 ?? (Array.isArray(d?.images) ? d.images[3] : null) ?? null,
          image5: d?.image5 ?? (Array.isArray(d?.images) ? d.images[4] : null) ?? null,
          image6: d?.image6 ?? (Array.isArray(d?.images) ? d.images[5] : null) ?? null,
          stockNumber: Number(d?.stockNumber ?? 0),
          color: String(d?.color ?? ''),
          clarity: String(d?.clarity ?? ''),
          cut: String(d?.cut ?? ''),
          shape: String(d?.shape ?? ''),
          isDeleted: Boolean(d?.isDeleted ?? false),
          updatedAt: String(d?.updatedAt ?? new Date().toISOString()),
          sellerSKU: String(d?.sellerSKU ?? ''),
          isOnAuction: Boolean(d?.isOnAuction ?? false),
          isSold: Boolean(d?.isSold ?? false),
          auctionEndTime: d?.auctionEndTime ?? undefined,
        }));
        const totalCount = typeof (meta as any)?.total === 'number' ? (meta as any).total : diamondsArr.length;

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
          <button
            className={"relative p-2 rounded border flex items-center justify-center transition-colors duration-150 group"}
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
            className={"relative p-2 rounded border flex items-center justify-center transition-colors duration-150 group"}
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
              <table className="min-w-full rounded-lg shadow border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <thead className="border-b" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                  <tr>
                    <th className="px-4 py-2 text-left">Image</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Color</th>
                    <th className="px-4 py-2 text-left">Clarity</th>
                    <th className="px-4 py-2 text-left">Cut</th>
                    <th className="px-4 py-2 text-left">Shape</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {diamonds.map((diamond) => (
                    <tr key={diamond.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-2">
                        <Image
                          src={diamond.image1 || "https://media.istockphoto.com/id/1493089752/vector/box-and-package-icon-concept.jpg"}
                          alt={diamond.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-2">{diamond.name}</td>
                      <td className="px-4 py-2" style={{ color: 'var(--primary)' }}>${Number(diamond.price).toLocaleString()}</td>
                      <td className="px-4 py-2">{diamond.color}</td>
                      <td className="px-4 py-2">{diamond.clarity}</td>
                      <td className="px-4 py-2">{diamond.cut}</td>
                      <td className="px-4 py-2">{diamond.shape}</td>
                      <td className="px-4 py-2">{diamond.stockNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        </>
      )}
    </div>
  );
};

export default DiamondsListing;
