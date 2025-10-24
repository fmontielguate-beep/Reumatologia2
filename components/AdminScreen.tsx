
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
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-800">Panel de Administrador</h1>
            <button onClick={onBack} className="text-blue-600 hover:underline">Volver al Inicio</button>
        </div>
      
        <div className="overflow-x-auto">
            {results.length > 0 ? (
                <table className="min-w-full bg-white border border-blue-200">
                    <thead className="bg-blue-50">
                        <tr>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-blue-800">Nombre</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-blue-800">ID Profesional</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-semibold text-blue-800">Fecha</th>
                            <th className="py-3 px-4 border-b text-center text-sm font-semibold text-blue-800">Nota</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        {results.map((result, index) => (
                            <tr key={index} className="hover:bg-blue-50 transition">
                                <td className="py-3 px-4 border-b">{result.firstName} {result.lastName}</td>
                                <td className="py-3 px-4 border-b">{result.professionalId}</td>
                                <td className="py-3 px-4 border-b text-sm text-slate-500">{result.date}</td>
                                <td className={`py-3 px-4 border-b text-center font-bold ${result.score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                                    {result.score}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-slate-500 py-10">No hay resultados para mostrar.</p>
            )}
        </div>
    </div>
  );
};

export default AdminScreen;
