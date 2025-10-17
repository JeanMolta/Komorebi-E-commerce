// ProductGrid.tsx
import React from 'react';
import ProductCard from './ProductCard';
import { products } from '../data/ProductData';
import type { Product } from '../data/ProductTypes';

const ProductGrid: React.FC = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Featured Snacks 🍣</h2>
      <div style={styles.grid}>
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px',
    maxWidth: '1200px', 
    margin: '0 auto',
  },

  title: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '20px',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
  },

  grid: {
    display: 'grid',
    gap: '20px', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  },
};

export default ProductGrid;