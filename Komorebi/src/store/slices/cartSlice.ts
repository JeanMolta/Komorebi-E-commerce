import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import type { Product } from '../../data/ProductTypes'
import { supabase } from '../../lib/supabaseClient'

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
  const total = items.reduce((total, item) => total + item.price * item.quantity, 0)
  
  return { itemCount, total }
}

const initialState: CartState = loadCartFromStorage()

// Helpers: get user ID from Supabase
const getUserId = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return data.user.id
}

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

      // 🔥 Supabase insert/update
      ;(async () => {
        const userId = await getUserId()
        if (!userId) return

        const item = state.items.find(i => i.id === action.payload.id)

        await supabase.from('cart')
          .upsert({
            user_id: userId,
            product_id: item!.id,
            quantity: item!.quantity,
            updated_at: new Date().toISOString()
          })
      })()
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)

      const totals = calculateTotals(state.items)
      state.total = totals.total
      state.itemCount = totals.itemCount

      saveCartToStorage(state)

      // 🔥 Supabase DELETE
      ;(async () => {
        const userId = await getUserId()
        if (!userId) return
        
        await supabase
          .from('cart')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', action.payload)
      })()
    },

    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)

      if (!item) return

      if (quantity <= 0) {
        state.items = state.items.filter(i => i.id !== id)
      } else {
        item.quantity = quantity
      }

      const totals = calculateTotals(state.items)
      state.total = totals.total
      state.itemCount = totals.itemCount

      saveCartToStorage(state)

      // 🔥 Supabase update
      ;(async () => {
        const userId = await getUserId()
        if (!userId) return

        if (quantity <= 0) {
          await supabase.from('cart').delete().eq('user_id', userId).eq('product_id', id)
        } else {
          await supabase.from('cart')
            .upsert({
              user_id: userId,
              product_id: id,
              quantity,
              updated_at: new Date().toISOString()
            })
        }
      })()
    },

    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload)
      if (!item) return

      item.quantity += 1

      const totals = calculateTotals(state.items)
      state.total = totals.total
      state.itemCount = totals.itemCount

      saveCartToStorage(state)

      // 🔥 Supabase update
      ;(async () => {
        const userId = await getUserId()
        if (!userId) return

        await supabase.from('cart').upsert({
          user_id: userId,
          product_id: item.id,
          quantity: item.quantity,
          updated_at: new Date().toISOString()
        })
      })()
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload)
      if (!item) return

      if (item.quantity <= 1) {
        state.items = state.items.filter(i => i.id !== action.payload)
      } else {
        item.quantity -= 1
      }

      const totals = calculateTotals(state.items)
      state.total = totals.total
      state.itemCount = totals.itemCount

      saveCartToStorage(state)

      // 🔥 Supabase update
      ;(async () => {
        const userId = await getUserId()
        if (!userId) return

        if (item.quantity <= 0) {
          await supabase.from('cart')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', item.id)
        } else {
          await supabase.from('cart').upsert({
            user_id: userId,
            product_id: item.id,
            quantity: item.quantity,
            updated_at: new Date().toISOString()
          })
        }
      })()
    },

    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0

      saveCartToStorage(state)

      // 🔥 Supabase DELETE todo
      ;(async () => {
        const userId = await getUserId()
        if (!userId) return
        
        await supabase.from('cart').delete().eq('user_id', userId)
      })()
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

export default cartSlice.reducer
