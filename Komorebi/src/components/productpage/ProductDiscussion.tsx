import React, { useState } from 'react';
import { MessageCircle, Send, Star } from 'lucide-react';
import type { Product } from '../../data/ProductTypes';
import reviewsData from '../../data/reviews.json';

interface ProductDiscussionProps {
  product: Product;
  comments?: any[];
  users?: any[];
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

const ProductDiscussion: React.FC<ProductDiscussionProps> = ({ product, comments = [], users = [] }) => {
  const [newQuestion, setNewQuestion] = useState('');
  const [activeTab, setActiveTab] = useState<'discussion' | 'reviews'>('discussion');

  // Get reviews for this product
  const productReviews: Review[] = reviewsData.filter(review => review.productId === product.id);

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
    );
  };

  const handleSubmitQuestion = () => {
    if (newQuestion.trim()) {
      alert(`Question submitted: "${newQuestion}"`);
      setNewQuestion('');
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
          Discussion ({mockDiscussions.length})
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
              Discussion ({mockDiscussions.length})
            </h2>
            <p className="text-gray-600 text-sm">
              Ask questions about this product
            </p>
          </div>

          {/* Discussion List */}
          <div className="mb-6">
            {mockDiscussions.map(discussion => {
              const user = users.find(u => u.id === discussion.userId);
              const answerer = discussion.answeredBy ? 
                users.find(u => u.id === discussion.answeredBy) : null;

              return (
                <div key={discussion.id} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                  {/* Question */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs">
                        👤
                      </div>
                      <span className="font-bold text-sm text-[var(--komorebi-black)]">
                        {user?.name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(discussion.createdAt)}
                      </span>
                    </div>
                    <p className="ml-10 text-gray-700 text-sm">
                      {discussion.question}
                    </p>
                  </div>

                  {/* Answer */}
                  {discussion.answer && (
                    <div className="ml-5 bg-gray-50 p-3 rounded-lg border-l-4 border-[var(--komorebi-yellow)]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[var(--komorebi-yellow)]">
                          🏪 {answerer?.name || 'Seller'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(discussion.answeredAt!)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {discussion.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Ask Question Form */}
          <div>
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
              onClick={handleSubmitQuestion}
              className="mt-3 py-3 px-5 btn-komorebi-yellow rounded-full font-bold shadow-sm flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </button>
          </div>
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
          <div className="space-y-4">
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
                          {review.userName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(review.date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="text-sm font-semibold">{review.title}</span>
                      </div>
                      
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDiscussion;
