import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { LogOut, Settings, Shield } from 'lucide-react';
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice';
import ProfileInfo from '../components/profilepage/ProfileInfo';
import ProfileStats from '../components/profilepage/ProfileStats';

const ProfilePage: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);

  // Redirect to login if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--komorebi-offwhite)] pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[var(--komorebi-black)] mb-2">
                Welcome back, {currentUser.firstName}!
              </h1>
              <p className="text-gray-600">
                Manage your account settings and view your activity
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <button className="flex items-center gap-2 text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                <Settings size={16} />
                Settings
              </button>
              <button className="flex items-center gap-2 text-sm bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Profile Info */}
          <div className="lg:col-span-2">
            <ProfileInfo />
          </div>

          {/* Sidebar - Stats and Actions */}
          <div className="space-y-6">
            <ProfileStats />
            
            {/* Security Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={20} />
                Account Security
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Password</span>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Change
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Two-factor authentication</span>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Email notifications</span>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Manage
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Navigation
              </h3>
              <div className="space-y-2">
                <Link
                  to="/wishlist"
                  className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  My Wishlist
                </Link>
                <Link
                  to="/cart"
                  className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  Shopping Cart
                </Link>
                <Link
                  to="/"
                  className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
