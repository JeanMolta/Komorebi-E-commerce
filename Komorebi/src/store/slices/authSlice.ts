import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Types
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  description?: string
  createdAt: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  description?: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  registrationSuccess: boolean
}

// Initial state
const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  registrationSuccess: false
}

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Check if email already exists (mock validation)
      if (userData.email === 'test@test.com') {
        throw new Error('Email already exists')
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        location: userData.location,
        description: userData.description,
        createdAt: new Date().toISOString()
      }

      // In real app, this would be saved to backend
      console.log('✅ User registered successfully:', newUser)
      
      return newUser
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed')
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock login validation
      if (loginData.email === 'demo@komorebi.com' && loginData.password === 'password123') {
        const user: User = {
          id: 'user_demo',
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@komorebi.com',
          phone: '+57 300 000 0000',
          location: 'Cali, Colombia',
          description: 'Demo account for testing',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
        return user
      } else {
        throw new Error('Invalid email or password')
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed')
    }
  }
)

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
    clearRegistrationSuccess: (state) => {
      state.registrationSuccess = false
    }
  },
  extraReducers: (builder) => {
    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.registrationSuccess = false
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
        state.registrationSuccess = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.registrationSuccess = false
      })
    
    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

// Actions
export const { logout, clearError, clearRegistrationSuccess } = authSlice.actions

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.currentUser
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error
export const selectRegistrationSuccess = (state: { auth: AuthState }) => state.auth.registrationSuccess

export default authSlice.reducer