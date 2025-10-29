import React, { useState } from 'react';

interface ProductDetailsProps {
  product: any;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Mock detailed data
  const mockDescription = `Delicious handcrafted ${product.name} made with premium Japanese rice and traditional fillings. Our onigiri are prepared fresh daily using authentic recipes passed down through generations. Each piece is carefully wrapped to maintain freshness and flavor.`;
  
  const mockIngredients = [
    'Premium short-grain rice',
    'Fresh Salmon',
    'Nori Seaweed', 
    'Sesame Seeds',
    'Traditional Seasonings',
    'Sea Salt'
  ];

  const mockSpecs = {
    weight: '300g',
    serving: '1 Person',
    shelfLife: '3 days refrigerated',
    allergens: 'Fish, Sesame'
  };

  const truncatedDescription = mockDescription.substring(0, 120) + '...';

  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <h2 className="mb-5 text-2xl font-bold text-[var(--komorebi-black)]">
        Product Details
      </h2>

      {/* Description Section */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-bold text-[var(--komorebi-black)]">
          Description
        </h3>
        <p className="leading-relaxed text-gray-600 text-sm">
          {showFullDescription ? mockDescription : truncatedDescription}
        </p>
        <button 
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="mt-2 bg-transparent border-none text-[var(--komorebi-yellow)] hover:text-[var(--komorebi-black)] underline transition-colors"
        >
          {showFullDescription ? 'Show Less' : 'Read More'}
        </button>
      </div>

      {/* Ingredients Section */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-bold text-[var(--komorebi-black)]">
          Ingredients
        </h3>
        <ul className="pl-5 text-gray-600 text-sm space-y-1">
          {mockIngredients.map((ingredient, index) => (
            <li key={index} className="list-disc">
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      {/* Product Specifications */}
      <div>
        <h3 className="mb-3 text-lg font-bold text-[var(--komorebi-black)]">
          Product Specifications
        </h3>
        <div className="grid grid-cols-2 gap-4 text-gray-600 text-sm">
          <div>
            <span className="font-semibold">Weight:</span> {mockSpecs.weight}
          </div>
          <div>
            <span className="font-semibold">Serving:</span> {mockSpecs.serving}
          </div>
          <div>
            <span className="font-semibold">Shelf Life:</span> {mockSpecs.shelfLife}
          </div>
          <div>
            <span className="font-semibold">Allergens:</span> {mockSpecs.allergens}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
