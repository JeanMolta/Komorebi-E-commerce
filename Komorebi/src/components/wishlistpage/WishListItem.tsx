import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '../../data/ProductTypes';
import { removeFromFavorites } from '../../store/slices/favoritesSlice';
import { addToCartWithSync, selectCartItems } from '../../store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';

interface WishListItemProps {
  product: Product;
}

const WishListItem: React.FC<WishListItemProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  
  // Check if product is in cart
  const cartItems = useAppSelector(selectCartItems);
  const isInCart = cartItems.some(item => item.id === product.id);

  const handleRemoveFromWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (currentUser) {
      dispatch(removeFromFavorites({ userId: currentUser.id, productId: product.id }));
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCartWithSync(product));
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer group"
      onClick={handleProductClick}
    >
      <div className="aspect-square overflow-hidden bg-gray-50 relative">
        <img
          src={product.imageUrl || product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleRemoveFromWishlist}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-50 transition-colors duration-200 group"
          aria-label="Remove from wishlist"
        >
          <Heart 
            size={20} 
            className="text-red-500 fill-red-500 hover:scale-110 transition-transform duration-200" 
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2">{product.vendor}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-[var(--komorebi-black)]">
            ${product.price.toLocaleString()}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`p-2 rounded-3xl transition-all duration-200 flex items-center gap-1 hover:scale-105 ${
              isInCart 
                ? 'bg-[var(--komorebi-yellow)] text-[var(--komorebi-black)] cursor-default'
                : 'bg-[var(--komorebi-black)] text-white hover:bg-gray-800'
            }`}
            aria-label={isInCart ? "Added to cart" : "Add to cart"}
          >
            {isInCart ? (
              <span className="text-sm font-semibold">Added!</span>
            ) : (
              <ShoppingCart size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishListItem;