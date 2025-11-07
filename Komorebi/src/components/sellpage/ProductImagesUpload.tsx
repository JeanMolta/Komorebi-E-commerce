import React from 'react'

interface ProductImagesUploadProps {
  images: File[]
  error: string
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (index: number) => void
}

const ProductImagesUpload: React.FC<ProductImagesUploadProps> = ({
  images,
  error,
  onImageUpload,
  onRemoveImage
}) => {
  return (
    <div className="bg-[var(--komorebi-offwhite)] rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[var(--komorebi-black)] mb-6">Product Pictures</h2>
      <p className="text-sm text-[var(--komorebi-black)]/60 mb-4">
        Upload max 5 high quality pictures. The first one will be the cover.
      </p>

      {/* Image Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            📁
          </div>
          <p className="text-[var(--komorebi-black)] font-medium mb-1">Click to upload images</p>
          <p className="text-sm text-[var(--komorebi-black)]/60">PNG, JPG max 10 mb each one</p>
        </label>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600"
              >
                ×
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 bg-[var(--komorebi-yellow)] text-xs px-2 py-1 rounded">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-[var(--komorebi-black)]/60">
          <div className="text-4xl mb-2">🖼️</div>
          <p>No images uploaded</p>
        </div>
      )}
    </div>
  )
}

export default ProductImagesUpload