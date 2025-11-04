import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Product } from '../../data/ProductTypes'
import productsData from '../../data/products.json'
import commentsData from '../../data/comments.json'
import usersData from '../../data/users.json'

// Interfaces para comments y reviews
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

// Cargar todos los productos
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mappedProducts: Product[] = productsData.map(product => ({
      id: product.id,
      name: product.name,
      vendor: product.vendor,
      price: product.price,
      image: product.image,
      imageUrl: product.image
    }))
    
    return mappedProducts
  }
)

// Cargar producto por ID con sus comentarios
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const foundProduct = productsData.find(p => p.id === productId)
    
    if (!foundProduct) {
      throw new Error('Producto no encontrado')
    }
    
    // Obtener comentarios del producto
    const productComments = commentsData
      .filter(comment => comment.productId === productId)
      .map(comment => {
        const user = usersData.find(u => u.id === comment.userId)
        return {
          ...comment,
          user: user || { id: comment.userId, name: 'Usuario Anónimo' }
        }
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    const product: Product = {
      id: foundProduct.id,
      name: foundProduct.name,
      vendor: foundProduct.vendor,
      price: foundProduct.price,
      image: foundProduct.image,
      imageUrl: foundProduct.image
    }
    
    return { product, comments: productComments }
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
    // FETCH ALL PRODUCTS
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
        state.error = action.error.message || 'Error al cargar productos'
      })
    
    // FETCH SINGLE PRODUCT WITH COMMENTS
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.productLoading = true
        state.productError = null
        state.commentsLoading = true
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
        state.productError = action.error.message || 'Producto no encontrado'
      })
  }
})

export const { clearErrors, clearCurrentProduct } = productSlice.actions
export default productSlice.reducer

// Selectores
export const selectAllProducts = (state: { products: ProductState }) => state.products.products
export const selectCurrentProduct = (state: { products: ProductState }) => state.products.currentProduct
export const selectCurrentProductComments = (state: { products: ProductState }) => state.products.currentProductComments
export const selectProductsLoading = (state: { products: ProductState }) => state.products.loading
export const selectProductLoading = (state: { products: ProductState }) => state.products.productLoading
export const selectCommentsLoading = (state: { products: ProductState }) => state.products.commentsLoading
export const selectProductsError = (state: { products: ProductState }) => state.products.error
export const selectProductError = (state: { products: ProductState }) => state.products.productError