import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
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
  loading: boolean
  error: string | null
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
    itemCount: 0,
    loading: false,
    error: null
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

// Load cart from Supabase
export const loadCartFromSupabase = createAsyncThunk(
  'cart/loadFromSupabase',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data: cartItems, error } = await supabase
        .from('cart')
        .select(`
          quantity,
          product_id,
          products (
            id,
            name,
            price,
            image_url,
            category,
            condition,
            description,
            location,
            availability,
            seller_id
          )
        `)
        .eq('user_id', userId)

      if (error) throw error

      const items: CartItem[] = cartItems.map((item: any) => ({
        ...item.products,
        quantity: item.quantity
      }))

      return items
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

/* ============================================================
   SYNC CART TO SUPABASE
============================================================ */
export const syncCartItemToSupabase = createAsyncThunk(
  'cart/syncItemToSupabase',
  async ({ userId, productId, quantity }: { userId: string, productId: string, quantity: number }, { rejectWithValue }) => {
    try {
      if (quantity > 0) {
        // Insert or update cart item
        const { error } = await supabase
          .from('cart')
          .upsert({
            user_id: userId,
            product_id: productId,
            quantity: quantity
          })

        if (error) throw error
      } else {
        // Remove item if quantity is 0
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId)

        if (error) throw error
      }
    } catch (err: any) {
      console.error('Error syncing cart to Supabase:', err)
      return rejectWithValue(err.message)
    }
  }
)

export const clearCartInSupabase = createAsyncThunk(
  'cart/clearInSupabase',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId)

      if (error) throw error
    } catch (err: any) {
      console.error('Error clearing cart in Supabase:', err)
      return rejectWithValue(err.message)
    }
  }
)

/* ============================================================
   ADD TO CART WITH SUPABASE SYNC
============================================================ */
export const addToCartWithSync = createAsyncThunk(
  'cart/addToCartWithSync',
  async (product: Product, { dispatch, getState }) => {
    // First update local state
    dispatch(addToCartLocal(product))
    
    // Then sync to Supabase
    const userId = await getUserId()
    if (userId) {
      const state = getState() as RootState
      const cartItem = state.cart.items.find(item => item.id === product.id)
      if (cartItem) {
        dispatch(syncCartItemToSupabase({ 
          userId, 
          productId: product.id, 
          quantity: cartItem.quantity 
        }))
      }
    }
  }
)

export const removeFromCartWithSync = createAsyncThunk(
  'cart/removeFromCartWithSync',
  async (productId: string, { dispatch, getState }) => {
    // First update local state
    dispatch(removeFromCartLocal(productId))
    
    // Then sync to Supabase
    const userId = await getUserId()
    if (userId) {
      dispatch(syncCartItemToSupabase({ 
        userId, 
        productId, 
        quantity: 0 
      }))
    }
  }
)

export const updateQuantityWithSync = createAsyncThunk(
  'cart/updateQuantityWithSync',
  async ({ productId, quantity }: { productId: string, quantity: number }, { dispatch, getState }) => {
    // First update local state
    dispatch(updateQuantityLocal({ productId, quantity }))
    
    // Then sync to Supabase
    const userId = await getUserId()
    if (userId) {
      dispatch(syncCartItemToSupabase({ 
        userId, 
        productId, 
        quantity 
      }))
    }
  }
)

export const clearCartWithSync = createAsyncThunk(
  'cart/clearCartWithSync',
  async (_, { dispatch }) => {
    // First clear local state
    dispatch(clearCartLocal())
    
    // Then clear in Supabase
    const userId = await getUserId()
    if (userId) {
      dispatch(clearCartInSupabase(userId))
    }
  }
)

export const increaseQuantityWithSync = createAsyncThunk(
  'cart/increaseQuantityWithSync',
  async (productId: string, { dispatch, getState }) => {
    // First update local state
    dispatch(increaseQuantity(productId))
    
    // Then sync to Supabase
    const userId = await getUserId()
    if (userId) {
      const state = getState() as RootState
      const cartItem = state.cart.items.find(item => item.id === productId)
      if (cartItem) {
        dispatch(syncCartItemToSupabase({ 
          userId, 
          productId, 
          quantity: cartItem.quantity 
        }))
      }
    }
  }
)

export const decreaseQuantityWithSync = createAsyncThunk(
  'cart/decreaseQuantityWithSync',
  async (productId: string, { dispatch, getState }) => {
    // First update local state
    dispatch(decreaseQuantity(productId))
    
    // Then sync to Supabase
    const userId = await getUserId()
    if (userId) {
      const state = getState() as RootState
      const cartItem = state.cart.items.find(item => item.id === productId)
      const quantity = cartItem ? cartItem.quantity : 0
      
      dispatch(syncCartItemToSupabase({ 
        userId, 
        productId, 
        quantity 
      }))
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local-only reducers (for internal use by thunks)
    addToCartLocal: (state, action: PayloadAction<Product>) => {
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
    removeFromCartLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)

      const totals = calculateTotals(state.items)
      state.total = totals.total
      state.itemCount = totals.itemCount

      saveCartToStorage(state)
    },
    updateQuantityLocal: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload
      
      if (quantity <= 0) {
        state.items = state.items.filter(item => item.id !== productId)
      } else {
        const existingItem = state.items.find(item => item.id === productId)
        if (existingItem) {
          existingItem.quantity = quantity
        }
      }

      const totals = calculateTotals(state.items)
      state.total = totals.total
      state.itemCount = totals.itemCount

      saveCartToStorage(state)
    },
    clearCartLocal: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0
      state.error = null

      saveCartToStorage(state)
    },
    clearCartState: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0
      state.loading = false
      state.error = null
      
      saveCartToStorage(state)
    },
    
    // Legacy reducers for backward compatibility (now just call local versions)
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
    },

    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload)
      if (!item) return

      item.quantity += 1

      const totals = calculateTotals(state.items)
      state.total = totals.total
      state.itemCount = totals.itemCount

      saveCartToStorage(state)
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
    },

    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0
      state.error = null

      saveCartToStorage(state)
    },

    clearCartState: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCartFromSupabase.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadCartFromSupabase.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload

        const totals = calculateTotals(state.items)
        state.total = totals.total
        state.itemCount = totals.itemCount

        saveCartToStorage(state)
      })
      .addCase(loadCartFromSupabase.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  clearCartState,
  addToCartLocal,
  removeFromCartLocal,
  updateQuantityLocal,
  clearCartLocal
} = cartSlice.actions

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartTotal = (state: RootState) => state.cart.total
export const selectCartItemCount = (state: RootState) => state.cart.itemCount
export const selectCartLoading = (state: RootState) => state.cart.loading
export const selectCartError = (state: RootState) => state.cart.error
export const selectCartSubtotal = (state: RootState) => state.cart.total
export const selectCartShipping = (state: RootState) => state.cart.total > 0 ? (state.cart.total > 100 ? 0 : 15) : 0
export const selectCartTaxes = (state: RootState) => state.cart.total * 0.08
export const selectCartFinalTotal = (state: RootState) => {
  const subtotal = state.cart.total
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 15) : 0
  const taxes = subtotal * 0.08
  return subtotal + shipping + taxes
}

export default cartSlice.reducer
