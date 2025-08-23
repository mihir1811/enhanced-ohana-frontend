
import React, { useEffect, useState } from 'react';
import DiamondFilters, { DiamondFilterValues } from './DiamondFilters';
import DiamondResults, { Diamond } from './DiamondResults';
import { getDefaultDiamondFilters, transformApiDiamond } from './diamondUtils';

interface DiamondListingPageProps {
  diamondType: 'lab-grown-single' | 'lab-grown-melee' | 'natural-single' | 'natural-melee';
  fetchDiamonds: (params: any) => Promise<any>; // expects API response with data & meta
  title?: string;
}

const DiamondListingPage: React.FC<DiamondListingPageProps> = ({
  diamondType,
  fetchDiamonds,
  title = 'Diamonds',
}) => {
  const [filters, setFilters] = useState<DiamondFilterValues>(() => getDefaultDiamondFilters(diamondType));
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Fetch diamonds when filters/page changes
  useEffect(() => {
    setLoading(true);
    fetchDiamonds({
      ...filters,
      page: currentPage,
      perPage: pageSize,
      diamondType,
    })
      .then((res) => {
        // API: { data: [...], meta: { total, currentPage, perPage } }
        setDiamonds(res.data.map(transformApiDiamond));
        setTotalCount(res.meta?.total || 0);
        setCurrentPage(res.meta?.currentPage || 1);
        setPageSize(res.meta?.perPage || 20);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters), currentPage, pageSize, diamondType]);

  const handleFiltersChange = (newFilters: DiamondFilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  return (
    <div className="flex gap-6">
      <aside className="w-72 flex-shrink-0">
        <DiamondFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          diamondType={diamondType}
        />
      </aside>
      <main className="flex-1">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <DiamondResults
          diamonds={diamonds}
          loading={loading}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onDiamondSelect={() => {}}
          onAddToWishlist={() => {}}
          onAddToCart={() => {}}
          diamondType={diamondType}
        />
      </main>
    </div>
  );
};

export default DiamondListingPage;
