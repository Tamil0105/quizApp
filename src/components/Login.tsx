import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Function to parse JWT
function parseJwt(token: any) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validatePhoneNumber = (phone: string) => {
    return phone.length >= 10; // Simple phone number validation
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate phone number
    if (!validatePhoneNumber(phone)) {
      setError('Phone number must be at least 10 digits.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://quiz-server-sigma.vercel.app/auth/login', { phone, password });
      const token = response.data.access_token;

      // Store token in localStorage
      localStorage.setItem('token', token);
      const decodedToken = parseJwt(token);
      console.log('Decoded token:', decodedToken);

      // Navigate based on the user role from the decoded token
      navigate(decodedToken.role === 'STUDENT' ? '/student-dashboard/course' : '/teacher-dashboard/course');
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/signup'); // Navigate to the sign-up page
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <svg className="w-5 h-5 mx-auto animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4h4a8 8 0 01-8 8v-4z"></path>
              </svg>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <button
              onClick={handleSignUpRedirect}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
