import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slices/productSlice'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import favoriteReducer from './slices/favoriteSlice'
import notificationReducer from './slices/notificationSlice'
import adReducer from './slices/adSlice'

export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    cart: cartReducer,
    favorites: favoriteReducer,
    notifications: notificationReducer,
    ads: adReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch