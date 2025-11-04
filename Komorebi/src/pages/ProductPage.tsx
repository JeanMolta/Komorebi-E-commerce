import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, MessageCircle, Share, Heart, ShoppingCart, MapPin, Clock, Truck } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
  fetchProductById, 
  clearCurrentProduct,
  selectCurrentProduct,
  selectCurrentProductComments,
  selectProductLoading,
  selectProductError 
} from '../store/slices/productSlice'

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  
  const product = useAppSelector(selectCurrentProduct)
  const comments = useAppSelector(selectCurrentProductComments)
  const isLoading = useAppSelector(selectProductLoading)
  const error = useAppSelector(selectProductError)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'discussion' | 'reviews'>('discussion')

  useEffect(() => {
    console.log('🔍 ProductPage - ID recibido:', id)
    if (id) {
      console.log('🚀 Dispatching fetchProductById con ID:', id)
      dispatch(fetchProductById(id))
    } else {
      console.log('❌ No se recibió ID')
    }
    return () => {
      dispatch(clearCurrentProduct())
    }
  }, [id, dispatch])

  // Calcular rating promedio
  const avgRating = comments.length > 0 
    ? comments.reduce((sum, comment) => sum + (comment.rating || 0), 0) / comments.filter(c => c.rating).length
    : 0
  
  const reviewsCount = comments.filter(c => c.rating).length

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--komorebi-offwhite)] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <span className="text-6xl mb-4 block">😕</span>
          <h2 className="text-2xl font-bold text-[var(--komorebi-black)] mb-2">¡Oops!</h2>
          <p className="text-[var(--komorebi-black)]/70 mb-6">{error}</p>
          <button 
            onClick={() => id && dispatch(fetchProductById(id))}
            className="px-6 py-2 bg-[var(--komorebi-yellow)] text-[var(--komorebi-black)] rounded-lg font-semibold hover:bg-[var(--komorebi-yellow)]/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--komorebi-offwhite)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--komorebi-yellow)]"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--komorebi-offwhite)] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--komorebi-black)] mb-2">Producto no encontrado</h2>
          <Link to="/" className="text-[var(--komorebi-yellow)] hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  // Imágenes del producto (simuladas - en el futuro vendrán de la data)
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ]

  return (
    <div className="min-h-screen bg-[var(--komorebi-offwhite)]">
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Left: Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <img 
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5ca5mNmY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+'
                }}
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-[var(--komorebi-yellow)]' 
                      : 'border-transparent hover:border-[var(--komorebi-gray)]'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Best Seller Badge */}
            <div className="flex items-center space-x-2">
              <span className="bg-[var(--komorebi-yellow)] text-[var(--komorebi-black)] px-3 py-1 rounded-full text-sm font-semibold">
                Best Seller
              </span>
              <button className="flex items-center text-[var(--komorebi-black)]/60 hover:text-[var(--komorebi-black)]">
                <Heart className="w-4 h-4 mr-1" />
                Save
              </button>
            </div>
          </div>

          {/* Right: Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-[var(--komorebi-yellow)] font-semibold text-sm">🏪 Komorebi</span>
                <span className="text-blue-500"></span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.floor(avgRating) ? 'text-[var(--komorebi-yellow)] fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-[var(--komorebi-black)]/60 text-sm ml-1">
                    4.9 ({reviewsCount} reviews)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center text-[var(--komorebi-black)]/60 text-sm mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                Cali, Co
              </div>

              <h1 className="text-3xl font-bold text-[var(--komorebi-black)] mb-2">{product.name}</h1>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-[var(--komorebi-black)]">
                ${product.price.toLocaleString()}
              </span>
              <span className="text-xl text-[var(--komorebi-black)]/50 line-through">
                ${(product.price * 1.3).toLocaleString()}
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-[var(--komorebi-gray)] rounded-lg">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-[var(--komorebi-black)]/60 hover:text-[var(--komorebi-black)]"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-[var(--komorebi-gray)]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-[var(--komorebi-black)]/60 hover:text-[var(--komorebi-black)]"
                >
                  +
                </button>
              </div>
              
              <button className="flex-1 btn-komorebi-yellow py-3 px-6 rounded-3xl font-semibold flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart ${(product.price * quantity).toLocaleString()}
              </button>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-lg p-4 space-y-3">
              <div className="flex items-center text-[var(--komorebi-black)]">
                <Truck className="w-5 h-5 mr-3 text-[var(--komorebi-yellow)]" />
                <div>
                  <p className="font-medium">Free Shipping over $20,000</p>
                  <p className="text-sm text-[var(--komorebi-black)]/60">2-3 Business Days</p>
                </div>
              </div>
              
              <div className="flex items-center text-[var(--komorebi-black)]">
                <Clock className="w-5 h-5 mr-3 text-[var(--komorebi-yellow)]" />
                <div>
                  <p className="font-medium">Fresh Delivery</p>
                  <p className="text-sm text-[var(--komorebi-black)]/60">Prepared Daily</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-[var(--komorebi-black)] mb-2">Description</h3>
              <p className="text-[var(--komorebi-black)]/70 text-sm leading-relaxed">
                Handcrafted onigiri made with premium Japanese rice and traditional fillings. Choose from our flavors: 
                madurko, teriyaki, and traditional.
              </p>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="font-semibold text-[var(--komorebi-black)] mb-2">Ingredients</h3>
              <ul className="text-sm text-[var(--komorebi-black)]/70 space-y-1">
                <li>• Premium short-grain rice</li>
                <li>• Fresh Salmon</li>
                <li>• Nori Seaweed</li>
                <li>• Sesame Seeds</li>
                <li>• Traditional Seasonings</li>
              </ul>
            </div>

            {/* Product Details */}
            <div>
              <h3 className="font-semibold text-[var(--komorebi-black)] mb-2">Products Details</h3>
              <div className="text-sm text-[var(--komorebi-black)]/70 space-y-1">
                <div className="flex justify-between">
                  <span>Weight: 300g</span>
                  <span>Serving: 1 Person</span>
                </div>
                <div className="flex justify-between">
                  <span>Shelf Life:</span>
                  <span>Allergens: Fish, Sesame</span>
                </div>
                <div>3 days refrigerated</div>
              </div>
            </div>
          </div>
        </div>

        {/* Discussion and Reviews Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {/* Tabs */}
          <div className="flex items-center space-x-6 mb-6 border-b border-[var(--komorebi-gray)]/20">
            <button
              onClick={() => setActiveTab('discussion')}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === 'discussion'
                  ? 'text-[var(--komorebi-black)] border-b-2 border-[var(--komorebi-yellow)]'
                  : 'text-[var(--komorebi-black)]/60 hover:text-[var(--komorebi-black)]'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-1" />
              Discussion ({comments.length})
            </button>
            
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === 'reviews'
                  ? 'text-[var(--komorebi-black)] border-b-2 border-[var(--komorebi-yellow)]'
                  : 'text-[var(--komorebi-black)]/60 hover:text-[var(--komorebi-black)]'
              }`}
            >
              <Star className="w-4 h-4 inline mr-1" />
              Reviews ({reviewsCount})
            </button>
          </div>

          {/* Comment Input */}
          <div className="mb-6">
            <textarea
              placeholder="Ask a question or start a conversation with this seller..."
              className="w-full p-4 border border-[var(--komorebi-gray)]/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--komorebi-yellow)]/50"
              rows={3}
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-[var(--komorebi-black)]/50">
                Be respectful and help build a great community
              </p>
              <button className="btn-komorebi-yellow px-6 py-2 rounded-3xl font-medium">
                Send Message
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-[var(--komorebi-black)]/50 text-center py-8">
                No hay comentarios aún. ¡Sé el primero en comentar!
              </p>
            ) : (
              comments
                .filter(comment => activeTab === 'discussion' || comment.rating)
                .map((comment) => (
                  <div key={comment.id} className="border-b border-[var(--komorebi-gray)]/20 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-[var(--komorebi-gray)] rounded-full flex items-center justify-center text-[var(--komorebi-black)] font-semibold text-sm">
                        {comment.user?.name?.charAt(0) || 'A'}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-[var(--komorebi-black)] text-sm">
                              {comment.user?.name || 'Usuario Anónimo'}
                            </span>
                            {comment.user?.name === 'Komorebi' && (
                              <span className="bg-[var(--komorebi-yellow)] text-[var(--komorebi-black)] text-xs px-2 py-0.5 rounded-full font-medium">
                                Seller
                              </span>
                            )}
                            {comment.rating && (
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <= (comment.rating || 0) ? 'text-[var(--komorebi-yellow)] fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <span className="text-xs text-[var(--komorebi-black)]/50">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-[var(--komorebi-black)]/80 text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
