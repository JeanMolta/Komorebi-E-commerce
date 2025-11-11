import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
  fetchProductById, 
  clearCurrentProduct,
  selectCurrentProduct,
  selectCurrentProductComments,
  selectProductLoading,
  selectProductError 
} from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { addToFavorites, removeFromFavorites, selectIsFavorite } from '../store/slices/favoriteSlice'

// Import user data directly for components
import usersData from '../data/users.json'

// Import refactored components
import ProductImage from '../components/productpage/ProductImage'
import ProductInfo from '../components/productpage/ProductInfo'
import ProductActions from '../components/productpage/ProductActions'
import ProductDetails from '../components/productpage/ProductDetails'
import ProductDiscussion from '../components/productpage/ProductDiscussion'

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  
  const product = useAppSelector(selectCurrentProduct)
  const comments = useAppSelector(selectCurrentProductComments)
  const isLoading = useAppSelector(selectProductLoading)
  const error = useAppSelector(selectProductError)
  const isFavorite = useAppSelector((state) => 
    product ? selectIsFavorite(state, product.id) : false
  )

  useEffect(() => {
    console.log('🔄 ProductPage mounted, productId:', id)
    
    if (id) {
      dispatch(fetchProductById(id))
    }
    
    // Cleanup function
    return () => {
      dispatch(clearCurrentProduct())
    }
  }, [dispatch, id])

  // Handle add to cart
  const handleAddToCart = (productId: string, quantity: number = 1) => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(product))
      }
      console.log('🛒 Added to cart:', product.name, 'quantity:', quantity)
    }
  }

  // Handle toggle favorite
  const handleToggleFavorite = (productId: string) => {
    if (product) {
      if (isFavorite) {
        dispatch(removeFromFavorites(productId))
        console.log('💔 Removed from favorites:', product.name)
      } else {
        dispatch(addToFavorites(product))
        console.log('💖 Added to favorites:', product.name)
      }
    }
  }

  // Show loading state
  if (isLoading) {
    console.log('⏳ Loading product...')
    return (
      <div className="min-h-screen bg-[var(--komorebi-offwhite)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--komorebi-yellow)] mx-auto mb-4"></div>
          <p className="text-[var(--komorebi-black)]/60">Cargando producto...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    console.log('❌ Error loading product:', error)
    return (
      <div className="min-h-screen bg-[var(--komorebi-offwhite)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error al cargar el producto</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-komorebi-yellow py-2 px-4 rounded-lg"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  // Show not found state
  if (!product) {
    console.log('❌ Product not found for ID:', id)
    return (
      <div className="min-h-screen bg-[var(--komorebi-offwhite)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--komorebi-black)] mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-4">El producto que buscas no está disponible.</p>
          <Link to="/" className="btn-komorebi-yellow py-2 px-4 rounded-lg inline-block">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  console.log('✅ ProductPage rendering with product:', product.name)

  return (
    <div className="min-h-screen bg-[var(--komorebi-offwhite)]">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Left: Product Images */}
          <ProductImage product={product} />
          
          {/* Right: Product Information and Actions */}
          <div className="space-y-6">
            <ProductInfo 
              product={product} 
              avgRating={comments?.length > 0 ? comments.reduce((acc, comment) => acc + (comment.rating || 0), 0) / comments.length : 0}
              reviewsCount={comments?.length || 0}
            />
            <ProductActions 
              product={product}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </div>

        {/* Product Details Section */}
        <ProductDetails product={product} />

        {/* Discussion Section */}
        <ProductDiscussion 
          product={product} 
          comments={comments} 
          users={usersData} 
        />
      </div>
    </div>
  )
}

export default ProductPage