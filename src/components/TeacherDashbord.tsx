import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../store/useStore';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaPlus, FaQuestionCircle, FaRegClipboard, FaSave, FaTimes } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: string;
  timer: number;
};

type Test = {
  id: string;
  name: string;
  questions: Question[];
  duration: number;
  responses: Response[];
};

type Response = {
  questionId: string;
  selectedOption: string;
};

const TeacherDashboard = () => {
  const { addTest,setTests, tests } = useStore();
  const [loading, setLoading] = useState(true);  // State for loading
  const [testName, setTestName] = useState('');
  const [durationUnit, setDurationUnit] = useState('seconds'); // seconds, minutes, hours
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [showCreateTestPopup, setShowCreateTestPopup] = useState<boolean>(false);
  const [testDuration, setTestDuration] = useState<number>(30);
  const [questionCategory, setQuestionCategory] = useState('');
  const [categories] = useState(['EEE', 'ECE', 'MECH']); // 
  const navigate = useNavigate();
  const { course } = useParams<{ course: string }>();

  const handleAddOption = () => {
    if (newOption.trim() !== '' && !options.includes(newOption)) {
      setOptions([...options, newOption]);
      setNewOption('');
    }
  };

  const handleCreateQuestion = () => {
    if (!questionText || options.length === 0 || !correctAnswer) {
      alert('Please fill out all fields and add at least one option.');
      return;
    }

    const newQuestion: Question = {
      id: uuidv4(),
      question: questionText,
      options,
      answer: correctAnswer,
      timer: 0,
    };

    setQuestions([...questions, newQuestion]);
    setQuestionText('');
    setOptions([]);
    setNewOption('');
    setCorrectAnswer('');
  };

  const newTest: Test = {
    id: uuidv4(),
    name: testName,
    questions,
    duration: testDuration,
    responses: [],
  };

  const handleSaveTest = () => {
    if (!testName || questions.length === 0) {
      alert('Please provide a test name and add at least one question.');
      return;
    }

    createTest(); // Save test to backend
    setTestName('');
    setQuestions([]);
    setTestDuration(0);
    setShowCreateTestPopup(false);
  };

  const createTest = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post('https://quiz-server-sigma.vercel.app/tests', newTest, {
        params: {
          course: course?.toUpperCase(),
        },
        headers,
      });
      console.log('Test created');
    } catch (error) {
      console.error('Error creating test:', error);
    }
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
  }, [addTest, course]);

  const handleTestClick = (testId: string) => {
    navigate(`/test-analytics/${testId}`);
  };
console.log(tests)
  return (
    <div className=" max-w-6xl py-2 mx-auto bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>

      <button
        onClick={() => (navigate("create-test"))}
        className="bg-purple-500 text-white rounded-lg p-2 hover:bg-purple-600 mb-6"
      >
        Create New Test
      </button>

      <h2 className="text-2xl font-semibold mb-4">Created Tests</h2>
      {loading ? (
        // Skeleton loader while fetching tests
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

      {/* Create Test Popup */}
      {showCreateTestPopup && (
          <div className="popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaCalendarAlt className="mr-2" />
              Create New Test
            </h2>
            <input
              type="text"
              placeholder="Enter test name"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            />
            <div className="flex items-center mb-4">
              <input
                type="number"
                placeholder="Enter total test duration"
                value={testDuration}
                onChange={(e) => setTestDuration(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-2 w-3/4 mr-2"
              />
              <select
                value={durationUnit}
                onChange={(e) => setDurationUnit(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-1/4"
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
            </div>
            
            <div className="flex items-center mb-4">
              <label className="mr-2">Category:</label>
              <select
                value={questionCategory}
                onChange={(e) => setQuestionCategory(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
    
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaPlus className="mr-2" />
              Add Question
            </h3>
            <input
              type="text"
              placeholder="Enter your question"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Enter new option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mb-2"
            />
            <button
              onClick={handleAddOption}
              className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 mb-2 flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Option
            </button>
    
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Options</h4>
              <ul className="list-disc pl-5">
                {options.map((option, index) => (
                  <li key={index} className="mb-1">{option}</li>
                ))}
              </ul>
            </div>
    
            <input
              type="text"
              placeholder="Enter the correct answer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mb-2"
            />
            <button
              onClick={handleCreateQuestion}
              className="bg-green-500 text-white rounded-lg p-2 hover:bg-green-600 mb-4 flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Question
            </button>
    
            <button
              onClick={handleSaveTest}
              className="bg-purple-500 text-white rounded-lg p-2 hover:bg-purple-600 mb-4 flex items-center"
            >
              <FaSave className="mr-2" />
              Save Test
            </button>
            <button
              onClick={() => setShowCreateTestPopup(false)}
              className="bg-red-500 text-white rounded-lg p-2 hover:bg-red-600 flex items-center"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
