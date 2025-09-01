import React from 'react';

export interface ProductCardProps {
  image: string;
  title: string;
  subtitle?: string;
  price: string | number;
  details?: React.ReactNode;
  onClick?: () => void;
  actions?: React.ReactNode;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  subtitle,
  price,
  details,
  onClick,
  actions,
}) => (
  <div
    className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer group bg-white dark:bg-slate-900"
    onClick={onClick}
    style={{ borderColor: 'var(--border)' }}
  >
    <div className="relative mb-3">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <span className="text-4xl">💎</span>
        )}
      </div>
      {actions && (
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {actions}
        </div>
      )}
    </div>
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
          {title}
        </h3>
        <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
          {typeof price === 'number' ? `$${price.toLocaleString()}` : price}
        </span>
      </div>
      {subtitle && <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{subtitle}</div>}
      {details}
    </div>
  </div>
);

export default ProductCard;
