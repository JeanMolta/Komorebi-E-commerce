import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import WishListItem from '../components/wishlistpage/WishListItem';
import { selectFavoriteItems, selectFavoriteCount } from '../store/slices/favoritesSlice';

const WishListPage: React.FC = () => {
  const favoriteItems = useSelector(selectFavoriteItems);
  const favoriteCount = useSelector(selectFavoriteCount);

  if (favoriteCount === 0) {
    return (
      <div className="min-h-screen bg-[var(--komorebi-offwhite)] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--komorebi-black)] mb-2">
              Your Wishlist
            </h1>
            <p className="text-gray-600">Save items you love for later</p>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="mb-6">
              <Heart size={80} className="mx-auto text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Explore our products and add your favorites to your wishlist. They'll appear here for easy access later!
            </p>
            <Link
              to="/home"
              className="inline-flex items-center font-semibold gap-2 btn-komorebi-yellow px-6 py-3 rounded-3xl transition-colors duration-200"
            >
              
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--komorebi-offwhite)] pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--komorebi-black)] mb-2">
            Your Wishlist
          </h1>
          <p className="text-gray-600">
            {favoriteCount} {favoriteCount === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteItems.map((product) => (
            <WishListItem key={product.id} product={product} />
          ))}
        </div>

        {/* Actions */}
        <div className="mt-12 text-center">
          <Link
            to="/home"
            className="inline-flex items-center font-semibold gap-2 btn-komorebi-yellow px-6 py-3 rounded-3xl transition-colors duration-200"
          >
            
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishListPage;
