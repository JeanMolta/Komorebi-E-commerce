import React, { useState } from 'react';

interface ProductImageProps {
  product: any;
}

const ProductImage: React.FC<ProductImageProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Mock additional images for gallery
  const images = [
    product.image,
    '/images/products/placeholder.jpg',
    '/images/products/placeholder.jpg',
    '/images/products/placeholder.jpg'
  ];

  return (
    <div>
      {/* Main Image */}
      <div className="w-full h-96 bg-gray-100 mb-4 flex items-center justify-center rounded-lg overflow-hidden">
        <img 
          src={images[selectedImage]} 
          alt={product.name}
          className="max-w-full max-h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg';
          }}
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2">
        {images.map((img, index) => (
          <div 
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-20 h-20 bg-gray-100 cursor-pointer flex items-center justify-center rounded-lg overflow-hidden transition-all ${
              selectedImage === index 
                ? 'border-2 border-[var(--komorebi-yellow)] ring-1 ring-[var(--komorebi-yellow)]/30' 
                : 'border border-gray-300 hover:border-gray-400'
            }`}
          >
            <img 
              src={img} 
              alt={`${product.name} ${index + 1}`}
              className="max-w-full max-h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImage;
