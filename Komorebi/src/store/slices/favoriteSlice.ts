import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../../data/ProductTypes'

interface FavoriteState {
  items: Product[]
}

// Load favorites from localStorage
const loadFavoritesFromStorage = (): FavoriteState => {
  try {
    const savedFavorites = localStorage.getItem('komorebi-favorites')
    if (savedFavorites) {
      return JSON.parse(savedFavorites)
    }
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error)
  }
  
  return {
    items: []
  }
}

// Save favorites to localStorage
const saveFavoritesToStorage = (state: FavoriteState) => {
  try {
    localStorage.setItem('komorebi-favorites', JSON.stringify(state))
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error)
  }
}

const initialState: FavoriteState = loadFavoritesFromStorage()

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (!existingItem) {
        state.items.push(action.payload)
        saveFavoritesToStorage(state)
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      saveFavoritesToStorage(state)
    },
    clearFavorites: (state) => {
      state.items = []
      saveFavoritesToStorage(state)
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