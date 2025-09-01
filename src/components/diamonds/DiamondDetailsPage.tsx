import React from 'react';
import { Diamond } from './DiamondResults';

interface DiamondDetailsPageProps {
  diamond: Diamond;
}

const DiamondDetailsPage: React.FC<DiamondDetailsPageProps> = ({ diamond }) => {
  if (!diamond) return <div>No diamond data found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-0 sm:p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 mt-10">
      <div className="flex flex-col md:flex-row gap-0 md:gap-10">
        {/* Image Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 bg-gray-50 dark:bg-zinc-800 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none border-b md:border-b-0 md:border-r border-gray-100 dark:border-zinc-700">
          {diamond.images && diamond.images.length > 0 ? (
            <img
              src={diamond.images[0]}
              alt={`${diamond.shape} Diamond`}
              className="w-60 h-60 sm:w-72 sm:h-72 object-contain rounded-xl shadow-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
            />
          ) : (
            <span className="text-7xl" style={{ color: 'var(--muted-foreground)' }}>💎</span>
          )}
        </div>
        {/* Details Section */}
        <div className="flex-1 flex flex-col gap-4 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {diamond.caratWeight}ct {diamond.shape} Diamond
            </h1>
            <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
              {typeof diamond.price === 'string' ? diamond.price : diamond.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
          </div>
          <hr className="my-2 border-gray-200 dark:border-zinc-700" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-base">
            <div><span className="font-semibold text-gray-700 dark:text-zinc-200">Color:</span> <span className="font-medium">{diamond.color}</span></div>
            <div><span className="font-semibold text-gray-700 dark:text-zinc-200">Clarity:</span> <span className="font-medium">{diamond.clarity}</span></div>
            <div><span className="font-semibold text-gray-700 dark:text-zinc-200">Cut:</span> <span className="font-medium">{diamond.cut || 'N/A'}</span></div>
            <div><span className="font-semibold text-gray-700 dark:text-zinc-200">Carat:</span> <span className="font-medium">{diamond.caratWeight}</span></div>
            <div><span className="font-semibold text-gray-700 dark:text-zinc-200">Certificate:</span> <span className="font-mono">{diamond.certificateNumber || 'N/A'}</span></div>
            <div><span className="font-semibold text-gray-700 dark:text-zinc-200">Seller:</span> <span className="font-medium">{diamond.sellerId ? `#${diamond.sellerId}` : 'Unknown'}</span></div>
          </div>
          {diamond.description && (
            <div className="mt-4 text-gray-500 dark:text-zinc-400 text-sm leading-relaxed">
              {diamond.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiamondDetailsPage;
