// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };



  // Determine user role
  const token = localStorage.getItem('token');
  let userRole = '';
  if (token) {
    try {
      const decodedToken: any = parseJwt(token);
      userRole = decodedToken.role;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  return (
    <nav
      className={`bg-white dark:bg-gray-800 p-4 shadow-md sticky top-0 z-50 `}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-gray-900 dark:text-white">
         MakeQuiz
        </Link>
        <div className="flex items-center space-x-4">
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
          {/* <button
            onClick={toggleDarkMode}
            className="text-gray-900 dark:text-white"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button> */}
          <button
            onClick={handleLogout}
            className="text-gray-900 dark:text-white hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
function parseJwt (token:any) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }