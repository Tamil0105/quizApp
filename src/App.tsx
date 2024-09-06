// import { useEffect } from 'react';
// import { useStore } from './store/useStore';
// import QuestionPage from './components/QuestionPage';
// import StudentDashboard from './components/StudentDashboard';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import TeacherDashboard from './components/TeacherDashbord';
// import Login from './components/Login';
// import TestAnalytics from './components/TestAnalytics';

// function App() {
//   const initializeStore = useStore((state) => state.initializeStore);

//   useEffect(() => {
//     initializeStore(); // Initialize store with default data
//   }, [initializeStore]);

//   return (
//     <Router>
//       <Routes>
//        <Route path="/" element={<Login />} />
//         <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
//         <Route path="/question/:testId" element={<QuestionPage />} />
//         <Route path="/student-dashboard" element={<StudentDashboard />} />
//         <Route path="/test-analytics/:testId" element={<TestAnalytics />} />

//         {/* Add other routes as needed */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;



// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './components/Sinup';
import QuestionPage from './components/QuestionPage';
import TeacherDashboard from './components/TeacherDashbord';
import Navbar from './components/navBar';
import TestAnalytics from './components/TestAnalytics';

const App: React.FC = () => {
  return (
    <Router>
        <Navbar />
        <main className="p-4">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/question/:testId" element={<ProtectedRoute><QuestionPage /></ProtectedRoute>} />
        <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/test-analytics/:testId" element={<ProtectedRoute><TestAnalytics /></ProtectedRoute>}/>

      </Routes>
      </main>
    </Router>
  );
};

export default App;
