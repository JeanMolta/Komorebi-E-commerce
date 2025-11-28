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
  content: string
  rating?: number // Make rating optional since it doesn't exist in comments table
  createdAt: string
  user?: User
}

interface ProductState {
  products: Product[]
  currentProduct: Product | null
  currentProductComments: Comment[]
  currentProductReviews: Review[]
  loading: boolean
  error: string | null
  productLoading: boolean
  productError: string | null
  commentsLoading: boolean
  creatingComment: boolean
  creatingReview: boolean
}

interface Review {
  id: string
  productId: string
  userId: string
  title: string
  content: string
  rating: number
  createdAt: string
  user?: User
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  currentProductComments: [],
  currentProductReviews: [],
  loading: false,
  error: null,
  productLoading: false,
  productError: null,
  commentsLoading: false,
  creatingComment: false,
  creatingReview: false,
}

/* ============================================================
   CREATE NEW PRODUCT (Supabase)
============================================================ */
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: {
    name: string
    description: string
    price: number
    seller_id: string
    category?: string
    image_url?: string
    images?: string[]  // Array de todas las URLs de imágenes
    stock?: number
  }, { rejectWithValue }) => {
    try {
      // Handle category - create slug from category name
      const categoryName = productData.category || 'General'
      const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-')
      let categoryId = 'default'
      
      // Try to find existing category
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single()
      
      if (existingCategory) {
        categoryId = existingCategory.id
      } else {
        // Create new category if it doesn't exist
        const { data: newCategory, error: categoryError } = await supabase
          .from('categories')
          .insert({
            name: categoryName,
            slug: categorySlug,
            description: `${categoryName} category for products`,
            created_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (categoryError) {
          console.warn('Could not create category:', categoryError.message)
          // Fallback to default category
          const { data: defaultCat } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', 'general')
            .single()
          categoryId = defaultCat?.id || 'default'
        } else {
          categoryId = newCategory.id
        }
      }

      console.log('Creating product with image_url:', productData.image_url)
      
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category_id: categoryId,
          seller_id: productData.seller_id,
          image_url: productData.image_url || '',
          images: productData.images || [],  // Guardar array de imágenes en campo JSONB
          stock: productData.stock || 1,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      console.log('Product created successfully:', data)
      console.log('Stored image_url in database:', data.image_url)

      const newProduct: Product = {
        id: data.id,
        name: data.name,
        vendor: 'Your Store', // Will be filled from seller profile
        price: data.price,
        image: data.image_url,            // Mantener para retrocompatibilidad
        imageUrl: data.image_url,         // Mantener para retrocompatibilidad
        image_url: data.image_url,        // Campo principal según ProductTypes
        category: productData.category || 'General',
        description: data.description || '',
        seller_id: data.seller_id,
        stock: data.stock,
        active: data.active
      }

      return newProduct
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create product')
    }
  }
)

/* ============================================================
   FETCH ALL PRODUCTS (Supabase)
============================================================ */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching products from Supabase...')
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          category_id,
          seller_id,
          image_url,
          images,
          stock,
          active,
          created_at,
          updated_at,
          categories (
            name
          )
        `)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      if (!data) {
        console.log('No products found, returning empty array')
        return []
      }

      console.log('Products fetched:', data.length)

      // Mapear al formato del front
      const mappedProducts: Product[] = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        vendor: 'Komorebi Store',
        price: p.price,
        image: p.image_url,           // Mantener para retrocompatibilidad
        imageUrl: p.image_url,        // Mantener para retrocompatibilidad  
        image_url: p.image_url,       // Campo principal según ProductTypes
        images: p.images || [],       // Array de imágenes adicionales
        category: p.categories?.name || 'General',
        description: p.description || '',
        seller_id: p.seller_id,
        stock: p.stock,
        active: p.active
      }))

      return mappedProducts
    } catch (err: any) {
      console.error('Error fetching products:', err)
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
        .select(`
          id,
          name,
          description,
          price,
          category_id,
          seller_id,
          image_url,
          images,
          stock,
          active,
          created_at,
          updated_at,
          categories (
            name
          )
        `)
        .eq('id', productId)
        .single()

      if (productError) throw productError
      if (!product) throw new Error('Producto no encontrado')

      const formattedProduct: Product = {
        id: product.id,
        name: product.name,
        vendor: 'Komorebi Store',
        price: product.price,
        image: product.image_url,           // Mantener para retrocompatibilidad
        imageUrl: product.image_url,        // Mantener para retrocompatibilidad
        image_url: product.image_url,       // Campo principal según ProductTypes
        images: product.images || [],       // Array de imágenes adicionales
        category: product.categories?.name || 'General',
        description: product.description || '',
        seller_id: product.seller_id,
        stock: product.stock,
        active: product.active
      }

      /* ───────── COMMENTS ───────── */
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (commentsError) throw commentsError

      /* ───────── Añadir datos del usuario ───────── */
      const commentsWithUser: Comment[] = []

      for (const c of comments) {
        const { data: userData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', c.user_id)
          .single()

        commentsWithUser.push({
          id: c.id,
          productId: productId,
          userId: c.user_id,
          content: c.content, // Direct mapping - correct column name
          createdAt: c.created_at,
          user: userData ? {
            id: userData.id,
            name: `${userData.first_name} ${userData.last_name}`,
            avatar: userData.avatar_url
          } : { 
            id: c.user_id, 
            name: 'Usuario Anónimo' 
          }
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

/* ============================================================
   CREATE COMMENT (Supabase)
============================================================ */
export const createComment = createAsyncThunk(
  'products/createComment',
  async ({ productId, content, userId }: {
    productId: string
    content: string
    userId: string
  }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          product_id: productId,
          user_id: userId,
          content: content, // Using 'content' - correct column name
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Get user data
      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      const transformedComment: Comment = {
        id: data.id,
        productId: data.product_id,
        userId: data.user_id,
        content: data.content, // Direct mapping
        createdAt: data.created_at,
        user: userData ? {
          id: userData.id,
          name: `${userData.first_name} ${userData.last_name}`,
          avatar: userData.avatar_url
        } : {
          id: data.user_id,
          name: 'Usuario Anónimo'
        }
      }

      return transformedComment
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

/* ============================================================
   CREATE REVIEW (Supabase)
============================================================ */
export const createReview = createAsyncThunk(
  'products/createReview',
  async ({ productId, title, content, rating, userId }: {
    productId: string
    title: string
    content: string
    rating: number
    userId: string
  }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: userId,
          title,
          comment: content, // Using 'comment' instead of 'content'
          rating,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Get user data
      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      const transformedReview: Review = {
        id: data.id,
        productId: data.product_id,
        userId: data.user_id,
        title: data.title,
        content: data.comment, // Map back to content
        rating: data.rating,
        createdAt: data.created_at,
        user: userData ? {
          id: userData.id,
          name: `${userData.first_name} ${userData.last_name}`,
          avatar: userData.avatar_url
        } : {
          id: data.user_id,
          name: 'Usuario Anónimo'
        }
      }

      return transformedReview
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

/* ============================================================
   FETCH REVIEWS (Supabase)
============================================================ */
export const fetchProductReviews = createAsyncThunk(
  'products/fetchProductReviews',
  async (productId: string, { rejectWithValue }) => {
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const reviewsWithUser: Review[] = []

      for (const r of reviews) {
        const { data: userData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', r.user_id)
          .single()

        reviewsWithUser.push({
          id: r.id,
          productId: r.product_id,
          userId: r.user_id,
          title: r.title,
          content: r.comment, // Map from 'comment' to 'content'
          rating: r.rating,
          createdAt: r.created_at,
          user: userData ? {
            id: userData.id,
            name: `${userData.first_name} ${userData.last_name}`,
            avatar: userData.avatar_url
          } : {
            id: r.user_id,
            name: 'Usuario Anónimo'
          }
        })
      }

      return reviewsWithUser
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
      state.currentProductReviews = []
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

    /* ───────── CREATE COMMENT ───────── */
    builder
      .addCase(createComment.pending, (state) => {
        state.creatingComment = true
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.creatingComment = false
        state.currentProductComments.unshift(action.payload)
      })
      .addCase(createComment.rejected, (state, action) => {
        state.creatingComment = false
        state.error = (action.payload as string) || 'Error al crear comentario'
      })

    /* ───────── CREATE REVIEW ───────── */
    builder
      .addCase(createReview.pending, (state) => {
        state.creatingReview = true
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.creatingReview = false
        state.currentProductReviews.unshift(action.payload)
      })
      .addCase(createReview.rejected, (state, action) => {
        state.creatingReview = false
        state.error = (action.payload as string) || 'Error al crear review'
      })

    /* ───────── FETCH REVIEWS ───────── */
    builder
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false
        state.currentProductReviews = action.payload
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Error al cargar reviews'
      })
  }
})

export const { clearErrors, clearCurrentProduct } = productSlice.actions
export default productSlice.reducer

// Selectores
export const selectAllProducts = (state: any) => state.products.products
export const selectCurrentProduct = (state: any) => state.products.currentProduct
export const selectCurrentProductComments = (state: any) => state.products.currentProductComments
export const selectCurrentProductReviews = (state: any) => state.products.currentProductReviews
export const selectProductsLoading = (state: any) => state.products.loading
export const selectProductLoading = (state: any) => state.products.productLoading
export const selectCommentsLoading = (state: any) => state.products.commentsLoading
export const selectCreatingComment = (state: any) => state.products.creatingComment
export const selectCreatingReview = (state: any) => state.products.creatingReview
export const selectProductsError = (state: any) => state.products.error
export const selectProductError = (state: any) => state.products.productError
