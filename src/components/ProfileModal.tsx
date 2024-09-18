// src/components/ProfileDropdown.tsx
import React from 'react';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  userDetails: any; // Replace with actual type if available
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose, onLogout, userDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 w-64 mt-2 overflow-hidden bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-[10000]">
      <div className="px-4 py-3 border-b border-gray-200 d">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 text-gray-500 bg-gray-200 rounded-full ">
            <span className="text-lg font-semibold">{userDetails?.name?.charAt(0) || 'U'}</span>
          </div>
          <div className='flex flex-col justify-start text-start'>
            <p className="font-semibold text-gray-900">{userDetails?.name || 'User'}</p>
            <p className="text-sm text-gray-600">{userDetails?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
      <div className="py-2">
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 text-left text-red-500 transition-colors hover:bg-red-100"
        >
          Logout
        </button>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-left text-gray-900 transition-colors hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
