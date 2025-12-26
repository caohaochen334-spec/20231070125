
export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  PARSING = 'PARSING',
  QUIZ = 'QUIZ',
  SUMMARY = 'SUMMARY'
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectQuestions: number[];
}
