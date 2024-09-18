import create from 'zustand';

interface Question {
  question: string;
  type: 'CHOICE' | 'TEXTAREA';
  options: string[];
  answer: string;
}

interface Level {
  levelNo: number;
  levelName: string;
  marks: number;
  minusMarks: number;
  questions: Question[];
}

interface Test {
  id: string;
  name: string;
  timerForWholeTest: boolean;
  levelsCount: number;
  duration: number;
  instructions: string;
  category: string;
  levels: Level[];
  responses: any[]; // Define response type if needed
}

interface TestStore {
  activeStep :number;
  test: Test | null;
  setTestDetails: (details: Partial<Omit<Test, 'levels' | 'responses'>>) => void;
  setTest: (test: Test) => void;
  updateQuestion: (levelNo: number, questionIndex: number, updatedQuestion: Question) => void;
  deleteQuestion: (levelNo: number, questionIndex: number) => void;
  addQuestionToLevel: (levelNo: number, question: Question) => void;
  addLevelToTest: (level: Level) => void;
  setActiveStep : (activeStep: number) => void;
}

const useStore = create<TestStore>((set) => ({
  test: null,
activeStep:1,
setActiveStep:(activeStep:number)  => set({activeStep}),
  // Set the whole test object
  setTest: (test: Test) => set({ test }),

  // Update the basic test details (excluding levels and responses)
  setTestDetails: (details: Partial<Omit<Test, 'levels' | 'responses'>>) => set((state) => {
    if (!state.test) return state; // Ensure state.test is not null
    return { test: { ...state.test, ...details } };
  }),

  // Update question by its index within a specific level
  updateQuestion: (levelNo: number, questionIndex: number, updatedQuestion: Question) => set((state) => {
    if (!state.test) return state; // Ensure state.test is not null

    const updatedLevels = state.test.levels.map((level) => {
      if (level.levelNo === levelNo) {
        const updatedQuestions = level.questions.map((question, index) =>
          index === questionIndex ? updatedQuestion : question
        );
        return { ...level, questions: updatedQuestions };
      }
      return level;
    });

    return { test: { ...state.test, levels: updatedLevels } };
  }),

  // Delete question by its index within a specific level
  deleteQuestion: (levelNo: number, questionIndex: number) => set((state) => {
    if (!state.test) return state; // Ensure state.test is not null

    const updatedLevels = state.test.levels.map((level) => {
      if (level.levelNo === levelNo) {
        const updatedQuestions = level.questions.filter((_, index) => index !== questionIndex);
        return { ...level, questions: updatedQuestions };
      }
      return level;
    });

    return { test: { ...state.test, levels: updatedLevels } };
  }),

  // Add a new question to a specific level
  addQuestionToLevel: (levelNo: number, question: Question) => set((state) => {
    if (!state.test) return state; // Ensure state.test is not null

    const updatedLevels = state.test.levels.map((level) => {
      if (level.levelNo === levelNo) {
        return { ...level, questions: [...level.questions, question] };
      }
      return level;
    });

    return { test: { ...state.test, levels: updatedLevels } };
  }),

  // Add a new level to the test
  addLevelToTest: (level: Level) => set((state) => {
    if (!state.test) return state; // Ensure state.test is not null

    return { test: { ...state.test, levels: [...state.test.levels, level] } };
  }),
}));

export default useStore;
