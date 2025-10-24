
import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import Timer from './Timer';

interface QuizScreenProps {
  questions: Question[];
  totalTime: number;
  onFinish: (answers: string[]) => void;
  isPractice: boolean;
  onRestart?: () => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, totalTime, onFinish, isPractice, onRestart }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const answersRef = useRef<string[]>(new Array(questions.length).fill(''));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onFinish(answersRef.current);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSpeedUpTime = () => {
    setTimeLeft(prev => Math.min(prev, 10)); // Set time to 10 seconds if it's more
  };

  const handleSelectAnswer = (option: string) => {
    setSelectedAnswer(option);
    answersRef.current[currentQuestionIndex] = option;
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(answersRef.current[currentQuestionIndex + 1] || null);
    } else {
      onFinish(answersRef.current);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-3xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-800">{isPractice ? 'Cuestionario de Prueba' : 'Cuestionario'}</h2>
            <Timer seconds={timeLeft} />
        </div>
        
        <div className="w-full bg-blue-100 rounded-full h-2.5 mb-6">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
        </div>
        
        <div className="mb-6">
            <p className="text-sm text-slate-500 mb-2">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800">{currentQuestion.question}</h3>
        </div>

        <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleSelectAnswer(option)}
                    className={`w-full text-left p-4 border rounded-lg transition duration-200 text-slate-700 ${
                        selectedAnswer === option
                            ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500'
                            : 'bg-white border-blue-200 hover:bg-blue-50'
                    }`}
                >
                    {option}
                </button>
            ))}
        </div>
        
        <div className="mt-8 flex justify-between items-center">
             <div>
                {isPractice && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSpeedUpTime}
                            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            title="Acelerar el tiempo a 10 segundos"
                        >
                            Acelerar Tiempo
                        </button>
                        {onRestart && (
                            <button
                                onClick={onRestart}
                                className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                Reiniciar Examen
                            </button>
                        )}
                    </div>
                )}
            </div>
            
            <button
                onClick={handleNext}
                className="bg-blue-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
                {currentQuestionIndex < questions.length - 1 ? 'Siguiente' : 'Finalizar'}
            </button>
        </div>
    </div>
  );
};

export default QuizScreen;
