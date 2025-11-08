import React from 'react'
import { useAppSelector } from '../../store/hooks'
import { 
  selectCartItemCount, 
  selectCartSubtotal, 
  selectCartShipping, 
  selectCartTaxes, 
  selectCartFinalTotal 
} from '../../store/slices/cartSlice'

const OrderSummary: React.FC = () => {
  const itemCount = useAppSelector(selectCartItemCount)
  const subtotal = useAppSelector(selectCartSubtotal)
  const shipping = useAppSelector(selectCartShipping)
  const taxes = useAppSelector(selectCartTaxes)
  const total = useAppSelector(selectCartFinalTotal)

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    alert('Checkout functionality will be implemented soon!')
  }

  return (
    <div className="bg-var(--komorebi-offwhite) rounded-lg p-6 shadow-sm border border-gray-100 h-fit">
      <h2 className="text-lg font-semibold text-[var(--komorebi-black)] mb-6">
        Order Summary
      </h2>

      <div className="space-y-4">
        {/* Items Count */}
        <div className="flex justify-between text-sm">
          <span className="text-[var(--komorebi-black)]/70">Items ({itemCount})</span>
          <span className="text-[var(--komorebi-black)]">${subtotal.toFixed(2)}</span>
        </div>

        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-[var(--komorebi-black)]/70">Subtotal</span>
          <span className="text-[var(--komorebi-black)]">${subtotal.toFixed(2)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-[var(--komorebi-black)]/70">Shipping</span>
          <span className="text-[var(--komorebi-black)]">
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        {/* Free shipping notice */}
        {subtotal > 0 && subtotal < 100 && (
          <div className="text-xs text-[var(--komorebi-green)] bg-green-50 p-2 rounded">
            Add ${(100 - subtotal).toFixed(2)} more for free shipping
          </div>
        )}

        {/* Taxes */}
        <div className="flex justify-between text-sm">
          <span className="text-[var(--komorebi-black)]/70">Taxes</span>
          <span className="text-[var(--komorebi-black)]">${taxes.toFixed(2)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-[var(--komorebi-black)]">Total</span>
            <span className="text-[var(--komorebi-black)]">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={itemCount === 0}
          className={`w-full py-4 rounded-3xl font-semibold transition-all mt-6 ${
            itemCount === 0
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'btn-komorebi-yellow'
          }`}
        >
          Proceed to Checkout
        </button>

        {/* Continue Shopping Link */}
        <div className="text-center mt-2">
          <a 
            href="/home" 
            className="text-lg text-[var(--komorebi-yellow)] hover:underline"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary