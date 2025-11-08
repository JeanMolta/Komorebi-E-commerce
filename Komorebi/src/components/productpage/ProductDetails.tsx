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
          <p>
            Experience the natural goodness of our carefully crafted cosmetic products. Each {product.name} is formulated with premium ingredients to deliver exceptional results while being gentle on your skin.
          </p>
          <div className="bg-[var(--komorebi-yellow)]/10 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--komorebi-black)] mb-2">Why Choose This Product?</h4>
            <ul className="space-y-1 text-sm">
              <li>✨ Developed with natural ingredients</li>
              <li>🧪 Scientifically tested and approved</li>
              <li>🌿 Eco-friendly and sustainable</li>
              <li>💯 Money-back guarantee</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
