import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaClock, FaQuestionCircle, FaRegClipboard } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import AnalyticPage from './departmentAnalyticPage';

const TeacherDashboard = () => {
  const [tests, setTest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'test' | 'report'>('test');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [testName, setTestName] = useState('');
  const [levelCount, setLevelCount] = useState(0);
  const navigate = useNavigate();
  const { course } = useParams<{ course: string }>();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`http://localhost:8080/tests/category/${course?.toUpperCase()}`, {
          headers,
        });
        setTest(response.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [course]);

  const handleTestClick = (testId: string) => {
    navigate(`/test-analytics/${testId}`);
  };

  const handleCreateTest = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const newTest = {
        name: testName,
        category: course?.toUpperCase(),
        levelsCount: levelCount,
        timerForWholeTest:true,
duration:60
      };
      await axios.post('http://localhost:8080/tests', newTest, { headers });
      setIsModalOpen(false);
      setTestName('');
      setLevelCount(0);
      // Optionally, refetch tests to show the newly created test
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  return (
    <div className="max-w-7xl py-2 px-2 mx-auto bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>

      <div className="mb-6 flex space-x-4 relative">
        {/* Test Button */}
        <button
          onClick={() => setActiveTab('test')}
          className={`px-4 py-2 text-sm rounded-lg transition-transform duration-300 ease-in-out ${
            activeTab === 'test'
              ? 'bg-teal-600 text-white shadow-lg '
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
              ? 'bg-teal-600 text-white shadow-lg '
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-gray-900'
          }`}
        >
          Report
        </button>
      </div>

      {activeTab === 'test' && (
        <>
          <button
            onClick={() => setIsModalOpen(true)} // Open modal on button click
            className="bg-teal-700 text-white rounded-lg p-2 hover:bg-teal-600 mb-6"
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
              {tests.map((test:any, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleTestClick(test.id)}
                >
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <FaRegClipboard className="mr-2 text-blue-500" /> {test.name}
                  </h3>
                  <p>Department: {test.category}</p>
                  <p className="flex items-center">
                    <FaClock className="mr-2 text-red-500" /> Total Time: {test.duration} seconds
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Modal for Creating a New Test */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
               <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Test configuration</h2>
                <button onClick ={() =>{
                  setIsModalOpen(false)
                }} className="text-gray-500 hover:text-gray-700 border rounded-full p-3 h-10 w-10 flex justify-center items-center">
                    <i className="fas fa-times"></i>
                </button>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Enter test name *</label>
                <input type="text" value={testName} onChange={(e) =>setTestName(e.target.value)} placeholder="Enter test name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"/>
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 mb-2">Level count</label>
                <input value={levelCount} onChange={(e) =>{setLevelCount(parseInt(e.target.value))}} type="text" placeholder="Enter Level Count" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"/>
            </div>
            <div className="flex justify-end">
                <button onClick={() =>handleCreateTest()} className="bg-teal-600 text-white px-6 py-2 rounded-lg">Confirm</button>
            </div>
        </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'report' && (
        <div>
          <AnalyticPage department={(course as any)?.toUpperCase()} />
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
