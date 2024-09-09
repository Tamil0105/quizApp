import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {  FaClock, FaQuestionCircle, FaRegClipboard } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import AnalyticPage from './departmentAnalyticPage';
const TeacherDashboard = () => {
  const { addTest, tests } = useStore();
  const [loading, setLoading] = useState(true);  
  const [activeTab, setActiveTab] = useState<'test' | 'report'>('test'); // State for active tab
  const navigate = useNavigate();
  const { course } = useParams<{ course: string }>();
 

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
        setLoading(false); 
      }
    };

    fetchTests();
  }, [addTest, course]);

  const handleTestClick = (testId: string) => {
    navigate(`/test-analytics/${testId}`);
  };

  return (
    <div className="max-w-7xl py-2 mx-auto bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>

      <div className="mb-6    flex space-x-4 relative">
 

  {/* Test Button */}
  <button
    onClick={() => setActiveTab('test')}
    className={`px-4 py-2 text-sm rounded-lg transition-transform duration-300 ease-in-out ${
      activeTab === 'test'
        ? 'bg-purple-600 text-white shadow-lg shadow-purple-400'
        : 'bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-gray-900'
    }`}
  >
    Test
  </button>
  
  {/* Report Button */}
  <button
    onClick={() => setActiveTab('report')}
    className={`px-4 py-2 text-sm rounded-lg transition-transform duration-300 ease-in-out ${
      activeTab === 'report'
        ? 'bg-purple-600 text-white shadow-lg shadow-purple-400'
        : 'bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-gray-900'
    }`}
  >
    Report
  </button>
</div>


      {activeTab === 'test' && (
        <>
          <button
            onClick={() => navigate('create-test')}
            className="bg-purple-500 text-white rounded-lg p-2 hover:bg-purple-600 mb-6"
          >
            Create New Test
          </button>

          <h2 className="text-2xl font-semibold mb-4">Created Tests</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="p-4">
                  <Skeleton height={100} />
                </div>
              ))}
            </div>
          ) : tests.length === 0 ? (
            <p className="text-center text-gray-500">No tests available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleTestClick(test.id)}
                >
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <FaRegClipboard className="mr-2 text-blue-500" /> {test.name}
                  </h3>
                  <p>Department: {test.category}</p>
                  <p className="flex items-center mb-1">
                    <FaQuestionCircle className="mr-2 text-green-500" /> Total Questions: {test.questions.length}
                  </p>
                  <p className="flex items-center">
                    <FaClock className="mr-2 text-red-500" /> Total Time: {test.duration} seconds
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'report' && (
        <div>
       <AnalyticPage department={(course as any).toUpperCase()}/>
        </div>
      )}
       </div>
  );
};

export default TeacherDashboard;
