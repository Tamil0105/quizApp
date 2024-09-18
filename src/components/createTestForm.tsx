import { useEffect, useState } from "react";
import useStore from "../store/useStore";
import axios from "axios";
import { useParams } from "react-router-dom";
import { data } from "framer-motion/client";

const CreateTestForm = () => {
  const { test, setTest, setTestDetails, setCurrentTab,currentTab, addLevelToTest, addQuestionToLevel } = useStore((state) => ({
    test: state.test,
    setTest: state.setTest,
    addLevelToTest: state.addLevelToTest,
    addQuestionToLevel: state.addQuestionToLevel,
    setTestDetails: state.setTestDetails,
    setCurrentTab:state.setActiveStep,
    currentTab:state.activeStep
  }));
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [levelsCount,setLevelCount] = useState(0)
  const [timeType, setTimeType] = useState<"overall" | "individual">("overall");
  const [testMinutes, setTestMinutes] = useState<number>(60);
  const [testSeconds, setTestSeconds] = useState<number>(0);
  const [individualMinutes, setIndividualMinutes] = useState<number>(1);
  const [individualSeconds, setIndividualSeconds] = useState<number>(0);
  const [answerType, setAnswerType] = useState<"CHOICE" | "TEXTAREA">("CHOICE");
  const [options, setOptions] = useState<string[]>([""]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [plusMarks, setPlusMarks] = useState<number>(1);
  const [minusMarks, setMinusMarks] = useState<number>(1);
  const [testName, setTestName] = useState<string>(( test as any)?.name);
  const [testInstructions, setTestInstructions] = useState<string>((test as any)?.instructions);
  const [testId, setTestId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { testId: routeTestId } = useParams();



  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    // if (!testName) newErrors.testName = "Test Name is required";
    // if (!testInstructions) newErrors.testInstructions = "Test Instructions are required";
    if (!question) newErrors.question = "Question is required";
    if (answerType === "CHOICE" && options.length === 0) newErrors.options = "At least one option is required";
    if (answerType === "CHOICE" && !correctAnswer) newErrors.correctAnswer = "Correct answer must be selected";
    if (answerType === "TEXTAREA" && !correctAnswer) newErrors.correctAnswer = "Correct answer is required";
    if (timeType === "overall" && (testMinutes <= 0 && testSeconds <= 0)) newErrors.testDuration = "Overall test duration must be greater than 0";
    if (timeType === "individual" && (individualMinutes <= 0 && individualSeconds <= 0)) newErrors.individualDuration = "Individual question timer must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleCorrectAnswerChange = (value: string) => {
    setCorrectAnswer(value);
  };

  const handleTabChange = (tab: number) => {
    setCurrentTab(tab);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!testId) {
      alert("Test ID is not set.");
      return;
    }

    const newQuestion = {
      question,
      type: answerType,
      options,
      answer: correctAnswer,
      timer: timeType === "individual" ? individualMinutes * 60 + individualSeconds : 0,
    };

    const levelNo = (currentTab+1);

    const existingTest = test;

    if (!existingTest) {
      const newTest = {
        id: testId,
        name: testName,
        timerForWholeTest: timeType === "overall",
        instructions: testInstructions,
        duration: testMinutes * 60 + testSeconds,
        levelsCount:(test as any)?.levelsCount,
        category: "EEE",
        levels: [
          {
            levelNo,
            levelName:`level ${currentTab}` ,
            marks: plusMarks,
            minusMarks,
            questions: [newQuestion],
          },
        ],
        responses: [],
      };
      setTest(newTest);
    } else {
      const levelExists = existingTest.levels.find((level) => level.levelNo === levelNo);

      if (levelExists) {
        addQuestionToLevel(levelNo, newQuestion);
      } else {
        addLevelToTest({
          levelNo,
          levelName: `level ${currentTab}`,
          marks: plusMarks,
          minusMarks,
          questions: [newQuestion],
        });
      }
    }

    // Reset form after submission
    setTestName((test as any)?.name);
    setTestInstructions((test as any)?.instruction);
    setQuestion("");
    setOptions([""]);
    setCorrectAnswer("");
    setTestMinutes(60);
    setTestSeconds(0);
    setIndividualMinutes(1);
    setIndividualSeconds(0);
    setPlusMarks(1);
    setMinusMarks(1);
    setErrors({});
  };

  useEffect(() => {
    const fetchTests = async () => {
      if (!routeTestId) return; // Guard clause for routeTestId

      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`http://localhost:8080/tests/${routeTestId}`, {
          headers,
        })
        setTestDetails(response.data);
        setTestId(response.data.id);
        setTestName(response.data.name) 
        setLevelCount(response.data.levelsCount)
        setTestInstructions(response?.data.instructions)// Ensure testId is set from response
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [routeTestId]);

  const handleCreateTestLevels = async () => {
    if (!routeTestId) return; // Guard clause for routeTestId
const level =  test?.levels.filter((l) => l.levelNo===currentTab+1)
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`http://localhost:8080/tests/${routeTestId}/levels`, {level}, { headers });
    } catch (error) {
      console.error('Error creating test levels:', error);
    }
  };

  const generateLevels = (count: number): string[] => {
    return Array.from({ length: count }, (_, index) => `Level ${index + 1}`);
  };
  console.log(levelsCount)
  return (
    <div className="p-8 rounded-lg bg-white shadow-lg w-full max-w-2xl border">
      <div className="border-b border-gray-200 mb-6">
        <ul className="flex space-x-6">
          {generateLevels(levelsCount).map((level,i) => (
            <li key={level} className="flex-shrink-0">
              <a
                className={`cursor-pointer ${
                  currentTab === i ? "text-green-600 font-medium" : "text-gray-500"
                }`}
                onClick={() => handleTabChange(i)}
              >
                {level}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Test Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="test_name">
            Test Name <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.testName ? 'border-red-500' : ''}`}
            type="text"
            id="test_name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="Enter the name of the test"
          />
          {errors.testName && <p className="text-red-500 text-sm">{errors.testName}</p>}
        </div>

        {/* Test Instructions */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="test_instruction">
            Test Instructions <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.testInstructions ? 'border-red-500' : ''}`}
            id="test_instruction"
            placeholder="Add instructions for the test here."
            value={testInstructions}
            onChange={(e) => setTestInstructions(e.target.value)}
          />
          {errors.testInstructions && <p className="text-red-500 text-sm">{errors.testInstructions}</p>}
        </div>

        {/* Marks */}
        <div className="flex gap-4 justify-between">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Marks for Each Question</label>
            <input
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              type="number"
              value={plusMarks}
              onChange={(e) => setPlusMarks(Number(e.target.value))}
              placeholder="Marks for correct answer"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Negative Marks</label>
            <input
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              type="number"
              value={minusMarks}
              onChange={(e) => setMinusMarks(Number(e.target.value))}
              placeholder="Marks deducted for incorrect answer"
            />
          </div>
        </div>

        {/* Question Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="question">
            Add question <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.question ? 'border-red-500' : ''}`}
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question here"
          />
          {errors.question && <p className="text-red-500 text-sm">{errors.question}</p>}
        </div>

        {/* Time Settings */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Select Timer Type</label>
          <div className="flex items-center">
            <input
              type="radio"
              id="overall"
              name="time_type"
              value="overall"
              checked={timeType === "overall"}
              onChange={() => setTimeType("overall")}
              className="mr-2"
            />
            <label htmlFor="overall" className="mr-4">Overall Time</label>
            <input
              type="radio"
              id="individual"
              name="time_type"
              value="individual"
              checked={timeType === "individual"}
              onChange={() => setTimeType("individual")}
              className="mr-2"
            />
            <label htmlFor="individual">Individual Question Time</label>
          </div>
        </div>

        {/* Timer Inputs */}
        {timeType === "overall" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Total Test Duration</label>
            <div className="flex gap-2">
              <input
                className="w-1/2 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                value={testMinutes}
                onChange={(e) => setTestMinutes(Number(e.target.value))}
                placeholder="Minutes"
              />
              <input
                className="w-1/2 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                value={testSeconds}
                onChange={(e) => setTestSeconds(Number(e.target.value))}
                placeholder="Seconds"
              />
            </div>
            {errors.testDuration && <p className="text-red-500 text-sm">{errors.testDuration}</p>}
          </div>
        )}

        {timeType === "individual" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Time for Each Question</label>
            <div className="flex gap-2">
              <input
                className="w-1/2 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                value={individualMinutes}
                onChange={(e) => setIndividualMinutes(Number(e.target.value))}
                placeholder="Minutes"
              />
              <input
                className="w-1/2 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                value={individualSeconds}
                onChange={(e) => setIndividualSeconds(Number(e.target.value))}
                placeholder="Seconds"
              />
            </div>
            {errors.individualDuration && <p className="text-red-500 text-sm">{errors.individualDuration}</p>}
          </div>
        )}

        {/* Answer Type */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Select Answer Type</label>
          <div className="flex items-center">
            <input
              type="radio"
              id="CHOICE"
              name="answer_type"
              value="CHOICE"
              checked={answerType === "CHOICE"}
              onChange={() => setAnswerType("CHOICE")}
              className="mr-2"
            />
            <label htmlFor="CHOICE" className="mr-4">Multiple Choice</label>
            <input
              type="radio"
              id="TEXTAREA"
              name="answer_type"
              value="TEXTAREA"
              checked={answerType === "TEXTAREA"}
              onChange={() => setAnswerType("TEXTAREA")}
              className="mr-2"
            />
            <label htmlFor="TEXTAREA">Text Area</label>
          </div>
        </div>

        {/* CHOICE */}
        {answerType === "CHOICE" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex mb-2">
                <input
                  className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddOption}
              className="text-green-600 hover:underline"
            >
              + Add Option
            </button>
            {errors.options && <p className="text-red-500 text-sm">{errors.options}</p>}
          </div>
        )}

        {/* Correct Answer Input */}
        {(answerType === "CHOICE" || answerType === "TEXTAREA") && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="correct_answer">
              Correct Answer <span className="text-red-500">*</span>
            </label>
            <input
              className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.correctAnswer ? 'border-red-500' : ''}`}
              type="text"
              id="correct_answer"
              value={correctAnswer ?? ""}
              onChange={(e) => handleCorrectAnswerChange(e.target.value)}
              placeholder="Enter the correct answer"
            />
            {errors.correctAnswer && <p className="text-red-500 text-sm">{errors.correctAnswer}</p>}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-6 py-3  text-teal-600 rounded-full border border-teal-500  hover:bg-teal-50"
          >
            Create Question
          </button>
          <button
          onClick={() => handleCreateTestLevels()}
            type="button"
            className="px-6 py-3 bg-teal-500 text-white rounded-full hover:bg-teal-600"
          >
            Save Test
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTestForm;
