// components/QuestionPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const QuestionPage = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const { tests, setResponses } = useStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [testDuration, setTestDuration] = useState<number>(0);
  const [testTimer, setTestTimer] = useState<number>(0); // Total test timer
  const [isNotificationSupported, setIsNotificationSupported] = useState(false);
  const navigate = useNavigate();

  const test = tests.find((test) => test.questions.some((q) => q.id === questionId));
  const currentQuestion = test?.questions[currentQuestionIndex];
  const correctAnswers = test?.questions.map(q => ({ id: q.id, answer: q.answer }));

  useEffect(() => {
    if (test) {
      setTestDuration(test.duration);
      setTestTimer(test.duration);
      setTimeLeft(currentQuestion?.timer || 0);
    }
  }, [test, currentQuestion]);

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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Tab is not focused
        if (isNotificationSupported) {
          new Notification('You have switched tabs!', {
            body: 'The test will be closed if you do not return to the tab.',
          });
        }
        // Close the test or navigate away
        handleCloseTest();
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Check if the Notification API is supported
    if ('Notification' in window) {
      setIsNotificationSupported(Notification.permission === 'granted' || Notification.permission === 'default');
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isNotificationSupported]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (test?.questions.length || 0) - 1) {
      // Save the selected answer
      if (selectedOption !== null && test) {
        const updatedResponses = test.questions.map((question) => ({
          questionId: question.id,
          selectedOption: question.id === currentQuestion?.id ? selectedOption : '',
        }));
        setResponses(test.id, updatedResponses);
      }
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeLeft(test?.questions[currentQuestionIndex + 1]?.timer || 0);
    } else {
      // End of the test
      if (selectedOption !== null && test) {
        const updatedResponses = test.questions.map((question) => ({
          questionId: question.id,
          selectedOption: question.id === currentQuestion?.id ? selectedOption : '',
        }));
        setResponses(test.id, updatedResponses);
      }
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setTimeLeft(test?.questions[0]?.timer || 0);
    setTestTimer(testDuration);
    setShowResults(false);
  };

  const handleCloseTest = () => {
    setShowResults(true)
  };

  const handleSubmitResponse = async() =>{
    try {
        const response = await axios.post('http://localhost:8080/tests/add-res',{testId:test?.id,responses:test?.responses});
        console.log(response.data);
        setShowResults(true);
        // addTest(response.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }

  }
  if (showResults) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
        <h2 className="text-2xl font-semibold mb-4">Results:</h2>
        {test?.questions.map((question) => (
          <div key={question.id} className="bg-white border border-gray-300 rounded-lg shadow-md p-4 mb-4">
            <h3 className="text-xl font-semibold mb-2">{question.question}</h3>
            <p className="text-gray-700 mb-2">Your Answer: {test.responses.find(r => r.questionId === question.id)?.selectedOption || 'N/A'}</p>
            <p className="text-green-600">Correct Answer: {question.answer}</p>
          </div>
        ))}
        <button onClick={handleRestart} className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-300">
          Restart Test
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="p-6 bg-gray-100 min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{currentQuestion.question}</h1>
      <div className="space-y-2 mb-4">
        <AnimatePresence>
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.2 }}
            className="p-4 bg-white border border-gray-300 rounded-lg shadow-md"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleOptionChange(option)}
                  className="form-radio text-blue-500"
                />
                <label className="text-lg">{option}</label>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 mb-2">Time left for this question: <span className="font-semibold">{timeLeft} seconds</span></p>
        <p className="text-gray-700">Total time left for the test: <span className="font-semibold">{testTimer} seconds</span></p>
      </div>

      <button
        onClick={currentQuestionIndex < (test?.questions.length || 0) - 1?handleNextQuestion:handleSubmitResponse}
        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-300"
      >
        {currentQuestionIndex < (test?.questions.length || 0) - 1 ? 'Next Question' : 'Submit Test'}
      </button>
    </div>
  );
};

export default QuestionPage;
