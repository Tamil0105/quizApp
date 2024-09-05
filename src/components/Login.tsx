// components/Login.tsx
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // const { setUserType } = useStore();
  const navigate = useNavigate();

  const handleLogin = (userType: 'student' | 'teacher') => {
    // setUserType(userType);
    navigate(userType === 'teacher' ? '/teacher' : '/student');
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <button onClick={() => handleLogin('teacher')}>Teacher Login</button>
      <button onClick={() => handleLogin('student')}>Student Login</button>
    </div>
  );
};

export default Login;
