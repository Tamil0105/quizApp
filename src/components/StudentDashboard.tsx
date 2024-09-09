import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useStore } from '../store/useStore';
import { useNavigate, useParams } from 'react-router-dom';
import { FiBook, FiFolder, FiPlayCircle } from 'react-icons/fi';

const StudentDashboard: React.FC = () => {
  const { tests, addTest } = useStore();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const navigate = useNavigate(); 
  const { course } = useParams<{ course: string }>();
console.log(selectedTest)

  const handleStartTest = (testId: string) => {
    setSelectedTest(testId);
    navigate(`/question/${testId}`);
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get('https://quiz-server-sigma.vercel.app/tests/by/category', {
          params: {
            course: course?.toUpperCase(),
          },
          headers,
        });      
      addTest(response.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchTests();
  }, [addTest]);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 animate-pulse"
        >
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4">Available Tests</h2>

      {loading ? (
        renderSkeleton() // Show skeleton loader when data is being fetched
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <div key={test.id} className="bg-white border border-gray-300 flex flex-col gap-4 rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-start">
              {/* Test Name with Icon */}
              <FiBook className="text-4xl text-purple-500 mb-2" /> {/* Icon for test */}
              <h3 className="text-2xl font-semibold mb-2">{test.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              {/* Department Info with Icon */}
              <FiFolder className="text-xl text-gray-500" />
              <p className="text-lg font-medium">Department: {test.category}</p>
            </div>
            <button
              onClick={() => handleStartTest(test.id)}
              className="bg-purple-500 flex items-center w-36 gap-2 text-white rounded-lg px-4 py-2 hover:bg-purple-600 transition duration-300 text-sm font-medium"
            >
              {/* Play Icon inside button */}
              <FiPlayCircle className="text-xl" />
              Start Test
            </button>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default StudentDashboard;
