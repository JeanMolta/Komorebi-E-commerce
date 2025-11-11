import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Edit3, Save, X, User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { selectCurrentUser } from '../../store/slices/authSlice';

const ProfileInfo: React.FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    description: currentUser?.description || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement updateUser action in authSlice
    console.log('Saving user data:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone,
        location: currentUser.location,
        description: currentUser.description || ''
      });
    }
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-gray-500 text-center">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <User size={24} />
            Profile Information
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-sm bg-[var(--komorebi-black)] text-white px-4 py-2 rounded-3xl hover:bg-gray-800 transition-colors duration-200"
            >
              <Edit3 size={16} />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 py-2">{currentUser.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 py-2">{currentUser.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Mail size={16} />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 py-2">{currentUser.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Phone size={16} />
              Phone
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 py-2">{currentUser.phone}</p>
            )}
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <MapPin size={16} />
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 py-2">{currentUser.location}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <FileText size={16} />
              Description
            </label>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-900 py-2">
                {currentUser.description || 'No description provided'}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-[var(--komorebi-black)] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              <Save size={16} />
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        )}

        {/* Account Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <p>Member since: {new Date(currentUser.createdAt).toLocaleDateString()}</p>
            <p>User ID: {currentUser.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;