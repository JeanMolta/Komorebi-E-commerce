import React, { useState } from 'react';

interface ProductDiscussionProps {
  product: any;
  comments: any[];
  users: any[];
}

const ProductDiscussion: React.FC<ProductDiscussionProps> = ({ product, comments, users }) => {
  const [newQuestion, setNewQuestion] = useState('');

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

  const handleSubmitQuestion = () => {
    if (newQuestion.trim()) {
      alert(`Question submitted: "${newQuestion}"`);
      setNewQuestion('');
    }
  };

  return (
    <div className="border border-gray-300 p-6 rounded-lg shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold mb-2 text-[var(--komorebi-black)]">
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
          className="mt-3 py-3 px-5 btn-komorebi-yellow rounded-full font-bold shadow-sm"
        >
          📩 Send Message
        </button>
      </div>
    </div>
  );
};

export default ProductDiscussion;
