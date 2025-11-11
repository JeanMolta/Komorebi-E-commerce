import React, { useEffect } from 'react';
import ProductCard from './ProductCard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts, selectAllProducts, selectProductsLoading } from '../../store/slices/productSlice';

const ProductGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const loading = useAppSelector(selectProductsLoading);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="p-5 max-w-[1200px] mx-auto">
        <h2 className="text-[28px] font-semibold mb-5 border-b-2 border-gray-200 pb-2">
          Featured Snacks
        </h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--komorebi-yellow)]"></div>
        </div>
      </div>
    );
  }

  return (
    // Main container with padding and centered layout
    <div className="p-5 max-w-[1200px] mx-auto">
      {/* Section header with bottom border */}
      <h2 className="text-[28px] font-semibold mb-5 border-b-2 border-gray-200 pb-2">
        Featured Snacks
      </h2>

      {/* Responsive grid that auto-fits cards with minimum width of 250px */}
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
        {/* Map through products array and render a ProductCard for each item */}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;