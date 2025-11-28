// src/components/homepage/ProductCard.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCartWithSync, selectCartItems } from '../../store/slices/cartSlice';
import { addToFavorites, removeFromFavorites, selectIsFavorite } from '../../store/slices/favoritesSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import type { Product } from '../../data/ProductTypes';
import type { RootState } from '../../store';

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
  const currentUser = useAppSelector(selectCurrentUser);
  
  // Check if product is in favorites
  const isFavorite = useSelector((state: RootState) => selectIsFavorite(state, product.id));
  
  // Check if product is in cart
  const cartItems = useAppSelector(selectCartItems);
  const isInCart = cartItems.some(item => item.id === product.id);
  
  // Set image URL from product data or use default path
  const imageUrl = product.image_url ?? `/images/products/${product.id}.jpg`;
  const fallback = '/images/products/placeholder.jpg';

  // Handle add to cart button click
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from firing
    
    // Add product to cart using Redux
    dispatch(addToCartWithSync(product));
  };

  // Handle favorite toggle
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentUser) {
      // Redirect to login if not authenticated
      navigate('/signin');
      return;
    }

    if (isFavorite) {
      dispatch(removeFromFavorites({ userId: currentUser.id, productId: product.id }));
    } else {
      dispatch(addToFavorites({ userId: currentUser.id, product }));
    }
  };

  // Navigate to product page when card is clicked
  const handleCardClick = () => {
    navigate(`/product/${product.id}`); // Asumiendo una ruta de detalle
  };

  return (
    // Card container with hover effect that lifts the card up
    <div 
      className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform transform hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick} // Handle click on card
    >
      {/* Product image container with fixed height */}
      <div className="w-full h-48 bg-gray-100 relative">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          // Fallback to placeholder if image fails to load
          onError={(e) => ((e.target as HTMLImageElement).src = fallback)}
          className="w-full h-full object-cover"
        />
        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 group"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            size={20} 
            className={`transition-colors duration-200 ${
              isFavorite 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-400 hover:text-red-500 group-hover:text-red-500'
            }`}
          />
        </button>
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
            disabled={isInCart}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
              isInCart
                ? 'bg-[var(--komorebi-yellow)] text-[var(--komorebi-black)] cursor-default'
                : 'bg-[var(--komorebi-yellow)] text-[var(--komorebi-black)] hover:brightness-95'
            }`}
          >
            {isInCart ? 'Added!' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;