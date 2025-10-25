import React, { useState, useEffect } from 'react';
import { User } from '../types';
import Modal from './Modal';

interface LoginScreenProps {
  onStart: (user: User, isPractice?: boolean) => void;
  onAdminLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onStart, onAdminLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [professionalId, setProfessionalId] = useState('');
  const [error, setError] = useState('');
  const [idAlreadyTaken, setIdAlreadyTaken] = useState(false);
  const [showPracticePassword, setShowPracticePassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  useEffect(() => {
    if (professionalId) {
      const takers: string[] = JSON.parse(localStorage.getItem('quiz_takers') || '[]');
      if (takers.includes(professionalId)) {
        setIdAlreadyTaken(true);
        setError(''); // Clear other errors
      } else {
        setIdAlreadyTaken(false);
      }
    } else {
        setIdAlreadyTaken(false);
    }
  }, [professionalId]);

  const handleSubmit = () => {
    if (idAlreadyTaken) {
        return; // Button is disabled, but as an extra check
    }
    if (!firstName || !lastName || !professionalId) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setError('');
    onStart({ firstName, lastName, professionalId });
  };
  
  const handlePracticeSubmit = (password: string) => {
     if (password === 'Helena2016') {
        if (!firstName || !lastName || !professionalId) {
           setError('Por favor, identifíquese primero antes de iniciar el curso de prueba.');
           setShowPracticePassword(false);
           return;
        }
        setError('');
        setShowPracticePassword(false);
        onStart({ firstName, lastName, professionalId }, true);
     } else {
        alert('Contraseña incorrecta.');
     }
  };

  const handleAdminSubmit = (password: string) => {
    if (password === 'Miquel2021') {
      setShowAdminPassword(false);
      onAdminLogin();
    } else {
      alert('Contraseña incorrecta.');
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-lg mx-auto text-center animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-300 mb-2">Reumatología Pediátrica</h1>
        <p className="text-slate-400 mb-8">Ponga a prueba sus conocimientos.</p>
        
        <div className="space-y-4 text-left">
            <input 
                type="text" 
                placeholder="Nombre" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <input 
                type="text" 
                placeholder="Apellido" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <input 
                type="text" 
                placeholder="Número de Colegiado" 
                value={professionalId}
                onChange={(e) => setProfessionalId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
        </div>

        {idAlreadyTaken && <p className="text-orange-500 font-semibold mt-4">Este número de colegiado ya ha completado el cuestionario.</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        <button 
            onClick={handleSubmit}
            disabled={idAlreadyTaken}
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg mt-8 hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none"
        >
            Iniciar Cuestionario
        </button>

        <div className="mt-6 flex justify-between items-center text-sm">
            <button onClick={() => setShowPracticePassword(true)} className="text-blue-400 hover:underline">Curso de Prueba</button>
            <button onClick={() => setShowAdminPassword(true)} className="text-slate-400 hover:underline">Acceso Administrador</button>
        </div>
        
        {showPracticePassword && (
            <Modal 
                title="Contraseña de Prueba"
                onSubmit={handlePracticeSubmit}
                onClose={() => setShowPracticePassword(false)}
            />
        )}
        {showAdminPassword && (
            <Modal
                title="Acceso de Administrador"
                onSubmit={handleAdminSubmit}
                onClose={() => setShowAdminPassword(false)}
            />
        )}
    </div>
  );
};

export default LoginScreen;