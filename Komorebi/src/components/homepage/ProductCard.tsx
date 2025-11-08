import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';
import type { Product } from '../../data/ProductTypes';

interface ProductCardProps {
  product: Product;
}

// Format price to Colombian Peso currency format
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Set image URL from product data or use default path
  const imageUrl = product.image ?? `/images/products/${product.id}.jpg`;
  const fallback = '/images/products/placeholder.jpg';

  // Track whether product has been added to cart
  const [added, setAdded] = useState(false);

  // Handle add to cart button click
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se active el click del card
    dispatch(addToCart(product));
    setAdded(true);
    
    // Reset "Added" state after 2 seconds
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  // Navigate to product page when card is clicked
  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };


  return (
    // Card container with hover effect that lifts the card up
    <div 
      className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform transform hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Product image container with fixed height */}
      <div className="w-full h-48 bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          // Fallback to placeholder if image fails to load
          onError={(e) => ((e.target as HTMLImageElement).src = fallback)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product details section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        {/* Product name and vendor */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.vendor}</p>
        </div>

        {/* Price and add button row */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-[var(--komorebi-black)]">{formatPrice(product.price)}</span>
          {/* Add button that changes appearance when clicked */}
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