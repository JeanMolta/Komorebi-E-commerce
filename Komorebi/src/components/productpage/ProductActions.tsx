import React, { useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';
import type { Product } from '../../data/ProductTypes';

interface ProductActionsProps {
  product: Product;
  onAddToCart?: (productId: string, quantity: number) => void;
  onToggleFavorite?: (productId: string) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ 
  product, 
  onAddToCart,
  onToggleFavorite
}) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    // Add each item individually to respect quantity
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    
    if (onAddToCart) {
      onAddToCart(product.id, quantity);
    }
    
    console.log('🛒 Agregando al carrito:', product.name, 'cantidad:', quantity);
  };

  const handleToggleFavorite = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    } else {
      console.log('💖 Agregando a favoritos:', product.id);
      alert(`${product.name} ${newFavoriteState ? 'agregado a' : 'removido de'} favoritos!`);
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
        <div className="flex items-center border border-[var(--komorebi-gray)] rounded-lg">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-[var(--komorebi-black)]/60 hover:text-[var(--komorebi-black)]"
          >
            -
          </button>
          <span className="px-4 py-2 border-x border-[var(--komorebi-gray)]">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 text-[var(--komorebi-black)]/60 hover:text-[var(--komorebi-black)]"
          >
            +
          </button>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="flex-1 btn-komorebi-yellow py-3 px-6 rounded-3xl font-semibold flex items-center justify-center"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
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
