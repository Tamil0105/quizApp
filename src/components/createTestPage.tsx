import React, { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io'; // Arrow back icon
import { FaPlus } from 'react-icons/fa'; // Plus icon
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4
import { useParams } from 'react-router-dom';

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
    category: string;
    responses: Response[];
};

type Response = {
    questionId: string;
    selectedOption: string;
};

const CreateTestPage: React.FC = () => {
  const [testName, setTestName] = useState('');
  const [testDuration, setTestDuration] = useState<number>(60); // Default to 60 seconds
  const [durationUnit, setDurationUnit] = useState<'seconds' | 'minutes'>('seconds');
  const [questionText, setQuestionText] = useState('');
  const [newOption, setNewOption] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [questions, setQuestions] = useState<{ id:string;question: string, options: string[], timer: number; answer: string }[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const { course } = useParams<{ course: string }>();

  const validateDuration = (value: number) => {
    if (durationUnit === 'seconds' && (value < 1 || value > 120)) {
      return 'Duration must be between 1 and 120 seconds.';
    } else if (durationUnit === 'minutes' && (value < 1 || value > 1)) {
      return 'Duration must be 1 minute.';
    }
    return '';
  };

  const handleAddOption = () => {
    if (newOption && options.length < 6) {
      setOptions([...options, newOption]);
      setNewOption('');
    } else if (options.length >= 6) {
      setErrors(['You can add a maximum of 6 options.']);
    }
  };

  const handleCreateQuestion = () => {
    if (!questionText || options.length === 0 || !correctAnswer) {
      setErrors(['Please fill out all fields and add at least one option.']);
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
    setErrors([]);
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!testName) errors.push('Test name is required.');
    if (questions.length === 0) errors.push('Please add at least one question.');

    const durationError = validateDuration(testDuration);
    if (durationError) errors.push(durationError);

    setErrors(errors);

    return errors.length === 0;
  };

  const createTest = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post('https://quiz-server-sigma.vercel.app/tests', newTest, { headers });
      console.log('Test created');
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  const handleSaveTest = () => {
    if (validateForm()) {
      createTest(); // Save test to backend
      setTestName('');
      setQuestions([]);
      setTestDuration(60); // Reset to default value
    }
  };

  const newTest: Test = {
    id: uuidv4(),
    name: testName,
    questions: questions,
    category: course?.toUpperCase()??"MECH",
    duration: testDuration,
    responses: [],
  };

  return (
    <div className="flex flex-col md:flex-row p-6 bg-gray-100 min-h-screen">
      {/* Left side - Form */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-lg md:w-1/3">
        <div className="sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => window.history.back()}
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <IoIosArrowBack className="mr-2" /> Back
            </button>
            <button
              onClick={handleSaveTest}
              className="bg-purple-500 text-white rounded-lg p-2 hover:bg-purple-600"
            >
              Save Test
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Create New Test</h2>

        {/* <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
          >
            <option value="">Select a category</option>
            <option value="EEE">EEE</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
          </select>
        </div> */}

        <input
          type="text"
          placeholder="Enter test name"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        />

        <div className="flex mb-4">
          <input
            type="number"
            placeholder="Enter duration"
            value={testDuration}
            onChange={(e) => setTestDuration(Number(e.target.value))}
            className="border border-gray-300 rounded-lg p-2 w-2/3"
          />
          <select
            value={durationUnit}
            onChange={(e) => setDurationUnit(e.target.value as 'seconds' | 'minutes')}
            className="border border-gray-300 rounded-lg p-2 w-1/3 ml-2"
          >
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
          </select>
        </div>

        <div className="text-red-500 mb-4">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>

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
          className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 mb-2 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Option
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
      </div>

      {/* Right side - Preview */}
      <div className="md:w-2/3 md:pl-6 flex flex-col">
        <div className="flex-1 overflow-y-auto bg-white p-6 rounded-lg shadow-lg">
          <h4 className="text-xl font-bold mb-4">Test Preview</h4>
          <h5 className="text-lg font-semibold mb-2">Test Name:</h5>
          <p>{testName}</p>

          <h5 className="text-lg font-semibold mt-4 mb-2">Duration:</h5>
          <p>{testDuration} {durationUnit}</p>

          <h5 className="text-lg font-semibold mt-4 mb-2">Questions:</h5>
          <ul className="list-disc pl-5">
            {questions.map((q, index) => (
              <li key={index} className="mb-2">
                <strong>Q{index + 1}: </strong>{q.question}
                <ul className="list-disc pl-5 mt-2">
                  {q.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
                <p><strong>Answer:</strong> {q.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateTestPage;
