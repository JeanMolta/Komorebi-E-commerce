import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../../data/ProductTypes'
import { supabase } from '../../lib/supabaseClient'

interface FavoriteState {
  items: Product[]
  loading: boolean
  error: string | null
}

// Load favorites from Supabase
export const loadFavorites = createAsyncThunk(
  'favorites/loadFavorites',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('product_data')
        .eq('user_id', userId)

      if (error) throw error

      return data.map((f: any) => f.product_data)
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

// Add favorite
export const addtofavorites = createAsyncThunk(
  'favorites/addFavorite',
  async ({ userId, product }: { userId: string; product: Product }, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from('favorites').insert({
        user_id: userId,
        product_id: product.id,
        product_data: product
      })

      if (error) throw error

      return product
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

// Remove favorite
export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFavorite',
  async ({ userId, productId }: { userId: string; productId: string }, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)

      if (error) throw error

      return productId
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

const initialState: FavoriteState = {
  items: [],
  loading: false,
  error: null
}

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavoritesState: (state) => {
      state.items = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Load favorites
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Add favorite
    builder
      .addCase(addtofavorites.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })

    // Remove favorite
    builder
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
      })
  }
})

export const { clearFavoritesState } = favoriteSlice.actions

// Selectors
export const selectFavoriteItems = (state: any) => state.favorites.items
export const selectFavoriteCount = (state: any) => state.favorites.items.length
export const selectIsFavorite = (state: any, productId: string) =>
  state.favorites.items.some((item: Product) => item.id === productId)

export default favoriteSlice.reducer
