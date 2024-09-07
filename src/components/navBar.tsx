// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileModal';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const token = localStorage.getItem('token');
  let userRole = '';
  let userDetails = null;

  if (token) {
    try {
      const decodedToken: any = parseJwt(token);
      userRole = decodedToken.role;
      userDetails = decodedToken; 
      console.log(decodedToken)// Adjust as per your token structure
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-800 p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-gray-900 dark:text-white">
        Assessment        </Link>
        <div className="relative flex items-center space-x-4">
          {userRole === 'student' && (
            <>
              <Link to="/student-dashboard" className="text-gray-900 dark:text-white hover:underline">
                Dashboard
              </Link>
              <Link to="/tests" className="text-gray-900 dark:text-white hover:underline">
                Tests
              </Link>
            </>
          )}
          {userRole === 'admin' && (
            <>
              <Link to="/admin-dashboard" className="text-gray-900 dark:text-white hover:underline">
                Dashboard
              </Link>
              <Link to="/create-test" className="text-gray-900 dark:text-white hover:underline">
                Create Test
              </Link>
            </>
          )}
          <button
            onClick={toggleProfileDropdown}
            className="text-gray-900 dark:text-white relative"
          >
             <div className="h-10 w-10 rounded-full bg-gray-200  flex items-center justify-center text-gray-500 ">
            <span className="text-lg font-semibold">{userDetails?.name?.charAt(0) || 'U'}</span>
          </div>
            {isProfileDropdownOpen && (
              <ProfileDropdown
                isOpen={isProfileDropdownOpen}
                onClose={toggleProfileDropdown}
                onLogout={handleLogout}
                userDetails={userDetails}
              />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

function parseJwt(token: any) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}
