import React from 'react';

const AssessmentInstructions: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <img
        alt=""
        className="mx-auto mb-6"
        height="300"
        src="https://i.ibb.co/ZJmJVnj/Instruction-manual-rafiki-2.png"
        width="300"
      />
      <h1 className="text-2xl font-bold text-teal-700 mb-4 text-center">
        Class Assessment Instructions
      </h1>
      <p className="text-gray-600 mb-6 text-left">
        Welcome to the General Knowledge Test Assessment. This assessment consists of three levels that progressively evaluate your understanding of the material. Please ensure you read all instructions before beginning.
      </p>
      <h2 className="text-xl font-semibold text-teal-700 mb-2 text-left">
        General Information
      </h2>
      <p className="text-gray-600 mb-6 text-left">
        You will have [60 minutes] to complete all levels of the assessment. Time for each level will vary, and the timer will not stop between levels.
      </p>
      <p className="text-gray-600 mb-6 text-left">
        Level 1: Basic concepts <br />
        Level 2: Intermediate application <br />
        Level 3: Advanced problem-solving
      </p>
      <div className="text-right">
        <button
          onClick={onStart}
          className="bg-teal-700 text-white px-6 py-2 rounded-full hover:bg-teal-800 transition duration-200"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default AssessmentInstructions;
