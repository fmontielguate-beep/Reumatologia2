import React, { useState } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (password: string) => void;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, onSubmit }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-sm animate-fade-in">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-300">{title}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Ingrese la contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;