import React, { useState, useEffect, useRef } from 'react'

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

interface ProductInformationFormProps {
  formData: ProductFormData
  errors: Record<string, string>
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

// Categories available for products
const CATEGORIES = [
  'Healthy',
  'Cakes',
  'Shakes',
  'Sweet Treats',
  'Donuts',
  'Onigiris',
  'Other'
]

// Product conditions
const CONDITIONS = [
  'Artisanal',
  'Organic',
  'Vegan',
  'Gluten-Free',
]

const ProductInformationForm: React.FC<ProductInformationFormProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [conditionDropdownOpen, setConditionDropdownOpen] = useState(false)
  const categoryRef = useRef<HTMLDivElement>(null)
  const conditionRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false)
      }
      if (conditionRef.current && !conditionRef.current.contains(event.target as Node)) {
        setConditionDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleCategorySelect = (category: string) => {
    const event = {
      target: { name: 'category', value: category }
    } as React.ChangeEvent<HTMLSelectElement>
    onInputChange(event)
    setCategoryDropdownOpen(false)
  }

  const handleConditionSelect = (condition: string) => {
    const event = {
      target: { name: 'condition', value: condition }
    } as React.ChangeEvent<HTMLSelectElement>
    onInputChange(event)
    setConditionDropdownOpen(false)
  }
  return (
    <div className="bg-[var(--komorebi-offwhite)] rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[var(--komorebi-black)] mb-6">Product Information</h2>
      
      <div className="space-y-4">
        {/* Product Title */}
        <div>
          <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">
            Product Title*
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            placeholder="Ex. Onigiri Premium"
            className={`w-full px-4 py-3 bg-gray-100 rounded-3xl border-none outline-none ${
              errors.title ? 'bg-red-50 border border-red-300' : ''
            }`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">
            Description*
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Describe your product: ingredients, flavor, origin..."
            rows={4}
            className={`w-full px-4 py-3 bg-gray-100 rounded-3xl border-none outline-none resize-none ${
              errors.description ? 'bg-red-50 border border-red-300' : ''
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Price and Category Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">
              Price*
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={onInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full px-4 py-3 bg-gray-100 rounded-3xl border-none outline-none ${
                errors.price ? 'bg-red-50 border border-red-300' : ''
              }`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">
              Category*
            </label>
            <div className="relative" ref={categoryRef}>
              <div
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className={`w-full px-4 py-3 bg-gray-100 rounded-3xl border-none outline-none cursor-pointer flex justify-between items-center ${
                  errors.category ? 'bg-red-50' : ''
                }`}
              >
                <span className={formData.category ? 'text-black' : 'text-gray-500'}>
                  {formData.category || 'Select a category'}
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-lg border border-gray-200 z-10 max-h-48 overflow-y-auto">
                  {CATEGORIES.map(cat => (
                    <div
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
        </div>

        {/* Condition and Location Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">
              Condition*
            </label>
            <div className="relative" ref={conditionRef}>
              <div
                onClick={() => setConditionDropdownOpen(!conditionDropdownOpen)}
                className={`w-full px-4 py-3 bg-gray-100 rounded-3xl border-none outline-none cursor-pointer flex justify-between items-center ${
                  errors.condition ? 'bg-red-50' : ''
                }`}
              >
                <span className={formData.condition ? 'text-black' : 'text-gray-500'}>
                  {formData.condition || 'Product State'}
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${conditionDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {conditionDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-lg border border-gray-200 z-10 max-h-48 overflow-y-auto">
                  {CONDITIONS.map(condition => (
                    <div
                      key={condition}
                      onClick={() => handleConditionSelect(condition)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      {condition}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">
              Location*
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={onInputChange}
              placeholder="Country, city, region"
              className={`w-full px-4 py-3 bg-gray-100 rounded-3xl border-none outline-none ${
                errors.location ? 'bg-red-50 border border-red-300' : ''
              }`}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductInformationForm