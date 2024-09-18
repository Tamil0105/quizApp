import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ResultPage from './ResultPage';
import AssessmentInstructions from '../pages/AssessmentInstructionsPage';

// Interfaces
interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  type:string
  timer?: number;
}

interface Level {
  id: string;
  questions: Question[];
}

interface Test {
  id: string;
  name: string;
  duration: number;
  levels: Level[];
  passMark: number;
}

interface JwtPayload {
  sub: string;
}

// Utility functions
const shuffleArray = (array: any[]) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const parseJwt = (token: string): JwtPayload => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  return JSON.parse(jsonPayload);
};

// Instruction Page Component
// const InstructionPage: React.FC<{ onStart: () => void }> = ({ onStart }) => (
//   <div className="w-full max-w-3xl mx-auto p-8 mt-8 text-center">
//     <h2 className="text-lg font-medium mb-4">Quiz Instructions</h2>
//     <p className="mb-4">Welcome to the quiz! Here are some important instructions:</p>
//     <ul className="list-disc list-inside mb-4">
//       <li>Each question has multiple options; choose the correct one.</li>
//       <li>You have a limited time for each question.</li>
//       <li>Your score will be based on correct answers.</li>
//       <li>Good luck!</li>
//     </ul>
//     <button onClick={onStart} className="bg-teal-500 text-white py-2 px-6 rounded-lg">Start Quiz</button>
//   </div>
// );

