import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../../data/ProductTypes'
import { supabase } from '../../lib/supabaseClient'

interface FavoriteState {
  items: Product[]
  loading: boolean
  error: string | null
}

// Load favorites from localStorage
const loadFavoritesFromStorage = (): Product[] => {
  try {
    const savedFavorites = localStorage.getItem('komorebi-favorites')
    if (savedFavorites) {
      return JSON.parse(savedFavorites)
    }
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error)
  }
  return []
}

// Save favorites to localStorage
const saveFavoritesToStorage = (items: Product[]) => {
  try {
    localStorage.setItem('komorebi-favorites', JSON.stringify(items))
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error)
  }
}

// Load favorites from Supabase
export const loadFavorites = createAsyncThunk(
  'favorites/loadFavorites',
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log('Loading favorites for user:', userId)
      
      // Primero obtenemos los IDs de productos favoritos
      const { data: favoriteIds, error: favError } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', userId)

      if (favError) {
        console.error('Error loading favorite IDs:', favError)
        throw favError
      }

      if (!favoriteIds || favoriteIds.length === 0) {
        console.log('No favorites found')
        return []
      }

      // Luego obtenemos los productos correspondientes
      const productIds = favoriteIds.map(f => f.product_id)
      const { data: products, error: prodError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          category_id,
          seller_id,
          image_url,
          stock,
          active
        `)
        .in('id', productIds)

      if (prodError) {
        console.error('Error loading favorite products:', prodError)
        throw prodError
      }

      // Mapear al formato Product que espera el frontend
      const mappedProducts = products?.map((p: any) => ({
        id: p.id,
        name: p.name,
        vendor: 'Komorebi Store',
        price: p.price,
        image: p.image_url,           // Mantener para retrocompatibilidad
        imageUrl: p.image_url,        // Mantener para retrocompatibilidad
        image_url: p.image_url,       // Campo principal según ProductTypes
        category: 'General',          // Podríamos hacer otro JOIN para obtener el nombre de la categoría
        description: p.description || '',
        seller_id: p.seller_id,
        stock: p.stock,
        active: p.active
      })) || []

      console.log('Loaded favorite products:', mappedProducts.length)
      return mappedProducts
    } catch (err: any) {
      console.error('Error in loadFavorites:', err)
      return rejectWithValue(err.message)
    }
  }
)

// Add favorite
export const addToFavorites = createAsyncThunk(
  'favorites/addFavorite',
  async ({ userId, product }: { userId: string; product: Product }, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from('favorites').insert({
        user_id: userId,
        product_id: product.id
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
  items: loadFavoritesFromStorage(),
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
      saveFavoritesToStorage([])
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
        saveFavoritesToStorage(action.payload)
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Add favorite
    builder
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.items.push(action.payload)
        saveFavoritesToStorage(state.items)
      })

    // Remove favorite
    builder
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
        saveFavoritesToStorage(state.items)
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
