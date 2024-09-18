import React from 'react';

const AssessmentInstructions = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <img
        alt="Illustration of a person standing in front of an open book with various icons"
        className="mx-auto mb-6"
        height="200"
        src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-LmQ09WWGIGwOeeA4ArnRw0x5/user-uJPET5fjNenSso8wCETWVNOp/img-wQlJIDA8ImafHtUQZeb91ppX.png?st=2024-09-17T14%3A57%3A12Z&amp;se=2024-09-17T16%3A57%3A12Z&amp;sp=r&amp;sv=2024-08-04&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2024-09-16T23%3A21%3A04Z&amp;ske=2024-09-17T23%3A21%3A04Z&amp;sks=b&amp;skv=2024-08-04&amp;sig=EoUatop20beWbEtul2Sc4xkTFGWI8Xl9xqLYpi7NHaw%3D"
        width="200"
      />
      <h1 className="text-2xl font-bold text-purple-700 mb-4 text-left">
        Class Assessment Instructions
      </h1>
      <p className="text-gray-600 mb-6 text-left">
        Welcome to the general Knowledge Test Assessment. This assessment consists of three levels that progressively evaluate your understanding of the material. Please ensure you read all instructions before beginning.
      </p>
      <h2 className="text-xl font-semibold text-purple-700 mb-2 text-left">
        General Information
      </h2>
      <p className="text-gray-600 mb-6 text-left">
        You will have [60 minutes] to complete all levels of the assessment. Time for each level will vary, and the timer will not stop between levels.
      </p>
      <p className="text-gray-600 mb-6 text-left">
        Level 1: Basic concepts Level 2: Intermediate application Level 3: Advanced problem-solving
      </p>
      <div className="text-right">
        <button className="bg-purple-700 text-white px-6 py-2 rounded-full">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default AssessmentInstructions;
