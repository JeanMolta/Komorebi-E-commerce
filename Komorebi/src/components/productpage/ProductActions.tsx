import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCartWithSync, selectCartItems } from '../../store/slices/cartSlice';
import { addToFavorites, removeFromFavorites, selectIsFavorite } from '../../store/slices/favoritesSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import type { Product } from '../../data/ProductTypes';

interface ProductActionsProps {
  product: Product;
  onAddToCart?: (productId: string, quantity: number) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ 
  product, 
  onAddToCart,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, product.id));
  
  const [quantity, setQuantity] = useState(1);
  
  // Check if product is in cart
  const cartItems = useAppSelector(selectCartItems);
  const isInCart = cartItems.some(item => item.id === product.id);

  const handleAddToCart = () => {
    // Add each item individually to respect quantity
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCartWithSync(product));
    }
    
    if (onAddToCart) {
      onAddToCart(product.id, quantity);
    }
    
    console.log('🛒 Agregando al carrito:', product.name, 'cantidad:', quantity);
  };

  const handleToggleFavorite = () => {
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

  const handleShare = () => {
    console.log('📤 Compartiendo:', product.id);
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Mira este producto: ${product.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado!');
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity and Add to Cart */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-[var(--komorebi-gray)] rounded-3xl">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-[var(--komorebi-black)]/60 hover:text-[var(--komorebi-black)]"
          >
            -
          </button>
          <span className="px-4 py-2">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 text-[var(--komorebi-black)]/60 hover:text-[var(--komorebi-black)]"
          >
            +
          </button>
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={isInCart}
          className={`flex-1 py-3 px-6 rounded-3xl font-semibold flex items-center justify-center transition-all duration-200 ${
            isInCart
              ? 'bg-[var(--komorebi-yellow)] text-[var(--komorebi-black)] cursor-default'
              : 'btn-komorebi-yellow hover:brightness-95'
          }`}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {isInCart ? 'Added!' : 'Add to Cart'}
        </button>
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={handleToggleFavorite}
          className="border-2 border-[var(--komorebi-pink)]/30 text-[var(--komorebi-pink)] py-3 px-4 rounded-full font-medium hover:bg-[var(--komorebi-pink)]/10 transition-colors flex items-center justify-center"
        >
          <Heart className={`w-4 h-4 mr-1 ${isFavorite ? 'fill-current' : ''}`} />
          {isFavorite ? 'Saved' : 'Save'}
        </button>
        
        <button 
          onClick={handleShare}
          className="border-2 border-[var(--komorebi-gray)] text-[var(--komorebi-black)] py-3 px-4 rounded-full font-medium hover:bg-[var(--komorebi-gray)]/20 transition-colors"
        >
          📤 Share
        </button>
      </div>
    </div>
  );
};

export default ProductActions;
