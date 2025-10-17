import React from 'react';
import ProductCard from './ProductCard';
import { products } from '../../data/ProductData';
import type { Product } from '../../data/ProductTypes';

const ProductGrid: React.FC = () => {
  return (
    <div className="p-5 max-w-[1200px] mx-auto">
      <h2 className="text-[28px] font-semibold mb-5 border-b-2 border-gray-200 pb-2">
        Featured Snacks 🍣
      </h2>

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
