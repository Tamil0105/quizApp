import { useEffect } from 'react';
import { useStore } from './store/useStore';
import QuestionPage from './components/QuestionPage';
import StudentDashboard from './components/StudentDashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TeacherDashboard from './components/TeacherDashbord';

function App() {
  const initializeStore = useStore((state) => state.initializeStore);

  useEffect(() => {
    initializeStore(); // Initialize store with default data
  }, [initializeStore]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TeacherDashboard />} />
        <Route path="/question/:questionId" element={<QuestionPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
