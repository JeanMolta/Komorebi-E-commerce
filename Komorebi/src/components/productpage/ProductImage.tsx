import React, { useState } from 'react';
import { Heart, Share } from 'lucide-react';
import type { Product } from '../../data/ProductTypes';

interface ProductImageProps {
  product: Product;
}

const ProductImage: React.FC<ProductImageProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Imágenes del producto (simuladas - en el futuro vendrán de la data)
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-[var(--komorebi-offwhite)] rounded-2xl p-4 shadow-sm">
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
  );
};

export default ProductImage;
