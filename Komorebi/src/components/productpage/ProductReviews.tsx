import React, { useState } from 'react';

interface ProductReviewsProps {
  product: any;
  comments: any[];
  users: any[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ product, comments, users }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Filter comments for this product
  const productReviews = comments.filter(comment => comment.productId === product.id);
  
  // Get user info for each review
  const reviewsWithUsers = productReviews.map(review => {
    const user = users.find(u => u.id === review.userId);
    return { ...review, user };
  });

  const displayedReviews = showAllReviews ? reviewsWithUsers : reviewsWithUsers.slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="border border-gray-300 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-[var(--komorebi-black)]">
          Reviews ({productReviews.length})
        </h2>
        <div className="text-gray-600 text-sm">
          ⭐ 4.8 avg rating
        </div>
      </div>

      {/* Reviews List */}
      {displayedReviews.length > 0 ? (
        <div>
          {displayedReviews.map(review => (
            <div key={review.id} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  👤
                </div>
                <div>
                  <div className="font-bold text-[var(--komorebi-black)] text-sm">
                    {review.user?.name || 'Anonymous User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(review.createdAt)}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-2 text-sm">
                {renderStars(review.rating)}
              </div>

              {/* Review Content */}
              <p className="text-gray-600 leading-relaxed text-sm">
                {review.content}
              </p>
            </div>
          ))}

          {/* Show More Button */}
          {productReviews.length > 3 && (
            <button 
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="w-full mt-4 py-3 px-5 bg-transparent border border-[var(--komorebi-yellow)] text-[var(--komorebi-yellow)] hover:bg-[var(--komorebi-yellow)] hover:text-[var(--komorebi-black)] rounded-lg transition-all font-medium"
            >
              {showAllReviews ? 'Show Less' : `Show All ${productReviews.length} Reviews`}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          <p className="mb-2">No reviews yet for this product.</p>
          <p className="text-sm">Be the first to review!</p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
