import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  if (totalPages <= 1) return null;

  // Show up to 5 page buttons, centered around currentPage
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className={`flex items-center justify-center space-x-2 pt-6 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
      >
        Previous
      </button>
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 border rounded-lg transition-colors ${currentPage === page ? 'bg-opacity-100' : 'bg-opacity-0'}`}
          style={{
            backgroundColor: currentPage === page ? 'var(--primary)' : 'var(--background)',
            borderColor: 'var(--border)',
            color: currentPage === page ? 'var(--primary-foreground)' : 'var(--foreground)'
          }}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
