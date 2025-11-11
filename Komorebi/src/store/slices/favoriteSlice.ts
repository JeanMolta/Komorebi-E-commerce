import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../../data/ProductTypes'

interface FavoriteState {
  items: Product[]
}

const initialState: FavoriteState = {
  items: []
}

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (!existingItem) {
        state.items.push(action.payload)
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    clearFavorites: (state) => {
      state.items = []
    }
  }
})

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoriteSlice.actions

// Selectors
export const selectFavoriteItems = (state: { favorites: FavoriteState }) => state.favorites.items
export const selectFavoriteCount = (state: { favorites: FavoriteState }) => state.favorites.items.length
export const selectIsFavorite = (state: { favorites: FavoriteState }, productId: string) => 
  state.favorites.items.some(item => item.id === productId)

export default favoriteSlice.reducer