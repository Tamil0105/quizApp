import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (userType: 'student' | 'teacher') => {
    navigate(userType === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h1>
        <button
          onClick={() => handleLogin('teacher')}
          className="w-full bg-blue-500 text-white rounded-lg py-2 mb-4 hover:bg-blue-600 transition duration-300"
        >
          Teacher Login
        </button>
        <button
          onClick={() => handleLogin('student')}
          className="w-full bg-green-500 text-white rounded-lg py-2 hover:bg-green-600 transition duration-300"
        >
          Student Login
        </button>
      </div>
    </div>
  );
};

export default Login;
