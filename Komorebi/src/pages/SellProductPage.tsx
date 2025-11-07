import React, { useState } from 'react'
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
      // Here you would implement the actual submission logic
      // For now, just simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Product data:', {
        ...formData,
        isDraft: saveAsDraft,
        imageCount: formData.images.length
      })
      
      // TODO: Dispatch to productSlice to add new product
      // dispatch(addProduct(productData))
      
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
