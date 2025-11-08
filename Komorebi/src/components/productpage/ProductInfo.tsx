import React from 'react';
import { Star, MapPin, Truck, Clock } from 'lucide-react';
import type { Product } from '../../data/ProductTypes';

interface ProductInfoProps {
  product: Product;
  avgRating: number;
  reviewsCount: number;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, avgRating, reviewsCount }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-[var(--komorebi-yellow)] font-semibold text-sm">🏪 Komorebi</span>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.floor(avgRating) ? 'text-[var(--komorebi-yellow)] fill-current' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-[var(--komorebi-black)]/60 text-sm ml-1">
              {avgRating.toFixed(1)} ({reviewsCount} reviews)
            </span>
          </div>
        </div>
        
        <div className="flex items-center text-[var(--komorebi-black)]/60 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          Cali, Co
        </div>

        <h1 className="text-3xl font-bold text-[var(--komorebi-black)] mb-2">{product.name}</h1>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-4">
        <span className="text-3xl font-bold text-[var(--komorebi-black)]">
          ${product.price.toLocaleString()}
        </span>
        <span className="text-xl text-[var(--komorebi-black)]/50 line-through">
          ${(product.price * 1.3).toLocaleString()}
        </span>
      </div>

      {/* Shipping Info */}
      <div className="bg-transparent rounded-lg p-4 space-y-3">
        <div className="flex items-center text-[var(--komorebi-black)]">
          <Truck className="w-5 h-5 mr-3 text-[var(--komorebi-yellow)]" />
          <div>
            <p className="font-medium">Free Shipping over $20,000</p>
            <p className="text-sm text-[var(--komorebi-black)]/60">2-3 Business Days</p>
          </div>
        </div>
        
        <div className="flex items-center text-[var(--komorebi-black)]">
          <Clock className="w-5 h-5 mr-3 text-[var(--komorebi-yellow)]" />
          <div>
            <p className="font-medium">Fresh Delivery</p>
            <p className="text-sm text-[var(--komorebi-black)]/60">Prepared Daily</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
