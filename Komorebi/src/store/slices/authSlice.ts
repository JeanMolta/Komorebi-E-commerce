import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabaseClient'

// User types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
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

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  registrationSuccess: false
}

// ⭐ REGISTER USER (SUPABASE)
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      // 1️⃣ Registrar en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password
      })

      if (authError) throw new Error(authError.message)
      if (!authData.user) throw new Error("No se pudo crear el usuario")

      const userId = authData.user.id

      // 2️⃣ Crear perfil en tabla profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          location: userData.location,
          description: userData.description || '',
          avatar_url: '',
          user_type: 'client',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) throw new Error(profileError.message)

      // 3️⃣ Formar objeto User final
      const newUser: User = {
        id: userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        location: userData.location,
        description: userData.description,
        createdAt: new Date().toISOString()
      }

      return newUser
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Registration failed'
      )
    }
  }
)

// ⭐ LOGIN USER (SUPABASE)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      // 1️⃣ Login auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: loginData.email,
          password: loginData.password
        })

      if (authError) throw new Error(authError.message)
      if (!authData.user) throw new Error('No se encontró usuario')

      const userId = authData.user.id

      // 2️⃣ Obtener perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) throw new Error(profileError.message)

      // 3️⃣ Crear objeto User
      const user: User = {
        id: userId,
        email: authData.user.email!,
        firstName: '',
        lastName: '',
        phone: '',
        location: profile.location,
        description: profile.description,
        createdAt: profile.created_at
      }

      return user
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Login failed'
      )
    }
  }
)

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      supabase.auth.signOut()
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
    builder
      // REGISTER
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
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const {
  logout,
  clearError,
  clearRegistrationSuccess
} = authSlice.actions

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.currentUser

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated

export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading

export const selectAuthError = (state: { auth: AuthState }) =>
  state.auth.error

export const selectRegistrationSuccess = (state: { auth: AuthState }) =>
  state.auth.registrationSuccess

export default authSlice.reducer
