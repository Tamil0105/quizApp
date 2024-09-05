// components/StudentDashboard.tsx
import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
  const { tests, addTest } = useStore();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const navigate = useNavigate(); // Use useNavigate for navigation

  const handleStartTest = (testId: string) => {
    setSelectedTest(testId);
    navigate(`/question/${testId}`); // Navigate to the test page
  };
console.log(selectedTest)
  useEffect(() => {
    // Fetch all tests from the API
    const fetchTests = async () => {
      try {
        const response = await axios.get('https://quiz-server-gules.vercel.app//tests');
        console.log(response.data);
        addTest(response.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, [addTest]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4">Available Tests</h2>
      <div className="space-y-4">
        {tests.map((test) => (
          <div key={test.id} className="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <h3 className="text-2xl font-semibold mb-2">{test.name}</h3>
            <button
              onClick={() => handleStartTest(test.questions[0].id)}
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-300"
            >
              Start Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
