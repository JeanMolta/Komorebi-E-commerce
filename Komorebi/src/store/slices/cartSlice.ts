import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import type { Product } from '../../data/ProductTypes'

export interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

// Load cart from localStorage
const loadCartFromStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem('komorebi-cart')
    if (savedCart) {
      return JSON.parse(savedCart)
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
  }
  
  return {
    items: [],
    total: 0,
    itemCount: 0
  }
}

// Save cart to localStorage
const saveCartToStorage = (state: CartState) => {
  try {
    localStorage.setItem('komorebi-cart', JSON.stringify(state))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

// Calculate totals
const calculateTotals = (items: CartItem[]) => {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const total = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  
  return { itemCount, total }
}

const initialState: CartState = loadCartFromStorage()

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      
      const totals = calculateTotals(state.items)
      state.total = totals.total
      state.itemCount = totals.itemCount
      
      saveCartToStorage(state)
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      
      const totals = calculateTotals(state.items)
      state.total = totals.total
      state.itemCount = totals.itemCount
      
      saveCartToStorage(state)
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id)
        } else {
          item.quantity = quantity
        }
        
        const totals = calculateTotals(state.items)
        state.total = totals.total
        state.itemCount = totals.itemCount
        
        saveCartToStorage(state)
      }
    },
    
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload)
      if (item) {
        item.quantity += 1
        
        const totals = calculateTotals(state.items)
        state.total = totals.total
        state.itemCount = totals.itemCount
        
        saveCartToStorage(state)
      }
    },
    
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload)
      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter(item => item.id !== action.payload)
        } else {
          item.quantity -= 1
        }
        
        const totals = calculateTotals(state.items)
        state.total = totals.total
        state.itemCount = totals.itemCount
        
        saveCartToStorage(state)
      }
    },
    
    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0
      
      saveCartToStorage(state)
    }
  }
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart
} = cartSlice.actions

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartTotal = (state: RootState) => state.cart.total
export const selectCartItemCount = (state: RootState) => state.cart.itemCount
export const selectCartSubtotal = (state: RootState) => state.cart.total
export const selectCartShipping = (state: RootState) => state.cart.total > 0 ? (state.cart.total > 100 ? 0 : 15) : 0
export const selectCartTaxes = (state: RootState) => state.cart.total * 0.08 // 8% tax
export const selectCartFinalTotal = (state: RootState) => {
  const subtotal = state.cart.total
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 15) : 0
  const taxes = subtotal * 0.08
  return subtotal + shipping + taxes
}

export default cartSlice.reducer