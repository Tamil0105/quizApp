import create from 'zustand';

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: string;
  timer: number; // Timer for each question
};

type Response = {
  questionId: string;
  selectedOption: string;
};

type Test = {
  id: string;
  name: string;
  questions: Question[];
  duration: number; // Total duration of the test
  responses: Response[];
};

type StoreState = {
  tests: Test[];
  responses:Response[];
  addQuestion: (testId: string, question: Question) => void;
  addTest: (test: Test[]) => void;
  setTest: (updatedTest: Test) => void;
  setResponses: (testId: string, responses: Response[]) => void;
  getTestResponses: (questionId: string) => Response[];
  initializeStore: () => void;
};

const useStore = create<StoreState>((set) => ({
  tests: [],
responses:[],
  // Add a new test
  // Add multiple tests with duplicate check
  addTest: (tests) => set((state) => {
    // Filter out duplicates
    const existingTestIds = new Set(state.tests.map(test => test.id));
    const existingTestNames = new Set(state.tests.map(test => test.name));

    const uniqueTests = tests.filter(test => 
      !existingTestIds.has(test.id) && !existingTestNames.has(test.name)
    );

    if (uniqueTests.length === 0) {
      console.warn('All tests are duplicates or already exist.');
      return state; // No unique tests to add
    }

    return { tests: [...state.tests, ...uniqueTests] };
  }),
  // Update an existing test or add a new one if it doesn't exist
  setTest: (updatedTest) => set((state) => {
    const testIndex = state.tests.findIndex(test => test.id === updatedTest.id);
    if (testIndex !== -1) {
      const updatedTests = [...state.tests];
      updatedTests[testIndex] = updatedTest;
      return { tests: updatedTests };
    } else {
      return { tests: [...state.tests, updatedTest] };
    }
  }),

  // Add a new question to a specific test
  addQuestion: (testId, question) => set((state) => {
    const updatedTests = state.tests.map(test => 
      test.id === testId 
        ? { ...test, questions: [...test.questions, question] }
        : test
    );
    return { tests: updatedTests };
  }),

  // Set responses for a test
  setResponses: (testId, responses) => set((state) => {
    const updatedTests = state.tests.map(test => 
      test.id === testId
        ? { ...test, responses }
        : test
    );
    return { tests: updatedTests };
  }),

  // Get all responses for a specific question
  getTestResponses: (questionId) => {
    const responses: Response[] = useStore.getState().tests.flatMap((test) =>
      test.responses.filter((response) => response.questionId === questionId)
    );
    return responses;
  },

  // Initialize the store with default data
  initializeStore: () => {
    set({
      tests: [
        // {
        //   id: 'test1',
        //   name: 'Sample Test',
        //   questions: [
        //     { id: 'q1', question: 'What is 2 + 2?', options: ['3', '4', '5'], answer: '4', timer: 30 },
        //     { id: 'q2', question: 'What is 3 + 5?', options: ['7', '8', '9'], answer: '8', timer: 30 }
        //   ],
        //   duration: 120, // Total test duration in seconds
        //   responses: []
        // }
      ]
    });
  }
}));

export { useStore };
