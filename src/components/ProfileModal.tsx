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
    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 d">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200  flex items-center justify-center text-gray-500 ">
            <span className="text-lg font-semibold">{userDetails?.name?.charAt(0) || 'U'}</span>
          </div>
          <div className='flex justify-start text-start flex-col'>
            <p className="text-gray-900  font-semibold">{userDetails?.name || 'User'}</p>
            <p className="text-gray-600 text-sm">{userDetails?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
      <div className="py-2">
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100   transition-colors"
        >
          Logout
        </button>
        <button
          onClick={onClose}
          className="w-full text-left px-4 py-2 text-gray-900  hover:bg-gray-100  transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
