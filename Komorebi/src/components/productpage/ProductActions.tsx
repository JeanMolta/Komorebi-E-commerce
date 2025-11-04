import React, { useState } from 'react';

interface ProductActionsProps {
  product: any;
}

// Format price to Colombian Peso currency format
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    alert(isFavorite ? 'Removed from favorites' : 'Added to favorites!');
  };

  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      {/* Quantity Selector */}
      <div className="mb-5">
        <label className="block mb-2 font-bold text-[var(--komorebi-black)]">
          Quantity:
        </label>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleQuantityChange(-1)}
            className="px-3 py-2 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-lg font-semibold"
          >
            -
          </button>
          <span className="text-lg font-bold min-w-[30px] text-center text-[var(--komorebi-black)]">
            {quantity}
          </span>
          <button 
            onClick={() => handleQuantityChange(1)}
            className="px-3 py-2 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-lg font-semibold"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button 
        onClick={handleAddToCart}
        className="w-full py-4 btn-komorebi-yellow rounded-full text-base font-bold mb-4 shadow-sm"
      >
        🛒 Add to Cart - {formatPrice(product.price * quantity)}
      </button>

      {/* Action Buttons Row */}
      <div className="flex gap-3">
        <button 
          onClick={handleToggleFavorite}
          className={`flex-1 py-3 px-4 border border-gray-300 rounded-full font-medium ${
            isFavorite 
              ? 'btn-komorebi-yellow' 
              : 'bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors'
          }`}
        >
          {isFavorite ? '❤️' : '🤍'} {isFavorite ? 'Saved' : 'Save'}
        </button>
        
        <button 
          className="flex-1 py-3 px-4 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-4xl transition-all font-medium text-gray-700"
          onClick={() => alert('Share functionality coming soon!')}
        >
          📤 Share
        </button>
        
        <button 
          className="py-3 px-4 border border-red-400 bg-gray-50 hover:bg-red-50 rounded-4xl transition-all font-medium text-red-600"
          onClick={() => alert('Report functionality coming soon!')}
        >
          ⚠️ Report
        </button>
      </div>
    </div>
  );
};

export default ProductActions;
