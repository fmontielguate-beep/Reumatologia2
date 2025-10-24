
import React from 'react';

interface TimerProps {
  seconds: number;
}

const Timer: React.FC<TimerProps> = ({ seconds }) => {
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const secs = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = seconds <= 60;

  return (
    <div className={`text-lg font-bold p-2 rounded-lg ${isLowTime ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
        <span>{formatTime(seconds)}</span>
    </div>
  );
};

export default Timer;
