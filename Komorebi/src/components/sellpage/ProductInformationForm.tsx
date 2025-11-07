import React from 'react'

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
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Health & Beauty',
  'Toys & Games',
  'Automotive',
  'Other'
]

// Product conditions
const CONDITIONS = [
  'New',
  'Like New', 
  'Good',
  'Fair',
  'Poor'
]

const ProductInformationForm: React.FC<ProductInformationFormProps> = ({
  formData,
  errors,
  onInputChange
}) => {
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
            <select
              name="category"
              value={formData.category}
              onChange={onInputChange}
              className={`w-full px-4 py-3 bg-gray-100 rounded-3xl border-none outline-none ${
                errors.category ? 'bg-red-50 border border-red-300' : ''
              }`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
        </div>

        {/* Condition and Location Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">
              Condition*
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={onInputChange}
              className={`w-full px-4 py-3 bg-gray-100 rounded-3xl border-none outline-none ${
                errors.condition ? 'bg-red-50 border border-red-300' : ''
              }`}
            >
              <option value="">Product State</option>
              {CONDITIONS.map(condition => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
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