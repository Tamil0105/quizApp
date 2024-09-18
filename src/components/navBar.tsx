// // src/components/Navbar.tsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import ProfileDropdown from './ProfileModal';

// const Navbar: React.FC = () => {
//   const navigate = useNavigate();
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/');
//   };

//   const toggleProfileDropdown = () => {
//     setIsProfileDropdownOpen(!isProfileDropdownOpen);
//   };

//   const token = localStorage.getItem('token');
//   let userRole = '';
//   let userDetails = null;

//   if (token) {
//     try {
//       const decodedToken: any = parseJwt(token);
//       userRole = decodedToken.role;
//       userDetails = decodedToken;
//       console.log(decodedToken)// Adjust as per your token structure
//     } catch (error) {
//       console.error('Error decoding token:', error);
//     }
//   }

//   return (
//     <nav className="w-full h-full bg-teal-600 shadow-md">
//     {/* <nav className="sticky top-0 z-50 p-4 bg-teal-600 shadow-md"> */}
//       <div className="container flex items-center justify-between mx-auto">
//         <Link to="/" className="text-xl font-semibold text-gray-900 dark:text-white">
//         Assessment        </Link>
//         <div className="relative flex items-center space-x-4">
//           {userRole === 'student' && (
//             <>
//               <Link to="/student-dashboard" className="text-gray-900 dark:text-white hover:underline">
//                 Dashboard
//               </Link>
//               <Link to="/tests" className="text-gray-900 dark:text-white hover:underline">
//                 Tests
//               </Link>
//             </>
//           )}
//           {userRole === 'admin' && (
//             <>
//               <Link to="/admin-dashboard" className="text-gray-900 dark:text-white hover:underline">
//                 Dashboard
//               </Link>
//               <Link to="/create-test" className="text-gray-900 dark:text-white hover:underline">
//                 Create Test
//               </Link>
//             </>
//           )}
//           <button
//             onClick={toggleProfileDropdown}
//             className="relative text-gray-900 dark:text-white"
//           >
//              <div className="flex items-center justify-center w-10 h-10 text-gray-500 bg-gray-200 rounded-full ">
//             <span className="text-lg font-semibold">{userDetails?.name?.charAt(0) || 'U'}</span>
//           </div>
//             {isProfileDropdownOpen && (
//               <ProfileDropdown
//                 isOpen={isProfileDropdownOpen}
//                 onClose={toggleProfileDropdown}
//                 onLogout={handleLogout}
//                 userDetails={userDetails}
//               />
//             )}
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// function parseJwt(token: any) {
//   const base64Url = token.split('.')[1];
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
//     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//   }).join(''));

//   return JSON.parse(jsonPayload);
// }

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileModal";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const token = localStorage.getItem("token");
  let userRole = "";
  let userDetails: any = null;

  if (token) {
    try {
      const decodedToken: any = parseJwt(token);
      userRole = decodedToken.role;
      userDetails = decodedToken; // Adjust as per your token structure
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return (
    <nav className="flex items-center w-full h-full px-5 bg-white shadow-sm">
    <div className="flex items-center justify-between w-full">
      {/* Left section - Greeting */}
      <div className="text-xl font-semibold text-teal-600">
        Hello, {userDetails?.name || "User"}{" "}
        <span role="img" aria-label="wave">
          👋
        </span>
        {/* Welcome message */}
        <div className="text-sm text-gray-500">Welcome to Assessment</div>
      </div>

      {/* Right section - Profile circle */}
      <div className="relative flex items-center space-x-4">
        {/* Links based on user role */}
        {userRole === "student" && (
          <>
            <Link
              to="/student-dashboard"
              className="text-gray-900 dark:text-white hover:underline"
            >
              Dashboard
            </Link>
            <Link
              to="/tests"
              className="text-gray-900 dark:text-white hover:underline"
            >
              Tests
            </Link>
          </>
        )}
        {userRole === "admin" && (
          <>
            <Link
              to="/admin-dashboard"
              className="text-gray-900 dark:text-white hover:underline"
            >
              Dashboard
            </Link>
            <Link
              to="/create-test"
              className="text-gray-900 dark:text-white hover:underline"
            >
              Create Test
            </Link>
          </>
        )}

        {/* Profile button */}
        <button
          onClick={toggleProfileDropdown}
          className="relative text-gray-900 dark:text-white"
        >
          <div className="flex items-center justify-center w-10 h-10 text-teal-600 border-2 border-teal-600 rounded-full bg-teal-600/25">
            <span className="text-lg font-semibold">
              {userDetails?.name?.charAt(0) || "U"}
            </span>
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

function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}