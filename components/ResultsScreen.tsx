import React, { useRef } from 'react';
import { User } from '../types';

interface ResultsScreenProps {
  user: User | null;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  onRestart?: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ user, score, totalQuestions, correctAnswers, onRestart }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (certificateRef.current && (window as any).html2canvas) {
      (window as any).html2canvas(certificateRef.current, { scale: 2, backgroundColor: '#1e293b' }).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.download = `Certificado-${user?.firstName}-${user?.lastName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-2xl mx-auto text-center animate-fade-in">
        <div ref={certificateRef} className="bg-gradient-to-br from-slate-700 to-slate-800 p-8 rounded-lg mb-8 text-white">
            <h1 className="text-3xl font-bold text-blue-300 mb-2">Resultados del Cuestionario</h1>
            <p className="text-slate-300 text-lg mb-6">Felicitaciones, {user?.firstName} {user?.lastName}!</p>
            
            <div className="my-8">
                <div className={`mx-auto w-40 h-40 rounded-full flex items-center justify-center text-5xl font-extrabold ${score >= 60 ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                    {score}%
                </div>
            </div>

            <p className="text-slate-200 text-xl">
                Has respondido correctamente a <strong>{correctAnswers}</strong> de <strong>{totalQuestions}</strong> preguntas.
            </p>
            <p className="text-sm text-slate-400 mt-4">ID Profesional: {user?.professionalId}</p>
            <p className="text-xs text-slate-500 mt-1">Fecha: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button
                onClick={handleDownload}
                className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
                Descargar Certificado
            </button>
            {onRestart && (
                <button
                    onClick={onRestart}
                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    Volver al Inicio
                </button>
            )}
        </div>
    </div>
  );
};

export default ResultsScreen;