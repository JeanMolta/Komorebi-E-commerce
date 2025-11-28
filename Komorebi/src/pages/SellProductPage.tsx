import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { createProduct } from '../store/slices/productSlice'
import { selectCurrentUser } from '../store/slices/authSlice'
import { uploadImage } from '../utils/imageUpload'
import SellPageHeader from '../components/sellpage/SellPageHeader'
import ProductInformationForm from '../components/sellpage/ProductInformationForm'
import ProductImagesUpload from '../components/sellpage/ProductImagesUpload'
import PublishActions from '../components/sellpage/PublishActions'

// Extended Product interface for form data
interface ProductFormData {
  title: string
  description: string
  price: string
  category: string
  condition: string
  location: string
  images: File[]
}

const SellProductPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  
  // Redirect if not authenticated
  if (!currentUser) {
    navigate('/signin')
    return null
  }
  
  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    images: []
  })
  
  // UI states
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraft, setIsDraft] = useState(false)

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length + formData.images.length > 5) {
      setErrors(prev => ({ ...prev, images: 'Maximum 5 images allowed' }))
      return
    }
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB max
      return isValidType && isValidSize
    })
    
    if (validFiles.length !== files.length) {
      setErrors(prev => ({ ...prev, images: 'Only image files under 10MB are allowed' }))
      return
    }
    
    setFormData(prev => ({ ...prev, images: [...prev.images, ...validFiles] }))
    setErrors(prev => ({ ...prev, images: '' }))
  }

  // Remove image
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) newErrors.title = 'Product title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.price) newErrors.price = 'Price is required'
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price'
    }
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.condition) newErrors.condition = 'Condition is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (formData.images.length === 0) newErrors.images = 'At least one image is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault()
    
    if (!saveAsDraft && !validateForm()) return
    
    setIsSubmitting(true)
    setIsDraft(saveAsDraft)
    
    try {
      // Upload images first if there are any
      // Create a reliable placeholder that works offline
      const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjQ0NDQ0NDIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'
      let imageUrl = placeholderImage
      
      console.log('Form data images length:', formData.images.length)
      
      if (formData.images.length > 0) {
        console.log('Attempting to upload image:', formData.images[0].name, 'Size:', formData.images[0].size)
        try {
          // Upload the first image as the main image
          imageUrl = await uploadImage(formData.images[0], 'products')
          console.log('Image uploaded successfully:', imageUrl)
        } catch (imageError: any) {
          console.error('Failed to upload image:', imageError)
          
          // More specific error message
          let errorMessage = 'Warning: Failed to upload image. Product will be created with a placeholder.'
          if (imageError.message?.includes('Bucket not found')) {
            errorMessage = 'Warning: Storage not configured properly. Creating bucket and using placeholder for now.'
          } else if (imageError.message?.includes('File size')) {
            errorMessage = 'Warning: Image file is too large. Please use an image smaller than 5MB.'
          }
          
          alert(errorMessage)
          // Continue with placeholder if image upload fails
          console.log('Using fallback placeholder due to upload failure')
        }
      } else {
        console.log('No images to upload, using placeholder')
      }

      // Create product data for Supabase
      const productData = {
        name: formData.title,
        description: formData.description,
        price: Number(formData.price),
        seller_id: currentUser.id,
        image_url: imageUrl,
        category: formData.category,
        condition: formData.condition,
        location: formData.location,
        availability: saveAsDraft ? 'draft' : 'available'
      }
      
      console.log('Product data to be created:', productData)
      
      // Dispatch create product
      const result = await dispatch(createProduct(productData))
      
      if (createProduct.fulfilled.match(result)) {
        alert(saveAsDraft ? 'Product saved as draft!' : 'Product published successfully!')
        
        // Reset form on success
        setFormData({
          title: '',
          description: '',
          price: '',
          category: '',
          condition: '',
          location: '',
          images: []
        })
        
        // Navigate to home to see the new product
        navigate('/home')
      } else {
        throw new Error('Failed to create product')
      }
      
    } catch (error) {
      console.error('Error submitting product:', error)
      alert('Error submitting product. Please try again.')
    } finally {
      setIsSubmitting(false)
      setIsDraft(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--komorebi-offwhite)] pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        
        {/* Header */}
        <SellPageHeader />

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
          
          {/* Product Information */}
          <ProductInformationForm 
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />

          {/* Product Pictures */}
          <ProductImagesUpload 
            images={formData.images}
            error={errors.images}
            onImageUpload={handleImageUpload}
            onRemoveImage={removeImage}
          />

          {/* Submit Buttons */}
          <PublishActions 
            isSubmitting={isSubmitting}
            isDraft={isDraft}
            onSaveAsDraft={(e) => handleSubmit(e, true)}
            onPublish={(e) => handleSubmit(e, false)}
          />
        </form>
      </div>
    </div>
  )
}

export default SellProductPage
