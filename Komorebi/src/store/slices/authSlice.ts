import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabaseClient'

// User types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  location?: string
  description?: string
  avatarUrl?: string
  address?: string
  preferredLanguage?: string
  preferredCurrency?: string
  biography?: string
  createdAt?: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  location?: string
  description?: string
  password: string
  avatarFile?: File | null  // Archivo de avatar para subir
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
      // 1️⃣ Registrar en Supabase Auth (sin confirmación de email)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: undefined // Desactivar confirmación de email
        }
      })

      if (authError) throw new Error(authError.message)
      if (!authData.user) throw new Error("No se pudo crear el usuario")

      const userId = authData.user.id
      let avatarUrl = ''

      // 2️⃣ Subir avatar si se proporcionó
      if (userData.avatarFile) {
        try {
          console.log('📤 Uploading avatar for new user...')
          const { uploadImage } = await import('../../utils/imageUpload')
          avatarUrl = await uploadImage(userData.avatarFile, 'avatars')
          console.log('✅ Avatar uploaded:', avatarUrl)
        } catch (avatarError) {
          console.warn('⚠️ Avatar upload failed:', avatarError)
          // Continue registration even if avatar fails
        }
      }

      // 3️⃣ Crear perfil en tabla profiles (o actualizar si ya existe)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          location: userData.location,
          description: userData.description || '',
          avatar_url: avatarUrl,
          user_type: 'buyer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) throw new Error(profileError.message)

      // 4️⃣ Formar objeto User final
      const newUser: User = {
        id: userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        location: userData.location,
        description: userData.description,
        avatarUrl: avatarUrl,
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

// ⭐ UPDATE USER AVATAR (SUPABASE)
export const updateUserAvatar = createAsyncThunk(
  'auth/updateUserAvatar',
  async (avatarFile: File, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState }
      const currentUser = state.auth.currentUser
      if (!currentUser) throw new Error('No authenticated user')

      console.log('📤 Uploading new avatar...')
      const { uploadImage } = await import('../../utils/imageUpload')
      const avatarUrl = await uploadImage(avatarFile, 'avatars')
      console.log('✅ Avatar uploaded:', avatarUrl)

      // Update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id)

      if (profileError) throw new Error(profileError.message)

      return avatarUrl
    } catch (error) {
      console.error('❌ Avatar update failed:', error)
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update avatar'
      )
    }
  }
)

// ⭐ UPDATE USER PROFILE (SUPABASE)
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: Partial<User>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState }
      const currentUser = state.auth.currentUser
      if (!currentUser) throw new Error('No authenticated user')

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          location: userData.location,
          description: userData.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id)

      if (profileError) throw new Error(profileError.message)

      const updatedUser: User = {
        ...currentUser,
        ...userData
      }

      return updatedUser
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Update failed'
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
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        description: profile.description || '',
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
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      state.isAuthenticated = true
      state.error = null
    },
    clearCurrentUser: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.error = null
    },
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

      // UPDATE USER
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false
        state.currentUser = action.payload
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // UPDATE USER AVATAR
      .addCase(updateUserAvatar.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserAvatar.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        if (state.currentUser) {
          state.currentUser.avatarUrl = action.payload
        }
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const {
  setCurrentUser,
  clearCurrentUser,
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
