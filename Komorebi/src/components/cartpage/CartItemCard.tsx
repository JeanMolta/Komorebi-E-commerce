import React from 'react'
import { useAppDispatch } from '../../store/hooks'
import { increaseQuantity, decreaseQuantity, removeFromCart } from '../../store/slices/cartSlice'
import type { CartItem } from '../../store/slices/cartSlice'

interface CartItemCardProps {
  item: CartItem
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const dispatch = useAppDispatch()

  const handleIncrease = () => {
    dispatch(increaseQuantity(item.id))
  }

  const handleDecrease = () => {
    dispatch(decreaseQuantity(item.id))
  }

  const handleRemove = () => {
    dispatch(removeFromCart(item.id))
  }

  return (
    <div className="flex items-center py-4 border-b border-gray-200 last:border-b-0">
      
      {/* Product Image */}
      <div className="w-16 h-16 rounded-lg mr-4 flex-shrink-0 overflow-hidden">
        <img 
          src={item.imageUrl || item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-[var(--komorebi-black)] truncate">
          {item.name}
        </h3>
        <p className="text-xs text-[var(--komorebi-black)]/60 mt-1">
          by {item.vendor}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center mx-4">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
        >
          −
        </button>
        <span className="mx-3 min-w-[2rem] text-center text-sm font-medium text-[var(--komorebi-black)]">
          {item.quantity}
        </span>
        <button
          onClick={handleIncrease}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
        >
          +
        </button>
      </div>

      {/* Price */}
      <div className="text-sm font-medium text-[var(--komorebi-black)] min-w-[4rem] text-right mr-4">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="w-6 h-6 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center text-xs transition-colors flex-shrink-0"
      >
        ×
      </button>
    </div>
  )
}

export default CartItemCard