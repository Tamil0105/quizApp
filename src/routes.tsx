// routes.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import QuestionPage from './components/QuestionPage';
import TeacherDashboard from './components/TeacherDashbord';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/question/:id" element={<QuestionPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
