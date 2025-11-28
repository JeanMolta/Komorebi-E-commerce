import React, { useState, useRef } from 'react';
import { Camera, User, Upload } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onImageChange: (file: File | null) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  showChangeButton?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onImageChange,
  disabled = false,
  size = 'medium',
  showChangeButton = true
}) => {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be smaller than 2MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      onImageChange(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Container */}
      <div className="relative group">
        <div 
          className={`${sizeClasses[size]} rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 cursor-pointer transition-all duration-200 ${!disabled ? 'hover:shadow-xl group-hover:border-[var(--komorebi-yellow)]' : ''}`}
          onClick={handleClick}
        >
          {preview ? (
            <img 
              src={preview} 
              alt="Avatar preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <User size={iconSizes[size]} className="text-gray-400" />
            </div>
          )}
          
          {/* Hover overlay */}
          {!disabled && (
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Camera size={iconSizes[size]} className="text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {showChangeButton && !disabled && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClick}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--komorebi-yellow)] text-[var(--komorebi-black)] rounded-full hover:bg-[var(--komorebi-yellow)]/80 transition-colors duration-200"
          >
            <Upload size={14} />
            {preview ? 'Change' : 'Upload photo'}
          </button>
          
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors duration-200"
            >
              Remove
            </button>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      {/* Help text */}
      {showChangeButton && !disabled && (
        <p className="text-xs text-gray-500 text-center max-w-xs">
          Supported formats: JPG, PNG, GIF. Maximum 2MB.
        </p>
      )}
    </div>
  );
};

export default AvatarUpload;