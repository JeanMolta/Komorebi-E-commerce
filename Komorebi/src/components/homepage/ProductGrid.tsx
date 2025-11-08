import React from 'react';
import ProductCard from './ProductCard';
import { productsData } from '../../data/ProductData';
import type { Product } from '../../data/ProductTypes';

const ProductGrid: React.FC = () => {
  return (
    // Main container with padding and centered layout
    <div className="p-5 max-w-[1200px] mx-auto">
      {/* Section header with bottom border */}
      <h2 className="text-[28px] font-semibold mb-5 border-b-2 border-gray-200 pb-2">
        Featured Snacks 🍣
      </h2>

      {/* Responsive grid that auto-fits cards with minimum width of 250px */}
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
        {/* Map through products array and render a ProductCard for each item */}
        {productsData.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;