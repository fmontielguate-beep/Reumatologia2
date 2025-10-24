
export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface User {
  firstName: string;
  lastName: string;
  professionalId: string;
}

export interface StoredResult extends User {
  score: number;
  date: string;
}

export enum AppState {
  Login,
  Quiz,
  PracticeQuiz,
  Results,
  Admin,
}
