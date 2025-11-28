import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Product } from '../../data/ProductTypes'
import { supabase } from '../../lib/supabaseClient'

// Interfaces reales
interface User {
  id: string
  name: string
  avatar?: string
}

interface Comment {
  id: string
  productId: string
  userId: string
  rating?: number
  content: string
  createdAt: string
  user?: User
}

interface ProductState {
  products: Product[]
  currentProduct: Product | null
  currentProductComments: Comment[]
  loading: boolean
  error: string | null
  productLoading: boolean
  productError: string | null
  commentsLoading: boolean
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  currentProductComments: [],
  loading: false,
  error: null,
  productLoading: false,
  productError: null,
  commentsLoading: false,
}

/* ============================================================
   FETCH ALL PRODUCTS (Supabase)
============================================================ */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')

      if (error) throw error

      // Mapear al formato del front
      const mappedProducts: Product[] = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        vendor: p.vendor,
        price: p.price,
        image: p.image,
        imageUrl: p.image,
        category: p.category
      }))

      return mappedProducts
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

/* ============================================================
   FETCH PRODUCT + COMMENTS (Supabase)
============================================================ */
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId: string, { rejectWithValue }) => {
    try {
      /* ───────── PRODUCTO ───────── */
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (productError) throw productError
      if (!product) throw new Error('Producto no encontrado')

      const formattedProduct: Product = {
        id: product.id,
        name: product.name,
        vendor: product.vendor,
        price: product.price,
        image: product.image,
        imageUrl: product.image,
        category: product.category
      }

      /* ───────── COMMENTS ───────── */
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('productId', productId)
        .order('createdAt', { ascending: false })

      if (commentsError) throw commentsError

      /* ───────── Añadir datos del usuario ───────── */
      const commentsWithUser: Comment[] = []

      for (const c of comments) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', c.userId)
          .single()

        commentsWithUser.push({
          ...c,
          user: userData || { id: c.userId, name: 'Usuario Anónimo' }
        })
      }

      return {
        product: formattedProduct,
        comments: commentsWithUser
      }
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null
      state.productError = null
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
      state.currentProductComments = []
      state.productError = null
    },
  },
  extraReducers: (builder) => {
    /* ───────── FETCH ALL PRODUCTS ───────── */
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Error al cargar productos'
      })

    /* ───────── FETCH PRODUCT + COMMENTS ───────── */
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.productLoading = true
        state.commentsLoading = true
        state.productError = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productLoading = false
        state.commentsLoading = false
        state.currentProduct = action.payload.product
        state.currentProductComments = action.payload.comments
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productLoading = false
        state.commentsLoading = false
        state.productError = (action.payload as string) || 'Producto no encontrado'
      })
  }
})

export const { clearErrors, clearCurrentProduct } = productSlice.actions
export default productSlice.reducer

// Selectores
export const selectAllProducts = (state: any) => state.products.products
export const selectCurrentProduct = (state: any) => state.products.currentProduct
export const selectCurrentProductComments = (state: any) => state.products.currentProductComments
export const selectProductsLoading = (state: any) => state.products.loading
export const selectProductLoading = (state: any) => state.products.productLoading
export const selectCommentsLoading = (state: any) => state.products.commentsLoading
export const selectProductsError = (state: any) => state.products.error
export const selectProductError = (state: any) => state.products.productError
