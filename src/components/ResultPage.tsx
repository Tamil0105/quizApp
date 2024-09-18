import React from 'react';

const ResultPage: React.FC<{
  passMark: number;
  takenTime: string;
  resultsByLevel: any[];
  onRestart: () => void;
}> = ({ passMark, takenTime, resultsByLevel, onRestart }) => {
  
  // Calculate total marks based on user's answers
  const calculateTotalMarks = () => {
    let totalMarks = 0;
    resultsByLevel.forEach(level => {
      level.questions.forEach((q: { userAnswer: any; correctAnswer: any; }) => {
        if (q.userAnswer === q.correctAnswer) {
          totalMarks += 1; // Add 1 for correct answer
        } else {
          totalMarks -= 1; // Subtract 1 for wrong answer
        }
      });
    });
    return totalMarks;
  };

  const totalMarks = calculateTotalMarks();
  console.log(totalMarks,passMark)
  const scorePercentage = ((totalMarks / (resultsByLevel.reduce((acc, level) => acc + level.questions.length, 0))) * 100).toFixed(0);
  const isPassed = totalMarks >= passMark;
console.log(isPassed)
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex">
        <img
          alt="Illustration of a person completing an assessment on a laptop"
          className="w-1/3"
          height="200"
          src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-BVbpSZmLndA7MfHIxv2ahIKS/user-IBY8IaMXtVn7IVIdZeyvjx16/img-efKM61OJxByUMY49t1AHNwC3.png?st=2024-09-18T05%3A17%3A20Z&se=2024-09-18T07%3A17%3A20Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-09-17T23%3A59%3A24Z&ske=2024-09-18T23%3A59%3A24Z&sks=b&skv=2024-08-04&sig=NOm1Oot17hrt0qMKmslLoneSAtjiBHZwv0JTKrlvoXk%3D"
          width="200"
        />
        <div className="ml-8">
          <h1 className="text-2xl font-semibold mb-4">Assessment completed!</h1>
          <p className="mb-2">Pass mark: {passMark} marks</p>
          <p className="mb-2">Taken time: {takenTime}</p>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="font-semibold">SCORE: {scorePercentage}%</p>
            <p className={`text-${isPassed ? 'green' : 'red'}-600`}>
              {isPassed ? '✅ Passed' : '❌ Failed'}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        {resultsByLevel.map((level) => (
          <div key={level.levelIndex} className="bg-gray-50 p-4 rounded-lg mb-4">
            <h2 className="font-semibold">Level {level.levelIndex }</h2>
            <p>Marks: {totalMarks} {level.isPassed ? '✅ Passed' : '❌ Failed'}</p>
            {level.questions.map((q: any, index: number) => (
              <div key={index} className={`bg-${q.userAnswer === q.correctAnswer ? 'green' : 'red'}-100 p-4 rounded-lg mb-2`}>
                <p className="font-semibold">{`Question ${index + 1}`}</p>
                <p>Your answer: {q.userAnswer || 'N/A'}</p>
                <p className={`text-${q.userAnswer === q.correctAnswer ? 'green' : 'red'}-600`}>
                  Correct answer: {q.correctAnswer}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-8">
        <button onClick={onRestart} className="bg-purple-600 text-white px-6 py-2 rounded-lg">
          Restart
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
