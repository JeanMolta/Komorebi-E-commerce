import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { selectCartItems, selectCartTotal } from '../../store/slices/cartSlice'
import CartItemCard from './CartItemCard'
import OrderSummary from './OrderSummary'

const Cart: React.FC = () => {
  const cartItems = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-var(--komorebi-offwhite) pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-[var(--komorebi-black)] mb-8">Shopping Cart</h1>
          
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-[var(--komorebi-black)] mb-2">
              Your cart is empty
            </h2>
            <p className="text-[var(--komorebi-black)]/60 mb-8">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link 
              to="/home"
              className="inline-block btn-komorebi-yellow px-8 py-3 rounded-3xl font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-var(--komorebi-offwhite) pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--komorebi-black)] mb-2">Shopping Cart</h1>
          <p className="text-[var(--komorebi-black)]/60">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--komorebi-offwhite)] rounded-3xl p-6 shadow-sm border border-gray-100">
              
              {/* Cart Items */}
              <div className="space-y-0">
                {cartItems.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </div>

              {/* Cart Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <Link 
                    to="/home"
                    className="text-[var(--komorebi-yellow)] hover:underline font-medium flex items-center"
                  >
                    ← Continue Shopping
                  </Link>
                  <div className="text-right">
                    <p className="text-sm text-[var(--komorebi-black)]/60">Subtotal</p>
                    <p className="text-xl font-bold text-[var(--komorebi-black)]">
                      ${total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart