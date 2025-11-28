import React from 'react';
import { FileText } from 'lucide-react';
import type { Product } from '../../data/ProductTypes';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <div className="bg-transparent rounded-lg p-6 mb-6">
      {/* Single Tab Header */}
      <div className="flex border-b border-[var(--komorebi-gray)] mb-6">
        <div className="flex items-center px-6 py-3 font-medium border-b-2 border-[var(--komorebi-yellow)] text-[var(--komorebi-black)]">
          <FileText className="w-4 h-4 mr-2" />
          Description
        </div>
      </div>

      {/* Content */}
      <div className="text-[var(--komorebi-black)]/80 leading-relaxed">
        <div className="space-y-4">
          {product.description ? (
            <p>{product.description}</p>
          ) : (
            <p>No description available for this product.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
