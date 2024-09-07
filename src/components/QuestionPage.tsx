import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const shuffleArray = (array: any[]) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};
function parseJwt(token: any) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}
const QuestionPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [testDuration, setTestDuration] = useState<number>(0);
  const [testTimer, setTestTimer] = useState<number>(15);
  const [test, setTest] = useState<any>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const response = await axios.get(`https://quiz-server-sigma.vercel.app/tests/${testId}`, { headers });
        const fetchedTest = response.data;
        setTest(fetchedTest);
        setTestDuration(fetchedTest.duration);
        setTestTimer(fetchedTest.duration);
        setTimeLeft(fetchedTest.questions[0]?.timer || 15);

        // Shuffle questions and options
        const shuffled = fetchedTest.questions.map((question: any) => ({
          ...question,
          options: shuffleArray(question.options),
        }));
        setShuffledQuestions(shuffled);
      } catch (error) {
        console.error('Error fetching test data:', error);
      }
    };

    if (testId) {
      fetchTest();
    }
  }, [testId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = parseJwt(token);
        setUserId(decodedToken.sub);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);
  
  const saveResponse = (questionId: string, selectedOption: string) => {
    const existingResponses = JSON.parse(localStorage.getItem(`test-${testId}-responses`) || '[]');
    const updatedResponses = [...existingResponses, { questionId, selectedOption }];
    localStorage.setItem(`test-${testId}-responses`, JSON.stringify(updatedResponses));
  };

  useEffect(() => {
    const savedResponses = JSON.parse(localStorage.getItem(`test-${testId}-responses`) || '[]');
    if (savedResponses.length > 0) {
      setCurrentQuestionIndex(savedResponses.length);
      setSelectedOption(null);
    }
  }, [testId]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    } else {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (testTimer === 0) {
      setShowResults(true);
    } else {
      const timer = setTimeout(() => setTestTimer(testTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [testTimer]);

  const handleOptionChange = (option: any) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (shuffledQuestions.length || 0) - 1) {
      if (selectedOption !== null && test) {
        saveResponse(shuffledQuestions[currentQuestionIndex]?.id, selectedOption);
      }
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeLeft(shuffledQuestions[currentQuestionIndex + 1]?.timer || 0);
    } else {
      // Final question, trigger submission
      if (selectedOption !== null && test) {
        saveResponse(shuffledQuestions[currentQuestionIndex]?.id, selectedOption);
      }
      handleSubmitResponse();
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setTimeLeft(shuffledQuestions[0]?.timer || 0);
    setTestTimer(testDuration);
    setShowResults(false);
    localStorage.removeItem(`test-${testId}-responses`);
  };

  const calculateMarks = (responses: any[]) => {
    let totalMarks = 0;
    responses.forEach((response: { questionId: string; selectedOption: string }) => {
      const question = shuffledQuestions.find((q: { id: string }) => q.id === response.questionId);
      if (question) {
        if (response.selectedOption === question.answer) {
          totalMarks += 2; // Correct answer
        } else {
          totalMarks -= 1; // Incorrect answer
        }
      }
    });
    return totalMarks;
  };

  const handleSubmitResponse = async () => {
    const responses = JSON.parse(localStorage.getItem(`test-${testId}-responses`) || '[]');
  
    if (selectedOption !== null && test) {
      saveResponse(shuffledQuestions[currentQuestionIndex]?.id, selectedOption);
    }
  
    try {
      const totalMarks = calculateMarks(responses);
      const passMark = (test?.passMark || 0) * 0.7; // Assuming passMark is a percentage
      const passed = totalMarks >= passMark;
  
      const processedResponses = responses.map((response: { questionId: string; selectedOption: string }) => ({
        questionId: response.questionId,
        testId: testId,
        userId: userId,
        selectedOption: response.selectedOption,
      }));
  
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
  
      const response = await axios.post('https://quiz-server-sigma.vercel.app/responses', {
        testId: test?.id,
        userMarks: {
          userId:userId,
          testId: test?.id,
          marks: totalMarks,
          pass: passed,
          timeTaken: testDuration - testTimer // Total time taken for the test
        },
        responses: processedResponses,
        totalMarks
      }, { headers });
  
      console.log(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting responses:', error);
    }
  };

  if (showResults) {
    const finalResponses = JSON.parse(localStorage.getItem(`test-${testId}-responses`) || '[]');
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
        <h2 className="text-2xl font-semibold mb-4">Results:</h2>
        {shuffledQuestions.map((question: any) => (
          <div key={question.id} className="bg-white border border-gray-300 rounded-lg shadow-md p-4 mb-4">
            <h3 className="text-xl font-semibold mb-2">Question {shuffledQuestions.findIndex((q: { id: any; }) => q.id === question.id) + 1}:</h3>
            <p className="text-gray-700 mb-2">Your Answer: {finalResponses.find((r: { questionId: any; }) => r.questionId === question.id)?.selectedOption || 'N/A'}</p>
            <p className="text-green-600">Correct Answer: {question.answer}</p>
          </div>
        ))}
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-xl font-semibold mb-2">Total Marks: {calculateMarks(finalResponses)}</h3>
          <p className="text-xl font-semibold mb-2">Pass/Fail: {calculateMarks(finalResponses) >= (test?.passMark || 0) * 0.7 ? 'Pass' : 'Fail'}</p>
          <p className="text-xl font-semibold mb-2">Time Taken: {formatTime(testDuration - testTimer)}</p>
        </div>
        <button onClick={handleRestart} className="bg-blue-500 text-white py-2 px-4 rounded">Restart Quiz</button>
      </div>
    );
  }

  if (!test) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{test.name}</h1>
      <h2 className="text-2xl font-semibold mb-4">Question {currentQuestionIndex + 1}:</h2>
      <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 mb-4">
        <p className="text-lg mb-4">{shuffledQuestions[currentQuestionIndex]?.question}</p>
        {shuffledQuestions[currentQuestionIndex]?.options.map((option: any, index: number) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="radio"
              id={`option-${index}`}
              name="options"
              value={option}
              checked={selectedOption === option}
              onChange={() => handleOptionChange(option)}
              className="mr-2"
            />
            <label htmlFor={`option-${index}`} className="text-gray-700">{option}</label>
          </div>
        ))}
      </div>
      <div className="flex items-center mb-4">
        <span className="text-xl font-semibold mr-4">Time Left: {formatTime(timeLeft)}</span>
        <span className="text-xl font-semibold">Test Timer: {formatTime(testTimer)}</span>
      </div>
      <button
        onClick={handleNextQuestion}
        className="bg-blue-500 text-white py-2 px-4 rounded"
        disabled={selectedOption === null}
      >
        Next Question
      </button>
    </div>
  );
};

export default QuestionPage;
