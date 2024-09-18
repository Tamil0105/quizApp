import { useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import useStore from "../store/useStore";

interface Question {
  question: string;
  type: "CHOICE" | "TEXTAREA";
  options: string[];
  answer: string;
}

const QuestionPreviewPage = () => {
  const [editQuestionIndex, setEditQuestionIndex] = useState<number | null>(
    null
  );
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);
  const { test, updateQuestion,activeStep, deleteQuestion } = useStore((state) => ({
    test: state.test,
    updateQuestion: state.updateQuestion,
    deleteQuestion: state.deleteQuestion,
    activeStep:state.activeStep,
    
  }));

  if (!test) {
    return <div>No test available</div>;
  }

  const handleEditClick = (levelNo: number, questionIndex: number) => {
    const level = test.levels.find((level) => level.levelNo === levelNo);
    if (level) {
      const questionToEdit = level.questions[questionIndex];
      if (questionToEdit) {
        setEditQuestionIndex(questionIndex);
        setEditedQuestion({ ...questionToEdit });
      }
    }
  };

  const handleDeleteClick = (levelNo: number, questionIndex: number) => {
    deleteQuestion(levelNo, questionIndex);
  };

  const handleSaveEdit = () => {
    if (editedQuestion !== null && editQuestionIndex !== null) {
      const levelNo = test.levels.find((level) =>
        level.questions.some((_, i) => i === editQuestionIndex)
      )?.levelNo;

      if (levelNo !== undefined) {
        updateQuestion(levelNo, editQuestionIndex, editedQuestion);
        setEditQuestionIndex(null);
        setEditedQuestion(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditQuestionIndex(null);
    setEditedQuestion(null);
  };

  const handleOptionDelete = (index: number) => {
    if (editedQuestion?.type === "CHOICE") {
      const newOptions = editedQuestion.options.filter((_, i) => i !== index);
      setEditedQuestion((prev) =>
        prev ? { ...prev, options: newOptions } : prev
      );
    }
  };

  const upperCaseAlp = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
console.log(test.levels.filter((le) =>le.levelNo===activeStep+1))
  return (
    <div className="w-full  rounded-lg  border border-gray-300 p-6">
      {editQuestionIndex !== null ? (
        <div className="p-6 rounded-lg shadow-lg mb-6 bg-white">
          <h2 className="text-2xl font-semibold mb-4">Edit Question</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
            }}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="edit_question_text"
              >
                Question
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg"
                type="text"
                id="edit_question_text"
                value={editedQuestion?.question || ""}
                onChange={(e) =>
                  setEditedQuestion((prev) =>
                    prev ? { ...prev, question: e.target.value } : prev
                  )
                }
              />
            </div>

            {editedQuestion?.type === "CHOICE" && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Options
                </label>
                {editedQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center mb-2 bg-gray-100 p-2 rounded-md"
                  >
                    <input
                      className="flex-grow px-2 py-1 border border-gray-300 rounded-md"
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...editedQuestion.options];
                        newOptions[index] = e.target.value;
                        setEditedQuestion((prev) =>
                          prev ? { ...prev, options: newOptions } : prev
                        );
                      }}
                    />
                    <button
                      type="button"
                      className="ml-2 text-red-500"
                      onClick={() => handleOptionDelete(index)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2 flex items-center gap-2"
                  onClick={() =>
                    setEditedQuestion((prev) =>
                      prev ? { ...prev, options: [...prev.options, ""] } : prev
                    )
                  }
                >
                  <FaPlus />
                  Add Option
                </button>
              </div>
            )}

            {editedQuestion?.type === "TEXTAREA" && (
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="edit_answer"
                >
                  Answer
                </label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg"
                  id="edit_answer"
                  value={editedQuestion?.answer || ""}
                  onChange={(e) =>
                    setEditedQuestion((prev) =>
                      prev ? { ...prev, answer: e.target.value } : prev
                    )
                  }
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaSave />
                Save
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                onClick={handleCancelEdit}
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="">
          {test.levels.filter((le) =>le.levelNo===activeStep+1)
            .flatMap((level) => level.questions)
            .map((question, index) => {
              const levelNo = test.levels.find((level) =>
                level.questions.includes(question)
              )?.levelNo;
              return (
                <div key={index} className="p-6  mb-6 b">
                  <h2 className="text-xl font-semibold mb-4">
                    {index+1}. {question.question}
                  </h2>
                  {question.type === "CHOICE" && (
                    <ul className="list-disc pl-5 flex flex-col gap-2 mb-4">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center p-1 border border-gray-400 rounded-md"
                        >
                          <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-md">
                            <span className="text-lg font-bold text-gray-700">
                              {upperCaseAlp[optionIndex]}.
                            </span>
                          </div>
                          <p className="ml-2 text-gray-800">{option}</p>
                        </div>
                      ))}
                    </ul>
                  )}
                  {question.type === "TEXTAREA" && (
                    <textarea
                    className={`w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 `}
                      id="test_instruction"
                      placeholder="Add instructions for the test here."
                      value={question.answer}
                    />
                  )}
                  <div className="flex gap-4">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      onClick={() => {
                        if (levelNo !== undefined) {
                          const questionIndex = test.levels
                            .find((level) => level.levelNo === levelNo)
                            ?.questions.findIndex((q, i) => i === index);
                          if (
                            questionIndex !== undefined &&
                            questionIndex !== -1
                          ) {
                            handleEditClick(levelNo, questionIndex);
                          }
                        }
                      }}
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      onClick={() => {
                        if (levelNo !== undefined) {
                          const questionIndex = test.levels
                            .find((level) => level.levelNo === levelNo)
                            ?.questions.findIndex((q, i) => i === index);
                          if (
                            questionIndex !== undefined &&
                            questionIndex !== -1
                          ) {
                            handleDeleteClick(levelNo, questionIndex);
                          }
                        }
                      }}
                    >
                      <FaTrashAlt />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default QuestionPreviewPage;
