import React, { useState } from 'react';
import { MessageCircle, Send, Star } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createComment, createReview, selectCreatingComment, selectCreatingReview } from '../../store/slices/productSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import type { Product } from '../../data/ProductTypes';

interface ProductDiscussionProps {
  product: Product;
  comments?: any[];
  reviews?: any[];
  users?: any[];
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  title: string;
  content: string;
  rating: number;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

const ProductDiscussion: React.FC<ProductDiscussionProps> = ({ product, comments = [], reviews = [], users = [] }) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const creatingComment = useAppSelector(selectCreatingComment);
  const creatingReview = useAppSelector(selectCreatingReview);
  
  const [newQuestion, setNewQuestion] = useState('');
  const [activeTab, setActiveTab] = useState<'discussion' | 'reviews'>('discussion');
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    title: '',
    content: '',
    rating: 5
  });

  // Get reviews for this product (now from props/Redux instead of JSON)
  const productReviews: Review[] = reviews;

  // Calculate average rating
  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
    : 0;

  // Mock discussion data (in a real app, this would be separate from reviews)
  const mockDiscussions = [
    {
      id: 'q_001',
      userId: 'u_buyer_001', 
      question: 'This looks amazing! Do you deliver avocado in downtown?',
      createdAt: '2025-10-25T14:30:00.000Z',
      answer: 'Yes! We deliver to downtown Cali. Usually takes 2 hours.',
      answeredBy: 'u_vendor_001',
      answeredAt: '2025-10-25T15:15:00.000Z'
    },
    {
      id: 'q_002', 
      userId: 'u_buyer_002',
      question: 'Perfect! in place for 2 boxes then.',
      createdAt: '2025-10-26T09:45:00.000Z'
    },
    {
      id: 'q_003',
      userId: 'u_buyer_003', 
      question: 'How spicy is the salmon? I have a sensitive palate.',
      createdAt: '2025-10-27T11:20:00.000Z',
      answer: 'The salmon onigiri is not spicy at all. Very mild and family-friendly!',
      answeredBy: 'u_vendor_001', 
      answeredAt: '2025-10-27T12:00:00.000Z'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  };

  // Handle submitting a question/comment
  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please log in to ask questions');
      return;
    }
    
    if (!newQuestion.trim()) return;

    try {
      await dispatch(createComment({
        productId: product.id,
        content: newQuestion,
        userId: currentUser.id
        // Removed rating since it doesn't exist in comments table
      })).unwrap();
      
      setNewQuestion('');
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Error submitting question. Please try again.');
    }
  };

  // Handle submitting a review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please log in to write reviews');
      return;
    }
    
    if (!reviewForm.title.trim() || !reviewForm.content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await dispatch(createReview({
        productId: product.id,
        title: reviewForm.title,
        content: reviewForm.content,
        rating: reviewForm.rating,
        userId: currentUser.id
      })).unwrap();
      
      setReviewForm({ title: '', content: '', rating: 5 });
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    }
  };

  return (
    <div className="border border-gray-300 p-6 rounded-lg shadow-sm">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('discussion')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'discussion'
              ? 'border-[var(--komorebi-yellow)] text-[var(--komorebi-yellow)]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageCircle className="w-4 h-4 mr-2 inline" />
          Discussion ({comments.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'reviews'
              ? 'border-[var(--komorebi-yellow)] text-[var(--komorebi-yellow)]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Star className="w-4 h-4 mr-2 inline" />
          Reviews ({productReviews.length})
        </button>
      </div>

      {/* Discussion Tab Content */}
      {activeTab === 'discussion' && (
        <>
          <div className="mb-5">
            <h2 className="text-xl font-bold mb-2 text-[var(--komorebi-black)] flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Discussion ({comments.length})
            </h2>
            <p className="text-gray-600 text-sm">
              Ask questions about this product
            </p>
          </div>

          {/* Discussion List */}
          <div className="mb-6">
            {comments.map(comment => (
              <div key={comment.id} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs">
                    👤
                  </div>
                  <span className="font-bold text-sm text-[var(--komorebi-black)]">
                    {comment.user?.name || 'Anonymous'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="ml-10 text-gray-700 text-sm">
                  {comment.content}
                </p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-gray-500 text-center py-4">No questions yet. Be the first to ask!</p>
            )}
          </div>

          {/* Ask Question Form */}
          <form onSubmit={handleSubmitQuestion}>
            <h3 className="text-base font-bold mb-3 text-[var(--komorebi-black)]">
              Ask a Question
            </h3>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Ask a question about this product..."
              className="w-full min-h-[80px] p-3 border border-gray-300 rounded-lg resize-y text-sm focus:outline-none focus:ring-2 focus:ring-[var(--komorebi-yellow)]/50 focus:border-[var(--komorebi-yellow)]"
            />
            <button 
              type="submit"
              disabled={creatingComment || !newQuestion.trim()}
              className={`mt-3 py-3 px-5 btn-komorebi-yellow rounded-full font-bold shadow-sm flex items-center ${
                creatingComment ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send className="w-4 h-4 mr-2" />
              {creatingComment ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </>
      )}

      {/* Reviews Tab Content */}
      {activeTab === 'reviews' && (
        <>
          <div className="mb-5">
            <h2 className="text-xl font-bold mb-2 text-[var(--komorebi-black)] flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Reviews ({productReviews.length})
            </h2>
            {productReviews.length > 0 && (
              <div className="flex items-center gap-2 mb-2">
                {renderStars(Math.round(averageRating))}
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} out of 5 ({productReviews.length} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-4 mb-8">
            {productReviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              productReviews.map(review => (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                      👤
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-[var(--komorebi-black)]">
                          {review.user?.name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="text-sm font-semibold">{review.title}</span>
                      </div>
                      
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        {review.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Write Review Form */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-[var(--komorebi-black)]">
              Write a Review
            </h3>
            <form onSubmit={handleSubmitReview}>
              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewForm.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  placeholder="Summarize your experience..."
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--komorebi-yellow)]/50 focus:border-[var(--komorebi-yellow)]"
                  required
                />
              </div>

              {/* Content */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                  placeholder="Share details about your experience with this product..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--komorebi-yellow)]/50 focus:border-[var(--komorebi-yellow)]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={creatingReview || !reviewForm.title.trim() || !reviewForm.content.trim()}
                className={`py-3 px-6 btn-komorebi-yellow rounded-full font-bold shadow-sm flex items-center ${
                  creatingReview ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Star className="w-4 h-4 mr-2" />
                {creatingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDiscussion;
