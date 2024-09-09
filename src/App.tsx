import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './components/Sinup';
import QuestionPage from './components/QuestionPage';
import TeacherDashboard from './components/TeacherDashbord';
import Navbar from './components/navBar';
import TestAnalytics from './components/TestAnalytics';
import CoursePage from './components/coursePages';
import CreateTestPage from './components/createTestPage';
import LandingPage from './components/landingPage';
const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();

  // List of paths where the Navbar should not be displayed
  const hideNavbarPaths = ['/login','/', '/signup'];

  return (
    <>
      {/* Conditionally render Navbar based on the current path */}
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <main className="">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />

          <Route path="/teacher-dashboard/course" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
          <Route path="/student-dashboard/course" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
          <Route path="/student-dashboard/course/:course" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/teacher-dashboard/course/:course" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/question/:testId" element={<ProtectedRoute><QuestionPage /></ProtectedRoute>} />
          <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/test-analytics/:testId" element={<ProtectedRoute><TestAnalytics /></ProtectedRoute>} />
          <Route path="/teacher-dashboard/course/:course/create-test" element={<CreateTestPage />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
