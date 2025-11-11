import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Notification {
  id: string
  type: 'sale' | 'comment' | 'system'
  title: string
  message: string
  createdAt: string
  read: boolean
  userId?: string
  productId?: string
}

interface NotificationState {
  items: Notification[]
  unreadCount: number
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        read: false
      }
      
      state.items.unshift(notification)
      state.unreadCount = state.items.filter(item => !item.read).length
    },
    
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(item => item.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount = state.items.filter(item => !item.read).length
      }
    },
    
    markAllAsRead: (state) => {
      state.items.forEach(item => {
        item.read = true
      })
      state.unreadCount = 0
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.unreadCount = state.items.filter(item => !item.read).length
    },
    
    clearAllNotifications: (state) => {
      state.items = []
      state.unreadCount = 0
    }
  }
})

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications
} = notificationSlice.actions

// Selectors
export const selectNotifications = (state: { notifications: NotificationState }) => state.notifications.items
export const selectUnreadCount = (state: { notifications: NotificationState }) => state.notifications.unreadCount
export const selectUnreadNotifications = (state: { notifications: NotificationState }) => 
  state.notifications.items.filter(item => !item.read)

export default notificationSlice.reducer
