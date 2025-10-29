import React from 'react';
import { useParams } from 'react-router-dom';
import ProductImage from '../components/productpage/ProductImage';
import ProductInfo from '../components/productpage/ProductInfo';
import ProductActions from '../components/productpage/ProductActions';
import ProductDetails from '../components/productpage/ProductDetails';
import ProductReviews from '../components/productpage/ProductReviews';
import ProductDiscussion from '../components/productpage/ProductDiscussion';

// Import JSON data
import productsData from '../data/products.json';
import commentsData from '../data/comments.json';
import usersData from '../data/users.json';

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();

  // Find product by ID
  const product = productsData.find(p => p.id === productId);

  // If product not found, show 404
  if (!product) {
    return (
      <div className="pt-24 pb-20 px-5 text-center min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-4xl font-bold text-[var(--komorebi-black)] mb-4">Product Not Found</h1>
          <p className="text-gray-600">Product ID: {productId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-5 max-w-7xl mx-auto">
      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Left: Image */}
        <ProductImage product={product} />
        
        {/* Right: Info + Actions */}
        <div>
          <ProductInfo product={product} />
          <ProductActions product={product} />
        </div>
      </div>

      {/* Product Details */}
      <div className="mb-10">
        <ProductDetails product={product} />
      </div>

      {/* Reviews & Discussion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductReviews product={product} comments={commentsData} users={usersData} />
        <ProductDiscussion product={product} comments={commentsData} users={usersData} />
      </div>
    </div>
  );
};

export default ProductPage;
