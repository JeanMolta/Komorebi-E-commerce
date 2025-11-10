import React from 'react';
import { useSelector } from 'react-redux';
import { Heart, ShoppingCart, Package, Calendar } from 'lucide-react';
import { selectFavoriteCount } from '../../store/slices/favoriteSlice';
import { selectCartItemCount } from '../../store/slices/cartSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';

const ProfileStats: React.FC = () => {
  const favoriteCount = useSelector(selectFavoriteCount);
  const cartItemCount = useSelector(selectCartItemCount);
  const currentUser = useSelector(selectCurrentUser);

  const memberSince = currentUser ? new Date(currentUser.createdAt) : new Date();
  const daysSinceMember = Math.floor((Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24));

  const stats = [
    {
      label: 'Wishlist Items',
      value: favoriteCount,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Cart Items',
      value: cartItemCount,
      icon: ShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Total Orders',
      value: 0, // TODO: Implement order tracking
      icon: Package,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Days as Member',
      value: daysSinceMember,
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          
          return (
            <div
              key={index}
              className="flex items-center p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                <IconComponent size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <Heart size={16} />
            View Wishlist
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <ShoppingCart size={16} />
            View Cart
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <Package size={16} />
            Order History
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;