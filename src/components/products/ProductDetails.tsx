import React from 'react';

// Accepts any product type (diamond, gemstone, jewelry, etc.)
export interface ProductDetailsProps {
  product: any; // Replace 'any' with a union type for stricter typing
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  if (!product) return <div>No product found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="flex-shrink-0 w-full md:w-1/3">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {product.image ? (
              <img src={product.image} alt={product.name || product.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl">💎</span>
            )}
          </div>
        </div>
        {/* Product Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>{product.name || product.title}</h1>
          {product.subtitle && <div className="text-lg" style={{ color: 'var(--muted-foreground)' }}>{product.subtitle}</div>}
          <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
            {product.price ? `$${product.price.toLocaleString()}` : ''}
          </div>
          {/* Main Details Table */}
          <table className="w-full text-sm mt-4">
            <tbody>
              {Object.entries(product).map(([key, value]) => (
                key !== 'image' && key !== 'name' && key !== 'title' && key !== 'subtitle' && key !== 'price' && (
                  <tr key={key}>
                    <td className="font-medium pr-4 py-1 capitalize" style={{ color: 'var(--muted-foreground)' }}>{key.replace(/([A-Z])/g, ' $1')}</td>
                    <td className="py-1" style={{ color: 'var(--foreground)' }}>
                      {String(
                        value === undefined || value === null
                          ? ''
                          : Array.isArray(value)
                          ? value.join(', ')
                          : typeof value === 'object'
                          ? JSON.stringify(value)
                          : value
                      )}
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
