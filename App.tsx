
import React, { useState, useEffect, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import AdminScreen from './components/AdminScreen';
import { AppState, Question, User, StoredResult } from './types';
import { quizQuestions } from './services/quizData';

// Helper to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Login);
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [totalTime] = useState(quizQuestions.length * 90);
  const [wasPracticeQuiz, setWasPracticeQuiz] = useState(false);

  const startQuiz = useCallback((currentUser: User, isPractice: boolean = false) => {
    const takers: string[] = JSON.parse(localStorage.getItem('quiz_takers') || '[]');
    if (takers.includes(currentUser.professionalId) && !isPractice) {
      alert('Este número de colegiado ya ha completado el cuestionario.');
      return;
    }

    setWasPracticeQuiz(isPractice);
    setUser(currentUser);
    setQuestions(shuffleArray(quizQuestions));
    setUserAnswers(new Array(quizQuestions.length).fill(''));
    setAppState(isPractice ? AppState.PracticeQuiz : AppState.Quiz);
  }, []);
  
  const handleRestartPractice = () => {
    if (user) {
      startQuiz(user, true);
    }
  };

  const finishQuiz = useCallback((finalAnswers: string[]) => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (q.answer === finalAnswers[index]) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setUserAnswers(finalAnswers);

    if (user && appState === AppState.Quiz) {
      // Save results for main quiz
      const results: StoredResult[] = JSON.parse(localStorage.getItem('quiz_results') || '[]');
      const takers: string[] = JSON.parse(localStorage.getItem('quiz_takers') || '[]');
      
      const newResult: StoredResult = { 
        ...user, 
        score: finalScore,
        date: new Date().toLocaleString() 
      };

      localStorage.setItem('quiz_results', JSON.stringify([...results, newResult]));
      localStorage.setItem('quiz_takers', JSON.stringify([...takers, user.professionalId]));
    }
    
    setAppState(AppState.Results);
  }, [questions, user, appState]);

  const restart = () => {
    setAppState(AppState.Login);
    setUser(null);
    setScore(0);
    setUserAnswers([]);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.Quiz:
      case AppState.PracticeQuiz:
        return (
          <QuizScreen
            questions={questions}
            totalTime={totalTime}
            onFinish={finishQuiz}
            isPractice={appState === AppState.PracticeQuiz}
            onRestart={appState === AppState.PracticeQuiz ? handleRestartPractice : undefined}
          />
        );
      case AppState.Results:
        return (
            <ResultsScreen
                user={user}
                score={score}
                totalQuestions={questions.length}
                correctAnswers={userAnswers.filter((ans, i) => questions[i] && ans === questions[i].answer).length}
                onRestart={wasPracticeQuiz ? restart : undefined}
            />
        );
      case AppState.Admin:
        return <AdminScreen onBack={() => setAppState(AppState.Login)} />;
      case AppState.Login:
      default:
        return <LoginScreen onStart={startQuiz} onAdminLogin={() => setAppState(AppState.Admin)} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-200 min-h-screen text-slate-800 flex items-center justify-center p-4">
        <main className="w-full max-w-4xl mx-auto">
            {renderContent()}
        </main>
    </div>
  );
};

export default App;
