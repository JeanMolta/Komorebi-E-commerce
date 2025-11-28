import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabaseClient'

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
  loading: boolean
  error: string | null
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null
}

/* ============================================================
   LOAD NOTIFICATIONS FROM SUPABASE
============================================================ */
export const loadNotifications = createAsyncThunk(
  'notifications/load',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false })

      if (error) throw error

      return data
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

/* ============================================================
   ADD NOTIFICATION
============================================================ */
export const addNotificationDB = createAsyncThunk(
  'notifications/add',
  async (
    payload: Omit<Notification, 'id' | 'createdAt' | 'read'>,
    { rejectWithValue }
  ) => {
    try {
      const newNotification = {
        ...payload,
        read: false,
        createdAt: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert(newNotification)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

/* ============================================================
   MARK AS READ (1)
============================================================ */
export const markAsReadDB = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

      if (error) throw error
      return id
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

/* ============================================================
   MARK ALL AS READ
============================================================ */
export const markAllAsReadDB = createAsyncThunk(
  'notifications/markAllAsRead',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('userId', userId)

      if (error) throw error
      return true
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

/* ============================================================
   REMOVE NOTIFICATION
============================================================ */
export const removeNotificationDB = createAsyncThunk(
  'notifications/remove',
  async (id: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

/* ============================================================
   REDUX SLICE
============================================================ */
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Load
    builder.addCase(loadNotifications.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(loadNotifications.fulfilled, (state, action) => {
      state.loading = false
      state.items = action.payload
      state.unreadCount = action.payload.filter((n: Notification) => !n.read).length
    })
    builder.addCase(loadNotifications.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Add
    builder.addCase(addNotificationDB.fulfilled, (state, action) => {
      state.items.unshift(action.payload)
      state.unreadCount = state.items.filter(n => !n.read).length
    })

    // Mark as read
    builder.addCase(markAsReadDB.fulfilled, (state, action) => {
      const noti = state.items.find(n => n.id === action.payload)
      if (noti) noti.read = true
      state.unreadCount = state.items.filter(n => !n.read).length
    })

    // Mark ALL as read
    builder.addCase(markAllAsReadDB.fulfilled, (state) => {
      state.items.forEach(n => n.read = true)
      state.unreadCount = 0
    })

    // Remove
    builder.addCase(removeNotificationDB.fulfilled, (state, action) => {
      state.items = state.items.filter(n => n.id !== action.payload)
      state.unreadCount = state.items.filter(n => !n.read).length
    })
  }
})

export default notificationSlice.reducer

// Selectors
export const selectNotifications = (state: any) => state.notifications.items
export const selectUnreadCount = (state: any) => state.notifications.unreadCount
export const selectUnreadNotifications = (state: any) =>
  state.notifications.items.filter((n: Notification) => !n.read)