// Question Page Component
const QuestionPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const [test, setTest] = useState<Test | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Level[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [levelCompleted, setLevelCompleted] = useState<boolean[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [timeTaken, setTimeTaken] = useState<string>('00:00');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isTabFocused, setIsTabFocused] = useState(true);
  useEffect(() => {
    const fetchTest = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const response = await axios.get<Test>(`https://quiz-server-sigma.vercel.app/tests/${testId}`, { headers });
        const fetchedTest = response.data;
        setTest(fetchedTest);
        const shuffled = fetchedTest.levels.map(level => ({
          ...level,
          questions: shuffleArray(level.questions.map(question => ({
            ...question,
            options: shuffleArray(question.options),
          }))),
        }));
        setShuffledQuestions(shuffled);
        setTimeLeft(shuffled[0]?.questions[0]?.timer || 0);
        setLevelCompleted(Array(fetchedTest.levels.length).fill(false));
      } catch (error) {
        console.error('Error fetching test data:', error);
      }
    };

    if (testId) {
      fetchTest();
    }
  }, [testId]);
  useEffect(() => {
    if (!isTabFocused&&tabSwitchCount<3) {
      alert("'Don\'t forget to return to the quiz!")
      // Notify user when tab is not focused
      if (Notification.permission === 'granted') {
        new Notification('Reminder', {
          body: 'Don\'t forget to return to the quiz!',
        });
      }
    }
  }, [isTabFocused]);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsTabFocused(true);
      } else {
        setIsTabFocused(false);
        setTabSwitchCount((prevCount) => prevCount + 1);
        if (tabSwitchCount >= 2) {
          handleSubmitResponse();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [tabSwitchCount]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = parseJwt(token);
        setUserId(decodedToken.sub);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleNextQuestion = () => {
    const currentLevelQuestions = shuffledQuestions[currentLevelIndex]?.questions || [];
    if (currentQuestionIndex < currentLevelQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeLeft(currentLevelQuestions[currentQuestionIndex + 1]?.timer || 0);
    } else {
      const newLevelCompleted = [...levelCompleted];
      newLevelCompleted[currentLevelIndex] = true;
      setLevelCompleted(newLevelCompleted);
      if (test && currentLevelIndex < test.levels.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentLevelIndex(currentLevelIndex + 1);
          setCurrentQuestionIndex(0);
          const nextLevelQuestions = shuffledQuestions[currentLevelIndex + 1]?.questions;
          setTimeLeft(nextLevelQuestions?.[0]?.timer || 0);
          setIsTransitioning(false);
        }, 1000);
      } else {
        handleSubmitResponse();
      }
    }
  };
  const handleTextareaChange = (value: string) => {
    const currentQuestionId = shuffledQuestions[currentLevelIndex]?.questions[currentQuestionIndex]?.id;
    const levelKey = `test-${testId}-level-${currentLevelIndex}-responses`;
    const responses = JSON.parse(localStorage.getItem(levelKey) || '[]');
  
    // Update or add the response
    const existingResponseIndex = responses.findIndex((response: { questionId: string }) => response.questionId === currentQuestionId);
    
    if (existingResponseIndex !== -1) {
      // Update existing response
      responses[existingResponseIndex].selectedOption = value;
    } else {
      // Add new response
      responses.push({ questionId: currentQuestionId, selectedOption: value });
    }
    
    localStorage.setItem(levelKey, JSON.stringify(responses));
    setSelectedOption(value);
  };
  
  const handleOptionChange = (option: string) => {
    const currentQuestionId = shuffledQuestions[currentLevelIndex]?.questions[currentQuestionIndex]?.id;
    const levelKey = `test-${testId}-level-${currentLevelIndex}-responses`;
    const responses = JSON.parse(localStorage.getItem(levelKey) || '[]');
    const existingResponse = responses.find((response: { questionId: string }) => response.questionId === currentQuestionId);
  
    if (!existingResponse) {
      responses.push({ questionId: currentQuestionId, selectedOption: option });
      localStorage.setItem(levelKey, JSON.stringify(responses));
    }
  
    setSelectedOption(option);
    handleNextQuestion();
  };

  const handleSubmitResponse = async () => {
    const responses = JSON.parse(localStorage.getItem(`test-${testId}-responses`) || '[]');
    const uniqueResponses = Array.from(new Map(responses.map((item: { questionId: any; }) => [item.questionId, item])).values());

    if (selectedOption !== null && test) {
      const newResponse = {
        questionId: shuffledQuestions[currentLevelIndex]?.questions[currentQuestionIndex]?.id,
        selectedOption,
      };
      uniqueResponses.push(newResponse);
      localStorage.setItem(`test-${testId}-responses`, JSON.stringify(uniqueResponses));
    }

    const endTime = new Date();
    if (startTime) {
      const timeTakenInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      const formattedTimeTaken = formatTime(timeTakenInSeconds);
      setTimeTaken(formattedTimeTaken);
      const { totalMarks } = calculateMarks(uniqueResponses as any);
      const passMark = (test?.passMark || 0) * 0.7;
      const passed = totalMarks >= passMark;

      try {
        const processedResponses = uniqueResponses.map((response: any) => ({
          questionId: response.questionId,
          testId: testId,
          userId: userId,
          selectedOption: response.selectedOption,
        }));

        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        await axios.post('https://quiz-server-sigma.vercel.app/responses', {
          testId: test?.id,
          userMarks: {
            userId: userId,
            testId: test?.id,
            marks: totalMarks,
            pass: passed,
            timeTaken: formattedTimeTaken,
          },
          responses: processedResponses,
          totalMarks,
        }, { headers });

        setShowResults(true);
      } catch (error) {
        console.error('Error submitting responses:', error);
      }
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    } else if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const calculateMarks = (responses: { questionId: string; selectedOption: string }[]) => {
    let totalMarks = 0;
    let totalQuestions = 0;
  
    responses.forEach(response => {
      const question = shuffledQuestions[currentLevelIndex]?.questions.find(q => q.id === response.questionId);
      
      if (question) {
        totalQuestions++;
        if (response.selectedOption === question.answer) {
          totalMarks += 2; // Correct answer
        } else {
          totalMarks -= 1; // Incorrect answer
        }
      }
    });
  
    return { totalMarks, totalQuestions };
  };
  let textColor = 'text-gray-500'; // Default color

  if (timeLeft <= 0) {
    textColor = 'text-red-600'; // Time is up
  } else if (timeLeft <= 30) {
    textColor = 'text-yellow-500'; // Nearing the end
  }
  const handleStartQuiz = () => {
    setShowInstructions(false);
    setStartTime(new Date());  // Set the current time as the start time
    setTimeLeft(shuffledQuestions[currentLevelIndex]?.questions[0]?.timer || 0);
  };
  const customAlphabet = ["a", "b", "d", "c", ...Array.from(Array(22), (_, i) => String.fromCharCode(i + 101))];

  const renderLevels = () => (
    <div className="flex justify-around mb-4">
      {test?.levels.map((level, index) => {
        const isCompleted = levelCompleted[index];
        const isActive = index === 0 || (isCompleted || levelCompleted[index - 1]);
        const levelClass = isCompleted ? 'bg-teal-500' : (isActive ? 'bg-yellow-500' : 'bg-gray-400');
        return (
          <div key={level.id} className="flex items-center">
            <span className={`h-6 w-6 rounded-full ${levelClass}`}></span>
            <span className={`ml-2 ${isCompleted ? 'text-teal-900' : (isActive ? 'text-yellow-700' : 'text-gray-400')}`}>
              Level {index + 1} {isCompleted ? '✅' : (isActive ? '' : '🔒')}
            </span>
          </div>
        );
      })}
    </div>
  );

  if (showResults) {
    const finalResponses = JSON.parse(localStorage.getItem(`test-${testId}-responses`) || '[]');
    const { totalMarks } = calculateMarks(finalResponses);
  
    const totalPossibleMarks = test?.levels.reduce((acc, level) => acc + (level.questions.length * 2), 0) || 0;
    const passMark = totalPossibleMarks * 0.7; // 70% of total possible marks
    // const passed = totalMarks >= passMark;
  
    const resultsByLevel = test?.levels.map((level, index) => {
      const levelResponses = JSON.parse(localStorage.getItem(`test-${testId}-level-${index}-responses`) || '[]');

      // Ensure levelResponses is an array and level.questions exists
      if (!Array.isArray(levelResponses) || !Array.isArray(level.questions)) {
        return {
          levelIndex: index + 1,
          totalMarks: 0,
          isPassed: false,
          questions: level.questions.map(q => ({
            questionText: q.question,
            userAnswer: null,
            correctAnswer: q.answer,
          })),
        };
      }

      // Calculate marks for this level
      const levelMarks = level.questions.reduce((acc, q) => {
        const userAnswer = levelResponses.find((r: { questionId: string; }) => r.questionId === q.id)?.selectedOption;
        return acc + (userAnswer === q.answer ? 2 : 0); // Add 2 for correct answers
      }, 0);
      
      const totalPossibleMarksForLevel = level.questions.length * 2; // Total marks possible for this level
      
      return {
        levelIndex: index + 1,
        totalMarks: levelMarks,
        isPassed: levelMarks >= (totalPossibleMarksForLevel * 0.7), // Pass if at least 70% of total possible marks for the level
        questions: level.questions.map(q => ({
          questionText: q.question,
          userAnswer: levelResponses.find((r: { questionId: string; }) => r.questionId === q.id)?.selectedOption || null,
          correctAnswer: q.answer,
        })),
      };
    });

    return (
      <ResultPage 
        passMark={passMark}
        takenTime={timeTaken} // Use the calculated takenTime
        resultsByLevel={resultsByLevel as any}
        // onRestart={() => window.location.reload()} 
      />
    );
  }

  if (isTransitioning) {
    return (
      <div className="w-full max-w-3xl mx-auto p-8 mt-8">
        <h2 className="text-lg font-medium">Level Complete!</h2>
        <p className="text-gray-500">Moving to the next level in 10 seconds...</p>
      </div>
    );
  }

  if (showInstructions) {
    return <AssessmentInstructions onStart={handleStartQuiz} />;
  }

  if (!test) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-3xl mx-auto p-8 mt-8">
      {renderLevels()}
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-500 text-xl">{test.name}</div>
        <div className={`${textColor} text-xl`}>
      Time: {formatTime(timeLeft)}
    </div>
      </div>
      <h2 className="text-lg font-medium text-center">Level {currentLevelIndex + 1} - Question {currentQuestionIndex + 1}</h2>
      <div className="text-center mb-8">
    {shuffledQuestions[currentLevelIndex]?.questions[currentQuestionIndex]?.type === "TEXTAREA" ? (
      <textarea
        className="border border-gray-300 rounded-lg p-2 w-full h-24"
        placeholder="Type your answer here..."
        onChange={(e) => handleTextareaChange(e.target.value)} // Call the new function
      />
    ) : (
      <>
        <h3 className="text-xl font-bold">
          {shuffledQuestions[currentLevelIndex]?.questions[currentQuestionIndex]?.question}
        </h3>
        <div className="flex flex-col gap-4 mt-4">
          {shuffledQuestions[currentLevelIndex]?.questions[currentQuestionIndex]?.options.map((option, index) => (
            <div key={option} onClick={() => handleOptionChange(option)} className="flex items-center border border-gray-300 rounded-lg cursor-pointer">
              <div className="flex items-center justify-center w-8 h-8 bg-teal-200 rounded-l-lg">
                <span className="font-bold text-gray-800 capitalize">{customAlphabet[index]}</span>
              </div>
              <div className="px-2 py-1">
                <span className="text-gray-800">{option}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
      <div className=" py-4">
        <div className="flex justify-end  max-w-3xl mx-auto">
          {/* <p className="text-gray-600">Time Left: {formatTime(timeLeft)}</p> */}
          <button
            onClick={handleNextQuestion}
            className="bg-teal-500 text-white py-2 px-6 rounded-lg"
          >
            {currentQuestionIndex < (shuffledQuestions[currentLevelIndex]?.questions.length - 1) ? 'Next Question' : 'Submit Test'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
