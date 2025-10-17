import React, { useState } from 'react';
import type { Product } from '../../data/ProductTypes';

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.image ?? `/images/products/${product.id}.jpg`;
  const fallback = '/images/products/placeholder.jpg';

  const [added, setAdded] = useState(false);

  const handleAddClick = () => {
    setAdded(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform transform hover:-translate-y-1">
      <div className="w-full h-48 bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          onError={(e) => ((e.target as HTMLImageElement).src = fallback)}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.vendor}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-[var(--komorebi-black)]">{formatPrice(product.price)}</span>
          <button
            onClick={handleAddClick}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
              added
                ? 'bg-yellow-600 text-white cursor-default'
                : 'bg-[var(--komorebi-yellow)] text-[var(--komorebi-black)] hover:brightness-95'
            }`}
          >
            {added ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
