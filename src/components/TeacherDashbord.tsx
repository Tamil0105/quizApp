import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../store/useStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaQuestionCircle, FaRegClipboard } from 'react-icons/fa';

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
  const { addTest, setTest, tests } = useStore();
  const [testName, setTestName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [showCreateTestPopup, setShowCreateTestPopup] = useState<boolean>(false);
  const [testDuration, setTestDuration] = useState<number>(30);
  const navigate = useNavigate();

 
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

  // const handleOpenPopup = (questionId: string) => {
  //   const test = tests.find(t => t.questions.some(q => q.id === questionId));
  //   if (test) {
  //     const question = test.questions.find(q => q.id === questionId) || null;
  //     setPopupQuestion(question);
  //     if (question) {
  //       const testResponses = getTestResponses(questionId);
  //       setResponses(testResponses);
  //     }
  //   }
  // };

  const createTest = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post('https://quiz-server-sigma.vercel.app/tests', newTest,{headers});
      console.log('Test created:', response.data);
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get('https://quiz-server-sigma.vercel.app/tests',{headers});
        addTest(response.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, [setTest]);
  const handleTestClick = (testId: string) => {
    navigate(`/test-analytics/${testId}`);
  };
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>

      <button
        onClick={() => setShowCreateTestPopup(true)}
        className="bg-purple-500 text-white rounded-lg p-2 hover:bg-purple-600 mb-6"
      >
        Create New Test
      </button>

      <h2 className="text-2xl font-semibold mb-4">Created Tests</h2>
      {tests.length === 0 ? (
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
     {showCreateTestPopup && (
        <div className="popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">Create New Test</h2>
            <input
              type="text"
              placeholder="Enter test name"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            />
            <input
              type="number"
              placeholder="Enter total test duration in seconds"
              value={testDuration}
              onChange={(e) => setTestDuration(Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            />

            <h3 className="text-xl font-semibold mb-4">Add Question</h3>
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
              className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 mb-2"
            >
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
              className="bg-green-500 text-white rounded-lg p-2 hover:bg-green-600 mb-4"
            >
              Add Question
            </button>

            <button
              onClick={handleSaveTest}
              className="bg-purple-500 text-white rounded-lg p-2 hover:bg-purple-600"
            >
              Save Test
            </button>
            <button
              onClick={() => setShowCreateTestPopup(false)}
              className="bg-red-500 text-white rounded-lg p-2 hover:bg-red-600 mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>

  );
};

export default TeacherDashboard;
