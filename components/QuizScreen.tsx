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
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);
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

  useEffect(() => {
    // When question index changes, update the selected answer from our persistent ref
    setSelectedAnswer(answersRef.current[currentQuestionIndex] || null);
  }, [currentQuestionIndex]);

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
    } else {
      onFinish(answersRef.current);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleMarkQuestion = () => {
    setMarkedQuestions(prev => {
        const isMarked = prev.includes(currentQuestionIndex);
        if (isMarked) {
            return prev.filter(i => i !== currentQuestionIndex);
        } else {
            return [...prev, currentQuestionIndex].sort((a, b) => a - b);
        }
    });
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-5xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-300">{isPractice ? 'Cuestionario de Prueba' : 'Cuestionario'}</h2>
            <Timer seconds={timeLeft} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-grow">
                <div className="w-full bg-slate-700 rounded-full h-2.5 mb-6">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
                </div>
                
                <div className="flex justify-between items-start mb-4 gap-4">
                    <div className='flex-grow'>
                        <p className="text-sm text-slate-400 mb-2">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-100">{currentQuestion.question}</h3>
                    </div>
                    <button
                        onClick={handleMarkQuestion}
                        className={`flex-shrink-0 text-sm font-semibold py-2 px-3 rounded-lg transition ${
                            markedQuestions.includes(currentQuestionIndex)
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                        }`}
                    >
                        {markedQuestions.includes(currentQuestionIndex) ? 'Marcada' : 'Marcar'}
                    </button>
                </div>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelectAnswer(option)}
                            className={`w-full text-left p-4 border rounded-lg transition duration-200 text-slate-200 ${
                                selectedAnswer === option
                                    ? 'bg-blue-900 border-blue-500 ring-2 ring-blue-500'
                                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                
                <div className="mt-8 flex justify-between items-center gap-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="bg-slate-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-slate-500 transition focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-700 disabled:cursor-not-allowed"
                    >
                        Anterior
                    </button>

                    <div className="flex-grow flex justify-center">
                        {isPractice && (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSpeedUpTime}
                                    className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                    title="Acelerar el tiempo a 10 segundos"
                                >
                                    Acelerar
                                </button>
                                {onRestart && (
                                    <button
                                        onClick={onRestart}
                                        className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    >
                                        Reiniciar
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

            <div className="md:w-64 flex-shrink-0 bg-slate-900/50 p-4 rounded-lg order-first md:order-last">
                <h3 className="font-bold text-lg mb-4 text-slate-300 text-center">Navegador</h3>
                <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-5 gap-2">
                    {questions.map((_, index) => {
                        const isCurrent = index === currentQuestionIndex;
                        const isMarked = markedQuestions.includes(index);
                        const isAnswered = answersRef.current[index] !== '';
                        
                        let buttonClass = 'relative w-full aspect-square flex items-center justify-center rounded-lg font-bold transition ';
                        if (isCurrent) {
                            buttonClass += 'ring-2 ring-blue-500 text-blue-300 bg-slate-700';
                        } else if (isAnswered) {
                            buttonClass += 'bg-green-700 text-white hover:bg-green-600';
                        } else {
                            buttonClass += 'bg-slate-700 text-slate-300 hover:bg-slate-600';
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleJumpToQuestion(index)}
                                className={buttonClass}
                                aria-label={`Ir a la pregunta ${index + 1}`}
                            >
                                {index + 1}
                                {isMarked && (
                                    <span className="absolute top-0 right-0 -mt-1 -mr-1 text-xs" role="status" aria-label="Pregunta marcada">
                                        📌
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-4 text-xs space-y-1 text-slate-400">
                    <p className='font-bold text-sm text-slate-300 mb-2'>Leyenda:</p>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-700 border border-slate-600"></span> Respondida</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-700 border-2 border-blue-500"></span> Actual</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-700 border border-slate-600"></span> Sin responder</div>
                    <div className="flex items-center gap-2"><span>📌</span> Marcada</div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default QuizScreen;
