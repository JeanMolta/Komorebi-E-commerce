import React from 'react';

interface ProductInfoProps {
  product: any;
}

// Format price to Colombian Peso currency format
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  return (
    <div className="mb-8">
      {/* Product Title */}
      <h1 className="text-3xl font-bold mb-3 text-[var(--komorebi-black)]">
        {product.name}
      </h1>

      {/* Vendor Info */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[var(--komorebi-yellow)] font-bold">🏪 {product.vendor}</span>
        <span className="text-green-600 text-sm">✓</span>
      </div>

      {/* Location */}
      <p className="text-gray-600 mb-4">📍 Cali, Colombia</p>

      {/* Rating */}
      <div className="flex items-center gap-3 mb-5">
        <div className="text-lg">⭐⭐⭐⭐⭐</div>
        <span className="text-gray-600 text-sm">(4.8 rating)</span>
        <span className="text-gray-600 text-sm">(125 reviews)</span>
      </div>

      {/* Price */}
      <div className="mb-5">
        <span className="text-3xl font-bold text-[var(--komorebi-black)]">
          {formatPrice(product.price)}
        </span>
        <span className="text-xl text-gray-400 line-through ml-3">
          {formatPrice(product.price + 2000)}
        </span>
      </div>

      {/* Shipping Info */}
      <div className="bg-gray-50 p-4 rounded-lg mb-5 border border-gray-200">
        <p className="mb-2 text-green-600 text-sm">
          🚚 Free shipping over $20.000
        </p>
        <p className="mb-2 text-gray-700 text-sm">
          📅 Estimated delivery: 2-3 business days
        </p>
        <p className="mb-0 text-gray-600 text-sm">
          🍃 Fresh delivery prepared daily
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;
