import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import CreateTestForm from "./createTestForm";
import QuestionPreviewPage from "./QuestionPreviewPage";

type Question = {
  id: string;
  question: string;
  options?: string[]; // For multiple-choice questions
  answer: string;
  timer?: number;
  questionType: "textarea" | "multiple-choice"; // New field for question type
  correctMark: number;
  incorrectMark: number;
};

type Test = {
  id: string;
  name: string;
  questions: Question[];
  duration: number;
  category: string;
  responses: Response[];
  instructions: string;
  durationType: "test" | "per-question"; // New field to differentiate test duration
};

type Response = {
  questionId: string;
  selectedOption: string;
};

const CreateTestPage: React.FC = () => {
  const [testName, setTestName] = useState("");
  const [testDuration, setTestDuration] = useState<number>(60);
  const [durationType, setDurationType] = useState<"test" | "per-question">("test");
  const [questionText, setQuestionText] = useState("");
  const [newOption, setNewOption] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionTimer, setQuestionTimer] = useState<number>(15);
  const [questionType, setQuestionType] = useState<"textarea" | "multiple-choice">("multiple-choice");
  const [correctMark, setCorrectMark] = useState<number>(1);
  const [incorrectMark, setIncorrectMark] = useState<number>(0);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [instructions, setInstructions] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const { course } = useParams<{ course: string }>();

  const handleAddOption = () => {
    if (newOption && options.length < 6) {
      setOptions([...options, newOption]);
      setNewOption("");
    } else if (options.length >= 6) {
      setErrors(["You can add a maximum of 6 options."]);
    }
  };

  const handleDeleteOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const handleCreateQuestion = () => {
    if (!questionText || (questionType === "multiple-choice" && options.length === 0) || !correctAnswer || (durationType === "per-question" && questionTimer <= 0)) {
      setErrors(["Please fill out all fields and add at least one option for multiple-choice questions."]);
      return;
    }

    const newQuestion: Question = {
      id: uuidv4(),
      question: questionText,
      options: questionType === "multiple-choice" ? options : undefined,
      answer: correctAnswer,
      timer: durationType === "per-question" ? questionTimer : undefined,
      questionType,
      correctMark,
      incorrectMark,
    };

    if (editIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editIndex] = newQuestion;
      setQuestions(updatedQuestions);
      setEditIndex(null);
    } else {
      setQuestions([...questions, newQuestion]);
    }

    resetQuestionForm();
    setErrors([]);
  };

  const resetQuestionForm = () => {
    setQuestionText("");
    setOptions([]);
    setNewOption("");
    setCorrectAnswer("");
    setQuestionTimer(15);
    setQuestionType("multiple-choice");
    setCorrectMark(1);
    setIncorrectMark(0);
  };

  const handleEditQuestion = (index: number) => {
    const questionToEdit = questions[index];
    setQuestionText(questionToEdit.question);
    setOptions(questionToEdit.options || []);
    setCorrectAnswer(questionToEdit.answer);
    setQuestionTimer(questionToEdit.timer || 15);
    setQuestionType(questionToEdit.questionType);
    setCorrectMark(questionToEdit.correctMark);
    setIncorrectMark(questionToEdit.incorrectMark);
    setEditIndex(index);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const validateForm = () => {
    const errors: string[] = [];
    if (!testName) errors.push("Test name is required.");
    if (questions.length === 0) errors.push("Please add at least one question.");
    setErrors(errors);
    return errors.length === 0;
  };

  const createTest = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post("https://quiz-server-sigma.vercel.app/tests", newTest, {
        headers,
      });
      window.location.replace(`http://localhost:3000/teacher-dashboard/course/${course}`);
      console.log("Test created");
    } catch (error) {
      console.error("Error creating test:", error);
    }
  };

  const handleSaveTest = () => {
    if (validateForm()) {
      createTest();
      setTestName("");
      setQuestions([]);
      setTestDuration(60);
      setInstructions("");
    }
  };

  const newTest: Test = {
    id: uuidv4(),
    name: testName,
    questions,
    category: course?.toUpperCase() ?? "MECH",
    duration: testDuration,
    responses: [],
    instructions,
    durationType,
  };

  return (
    <div className="flex flex-col md:flex-row p-6 gap-3 bg-gray-100 min-h-screen">
      {/* <div className="flex-1 bg-white p-6 rounded-lg shadow-lg md:w-1/3">
        <div className="sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => window.history.back()}
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <IoIosArrowBack className="mr-2" /> Back
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

        <textarea
          placeholder="Enter instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          rows={3}
        />

        <div className="flex items-center mb-4">
          <input
            type="radio"
            id="test-duration"
            name="duration-type"
            value="test"
            checked={durationType === "test"}
            onChange={() => setDurationType("test")}
          />
          <label htmlFor="test-duration" className="ml-2">Duration for the entire test</label>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="radio"
            id="per-question-duration"
            name="duration-type"
            value="per-question"
            checked={durationType === "per-question"}
            onChange={() => setDurationType("per-question")}
          />
          <label htmlFor="per-question-duration" className="ml-2">Duration for each question</label>
        </div>

        {durationType === "test" && (
          <input
            type="number"
            placeholder="Enter test duration in minutes"
            value={testDuration}
            onChange={(e) => setTestDuration(Number(e.target.value))}
            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          />
        )}

        <h3 className="text-xl font-semibold mb-4">
          {editIndex !== null ? "Edit Question" : "Add Question"}
        </h3>

        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value as "textarea" | "multiple-choice")}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        >
          <option value="multiple-choice">Multiple Choice</option>
          <option value="textarea">Text Area</option>
        </select>

        <input
          type="text"
          placeholder="Enter your question"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        />

        {questionType === "multiple-choice" && (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter a new option"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
              <button
                onClick={handleAddOption}
                className="bg-blue-500 text-white p-2 rounded-lg mt-2 w-full"
              >
                Add Option
              </button>
            </div>

            <ul className="mb-4">
              {options.map((option, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                  <span>{option}</span>
                  <button
                    onClick={() => handleDeleteOption(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        <input
          type="text"
          placeholder="Enter the correct answer"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        />

        {durationType === "per-question" && (
          <input
            type="number"
            placeholder="Set time in seconds"
            value={questionTimer}
            onChange={(e) => setQuestionTimer(Number(e.target.value))}
            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          />
        )}

        <input
          type="number"
          placeholder="Enter positive marks for correct answer"
          value={correctMark}
          onChange={(e) => setCorrectMark(Number(e.target.value))}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        />

        <input
          type="number"
          placeholder="Enter negative marks for wrong answer"
          value={incorrectMark}
          onChange={(e) => setIncorrectMark(Number(e.target.value))}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        />

        <div className="flex justify-end">
          <button
            onClick={handleCreateQuestion}
            className="bg-green-500 text-white p-2 rounded-lg w-full"
          >
            {editIndex !== null ? "Update Question" : "Add Question"}
          </button>
        </div>

        {errors.length > 0 && (
          <ul className="text-red-500 mt-4">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
      </div> */}
<CreateTestForm/>
      {/* <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Test Preview</h2>

        <h3 className="text-lg font-semibold">Test Name: {testName}</h3>
        <h4 className="mb-4">Duration: {durationType === "test" ? `${testDuration} minutes` : "Per question"}</h4>
        <h4 className="mb-4">Instructions: {instructions}</h4>

        <h3 className="text-xl font-semibold mb-4">Questions:</h3>

        <ul>
          {questions.map((question, index) => (
            <li key={index} className="mb-4">
              <h4 className="font-semibold mb-2">
                {index + 1}. {question.question}
              </h4>
              {question.questionType === "multiple-choice" && (
                <ul>
                  {question.options?.map((option, i) => (
                    <li key={i} className="ml-4">{option}</li>
                  ))}
                </ul>
              )}
              <p className="ml-4">Correct Answer: {question.answer}</p>
              <p className="ml-4">Marks: {question.correctMark} / {question.incorrectMark}</p>
              {question.timer && <p className="ml-4">Time: {question.timer} seconds</p>}
              <div className="flex mt-2">
                <button
                  onClick={() => handleEditQuestion(index)}
                  className="bg-blue-500 text-white p-2 rounded-lg mr-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteQuestion(index)}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveTest}
            className="bg-green-500 text-white p-2 rounded-lg w-full"
          >
            Save Test
          </button>
        </div>
      </div> */}
      <QuestionPreviewPage/>
    </div>
  );
};

export default CreateTestPage;
