import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io"; // Arrow back icon
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa"; // Plus, Edit, Delete icons
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4
import {  useParams } from "react-router-dom";

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
  const [testName, setTestName] = useState("");
  const [testDuration, setTestDuration] = useState<number>(60); // Default to 60 minutes
  const [durationUnit, setDurationUnit] = useState<"minutes" | "hours">("minutes");
  const [questionText, setQuestionText] = useState("");
  const [newOption, setNewOption] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null); // For tracking which question is being edited
  const [errors, setErrors] = useState<string[]>([]);
  const { course } = useParams<{ course: string }>();
  // const navigate = useNavigate();

  const handleAddOption = () => {
    if (newOption && options.length < 6) {
      setOptions([...options, newOption]);
      setNewOption("");
    } else if (options.length >= 6) {
      setErrors(["You can add a maximum of 6 options."]);
    }
  };

  // Function to delete an individual option
  const handleDeleteOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const validateDuration = (value: number, unit: "minutes" | "hours") => {
    if (unit === "minutes" && value < 60) {
      return "Duration must be at least 60 minutes.";
    } else if (unit === "hours" && value < 1) {
      return "Duration must be at least 1 hour.";
    }
    return "";
  };

  const handleCreateQuestion = () => {
    if (!questionText || options.length === 0 || !correctAnswer) {
      setErrors(["Please fill out all fields and add at least one option."]);
      return;
    }

    const newQuestion: Question = {
      id: uuidv4(),
      question: questionText,
      options,
      answer: correctAnswer,
      timer: 0,
    };

    if (editIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editIndex] = newQuestion;
      setQuestions(updatedQuestions);
      setEditIndex(null); // Reset edit state
    } else {
      setQuestions([...questions, newQuestion]);
    }

    setQuestionText("");
    setOptions([]);
    setNewOption("");
    setCorrectAnswer("");
    setErrors([]);
  };

  const handleEditQuestion = (index: number) => {
    const questionToEdit = questions[index];
    setQuestionText(questionToEdit.question);
    setOptions(questionToEdit.options);
    setCorrectAnswer(questionToEdit.answer);
    setEditIndex(index); // Set the index for editing
  };

  // Function to delete a question
  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!testName) errors.push("Test name is required.");
    if (questions.length === 0) errors.push("Please add at least one question.");

    const durationError = validateDuration(testDuration, durationUnit);
    if (durationError) errors.push(durationError);

    setErrors(errors);

    return errors.length === 0;
  };

  const createTest = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post("http://localhost:8080/tests", newTest, {
        headers,
      });
   
      console.log("Test created");
    } catch (error) {
      console.error("Error creating test:", error);
    }
  };

  const handleSaveTest = () => {
    if (validateForm()) {
      createTest(); // Save test to backend
      setTestName("");
      setQuestions([]);
      setTestDuration(60); // Reset to default value
    }
  };

  const newTest: Test = {
    id: uuidv4(),
    name: testName,
    questions: questions,
    category: course?.toUpperCase() ?? "MECH",
    duration: durationUnit === "minutes" ? testDuration : testDuration * 60, // Convert hours to minutes
    responses: [],
  };

  return (
    <div className="flex flex-col md:flex-row p-6 gap-3 bg-gray-100 min-h-screen">
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
              className="bg-teal-600 text-white rounded-lg p-2 hover:bg-teal-700"
            >
              Save Test
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Create New Test</h2>

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
            min={durationUnit === "minutes" ? 60 : 1} // Minimum value depends on the unit
          />
          <select
            value={durationUnit}
            onChange={(e) =>
              setDurationUnit(e.target.value as "minutes" | "hours")
            }
            className="border border-gray-300 rounded-lg p-2 w-1/3 ml-2"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
          </select>
        </div>

        <div className="text-red-500 mb-4">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>

        <h3 className="text-xl font-semibold mb-4">
          {editIndex !== null ? "Edit Question" : "Add Question"}
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
          <FaPlus className="mr-2" /> Add Option
        </button>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Options</h4>
          <ul className="list-disc pl-5">
            {options.map((option, index) => (
              <li key={index} className="flex items-center">
                {option}
                <button
                  onClick={() => handleDeleteOption(index)}
                  className="text-red-500 ml-2"
                >
                  <FaTrashAlt />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <input
          type="text"
          placeholder="Enter correct answer"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        />

        <button
          onClick={handleCreateQuestion}
          className="bg-teal-600 text-white rounded-lg p-2 hover:bg-teal-700 w-full"
        >
          {editIndex !== null ? "Update Question" : "Add Question"}
        </button>
      </div>

      {/* Right side - Questions list */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-lg md:w-2/3 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Questions</h2>

        {questions.length === 0 ? (
          <p>No questions added yet.</p>
        ) : (
          <ul className="space-y-4">
            {questions.map((question, index) => (
              <li key={question.id} className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{question.question}</h4>
                <ul className="list-disc pl-5 mb-2">
                  {question.options.map((option, i) => (
                    <li key={i}>{option}</li>
                  ))}
                </ul>
                <p className="mb-2">
                  <strong>Correct Answer:</strong> {question.answer}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditQuestion(index)}
                    className="text-blue-500"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(index)}
                    className="text-red-500"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CreateTestPage;
