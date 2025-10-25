import React, { useEffect, useState } from 'react';
import { StoredResult } from '../types';

interface AdminScreenProps {
    onBack: () => void;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onBack }) => {
  const [results, setResults] = useState<StoredResult[]>([]);

  useEffect(() => {
    const storedResults = JSON.parse(localStorage.getItem('quiz_results') || '[]');
    // Sort by date, newest first
    storedResults.sort((a: StoredResult, b: StoredResult) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setResults(storedResults);
  }, []);

  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-4xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-300">Panel de Administrador</h1>
            <button onClick={onBack} className="text-blue-400 hover:underline">Volver al Inicio</button>
        </div>
      
        <div className="overflow-x-auto">
            {results.length > 0 ? (
                <table className="min-w-full bg-slate-800 border border-slate-700">
                    <thead className="bg-slate-700">
                        <tr>
                            <th className="py-3 px-4 border-b border-slate-600 text-left text-sm font-semibold text-blue-300">Nombre</th>
                            <th className="py-3 px-4 border-b border-slate-600 text-left text-sm font-semibold text-blue-300">ID Profesional</th>
                            <th className="py-3 px-4 border-b border-slate-600 text-left text-sm font-semibold text-blue-300">Fecha</th>
                            <th className="py-3 px-4 border-b border-slate-600 text-center text-sm font-semibold text-blue-300">Nota</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-300">
                        {results.map((result, index) => (
                            <tr key={index} className="hover:bg-slate-700 transition">
                                <td className="py-3 px-4 border-b border-slate-600">{result.firstName} {result.lastName}</td>
                                <td className="py-3 px-4 border-b border-slate-600">{result.professionalId}</td>
                                <td className="py-3 px-4 border-b border-slate-600 text-sm text-slate-400">{result.date}</td>
                                <td className={`py-3 px-4 border-b border-slate-600 text-center font-bold ${result.score >= 60 ? 'text-green-400' : 'text-red-400'}`}>
                                    {result.score}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-slate-400 py-10">No hay resultados para mostrar.</p>
            )}
        </div>
    </div>
  );
};

export default AdminScreen;