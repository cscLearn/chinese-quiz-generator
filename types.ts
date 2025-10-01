export interface Question {
  type: 'mc' | 'sa'; // mc: multiple-choice, sa: short-answer
  questionText: string;
  options?: string[];
  correctAnswerIndex?: number;
  correctAnswerText?: string;
  explanation: string;
}

export interface Quiz {
  passage: string;
  questions: Question[];
}

export interface QuizResult {
  score: number;
  totalMcQuestions: number;
  answers: {
    [questionIndex: number]: {
      userAnswer?: number | string;
      correctAnswer: number | string;
      isCorrect?: boolean; // Only for MC questions
    };
  };
}